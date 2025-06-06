import { prismaClient } from "../../../prisma/client";
import {
  sendCandidacyTransferToNewCertificationAuthorityEmail,
  sendCandidacyTransferToPreviousCertificationAuthorityEmail,
  sendCandidacyTransferedToOrganismEmail,
  sendCandidacyTransferToCandidate,
} from "../emails";
import { assignCandidadyToCertificationAuthorityLocalAccounts } from "./assignCandidadyToCertificationAuthorityLocalAccounts";

export const transferCandidacyToAnotherCertificationAuthority = async ({
  candidacyId,
  certificationAuthorityId,
  transferReason,
}: {
  candidacyId: string;
  certificationAuthorityId: string;
  transferReason: string;
}) => {
  const candidacy = await prismaClient.candidacy.findUnique({
    where: {
      id: candidacyId,
    },
    include: {
      Feasibility: {
        where: {
          isActive: true,
        },
        include: {
          certificationAuthority: true,
        },
      },
      organism: true,
      candidate: true,
    },
  });

  if (!candidacy) {
    throw new Error(`Aucune candidature trouvée avec l'ID : ${candidacyId}`);
  }

  const candidacyActiveFeasibility = candidacy.Feasibility.find(
    (f) => f.isActive,
  );

  const newCertificationAuthority =
    await prismaClient.certificationAuthority.findUnique({
      where: {
        id: certificationAuthorityId,
      },
    });

  if (!newCertificationAuthority) {
    throw new Error(
      `Aucun certificateur trouvé avec l'ID : ${certificationAuthorityId}`,
    );
  }

  await prismaClient.candidacy.update({
    where: {
      id: candidacyId,
    },
    data: {
      certificationAuthorityTransferReason: transferReason,
      Feasibility: {
        updateMany: {
          where: {
            candidacyId,
            isActive: true,
          },
          data: {
            certificationAuthorityId: newCertificationAuthority.id,
          },
        },
      },
      dossierDeValidation: {
        updateMany: {
          where: {
            candidacyId,
            isActive: true,
          },
          data: {
            certificationAuthorityId: newCertificationAuthority.id,
          },
        },
      },
      Jury: {
        updateMany: {
          where: {
            candidacyId,
            isActive: true,
          },
          data: {
            certificationAuthorityId: newCertificationAuthority.id,
          },
        },
      },
    },
  });

  // Remove candidacy from any certification authority local account
  await prismaClient.certificationAuthorityLocalAccountOnCandidacy.deleteMany({
    where: { candidacyId },
  });

  await assignCandidadyToCertificationAuthorityLocalAccounts({
    candidacyId,
  });

  const previousCertificationAuthority =
    candidacyActiveFeasibility?.certificationAuthority;

  const organismEmail =
    candidacy.organism?.emailContact ??
    candidacy.organism?.contactAdministrativeEmail;
  const organismName = (candidacy.organism?.nomPublic ??
    candidacy.organism?.label) as string;
  const previousCertificationAuthorityName =
    previousCertificationAuthority?.contactFullName ??
    (previousCertificationAuthority?.label as string);

  const newCertificationAuthorityName =
    newCertificationAuthority.contactFullName ??
    newCertificationAuthority.label;

  const candidateName = `${candidacy.candidate?.firstname} ${candidacy.candidate?.lastname}`;

  if (previousCertificationAuthority?.contactEmail) {
    sendCandidacyTransferToPreviousCertificationAuthorityEmail({
      email: previousCertificationAuthority.contactEmail,
      previousCertificationAuthorityName,
      newCertificationAuthorityName,
      candidateName,
    });
  }

  if (newCertificationAuthority.contactEmail) {
    sendCandidacyTransferToNewCertificationAuthorityEmail({
      email: newCertificationAuthority.contactEmail,
      previousCertificationAuthorityName,
      newCertificationAuthorityName,
      candidateName,
      transferReason,
      candidacyId,
    });
  }

  if (candidacy.candidate?.email) {
    sendCandidacyTransferToCandidate({
      email: candidacy.candidate?.email,
      newCertificationAuthorityName,
    });
  }

  if (organismEmail) {
    sendCandidacyTransferedToOrganismEmail({
      email: organismEmail,
      organismName,
      candidateName,
      certificationAuthorityName: newCertificationAuthorityName,
    });
  }

  return true;
};
