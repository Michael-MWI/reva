import Badge from "@codegouvfr/react-dsfr/Badge";
import { StatutValidationInformationsJuridiquesMaisonMereAap } from "@/graphql/generated/graphql";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";
import { LegalInformationUpdateForm } from "./LegalInformationUpdateForm";

export const LegalInformationUpdateBlock = ({
  maisonMereAAPId,
  statutValidationInformationsJuridiquesMaisonMereAAP,
}: {
  maisonMereAAPId: string;
  statutValidationInformationsJuridiquesMaisonMereAAP: StatutValidationInformationsJuridiquesMaisonMereAap;
}) => {
  const [showUpdateFormButtonPressed, setShowUpdateFormButtonPressed] =
    useState(false);

  const showUpdateForm =
    statutValidationInformationsJuridiquesMaisonMereAAP === "A_METTRE_A_JOUR" &&
    showUpdateFormButtonPressed;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col border p-6">
        <h2>Mise à jour du compte</h2>
        {statutValidationInformationsJuridiquesMaisonMereAAP === "A_JOUR" && (
          <UpToDateStatusBlock />
        )}
        {statutValidationInformationsJuridiquesMaisonMereAAP ===
          "EN_ATTENTE_DE_VERIFICATION" && <ValidationPendingStatusBlock />}

        {statutValidationInformationsJuridiquesMaisonMereAAP ===
          "A_METTRE_A_JOUR" && (
          <NeedUpdateStatusBlock
            showUpdateButton={!showUpdateForm}
            onUpdateButtonClick={() => setShowUpdateFormButtonPressed(true)}
          />
        )}
      </div>
      {showUpdateForm && (
        <LegalInformationUpdateForm maisonMereAAPId={maisonMereAAPId} />
      )}
    </div>
  );
};

const UpToDateStatusBlock = () => (
  <Badge severity="success">Compte à jour</Badge>
);

const ValidationPendingStatusBlock = () => (
  <>
    <Badge severity="info">En attente de vérification</Badge>
    <br />
    <p>
      Vos documents et informations ont bien été envoyés. Vous recevrez un mail
      de la part de France VAE, dès que ces informations auront été traitées.
    </p>
  </>
);

const NeedUpdateStatusBlock = ({
  showUpdateButton,
  onUpdateButtonClick,
}: {
  showUpdateButton: boolean;
  onUpdateButtonClick(): void;
}) => {
  return (
    <>
      <Badge severity="warning">À mettre à jour</Badge>
      <br />
      <p>
        Pour s'assurer de la conformité des inscriptions, nous vérifions les
        documents administratifs et légaux de chaque organisme d'accompagnement.
      </p>
      <p>Voici les documents en version numérique que vous devez préparer :</p>
      <br />
      <p>
        <strong>Documents requis pour tous les organismes :</strong>
      </p>
      <ul>
        <li>
          Attestation URSSAF (qui affiche le code de vérification) - Exemples :
          attestation de vigilance, attestation fiscale.
        </li>
        <li>
          Une copie du justificatif d'identité du dirigeant "certifiée conforme
          à l'original” signée par lui-même
        </li>
      </ul>
      <br />
      <p>
        <strong>
          Si l'administrateur du compte France VAE et le dirigeant sont
          différents, ajoutez également :
        </strong>
      </p>
      <ul>
        <li>
          Une lettre de délégation signée par le dirigeant et le délégataire
        </li>
        <li>
          Une copie du justificatif d'identité de la personne ayant reçu
          délégation.
        </li>
      </ul>
      <p>Assurez-vous d'avoir ces documents en version numérique.</p>
      {showUpdateButton && (
        <Button className="ml-auto" onClick={onUpdateButtonClick}>
          Mettre à jour
        </Button>
      )}
    </>
  );
};
