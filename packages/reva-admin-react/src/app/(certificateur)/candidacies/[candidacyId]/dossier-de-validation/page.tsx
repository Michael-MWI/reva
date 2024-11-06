"use client";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { format } from "date-fns";
import { useDossierDeValidationPageLogic } from "./dossierDeValidationPageLogic";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { FileLink } from "../../(components)/FileLink";
import { BackButton } from "@/components/back-button/BackButton";

const DossierDeValidationPage = () => {
  return (
    <div className="flex flex-col w-full">
      <BackButton href="/candidacies/dossiers-de-validation">
        Tous les dossiers
      </BackButton>
      <h1>Dossier de validation</h1>
      <Tabs
        tabs={[
          {
            label: "Date prévisionnelle",
            content: <ReadyForJuryEstimatedDateTab />,
          },
          {
            label: "Dossier",
            isDefault: true,
            content: <DossierDeValidationTab />,
          },
        ]}
      />
    </div>
  );
};

const ReadyForJuryEstimatedDateTab = () => {
  const { readyForJuryEstimatedAt, getDossierDeValidationStatus } =
    useDossierDeValidationPageLogic();

  const showContent = getDossierDeValidationStatus === "success";

  return (
    showContent && (
      <div className="flex flex-col overflow-auto">
        {readyForJuryEstimatedAt ? (
          <>
            <p className="text-gray-600 mb-12">
              Afin de faciliter la tenue du jury pour le candidat, l’AAP a
              renseigné la date prévisionnelle à laquelle son candidat sera
              potentiellement prêt pour son passage devant le jury.
            </p>
            <span className="uppercase font-bold text-sm">
              date prévisionnelle
            </span>
            <span className="text-base">
              {format(readyForJuryEstimatedAt, "dd/MM/yyyy")}
            </span>
          </>
        ) : (
          <Alert
            severity="info"
            title="Attente de la date prévisionnelle"
            description={
              <>
                <p className="mt-4">
                  Afin de faciliter la tenue du jury, l’AAP renseignera la date
                  prévisionnelle qui correspond :
                </p>
                <br />
                <ul className="list-disc list-inside">
                  <li>
                    à la date à laquelle le candidat aura finalisé son dossier
                    de validation pour les certifications du Ministère du
                    Travail et des Branches Professionnelles
                  </li>
                  <li>
                    à la date de dépôt du dossier de validation pour les autres
                    certifications
                  </li>
                </ul>
              </>
            }
          />
        )}
      </div>
    )
  );
};

const DossierDeValidationTab = () => {
  const {
    dossierDeValidation,
    candidacy,
    getDossierDeValidationStatus,
    canSignalProblem,
  } = useDossierDeValidationPageLogic();

  const showContent = getDossierDeValidationStatus === "success";

  return (
    showContent && (
      <div className="flex flex-col flex-1 mb-2 overflow-auto">
        {dossierDeValidation ? (
          <div className="flex flex-col">
            <p className="text-gray-600 mb-12">
              Voici les documents du dossier de validation du candidat.
            </p>
            <p className="text-xs">
              <span className="uppercase text-xs font-bold align-text-top">
                dossier déposé le :{" "}
              </span>
              <span className="text-base">
                {format(
                  dossierDeValidation.dossierDeValidationSentAt,
                  "dd/MM/yyyy",
                )}
              </span>
            </p>
            <p>
              <span className="uppercase text-xs font-bold">
                contenu du dossier :
              </span>
              <ul>
                <li>
                  <FileLink
                    text={dossierDeValidation.dossierDeValidationFile.name}
                    url={dossierDeValidation.dossierDeValidationFile.url}
                  />
                </li>
                {dossierDeValidation.dossierDeValidationOtherFiles.map((f) => (
                  <li key={f.url} className="mt-2">
                    <FileLink text={f.name} url={f.url} />
                  </li>
                ))}
              </ul>
            </p>

            {canSignalProblem && (
              <Button
                priority="secondary"
                className="mt-10 ml-auto"
                linkProps={{
                  href: `/candidacies/${candidacy?.id}/dossier-de-validation/problem`,
                }}
              >
                Signaler un problème
              </Button>
            )}
          </div>
        ) : (
          <Alert
            severity="info"
            title="Attente du dossier de validation"
            description={
              <>
                <p>
                  Le candidat (ou son AAP) doit vous transmettre son dossier de
                  validation une fois qu’il est finalisé.
                </p>
                <p className="mt-4">
                  Le passage devant le jury devra alors avoir lieu dans un délai
                  maximum de 3 mois à compter de la réception du dossier.
                </p>
                <p className="mt-4">
                  Si vous ne demandez pas la transmission du dossier de
                  validation avant le passage en jury du candidat, un courrier
                  vous informant que le candidat sera prêt à se présenter devant
                  le jury dans un délai de 3 mois vous sera transmis à la place.
                </p>
              </>
            }
          />
        )}
      </div>
    )
  );
};

export default DossierDeValidationPage;
