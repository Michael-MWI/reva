import { sendEmailUsingTemplate } from "@/modules/shared/email";

export const notifyPreviousEmailAddress = async ({
  email,
  newEmail,
}: {
  email: string;
  newEmail: string;
}) => {
  return sendEmailUsingTemplate({
    to: { email },
    templateId: 559,
    params: { newEmail },
  });
};
