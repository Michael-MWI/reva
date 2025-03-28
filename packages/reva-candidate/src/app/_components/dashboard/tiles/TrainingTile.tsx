import { CandidacyStatusStep } from "@/graphql/generated/graphql";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Tile from "@codegouvfr/react-dsfr/Tile";
import { isAfter, isBefore } from "date-fns";
import { useRouter } from "next/navigation";

const TrainingStatusBadge = ({
  candidacyStatus,
  firstAppointmentOccuredAt,
}: {
  candidacyStatus: CandidacyStatusStep;
  firstAppointmentOccuredAt?: number | null;
}) => {
  if (
    (candidacyStatus == "VALIDATION" || candidacyStatus == "PRISE_EN_CHARGE") &&
    firstAppointmentOccuredAt &&
    isBefore(firstAppointmentOccuredAt, new Date())
  ) {
    return (
      <Badge severity="info" data-test="training-status-badge-in-progress">
        En cours
      </Badge>
    );
  } else if (candidacyStatus == "PARCOURS_ENVOYE") {
    return (
      <Badge severity="warning" data-test="training-status-badge-to-validate">
        À valider
      </Badge>
    );
  } else if (
    candidacyStatus == "PARCOURS_CONFIRME" ||
    (candidacyStatus !== "VALIDATION" &&
      candidacyStatus !== "PRISE_EN_CHARGE" &&
      candidacyStatus !== "PROJET")
  ) {
    return (
      <Badge severity="success" data-test="training-status-badge-validated">
        Validé
      </Badge>
    );
  }
};

export const TrainingTile = ({
  candidacyStatus,
  firstAppointmentOccuredAt,
}: {
  candidacyStatus: CandidacyStatusStep;
  firstAppointmentOccuredAt?: number | null;
}) => {
  const router = useRouter();

  return (
    <Tile
      data-test="training-tile"
      disabled={
        candidacyStatus == "PROJET" ||
        candidacyStatus == "VALIDATION" ||
        (candidacyStatus == "PRISE_EN_CHARGE" &&
          !!firstAppointmentOccuredAt &&
          isAfter(firstAppointmentOccuredAt, new Date()))
      }
      title="Parcours et financement"
      start={
        <TrainingStatusBadge
          candidacyStatus={candidacyStatus}
          firstAppointmentOccuredAt={firstAppointmentOccuredAt}
        />
      }
      small
      buttonProps={{
        onClick: () => {
          router.push(
            candidacyStatus == "PRISE_EN_CHARGE" &&
              !!firstAppointmentOccuredAt &&
              isBefore(firstAppointmentOccuredAt, new Date())
              ? "/waiting-for-training"
              : "/validate-training",
          );
        },
      }}
      imageUrl="/candidat/images/pictograms/in-progress.svg"
    />
  );
};
