import mjml2html from "mjml";

import { prismaClient } from "../../../prisma/client";
import { isFeatureActiveForUser } from "../../feature-flipping/feature-flipping.features";
import {
  getBackofficeUrl,
  sendEmailUsingTemplate,
  sendGenericEmail,
  templateMail,
} from "../../shared/email";

export const sendCandidacyArchivedEmailToCertificateur = async (
  candidacyId: string,
) => {
  const feasibility = await prismaClient.feasibility.findFirst({
    where: { candidacyId, isActive: true },
    include: {
      certificationAuthority: true,
      candidacy: { include: { candidate: true } },
    },
  });

  if (!feasibility) {
    return;
  }

  const {
    candidacy: { candidate },
  } = feasibility;

  const candidateFullName =
    candidate &&
    `${candidate?.firstname || ""}${
      candidate?.lastname ? ` ${candidate?.lastname}` : ""
    }`;

  const contactEmail = feasibility.certificationAuthority?.contactEmail;

  if (!contactEmail || !candidateFullName) {
    return;
  }

  const feasibilityUrl = getBackofficeUrl({
    path: `/candidacies/${candidacyId}/feasibility`,
  });

  const useBrevoTemplate = await isFeatureActiveForUser({
    feature: "USE_BREVO_EMAIL_TEMPLATES_FOR_CERTIFICATEURS",
  });

  if (useBrevoTemplate) {
    return sendEmailUsingTemplate({
      to: { email: contactEmail },
      templateId: 567,
      params: { candidateFullName, feasibilityUrl },
    });
  } else {
    const htmlContent = mjml2html(
      templateMail({
        content: `
        <p>Bonjour,</p>
        <p>Nous vous informons que la candidature de ${candidateFullName} a été supprimée. Pour retrouver la candidature en question, cliquez sur le lien ci-dessous.</p>
        <p>L'équipe France VAE.</p>
        `,
        labelCTA: "Accéder à la candidature",
        url: feasibilityUrl,
      }),
    );

    return sendGenericEmail({
      to: { email: contactEmail },
      htmlContent: htmlContent.html,
      subject: "Une candidature a été supprimée",
    });
  }
};
