import { Candidate } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { format, isAfter, isBefore, sub } from "date-fns";

import { prismaClient } from "../../../../prisma/client";
import { logCandidacyAuditEvent } from "../../../candidacy-log/features/logCandidacyAuditEvent";
import { isFundingRequestEnabledForCertification } from "../../../candidacy-menu/features/isFundingRequestEnabledForCertification";
import { updateCandidacyStatus } from "../../../candidacy/features/updateCandidacyStatus";
import { isFeatureActiveForUser } from "../../../feature-flipping/feature-flipping.features";
import { UploadedFile } from "../../../shared/file";
import { applyBusinessValidationRules } from "../validation";
import { createBatchFromFundingRequestUnifvae } from "./fundingRequestBatch";

export const createFundingRequestUnifvae = async ({
  candidacyId,
  isCertificationPartial,
  fundingRequest,
  userKeycloakId,
  userEmail,
  userRoles,
}: FundingRequestUnifvaeInputCompleted & {
  userKeycloakId?: string;
  userEmail?: string;
  userRoles: KeyCloakUserRole[];
}) => {
  const fundingRequestDisabled = await isFeatureActiveForUser({
    feature: "FUNDING_REQUEST_DISABLED",
  });
  if (fundingRequestDisabled) {
    throw new Error("La demande de prise en charge est désactivée");
  }

  const candidacy = await prismaClient.candidacy.findUnique({
    where: { id: candidacyId },
    select: {
      financeModule: true,
      basicSkills: true,
      trainings: true,
      otherTraining: true,
      certificateSkills: true,
      candidate: true,
      certification: true,
    },
  });
  if (candidacy === null) {
    throw new Error(`Candidacy ${candidacyId} not found`);
  }
  const fundreq = await prismaClient.fundingRequestUnifvae.create({
    data: {
      candidacyId,
      numAction: await getNextNumAction(),
      otherTraining: candidacy.otherTraining ?? "",
      certificateSkills: candidacy.certificateSkills ?? "",
      ...fundingRequest,
      isPartialCertification: isCertificationPartial,
      candidateFirstname: candidacy.candidate?.firstname,
      candidateLastname: candidacy.candidate?.lastname,
    },
  });

  if (
    !candidacy.certification ||
    !isFundingRequestEnabledForCertification({
      certificationRncpId: candidacy.certification.rncpId,
    })
  ) {
    throw new Error(
      "La demande de financement n'est pas autorisée pour cette certification",
    );
  }

  await prismaClient.$transaction([
    prismaClient.basicSkillOnFundingRequestsUnifvae.createMany({
      data: candidacy.basicSkills.map(({ basicSkillId }) => ({
        basicSkillId,
        fundingRequestUnifvaeId: fundreq.id,
      })),
    }),
    prismaClient.trainingOnFundingRequestsUnifvae.createMany({
      data: candidacy.trainings.map(({ trainingId }) => ({
        trainingId,
        fundingRequestUnifvaeId: fundreq.id,
      })),
    }),
    prismaClient.candidate.update({
      where: { id: (candidacy.candidate as Candidate).id },
      data: {
        gender: fundingRequest.candidateGender,
        firstname2: fundingRequest.candidateSecondname,
        firstname3: fundingRequest.candidateThirdname,
      },
    }),
  ]);
  await updateCandidacyStatus({
    candidacyId,
    status: "DEMANDE_FINANCEMENT_ENVOYE",
  });

  await createBatchFromFundingRequestUnifvae(fundreq.id);

  const result = await prismaClient.fundingRequestUnifvae.findUnique({
    where: {
      id: fundreq.id,
    },
    include: {
      basicSkills: {
        select: {
          basicSkill: true,
        },
      },
      mandatoryTrainings: {
        select: {
          training: true,
        },
      },
    },
  });

  await logCandidacyAuditEvent({
    candidacyId,
    userKeycloakId,
    userEmail,
    userRoles,
    eventType: "FUNDING_REQUEST_CREATED",
  });
  return result;
};

export const getFundingRequestUnifvaeFromCandidacyId = async (
  candidacyId: string,
) =>
  prismaClient.fundingRequestUnifvae.findFirst({
    where: { candidacyId },
    include: {
      basicSkills: { include: { basicSkill: true } },
      mandatoryTrainings: { include: { training: true } },
    },
  });

async function getNextNumAction() {
  const nextValQueryResult =
    (await prismaClient.$queryRaw`Select nextval('funding_request_unifvae_num_action_sequence')`) as {
      nextval: number;
    }[];
  return `reva_${format(new Date(), "yyyyMMdd")}_${nextValQueryResult[0].nextval
    .toString()
    .padStart(5, "0")}`;
}

