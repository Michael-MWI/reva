import { MaisonMereAAP } from "@prisma/client";

import { prismaClient } from "../../../prisma/client";
import { logger } from "../../shared/logger";

export const getMaisonMereAapBySiretAndTypology = async (
  siret: string,
  typologie: OrganismTypology,
): Promise<MaisonMereAAP | null> => {
  try {
    const maisonMereAAP = await prismaClient.maisonMereAAP.findFirst({
      where: {
        siret,
        typologie,
      },
    });
    return maisonMereAAP;
  } catch (e) {
    logger.error(e);
  }

  return null;
};
