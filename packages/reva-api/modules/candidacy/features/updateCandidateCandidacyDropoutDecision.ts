import { logCandidacyAuditEvent } from "@/modules/candidacy-log/features/logCandidacyAuditEvent";
import { prismaClient } from "@/prisma/client";

import { sendCandidacyDropOutConfirmedEmailToAap } from "../emails/sendCandidacyDropOutConfirmedEmailToAap";
import { sendCandidacyDropOutConfirmedEmailToCandidate } from "../emails/sendCandidacyDropOutConfirmedEmailToCandidate";

export const updateCandidateCandidacyDropoutDecision = async ({
  candidacyId,
  dropOutConfirmed,
  userInfo,
}: {
  candidacyId: string;
  dropOutConfirmed: Date;
  userInfo: {
    userKeycloakId?: string;
    userEmail?: string;
    userRoles: KeyCloakUserRole[];
  };
}) => {
  const dropOut = await prismaClient.candidacyDropOut.findUnique({
    where: { candidacyId },
    include: {
      candidacy: {
        include: {
          candidate: true,
          organism: true,
        },
      },
    },
  });

  if (!dropOut) {
    throw new Error("Aucun abandon trouvé pour cette candidature");
  }

  if (dropOut.dropOutConfirmedByCandidate) {
    throw new Error(
      "La décision d'abandon a déjà été confirmée par le candidat",
    );
  }

  if (dropOut.autoDropOutConfirmationEmailsSent) {
    throw new Error(
      "La décision d'abandon a déjà été confirmée automatiquement",
    );
  }

  if (dropOutConfirmed) {
    const candidacy = await prismaClient.candidacy.update({
      where: { id: candidacyId },
      data: {
        candidacyDropOut: { update: { dropOutConfirmedByCandidate: true } },
      },
    });
    await logCandidacyAuditEvent({
      candidacyId,
      eventType: "CANDIDACY_DROPOUT_CONFIRMED_BY_CANDIDATE",
      ...userInfo,
    });

    const aapEmail =
      dropOut.candidacy?.organism?.emailContact ||
      dropOut.candidacy?.organism?.contactAdministrativeEmail;

    const aapLabel =
      dropOut.candidacy.organism?.nomPublic ||
      dropOut.candidacy.organism?.label;

    const candidateFullName =
      dropOut.candidacy.candidate?.firstname +
      " " +
      dropOut.candidacy.candidate?.lastname;

    if (aapEmail && aapLabel) {
      await sendCandidacyDropOutConfirmedEmailToAap({
        aapEmail,
        aapLabel,
        candidateFullName,
      });
    }

    const candidateEmail = dropOut.candidacy.candidate?.email;
    if (candidateEmail) {
      await sendCandidacyDropOutConfirmedEmailToCandidate({
        candidateEmail,
        candidateFullName,
      });
    }

    return candidacy;
  } else {
    const candidacy = await prismaClient.candidacy.update({
      where: { id: candidacyId },
      data: {
        candidacyDropOut: { delete: true },
      },
    });
    await logCandidacyAuditEvent({
      candidacyId,
      eventType: "CANDIDACY_DROPOUT_CANCELED_BY_CANDIDATE",
      ...userInfo,
    });
    return candidacy;
  }
};