export const getPaymentRequestUnifvaeFromCandidacyId = (candidacyId: string) =>
  prismaClient.paymentRequestUnifvae.findFirst({
    where: { candidacyId },
  });

export const createOrUpdatePaymentRequestUnifvae = async ({
  candidacyId,
  paymentRequest,
  userKeycloakId,
  userEmail,
  userRoles,
}: {
  candidacyId: string;
  paymentRequest: PaymentRequestUnifvaeInput;
  userKeycloakId?: string;
  userEmail?: string;
  userRoles: KeyCloakUserRole[];
}) => {
  const candidacy = await prismaClient.candidacy.findUnique({
    where: { id: candidacyId },
    include: {
      candidacyStatuses: true,
      candidacyDropOut: true,
      Feasibility: true,
      certification: true,
      candidacyContestationCaducite: true,
    },
  });
  if (!candidacy) {
    throw new Error(
      "Impossible de créer la demande de paiement. La candidature n'a pas été trouvée",
    );
  }

  if (
    candidacy.isCertificationPartial == undefined ||
    candidacy.isCertificationPartial == null
  ) {
    throw new Error('"isCertificationPartial" has not been set');
  }

  if (!candidacy.certification) {
    throw new Error(
      "Impossible de créer la demande de paiement. La candidature n'a pas de certification associée",
    );
  }

  const activeCandidacyStatus = candidacy.candidacyStatuses?.filter(
    (s) => s.isActive,
  )?.[0].status;
  const isCandidacyDroppedOut = !!candidacy.candidacyDropOut;
  const hasConfirmedCandidacyCaducite =
    !!candidacy.candidacyContestationCaducite?.find(
      (c) =>
        c.certificationAuthorityContestationDecision === "CADUCITE_CONFIRMED",
    );

  // If the candidate has not dropped out ...
  if (!isCandidacyDroppedOut && !hasConfirmedCandidacyCaducite) {
    const feasibilityRejected =
      candidacy?.Feasibility?.find((f) => f.isActive)?.decision === "REJECTED";
    // Either the feasibility has been rejected and thus the active candidacy status must be "DEMANDE_FINANCEMENT_ENVOYE" ...
    if (feasibilityRejected) {
      if (activeCandidacyStatus !== "DEMANDE_FINANCEMENT_ENVOYE") {
        throw new Error(
          "Impossible de créer la demande de paiement. La demande de financement n'a pas été envoyée ",
        );
      }
    }
    // ... Or the feasibility file is not rejected and the active candidacy status must be "DOSSIER_DE_VALIDATION_ENVOYE"
    else if (activeCandidacyStatus !== "DOSSIER_DE_VALIDATION_ENVOYE") {
      throw new Error(
        "Impossible de créer la demande de paiement. Le dossier de validation n'a pas été envoyé",
      );
    }
  }
  // If the candidate has dropped out ...
  else {
    // If the candidate has dropped out we ensure that the funding request has been sent
    if (
      !candidacy.candidacyStatuses?.some(
        (s) => s.status === "DEMANDE_FINANCEMENT_ENVOYE",
      )
    ) {
      throw new Error(
        "Impossible de créer la demande de paiement. La demande de financement n'a pas été envoyée",
      );
    }
    // If the candidate has dropped out for less than 4 months and no proof of dropout has been received by the france vae admin
    // and the candidate has not confirmed his dropout, we prevent the payment request creation
    if (
      candidacy.candidacyDropOut &&
      !candidacy.candidacyDropOut.proofReceivedByAdmin &&
      !candidacy.candidacyDropOut.dropOutConfirmedByCandidate &&
      isAfter(
        candidacy.candidacyDropOut.createdAt,
        sub(new Date(), { months: 4 }),
      )
    ) {
      throw new Error(
        "La demande de paiement n’est pas encore disponible. Vous y aurez accès 4 mois après la mise en abandon du candidat.",
      );
    }
  }

  //maximum total cost allowed for unifvae payment request depends on the funding request creation date
  //and the type of certification

  const fundingRequestSentBefore20231219 = candidacy.candidacyStatuses.some(
    (cs) =>
      cs.status === "DEMANDE_FINANCEMENT_ENVOYE" &&
      isBefore(cs.createdAt, new Date(2023, 11, 19)),
  );

  const fundingRequestSentBefore20240602 = candidacy.candidacyStatuses.some(
    (cs) =>
      cs.status === "DEMANDE_FINANCEMENT_ENVOYE" &&
      isBefore(cs.createdAt, new Date(2024, 5, 2)),
  );

  const DEAS_DEAP_AND_DEAES_RNCP_CODES = [
    "4495",
    "35830",
    "4496",
    "35832",
    "25467",
    "36004",
  ];

  const certificationIsDeasOrDeapOrDeaes =
    DEAS_DEAP_AND_DEAES_RNCP_CODES.includes(candidacy.certification.rncpId);

  //max total cost allowed is 4700 euros for funding request sent before 19/12/2023 or funding request sent before 02/06/2024 and certification is DEAS, DEAP or DEAES
  const allowPaymentRequestOf4700Euros =
    fundingRequestSentBefore20231219 ||
    (fundingRequestSentBefore20240602 && certificationIsDeasOrDeapOrDeaes);

  const maximumTotalCostAllowed = allowPaymentRequestOf4700Euros
    ? new Decimal(4700)
    : new Decimal(3200);

  const validationErrors = await applyBusinessValidationRules({
    maximumTotalCostAllowed,
    candidacyId,
    isCertificationPartial: candidacy.isCertificationPartial,
    individualHourCount: paymentRequest.individualEffectiveHourCount,
    collectiveHourCount: paymentRequest.collectiveEffectiveHourCount,
    basicSkillsHourCount: paymentRequest.basicSkillsEffectiveHourCount,
    mandatoryTrainingsHourCount:
      paymentRequest.mandatoryTrainingsEffectiveHourCount,
    certificateSkillsHourCount:
      paymentRequest.certificateSkillsEffectiveHourCount,
    otherTrainingHourCount: paymentRequest.otherTrainingEffectiveHourCount,
    individualCost: paymentRequest.individualEffectiveCost,
    collectiveCost: paymentRequest.collectiveEffectiveCost,
    basicSkillsCost: paymentRequest.basicSkillsEffectiveCost,
    mandatoryTrainingsCost: paymentRequest.mandatoryTrainingsEffectiveCost,
    certificateSkillsCost: paymentRequest.certificateSkillsEffectiveCost,
    otherTrainingCost: paymentRequest.otherTrainingEffectiveCost,
  });

  if (validationErrors.length) {
    const businessErrors = validationErrors.map(({ fieldName, message }) =>
      fieldName === "GLOBAL" ? message : `input.${fieldName}: ${message}`,
    );
    throw new Error(businessErrors[0]);
  }

  const result = await prismaClient.paymentRequestUnifvae.upsert({
    where: { candidacyId },
    create: {
      candidacyId,
      ...paymentRequest,
      invoiceNumber: paymentRequest.invoiceNumber || "",
    },
    update: {
      ...paymentRequest,
    },
  });

  await logCandidacyAuditEvent({
    candidacyId,
    userKeycloakId,
    userEmail,
    userRoles,
    eventType: "PAYMENT_REQUEST_CREATED_OR_UPDATED",
  });

  return result;
};

