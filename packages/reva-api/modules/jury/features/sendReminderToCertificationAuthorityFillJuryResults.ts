import { endOfDay, startOfDay, sub } from "date-fns";

import { getAccountById } from "@/modules/account/features/getAccount";
import { logger } from "@/modules/shared/logger/logger";
import { prismaClient } from "@/prisma/client";

import { sendFillJuryResultsCertificationAuthorityEmail } from "../emails/sendFillJuryResultsCertificationAuthorityEmail";

export const sendReminderToCertificationAuthorityFillJuryResults = async () => {
  const today = startOfDay(new Date());
  const prevWeek = endOfDay(sub(today, { days: 7 }));

  const juries = await prismaClient.jury.findMany({
    where: {
      isActive: true,
      reminderToCertificationAuthorityFillJuryResultsSentAt: null,
      result: null,
      dateOfSession: { lte: prevWeek },
    },
    include: {
      certificationAuthority: true,
      candidacy: {
        include: {
          certificationAuthorityLocalAccountOnCandidacy: {
            include: {
              certificationAuthorityLocalAccount: true,
            },
          },
        },
      },
    },
  });

  for (const jury of juries) {
    try {
      const emails = [];
      if (jury.certificationAuthority?.contactEmail) {
        emails.push(jury.certificationAuthority?.contactEmail);
      }

      for (const cala of jury.candidacy
        .certificationAuthorityLocalAccountOnCandidacy) {
        const account = await getAccountById({
          id: cala.certificationAuthorityLocalAccount.accountId,
        });
        emails.push(account.email);
      }

      await sendFillJuryResultsCertificationAuthorityEmail({
        emails,
      });

      await prismaClient.jury.update({
        where: { id: jury.id },
        data: {
          reminderToCertificationAuthorityFillJuryResultsSentAt: new Date(),
        },
      });
    } catch (error) {
      logger.error(error);
    }
  }
};
