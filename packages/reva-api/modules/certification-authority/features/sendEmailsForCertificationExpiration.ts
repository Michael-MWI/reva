import { CertificationEmailType } from "@prisma/client";
import { addDays, format, startOfToday, subDays } from "date-fns";
import { prismaClient } from "../../../prisma/client";
import { getBackofficeUrl, sendEmailUsingTemplate } from "../../shared/email";
import { logger } from "../../shared/logger";

const EMAIL_TEMPLATE_IDS = {
  CERTIFICATION_WILL_EXPIRE_IN_1_MONTH: 592,
  CERTIFICATION_HAS_EXPIRED: 593,
} as const;

const CERTIFICATION_EMAIL_TYPES: Record<string, CertificationEmailType> = {
  WILL_EXPIRE_IN_1_MONTH: "CERTIFICATION_WILL_EXPIRE_IN_1_MONTH",
  HAS_EXPIRED: "CERTIFICATION_HAS_EXPIRED",
};

const NOTIFICATION_PERIOD_DAYS = 30;

interface CertificationsParamsBrevo {
  label: string;
  expiresAt: string;
  index: number;
  rncpId: string;
  url: string;
}

interface CertificationData {
  id: string;
  label: string;
  expiresAt: Date;
  rncpId: string;
}

const getCertificationUrl = (certificationId: string) =>
  getBackofficeUrl({
    path: `/certifications/${certificationId}`,
  });

const formatCertificationsParamsForBrevo = (
  certifications: CertificationData[],
): CertificationsParamsBrevo[] => {
  return certifications.map(({ label, expiresAt, rncpId, id }, index) => ({
    label,
    expiresAt: format(expiresAt, "dd MMMM yyyy"),
    index: index + 1,
    rncpId,
    url: getCertificationUrl(id),
  }));
};
// Envoi d'un email de notification à un responsable de certification avec une ou plusieurs certifications qui vont expirer ou sont expirées
const sendCertificationNotificationEmailToCertificationRegistryManager =
  async ({
    certifications,
    certificationRegistryManagerEmail,
    templateId,
    emailType,
  }: {
    certifications: CertificationData[];
    certificationRegistryManagerEmail: string;
    templateId: number;
    emailType: CertificationEmailType;
  }) => {
    if (certifications.length) {
      const certificationsParams =
        formatCertificationsParamsForBrevo(certifications);

      await sendEmailUsingTemplate({
        to: { email: certificationRegistryManagerEmail },
        templateId,
        params: {
          certifications: certificationsParams,
        },
      });

      await prismaClient.certificationEmail.createMany({
        data: certifications.map((certification) => ({
          certificationId: certification.id,
          emailType,
        })),
      });
    }
  };

