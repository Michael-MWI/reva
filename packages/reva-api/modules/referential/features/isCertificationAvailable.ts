import { prismaClient } from "../../../prisma/client";

export const isCertificationAvailable = async ({
  certificationId,
}: {
  certificationId: string;
}): Promise<boolean> => {
  return !!(await prismaClient.availableCertification.findFirst({
    where: { certificationId },
  }));
};
