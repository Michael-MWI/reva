import Badge from "@codegouvfr/react-dsfr/Badge";
import Tile from "@codegouvfr/react-dsfr/Tile";
import { format } from "date-fns";
import { JuryUseCandidateForDashboard } from "../dashboard.hooks";

export const JurySessionTile = ({
  jury,
}: {
  jury: JuryUseCandidateForDashboard;
}) => {
  if (!jury) {
    return null;
  }

  const dateOfJurySession = `${format(jury.dateOfSession, "dd/MM/yyyy")} ${
    jury.timeSpecified ? `- ${jury.timeOfSession}` : ""
  }`;

  return (
    <Tile
      data-test="jury-session-tile"
      small
      orientation="horizontal"
      classes={{
        content: "pb-0",
      }}
      start={
        <Badge severity="info" small noIcon>
          Passage devant le jury
        </Badge>
      }
      title={dateOfJurySession}
    />
  );
};
