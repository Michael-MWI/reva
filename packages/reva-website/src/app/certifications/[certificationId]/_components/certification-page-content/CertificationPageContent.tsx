import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Tile } from "@codegouvfr/react-dsfr/Tile";

import { isFeatureActive } from "@/utils/featureFlipping";

import { CertificationJuryTypeOfModality } from "@/graphql/generated/graphql";

import { SelectCertificationButton } from "./_components/select-certification-button/SelectCertificationButton";
import { BlocsDeCompetenceTab } from "./tabs/BlocsDeCompetenceTab";
import DocumentationTab from "./tabs/DocumentationTab";
import { JuryTab } from "./tabs/JuryTab";
import { MetierTab } from "./tabs/MetierTab";
import { PreRequisitesTab } from "./tabs/PrerequisitesTab";
import { UsefulResources } from "./useful-resources/UserfulResources";

export const CertificationPageContent = async ({
  certification,
}: {
  certification: {
    id: string;
    label: string;
    isAapAvailable: boolean;
    codeRncp: string;
    typeDiplome?: string | null;
    level: number;
    rncpObjectifsContexte?: string | null;
    prerequisites: { id: string; label: string }[];
    juryTypeMiseEnSituationProfessionnelle?: CertificationJuryTypeOfModality | null;
    juryTypeSoutenanceOrale?: CertificationJuryTypeOfModality | null;
    juryEstimatedCost?: number | null;
    juryPlace?: string | null;
    additionalInfo?: {
      dossierDeValidationLink?: string | null;
      dossierDeValidationTemplate?: {
        url: string;
        name: string;
        mimeType: string;
      } | null;
      linkToReferential?: string | null;
      linkToJuryGuide?: string | null;
      linkToCorrespondenceTable?: string | null;
      additionalDocuments?:
        | {
            url: string;
            name: string;
            mimeType: string;
          }[]
        | null;
      certificationExpertContactDetails?: string | null;
      certificationExpertContactPhone?: string | null;
      certificationExpertContactEmail?: string | null;
      usefulResources?: string | null;
    } | null;
    competenceBlocs: {
      id: string;
      code?: string | null;
      label: string;
      competences: {
        id: string;
        label: string;
      }[];
    }[];
  };
}) => {
  const showVaeCollective = await isFeatureActive("VAE_COLLECTIVE");

  return (
    <div className="flex-1 flex pb-8 min-h-screen">
      <div className="flex-1 bg-white w-full mx-auto flex flex-col fr-container p-6 shadow-[0px_6px_18px_0px_rgba(0,0,18,0.16)]">
        <Breadcrumb
          className="!mt-0 !mb-3"
          currentPageLabel={certification?.label}
          segments={[
            {
              label: "Candidats",
              linkProps: {
                href: "/espace-candidat/",
              },
            },
          ]}
        />
        <div className="flex flex-col gap-4">
          <h1 data-testid="certification-label" className="m-0">
            {certification?.label}
          </h1>
          <div className="flex flex-row items-center gap-4">
            <span className="text-xs text-dsfrGray-mentionGrey">{`RNCP ${certification?.codeRncp}`}</span>

            <Tag small>
              {certification?.isAapAvailable
                ? "VAE en autonomie ou accompagnée"
                : "VAE en autonomie"}
            </Tag>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <Tile
              title={`Niveau ${certification.level}`}
              classes={{ content: "p-0" }}
              className="min-w-[282px]"
              small
              orientation="horizontal"
              imageSvg
              imageUrl="/candidate-space/certifications/pictograms/information.svg"
              imageAlt="icône information"
            />
            {certification.typeDiplome && (
              <Tile
                title={certification.typeDiplome}
                classes={{ content: "p-0" }}
                className="min-w-[282px]"
                small
                orientation="horizontal"
                imageSvg
                imageUrl="/candidate-space/certifications/pictograms/city-hall.svg"
                imageAlt="icône mairie"
              />
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-12">
          <SelectCertificationButton certificationId={certification.id} />
          {showVaeCollective && (
            <Button
              priority="secondary"
              linkProps={{
                href: `/inscription-candidat/vae-collective/`,
              }}
            >
              Utiliser un code VAE collective
            </Button>
          )}
        </div>
        <Tabs
          className="mt-12"
          tabs={[
            {
              label: "Métier",
              isDefault: true,
              content: (
                <MetierTab
                  codeRncp={certification.codeRncp}
                  rncpObjectifsContexte={certification.rncpObjectifsContexte}
                />
              ),
            },
            {
              label: "Blocs de compétences",
              content: (
                <BlocsDeCompetenceTab
                  competenceBlocs={certification.competenceBlocs}
                />
              ),
            },
            {
              label: "Prérequis",
              content: (
                <PreRequisitesTab prerequisites={certification.prerequisites} />
              ),
            },
            {
              label: "Jury",
              content: (
                <JuryTab
                  juryTypeMiseEnSituationProfessionnelle={
                    certification.juryTypeMiseEnSituationProfessionnelle
                  }
                  juryTypeSoutenanceOrale={
                    certification.juryTypeSoutenanceOrale
                  }
                  juryEstimatedCost={certification.juryEstimatedCost}
                  juryPlace={certification.juryPlace}
                />
              ),
            },
            {
              label: "Documentation",
              content: (
                <DocumentationTab
                  additionalInfo={certification.additionalInfo}
                />
              ),
            },
          ]}
        />
        <hr className="mt-12 mb-8 pb-1" />
        <UsefulResources />
        <div className="flex mt-12 justify-between">
          <Button
            priority="secondary"
            linkProps={{
              href: "/espace-candidat/",
            }}
          >
            Retour
          </Button>
          <SelectCertificationButton certificationId={certification.id} />
        </div>
      </div>
    </div>
  );
};
