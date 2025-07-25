import { sendEmailUsingTemplate } from "@/modules/shared/email";
import { UploadedFile } from "@/modules/shared/file";

export const sendFeasibilityValidatedToCandidateAccompagneEmail = async ({
  email,
  comment,
  certificationName,
  certificationAuthorityLabel,
  infoFile,
}: {
  email: string;
  comment?: string;
  certificationName: string;
  certificationAuthorityLabel: string;
  infoFile?: UploadedFile;
}) => {
  const attachment = infoFile
    ? [{ name: infoFile.filename, content: infoFile._buf.toString("base64") }]
    : undefined;

  return sendEmailUsingTemplate({
    to: { email },
    templateId: 501,
    params: {
      certificationAuthorityLabel,
      certificationName,
      comment,
    },
    attachment,
  });
};
