import { isFeatureActiveForUser } from "../../feature-flipping/feature-flipping.features";
import { sendEmailUsingTemplate, sendGenericEmail } from "../../shared/email";

export const sendUnknownUserEmail = async (email: string) => {
  const useBrevoTemplate = await isFeatureActiveForUser({
    feature: "USE_BREVO_EMAIL_TEMPLATES_FOR_CANDIDATE_EMAILS",
  });

  if (useBrevoTemplate) {
    return sendEmailUsingTemplate({
      to: { email },
      templateId: 494,
    });
  } else {
    const htmlContent = `Vous avez demandé à recevoir un lien pour vous connecter mais votre e-mail n’existe pas dans notre base.
    <br>
    <ul>
      <li>Si vous avez une candidature en cours sur le site de l’Education Nationale (ex : DAVA), votre candidature est disponible sur le site dédié <a href="https://vae.education.gouv.fr/">https://vae.education.gouv.fr/</a>.</li>
      <li>Si vous avez plusieurs adresses e-mails, peut-être n’avez-vous pas renseigné la bonne pour retrouver votre dossier.</li>
      <li>Si vous n’avez pas encore créé de compte, <a href="https://vae.gouv.fr/inscription-candidat/">vous devez d’abord vous inscrire</a>.</li>
    </ul>
    <br>
    L’équipe France VAE`;

    return sendGenericEmail({
      htmlContent: htmlContent,
      to: { email },
      subject:
        "Nous n’avons pas trouvé de compte France VAE correspondant à votre e-mail",
    });
  }
};
