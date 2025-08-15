import { addDays, format, subDays } from "date-fns";

import { logger } from "@/modules/shared/logger";
import { prismaClient } from "@/prisma/client";

import {
  INACTIF_CONFIRME_TRIGGER_DAYS,
  INACTIF_EN_ATTENTE_TRIGGER_AFTER_FEASIBILITY_ADMISSIBLE_DAYS,
  INACTIF_EN_ATTENTE_TRIGGER_AFTER_FEASIBILITY_CANDIDACY_STATUSES,
  INACTIF_EN_ATTENTE_TRIGGER_BEFORE_FEASIBILITY_ADMISSIBLE_DAYS,
  INACTIF_EN_ATTENTE_TRIGGER_BEFORE_FEASIBILITY_CANDIDACY_STATUSES,
} from "../constants/candidacy-inactif.constant";
import { sendInactifEnAttenteAfterFeasibilityAdmissibleToCandidate } from "../emails/sendInactifEnAttenteAfterFeasibilityAdmissibleToCandidate";
import { sendInactifEnAttenteBeforeFeasibilityAdmissibleToCandidate } from "../emails/sendInactifEnAttenteBeforeFeasibilityAdmissibleToCandidate";

export const checkAndUpdateCandidaciesInactifEnAttente = async () => {
  const thresholdDateInactifConfirme = format(
    addDays(new Date(), INACTIF_CONFIRME_TRIGGER_DAYS),
    "dd/MM/yyyy",
  );

  // Candidatures inactives avant d'avoir un dossier de faisabilité admissible
  const thresholdDateBeforeFeasibilityAdmissible = new Date(
    subDays(
      new Date(),
      INACTIF_EN_ATTENTE_TRIGGER_BEFORE_FEASIBILITY_ADMISSIBLE_DAYS,
    ),
  );

  try {
    const candidaciesBeforeFeasibilityAdmissible =
      await prismaClient.candidacy.findMany({
        where: {
          activite: "ACTIF",
          status: {
            in: INACTIF_EN_ATTENTE_TRIGGER_BEFORE_FEASIBILITY_CANDIDACY_STATUSES,
          },
          derniereDateActivite: {
            lte: thresholdDateBeforeFeasibilityAdmissible,
          },
        },
        select: {
          id: true,
          derniereDateActivite: true,
          candidate: {
            select: {
              email: true,
              firstname: true,
              lastname: true,
              keycloakId: true,
            },
          },
        },
      });

    if (candidaciesBeforeFeasibilityAdmissible.length) {
      for (const candidacy of candidaciesBeforeFeasibilityAdmissible) {
        const candidateEmail = candidacy.candidate?.email;
        const candidateFullName = `${candidacy.candidate?.firstname} ${candidacy.candidate?.lastname}`;
        const candidateKeycloakId = candidacy.candidate?.keycloakId;

        await prismaClient.candidacy.update({
          where: {
            id: candidacy.id,
          },
          data: {
            activite: "INACTIF_EN_ATTENTE",
            dateInactifEnAttente: new Date(),
          },
        });
        if (candidateEmail && candidateKeycloakId) {
          await sendInactifEnAttenteBeforeFeasibilityAdmissibleToCandidate({
            candidateEmail,
            thresholdDateInactifConfirme,
            candidateFullName,
          });

          await prismaClient.candidacyLog.create({
            data: {
              candidacyId: candidacy.id,
              eventType: "INACTIF_EN_ATTENTE",
              userEmail: candidateEmail,
              userKeycloakId: candidateKeycloakId,
              userProfile: "CANDIDAT",
            },
          });
        }
      }
    }

    // Candidatures inactives après avoir un dossier de faisabilité admissible
    const thresholdDateAfterFeasibilityAdmissible = new Date(
      subDays(
        new Date(),
        INACTIF_EN_ATTENTE_TRIGGER_AFTER_FEASIBILITY_ADMISSIBLE_DAYS,
      ),
    );

    const candidaciesAfterFeasibilityAdmissible =
      await prismaClient.candidacy.findMany({
        where: {
          activite: "ACTIF",
          status: {
            in: INACTIF_EN_ATTENTE_TRIGGER_AFTER_FEASIBILITY_CANDIDACY_STATUSES,
          },
          derniereDateActivite: {
            lte: thresholdDateAfterFeasibilityAdmissible,
          },
        },
        select: {
          id: true,
          derniereDateActivite: true,
          candidate: {
            select: {
              email: true,
              firstname: true,
              lastname: true,
              keycloakId: true,
            },
          },
        },
      });

    if (candidaciesAfterFeasibilityAdmissible.length) {
      for (const candidacy of candidaciesAfterFeasibilityAdmissible) {
        const candidateEmail = candidacy.candidate?.email;
        const candidateFullName = `${candidacy.candidate?.firstname} ${candidacy.candidate?.lastname}`;
        const candidateKeycloakId = candidacy.candidate?.keycloakId;

        await prismaClient.candidacy.update({
          where: {
            id: candidacy.id,
          },
          data: {
            activite: "INACTIF_EN_ATTENTE",
            dateInactifEnAttente: new Date(),
          },
        });
        if (candidateEmail && candidateKeycloakId) {
          await sendInactifEnAttenteAfterFeasibilityAdmissibleToCandidate({
            candidateEmail,
            thresholdDateInactifConfirme,
            candidateFullName,
          });

          await prismaClient.candidacyLog.create({
            data: {
              candidacyId: candidacy.id,
              eventType: "INACTIF_EN_ATTENTE",
              userEmail: candidateEmail,
              userKeycloakId: candidateKeycloakId,
              userProfile: "CANDIDAT",
            },
          });
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};
