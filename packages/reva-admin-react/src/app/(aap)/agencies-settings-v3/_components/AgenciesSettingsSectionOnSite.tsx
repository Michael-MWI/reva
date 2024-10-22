import { EnhancedSectionCard } from "@/components/card/enhanced-section-card/EnhancedSectionCard";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";

const VisibilityBadge = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div className="flex items-center">
      <Badge severity={isVisible ? "success" : "error"} small>
        {isVisible ? "Visible" : "Invisible"}
      </Badge>
    </div>
  );
};

const OrganismRow = ({
  organism,
  index,
  maisonMereAAPId,
}: {
  organism: {
    id: string;
    label: string;
    isVisibleInCandidateSearchResults: boolean;
    informationsCommerciales?: {
      nom?: string | null;
    } | null;
  };
  index: number;
  maisonMereAAPId: string;
}) => {
  return (
    <div
      className={`flex py-3 w-full justify-between border-b border-b-neutral-200 ${
        !index && "border-t border-t-neutral-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <p className="mb-0 ">
          {organism.informationsCommerciales?.nom || organism.label}
        </p>
        <VisibilityBadge
          isVisible={!!organism.isVisibleInCandidateSearchResults}
        />
      </div>

      <Button
        priority="tertiary no outline"
        size="small"
        linkProps={{
          href: `/agencies-settings-v3/${maisonMereAAPId}/organisms/${organism.id}/on-site`,
        }}
      >
        Modifier
      </Button>
    </div>
  );
};

export const AgenciesSettingsSectionOnSite = ({
  organisms = [],
  maisonMereAAPId,
  isEditable,
}: {
  organisms?: {
    id: string;
    label: string;
    isVisibleInCandidateSearchResults: boolean;
    informationsCommerciales?: { nom?: string | null } | null;
  }[];
  maisonMereAAPId: string;
  isEditable?: boolean;
}) => {
  const isOnSiteAgencyComplete = !!organisms.length;

  return (
    <EnhancedSectionCard
      data-test="on-site-agencies"
      title="Accompagnement en présentiel"
      buttonOnClickHref={`/agencies-settings-v3/${maisonMereAAPId}/organisms/add-agency`}
      titleIconClass="fr-icon-home-4-fill"
      isEditable={isEditable}
      customButtonTitle={"Ajouter un lieu d'accueil"}
      status={isOnSiteAgencyComplete ? "COMPLETED" : "TO_COMPLETE"}
      CustomBadge={<div />}
    >
      {!isOnSiteAgencyComplete && (
        <p className="md:w-4/5">
          Vous avez des collaborateurs qui font des accompagnements en
          présentiel ? Ajoutez les lieux d'accueil dans lesquels se rendront les
          candidats.
        </p>
      )}
      <div className="sm:pl-10 flex flex-col">
        {organisms.map((organism, index) => (
          <OrganismRow
            key={organism.id}
            organism={organism}
            index={index}
            maisonMereAAPId={maisonMereAAPId}
          />
        ))}
      </div>
    </EnhancedSectionCard>
  );
};