export const addUploadedFileAndConfirmPayment = async ({
  candidacyId,
  invoiceFile,
  certificateOfAttendanceFile,
  contractorInvoiceFiles,
  userKeycloakId,
  userEmail,
  userRoles,
}: {
  candidacyId: string;
  invoiceFile: UploadedFile;
  certificateOfAttendanceFile: UploadedFile;
  contractorInvoiceFiles?: UploadedFile[];
  userKeycloakId?: string;
  userEmail: string;
  userRoles: KeyCloakUserRole[];
}) => {
  await addUploadedFileToPaymentRequestUnifvae({
    candidacyId,
    invoiceFile,
    certificateOfAttendanceFile,
    contractorInvoiceFiles,
  });
  await confirmPaymentRequestUnifvae({
    candidacyId,
    userKeycloakId,
    userEmail,
    userRoles,
  });
};

const confirmPaymentRequestUnifvae = async ({
  candidacyId,
  userKeycloakId,
  userEmail,
  userRoles,
}: {
  candidacyId: string;
  userKeycloakId?: string;
  userEmail: string;
  userRoles: KeyCloakUserRole[];
}) => {
  const candidacy = await prismaClient.candidacy.findFirst({
    where: { id: candidacyId },
    include: {
      fundingRequestUnifvae: true,
      paymentRequestUnifvae: true,
      organism: true,
    },
  });

  if (!candidacy) {
    throw new Error(
      "Impossible de confirmer la demande de paiement. La candidature n'a pas été trouvée",
    );
  }

  const fundingRequest = candidacy?.fundingRequestUnifvae[0];

  if (!fundingRequest) {
    throw new Error(
      "Impossible de confirmer la demande de paiement. La demande de financement n'a pas été trouvée",
    );
  }

  const paymentRequest = candidacy?.paymentRequestUnifvae;

  if (!paymentRequest) {
    throw new Error(
      "Impossible de confirmer la demande de paiement. La demande de paiment n'a pas été trouvée",
    );
  }

  const formationComplementaireHeures =
    paymentRequest.basicSkillsEffectiveHourCount
      .plus(paymentRequest.mandatoryTrainingsEffectiveHourCount)
      .plus(paymentRequest.certificateSkillsEffectiveHourCount)
      .plus(paymentRequest.otherTrainingEffectiveHourCount);

  const formationComplementaireCoutTotal =
    paymentRequest.basicSkillsEffectiveHourCount
      .mul(paymentRequest.basicSkillsEffectiveCost)
      .plus(
        paymentRequest.mandatoryTrainingsEffectiveHourCount.mul(
          paymentRequest.mandatoryTrainingsEffectiveCost,
        ),
      )
      .plus(
        paymentRequest.certificateSkillsEffectiveHourCount.mul(
          paymentRequest.certificateSkillsEffectiveCost,
        ),
      )
      .plus(
        paymentRequest.otherTrainingEffectiveHourCount.mul(
          paymentRequest.otherTrainingEffectiveCost,
        ),
      );

  const formationComplementaireCoutHoraireMoyen =
    formationComplementaireHeures.isZero()
      ? new Decimal(0)
      : formationComplementaireCoutTotal.dividedBy(
          formationComplementaireHeures,
        );

  await prismaClient.paymentRequestBatchUnifvae.create({
    data: {
      paymentRequestUnifvaeId: paymentRequest.id,
      content: {
        SiretAP: candidacy?.organism?.siret,
        NumAction: fundingRequest.numAction,
        NumFacture: paymentRequest.invoiceNumber,
        NbHeureReaAccVAEInd:
          paymentRequest.individualEffectiveHourCount.toFixed(2),
        CoutHeureReaAccVAEInd:
          paymentRequest.individualEffectiveCost.toFixed(2),
        NbHeureReaAccVAEColl:
          paymentRequest.collectiveEffectiveHourCount.toFixed(2),
        CoutHeureReaAccVAEColl:
          paymentRequest.collectiveEffectiveCost.toFixed(2),
        NbHeureReaDemActeFormatifCompl:
          formationComplementaireHeures.toFixed(2),
        CoutHeureReaDemActeFormatifCompl:
          formationComplementaireCoutHoraireMoyen.toFixed(2, Decimal.ROUND_UP),
      },
    },
  });

  await updateCandidacyStatus({
    candidacyId,
    status: "DEMANDE_PAIEMENT_ENVOYEE",
  });

  await logCandidacyAuditEvent({
    candidacyId,
    userKeycloakId,
    userEmail,
    userRoles,
    eventType: "PAYMENT_REQUEST_CONFIRMED",
  });
  return paymentRequest;
};

