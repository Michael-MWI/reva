import { sendEmailUsingTemplate } from "@/modules/shared/email";

export const sendCandidacyDropOutConfirmedEmailToCandidate = async ({
  candidateEmail,
  candidateFullName,
}: {
  candidateEmail: string;
  candidateFullName: string;
}) =>
  sendEmailUsingTemplate({
    to: { email: candidateEmail },
    templateId: 518,
    params: {
      candidateFullName,
    },
  });
