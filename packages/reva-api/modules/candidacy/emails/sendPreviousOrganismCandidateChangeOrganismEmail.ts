import { sendEmailUsingTemplate } from "../../shared/email";

export const sendPreviousOrganismCandidateChangeOrganismEmail = async ({
  email,
  candidateFullName,
  certificationName,
}: {
  email: string;
  candidateFullName: string;
  certificationName: string;
}) => {
  return sendEmailUsingTemplate({
    to: { email },
    templateId: 534,
    params: {
      candidateFullName,
      certificationName,
    },
  });
};