const addUploadedFileToPaymentRequestUnifvae = async ({
  candidacyId,
  invoiceFile,
  certificateOfAttendanceFile,
  contractorInvoiceFiles,
}: {
  candidacyId: string;
  invoiceFile: UploadedFile;
  certificateOfAttendanceFile: UploadedFile;
  contractorInvoiceFiles?: UploadedFile[];
}) => {
  const paymentRequest = await prismaClient.paymentRequestUnifvae.findFirst({
    where: { candidacyId },
  });

  if (!paymentRequest) {
    throw new Error("Demande de paiement non trouvée");
  }

  const fundingRequest = await prismaClient.fundingRequestUnifvae.findFirst({
    where: { candidacyId },
  });

  if (!fundingRequest) {
    throw new Error("Demande de financement non trouvée");
  }

  await prismaClient.fileUploadSpooler.createMany({
    data: [
      {
        destinationFileName: `facture_${
          fundingRequest.numAction
        }.${getFilenameExtension(invoiceFile.filename)}`,
        destinationPath: "import",
        description: `Facture pour paymentRequestId ${paymentRequest.id} (${invoiceFile.filename} - ${invoiceFile.mimetype})`,
        fileContent: invoiceFile._buf,
      },
      {
        destinationFileName: `presence_${
          fundingRequest.numAction
        }.${getFilenameExtension(certificateOfAttendanceFile.filename)}`,
        destinationPath: "import",
        description: `Feuille de présence pour paymentRequestId ${paymentRequest.id} (${certificateOfAttendanceFile.filename} - ${certificateOfAttendanceFile.mimetype})`,
        fileContent: certificateOfAttendanceFile._buf,
      },
      ...(contractorInvoiceFiles
        ? contractorInvoiceFiles.map((ci, i) => ({
            destinationFileName: `presta${i + 1}_${
              fundingRequest.numAction
            }.${getFilenameExtension(ci.filename)}`,
            destinationPath: "import",
            description: `Facture préstataire ${i + 1} pour paymentRequestId ${paymentRequest.id} (${ci.filename} - ${ci.mimetype})`,
            fileContent: ci._buf,
          }))
        : []),
    ],
  });
};

function getFilenameExtension(filename: string) {
  return filename.split(".").pop();
}
