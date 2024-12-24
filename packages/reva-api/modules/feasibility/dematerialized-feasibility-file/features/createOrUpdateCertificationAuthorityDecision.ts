import { FeasibilityDecision } from "@prisma/client";
import { v4 as uuidV4 } from "uuid";
import {
  deleteFile,
  emptyUploadedFileStream,
  getUploadedFile,
  UploadedFile,
  uploadFilesToS3,
} from "../../../../modules/shared/file";
import { allowFileTypeByDocumentType } from "../../../../modules/shared/file/allowFileTypes";
import { prismaClient } from "../../../../prisma/client";
import { logCandidacyAuditEvent } from "../../../candidacy-log/features/logCandidacyAuditEvent";
import { updateCandidacyStatus } from "../../../candidacy/features/updateCandidacyStatus";
import { deleteFeasibilityIDFile } from "../../../feasibility/features/deleteFeasibilityIDFile";
import {
  sendFeasibilityIncompleteMailToAAP,
  sendFeasibilityIncompleteToCandidateAutonomeEmail,
  sendFeasibilityRejectedToCandidateAccompagneEmail,
  sendFeasibilityRejectedToCandidateAutonomeEmail,
  sendFeasibilityValidatedToCandidateAccompagneEmail,
  sendFeasibilityValidatedToCandidateAutonomeEmail,
} from "../../emails";
import { updateCandidacyLastActivityDateToNow } from "../../features/updateCandidacyLastActivityDateToNow";
import { DematerializedFeasibilityFileCreateOrUpdateCertificationAuthorityDecisionInput } from "../dematerialized-feasibility-file.types";
import { getDematerializedFeasibilityFileByCandidacyId } from "./getDematerializedFeasibilityFileByCandidacyId";
import { getDematerializedFeasibilityFileWithDetailsByCandidacyId } from "./getDematerializedFeasibilityFileWithDetailsByCandidacyId";
import { resetDFFSentToCandidateState } from "./resetDFFSentToCandidateState";

const adminBaseUrl =
  process.env.ADMIN_REACT_BASE_URL || "https://vae.gouv.fr/admin2";

const decisionMapper = {
  ADMISSIBLE: {
    status: "DOSSIER_FAISABILITE_RECEVABLE",
    log: "FEASIBILITY_VALIDATED",
  },
  REJECTED: {
    status: "DOSSIER_FAISABILITE_NON_RECEVABLE",
    log: "FEASIBILITY_REJECTED",
  },
  INCOMPLETE: {
    status: "DOSSIER_FAISABILITE_INCOMPLET",
    log: "FEASIBILITY_MARKED_AS_INCOMPLETE",
  },
  COMPLETE: {
    status: "DOSSIER_FAISABILITE_COMPLET",
    log: "FEASIBILITY_MARKED_AS_COMPLETE",
  },
} as const;

const sendFeasibilityDecisionTakenEmail = async ({
  candidateEmail,
  aapEmail,
  decision,
  decisionComment,
  certificationName,
  certificationAuthorityLabel,
  isAutonome,
  candidacyId,
  decisionUploadedFile,
}: {
  candidateEmail: string;
  aapEmail: string;
  decision: FeasibilityDecision["decision"];
  decisionComment: string;
  certificationName: string;
  certificationAuthorityLabel: string;
  isAutonome: boolean;
  candidacyId: string;
  decisionUploadedFile?: UploadedFile;
}) => {
  if (decision === "INCOMPLETE") {
    if (isAutonome) {
      sendFeasibilityIncompleteToCandidateAutonomeEmail({
        email: candidateEmail,
        comment: decisionComment,
        certificationAuthorityLabel,
        certificationName,
      });
    } else {
      sendFeasibilityIncompleteMailToAAP({
        email: aapEmail,
        feasibilityUrl: `${adminBaseUrl}/candidacies/${candidacyId}/feasibility`,
        comment: decisionComment,
      });
    }
  } else if (decision === "REJECTED") {
    if (isAutonome) {
      sendFeasibilityRejectedToCandidateAutonomeEmail({
        email: candidateEmail,
        comment: decisionComment,
        certificationAuthorityLabel,
        certificationName,
      });
    } else {
      sendFeasibilityRejectedToCandidateAccompagneEmail({
        email: candidateEmail,
        comment: decisionComment,
        certificationAuthorityLabel,
      });
    }
  } else if (decision === "ADMISSIBLE") {
    if (isAutonome) {
      sendFeasibilityValidatedToCandidateAutonomeEmail({
        email: candidateEmail,
        comment: decisionComment,
        certificationAuthorityLabel,
        certificationName,
        infoFile: decisionUploadedFile,
      });
    } else {
      sendFeasibilityValidatedToCandidateAccompagneEmail({
        email: candidateEmail,
        comment: decisionComment,
        certificationAuthorityLabel,
        certificationName,
        infoFile: decisionUploadedFile,
      });
    }

    await updateCandidacyLastActivityDateToNow({
      candidacyId,
    });
  }
};

