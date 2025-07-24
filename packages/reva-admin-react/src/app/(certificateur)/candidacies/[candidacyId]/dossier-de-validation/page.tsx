"use client";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { format } from "date-fns";

import { BackButton } from "@/components/back-button/BackButton";

import { DossierDeValidationCard } from "./_components/DossierDeValidationCard";
import { HistoryDossierDeValidationView } from "./_components/HistoryDossierDeValidationView";
import { useDossierDeValidationPageLogic } from "./dossierDeValidationPageLogic";

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
      <div className="flex flex-col gap-10 overflow-auto">
        {readyForJuryEstimatedAt ? (
          <>
            <h6 className="font-normal m-0">
              Pour faciliter l'organisation du jury, l’AAP a indiqué une date
              prévisionnelle de dépôt du dossier de validation. Cette date vous
              permet d’estimer la période à laquelle le candidat sera prêt pour
              un passage devant le jury.
            </h6>
            <div className="flex flex-col gap-2">
              <span className="uppercase font-bold text-sm">
                date prévisionnelle
              </span>
              <span className="text-base">
                {format(readyForJuryEstimatedAt, "dd/MM/yyyy")}
              </span>
            </div>
          </>
        ) : (
          <Alert
            severity="info"
            title="Attente de la date prévisionnelle"
            description={
              <>
                <p className="mt-4">
                  Le candidat ou l’AAP (le cas échéant) renseignera
                  prochainement la date prévisionnelle qui correspond :
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
                <p className="mt-4">
                  Une fois cette date communiquée, vous pourrez facilement
                  organiser le passage devant le jury.
                </p>
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
    historyDossierDeValidation,
    candidacy,
    getDossierDeValidationStatus,
    canSignalProblem,
  } = useDossierDeValidationPageLogic();

  const showContent = getDossierDeValidationStatus === "success";

  return (
    showContent && (
      <div className="flex flex-col gap-10 flex-1 mb-2 overflow-auto">
        {dossierDeValidation && (
          <h6 className="font-normal m-0">
            Retrouvez ici les documents liés au dossier de validation du
            candidat.
          </h6>
        )}

        <HistoryDossierDeValidationView
          historyDossierDeValidation={historyDossierDeValidation.map(
            (dossierDeValidation) => ({
              id: dossierDeValidation.id,
              sentAt: dossierDeValidation.dossierDeValidationSentAt,
              file: dossierDeValidation.dossierDeValidationFile,
              otherFiles: dossierDeValidation.dossierDeValidationOtherFiles,
              decision: dossierDeValidation.decision,
              decisionSentAt: dossierDeValidation.decisionSentAt,
              decisionComment: dossierDeValidation.decisionComment,
            }),
          )}
        />

        {dossierDeValidation ? (
          <>
            <DossierDeValidationCard
              dossierDeValidation={{
                id: dossierDeValidation.id,
                sentAt: dossierDeValidation.dossierDeValidationSentAt,
                file: dossierDeValidation.dossierDeValidationFile,
                otherFiles: dossierDeValidation.dossierDeValidationOtherFiles,
                decision: dossierDeValidation.decision,
                decisionSentAt: dossierDeValidation.decisionSentAt,
                decisionComment: dossierDeValidation.decisionComment,
              }}
            />

            {canSignalProblem && (
              <Button
                priority="secondary"
                className="mt-10 ml-auto"
                linkProps={{
                  href: `/candidacies/${candidacy?.id}/dossier-de-validation/problem`,
                }}
              >
                Demander une correction
              </Button>
            )}
          </>
        ) : (
          <Alert
            severity="info"
            title="En attente du dossier de validation"
            description={
              <p>
                Le dossier de validation est en cours de rédaction. Une fois
                terminé, le candidat ou l’AAP vous le transmettra et vous
                pourrez programmer son passage devant le jury (dans un délai
                maximum de 3 mois à compter de la réception du dossier).
                <br />
                <br />
                Si vous n’exigez pas la transmission du dossier de validation,
                un courrier vous informant que le candidat sera prêt à se
                présenter devant le jury dans un délai de 3 mois vous sera
                transmis à la place.
              </p>
            }
          />
        )}
      </div>
    )
  );
};

export default DossierDeValidationPage;