export const sendEmailsForCertificationExpiration = async () => {
  try {
    const today = startOfToday(); // Utilisation cohérente de minuit pour toutes les comparaisons de dates

    // Recherche des responsables de certifications avec des certifications qui expirent dans 1 mois
    // Double filtrage Prisma :
    // 1. Le "some" dans le premier "where" sélectionne les responsables ayant AU MOINS UNE certification qui expire dans 30 jours
    // 2. Le "where" dans l'include ne retourne que les certifications de ce responsable qui remplissent TOUTES les conditions
    //    (expiration dans 30 jours + statut validé + pas d'email déjà envoyé)
    const certificationRegistryManagersWithCertificationsToExpireIn1Month =
      await prismaClient.certificationRegistryManager.findMany({
        where: {
          certificationAuthorityStructure: {
            certifications: {
              some: {
                expiresAt: {
                  // Fenêtre de 30 jours : après aujourd'hui jusqu'au 30ème jour inclus
                  lte: addDays(today, NOTIFICATION_PERIOD_DAYS),
                  gt: today,
                },
                status: "VALIDE_PAR_CERTIFICATEUR",
              },
            },
          },
        },
        select: {
          account: {
            select: {
              email: true,
            },
          },
          certificationAuthorityStructure: {
            include: {
              certifications: {
                where: {
                  expiresAt: {
                    lte: addDays(today, NOTIFICATION_PERIOD_DAYS),
                    gt: today,
                  },
                  status: "VALIDE_PAR_CERTIFICATEUR",
                  // Évite les doublons : pas d'email de ce type envoyé dans les 31 derniers jours
                  certificationEmails: {
                    none: {
                      emailType:
                        CERTIFICATION_EMAIL_TYPES.WILL_EXPIRE_IN_1_MONTH,
                      sentAt: {
                        gte: subDays(today, NOTIFICATION_PERIOD_DAYS + 1),
                      },
                    },
                  },
                },
                select: {
                  id: true,
                  label: true,
                  expiresAt: true,
                  rncpId: true,
                },
              },
            },
          },
        },
      });

    // Envoi des emails pour les certifications qui expirent bientôt
    for (const certificationRegistryManager of certificationRegistryManagersWithCertificationsToExpireIn1Month) {
      await sendCertificationNotificationEmailToCertificationRegistryManager({
        certifications:
          certificationRegistryManager.certificationAuthorityStructure
            .certifications,
        certificationRegistryManagerEmail:
          certificationRegistryManager.account.email,
        templateId: EMAIL_TEMPLATE_IDS.CERTIFICATION_WILL_EXPIRE_IN_1_MONTH,
        emailType: CERTIFICATION_EMAIL_TYPES.WILL_EXPIRE_IN_1_MONTH,
      });
    }

    // Recherche des responsables de certifications avec des certifications expirées hier
    // Double filtrage Prisma :
    // 1. Le "some" dans le premier "where" sélectionne les responsables ayant AU MOINS UNE certification expirée hier
    // 2. Le "where" dans l'include ne retourne que les certifications de ce responsable qui remplissent TOUTES les conditions
    //    (expiration hier + statut validé + aucun email d'expiration déjà envoyé)
    const certificationRegistryManagersWithCertificationsHasExpired =
      await prismaClient.certificationRegistryManager.findMany({
        where: {
          certificationAuthorityStructure: {
            certifications: {
              some: {
                expiresAt: {
                  // Toute la journée d'hier : de 00:00:00 hier à 23:59:59 hier
                  gte: subDays(today, 1),
                  lt: today,
                },
                status: "VALIDE_PAR_CERTIFICATEUR",
              },
            },
          },
        },
        select: {
          account: {
            select: {
              email: true,
            },
          },
          certificationAuthorityStructure: {
            include: {
              certifications: {
                where: {
                  expiresAt: {
                    gte: subDays(today, 1),
                    lt: today,
                  },
                  status: "VALIDE_PAR_CERTIFICATEUR",
                  // Un seul email d'expiration par certification (pas de condition sur sentAt)
                  certificationEmails: {
                    none: {
                      emailType: CERTIFICATION_EMAIL_TYPES.HAS_EXPIRED,
                    },
                  },
                },
                select: {
                  id: true,
                  label: true,
                  expiresAt: true,
                  rncpId: true,
                },
              },
            },
          },
        },
      });

    // Envoi des emails pour les certifications expirées
    for (const certificationRegistryManager of certificationRegistryManagersWithCertificationsHasExpired) {
      await sendCertificationNotificationEmailToCertificationRegistryManager({
        certifications:
          certificationRegistryManager.certificationAuthorityStructure
            .certifications,
        certificationRegistryManagerEmail:
          certificationRegistryManager.account.email,
        templateId: EMAIL_TEMPLATE_IDS.CERTIFICATION_HAS_EXPIRED,
        emailType: CERTIFICATION_EMAIL_TYPES.HAS_EXPIRED,
      });
    }
  } catch (e) {
    logger.error(
      `Erreur pendant l'envoi des emails de notification d'expiration de certification`,
      e,
    );
  }
};