export const createOrUpdateCertificationAuthorityDecision = async ({
  candidacyId,
  input,
  context,
}: {
  candidacyId: string;
  input: DematerializedFeasibilityFileCreateOrUpdateCertificationAuthorityDecisionInput;
  context: GraphqlContext;
}) => {
  try {
    const dff = await getDematerializedFeasibilityFileWithDetailsByCandidacyId({
      candidacyId,
    });

    if (!dff) {
      throw new Error(
        `Aucun Dossier de faisabilité trouvé pour la candidature ${candidacyId}.`,
      );
    }

    const { decision, decisionFile, decisionComment } = input;

    const feasibility = dff.feasibility;

    const existingDecisionFileId = feasibility.decisionFileId;
    if (existingDecisionFileId) {
      const existingDecisionFile = await prismaClient.file.findUnique({
        where: { id: existingDecisionFileId },
      });

      if (existingDecisionFile) {
        await deleteFile(existingDecisionFile.path);
        await prismaClient.file.delete({
          where: { id: existingDecisionFileId },
        });
      }
    }

    let decisionFileForDb = null;
    let decisionUploadedFile;
    if (decisionFile) {
      decisionUploadedFile = await getUploadedFile(decisionFile);
      const fileId = uuidV4();
      const fileAndId: {
        id: string;
        data: Buffer;
        filePath: string;
        mimeType: string;
        name: string;
        allowedFileTypes: string[];
      } = {
        id: fileId,
        data: decisionUploadedFile._buf,
        filePath: getFilePath({ candidacyId, fileId }),
        mimeType: decisionUploadedFile.mimetype,
        name: decisionUploadedFile.filename,
        allowedFileTypes:
          allowFileTypeByDocumentType.certificationAuthorityDecisionFile,
      };

      await uploadFilesToS3([fileAndId]);

      decisionFileForDb = {
        create: {
          id: fileId,
          path: fileAndId.filePath,
          name: fileAndId.name,
          mimeType: fileAndId.mimeType,
        },
      };
    }

    const now = new Date().toISOString();
    await prismaClient.$transaction(async (tx) => {
      await tx.feasibility.update({
        where: {
          id: feasibility.id,
        },
        data: {
          decision,
          decisionComment,
          decisionSentAt: now,
          decisionFile: decisionFileForDb ? decisionFileForDb : undefined,
        },
      });

      await tx.feasibilityDecision.create({
        data: {
          decision,
          decisionComment,
          feasibilityId: feasibility.id,
        },
      });

      await updateCandidacyStatus({
        candidacyId,
        status: decisionMapper[decision].status,
        tx,
      });
    });

    const isAutonome =
      dff.feasibility.candidacy.typeAccompagnement === "AUTONOME";

    const candidateEmail = dff.feasibility.candidacy.candidate?.email as string;
    const certificationName =
      dff.feasibility.candidacy.certification?.label ||
      "certification inconnue";
    const certificationAuthorityLabel =
      dff.feasibility.candidacy.certification?.certificationAuthorityStructure
        ?.label || "certificateur inconnu";
    const aapEmail = dff.feasibility.candidacy.organism
      ?.contactAdministrativeEmail as string;

    if (decision === "INCOMPLETE") {
      await prismaClient.feasibility.update({
        where: {
          id: feasibility.id,
        },
        data: {
          feasibilityFileSentAt: null,
        },
      });

      await resetDFFSentToCandidateState(dff);
    }

    if (decision === "ADMISSIBLE" || decision === "REJECTED") {
      await deleteFeasibilityIDFile(feasibility.id);
    }

    sendFeasibilityDecisionTakenEmail({
      candidateEmail,
      aapEmail,
      decision,
      decisionComment,
      certificationName,
      certificationAuthorityLabel,
      isAutonome,
      candidacyId,
      decisionUploadedFile,
    });

    await logCandidacyAuditEvent({
      candidacyId,
      eventType: decisionMapper[decision].log,
      userKeycloakId: context.auth.userInfo?.sub,
      userEmail: context.auth.userInfo?.email,
      userRoles: context.auth.userInfo?.realm_access?.roles || [],
    });

    return getDematerializedFeasibilityFileByCandidacyId({
      candidacyId,
    });
  } finally {
    //every stream must be emptied otherwise the request will hang
    emptyUploadedFileStream(input.decisionFile);
  }
};

const getFilePath = ({
  candidacyId,
  fileId,
}: {
  candidacyId: string;
  fileId: string;
}) => `candidacies/${candidacyId}/dff_files/${fileId}`;
