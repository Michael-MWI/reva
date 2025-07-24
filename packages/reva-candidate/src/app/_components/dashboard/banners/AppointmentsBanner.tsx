import { format, isAfter, isBefore } from "date-fns";

import { OrganismUseCandidateForDashboard } from "../dashboard.hooks";

import { BaseBanner } from "./BaseBanner";

interface AppointmentsBannerProps {
  candidacyAlreadySubmitted: boolean;
  firstAppointmentOccuredAt?: number | null;
  organism?: OrganismUseCandidateForDashboard;
  status: string;
}

export const AppointmentsBanner = ({
  candidacyAlreadySubmitted,
  firstAppointmentOccuredAt,
  organism,
  status,
}: AppointmentsBannerProps) => {
  if (!candidacyAlreadySubmitted) {
    return null;
  }

  // Waiting for first appointment
  if (!firstAppointmentOccuredAt) {
    return (
      <BaseBanner
        content={
          <div data-test="waiting-for-appointment-banner">
            Votre accompagnateur vous enverra prochainement un date de
            rendez-vous pour parler de votre projet. Si vous n’avez toujours pas
            eu de retour 2 semaines après l’envoi de votre candidature,
            contactez-le directement.
          </div>
        }
      />
    );
  }

  // Future appointment
  if (isAfter(firstAppointmentOccuredAt, new Date())) {
    return (
      <BaseBanner
        content={
          <div data-test="first-appointment-scheduled-banner">
            <b>Information importante :</b> un rendez-vous est prévu le{" "}
            {format(firstAppointmentOccuredAt, "dd/MM/yyyy")} avec{" "}
            <em>{organism?.nomPublic || organism?.label}</em>.
          </div>
        }
      />
    );
  }

  // Past appointment with training waiting for confirmation
  if (
    isBefore(firstAppointmentOccuredAt, new Date()) &&
    status === "PARCOURS_ENVOYE"
  ) {
    return (
      <BaseBanner
        content={
          <div data-test="training-to-validate-banner">
            Vous pouvez maintenant consulter, vérifier et valider votre parcours
            et le financement prévu.
          </div>
        }
      />
    );
  }

  // Past appointment, waiting for training plan
  if (isBefore(firstAppointmentOccuredAt, new Date())) {
    return (
      <BaseBanner
        content={
          <div data-test="waiting-for-training-banner">
            Votre accompagnateur est en train de compléter votre parcours
            construit ensemble (heures d'accompagnement, formations, etc…). Vous
            pourrez le consulter très prochainement !
          </div>
        }
      />
    );
  }

  return null;
};
