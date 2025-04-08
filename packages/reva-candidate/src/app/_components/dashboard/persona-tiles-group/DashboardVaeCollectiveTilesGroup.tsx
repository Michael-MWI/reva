import Badge from "@codegouvfr/react-dsfr/Badge";
import { CandidacyUseCandidateForDashboard } from "../dashboard.hooks";
import { CertificationTile } from "../tiles/CertificationTile";
import { DossierValidationTile } from "../tiles/DossierValidationTile";
import { ExperiencesTile } from "../tiles/ExperiencesTile";
import { FeasibilityTile } from "../tiles/FeasibilityTile";
import { GoalsTile } from "../tiles/GoalsTile";
import { OrganismTile } from "../tiles/OrganismTile";
import { SubmitCandidacyTile } from "../tiles/SubmitCandidacyTile";
import { TrainingTile } from "../tiles/TrainingTile";
import { TypeAccompagnementTile } from "../tiles/TypeAccompagnementTile";
import { DashboardTilesSection } from "./DashboardTilesSection";

export const DashboardVaeCollectiveTilesGroup = ({
  candidacy,
  candidacyAlreadySubmitted,
  canSubmitCandidacy,
  hasSelectedOrganism,
  hasCompletedGoals,
}: {
  candidacy: CandidacyUseCandidateForDashboard;
  candidacyAlreadySubmitted: boolean;
  canSubmitCandidacy: boolean;
  hasSelectedOrganism: boolean;
  hasCompletedGoals: boolean;
}) => {
  const candidacyIsCaduque = candidacy?.isCaduque;
  const feasibility = candidacy?.feasibility;

  return (
    <>
      <DashboardTilesSection
        title="Compléter ma candidature de VAE Collective"
        icon="fr-icon-ball-pen-line"
      >
        <div className="grid md:grid-cols-3 grid-rows-2">
          <CertificationTile
            selectedCertificationId={candidacy?.certification?.id}
          />
          <TypeAccompagnementTile
            disabled
            typeAccompagnement={candidacy.typeAccompagnement}
          />
          <GoalsTile hasCompletedGoals={hasCompletedGoals} />
          <ExperiencesTile experiences={candidacy.experiences} />
          <OrganismTile
            hasSelectedOrganism={hasSelectedOrganism}
            candidacyStatus={candidacy.status}
          />
          <SubmitCandidacyTile
            candidacyAlreadySubmitted={candidacyAlreadySubmitted}
            canSubmitCandidacy={canSubmitCandidacy}
          />
        </div>
      </DashboardTilesSection>

      <DashboardTilesSection
        title="Suivre mon parcours"
        icon="fr-icon-award-line"
        badge={
          !candidacyAlreadySubmitted ? (
            <Badge severity="warning">Candidature non envoyée</Badge>
          ) : undefined
        }
      >
        <div className="grid grid-flow-row md:grid-flow-col grid-rows-1">
          <TrainingTile
            candidacyStatus={candidacy.status}
            firstAppointmentOccuredAt={candidacy.firstAppointmentOccuredAt}
          />
          <FeasibilityTile
            feasibility={feasibility}
            isCaduque={candidacyIsCaduque}
            candidacyIsAutonome={false}
          />
          <DossierValidationTile
            feasibility={candidacy.feasibility}
            activeDossierDeValidation={candidacy.activeDossierDeValidation}
            isCaduque={candidacy.isCaduque}
            jury={candidacy.jury}
          />
        </div>
      </DashboardTilesSection>
    </>
  );
};
