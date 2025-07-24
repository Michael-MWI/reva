import { prismaClient } from "../../../prisma/client";
import {
  FunctionalCodeError,
  // FunctionalError,
} from "../../shared/error/functionalError";
import { logger } from "../../shared/logger";
import { ArchiveCandidacyParams } from "../candidacy.types";

import { getCandidacyById } from "./getCandidacyById";
import { updateCandidacyStatus } from "./updateCandidacyStatus";

export const archiveCandidacy = async (params: ArchiveCandidacyParams) => {
  let candidacy;
  try {
    candidacy = await getCandidacyById({
      candidacyId: params.candidacyId,
      includes: {
        candidacyStatuses: true,
      },
    });
  } catch (error) {
    throw new Error(
      `${FunctionalCodeError.CANDIDACY_DOES_NOT_EXIST} La candidature ${params.candidacyId} n'a pas pu être récupérée: ${error}`,
    );
  }

  if (!candidacy) {
    throw new Error(
      `${FunctionalCodeError.CANDIDACY_DOES_NOT_EXIST} La candidature ${params.candidacyId} n'existe pas`,
    );
  }

  const isArchived = candidacy.status === "ARCHIVE";

  if (isArchived) {
    throw new Error(
      `${FunctionalCodeError.CANDIDACY_ALREADY_ARCHIVED} La candidature est déjà archivée`,
    );
  }

  try {
    return prismaClient.$transaction(async (tx) => {
      await updateCandidacyStatus({
        candidacyId: candidacy.id,
        status: "ARCHIVE",
        tx,
      });

      return tx.candidacy.update({
        where: {
          id: params.candidacyId,
        },
        data: {
          archivingReason: params.archivingReason,
          archivingReasonAdditionalInformation:
            params.archivingReasonAdditionalInformation,
        },
      });
    });
  } catch (e) {
    logger.error(e);
    throw new Error(
      `Erreur lors de l'archivage de la candidature ${params.candidacyId}`,
    );
  }
};
