import Alert from "@codegouvfr/react-dsfr/Alert";

import { DossierDeValidationType } from "../types";

import { HistoryDossierDeValidationView } from "./HistoryDossierDeValidationView";
import { DossierDeValidationCard } from "./DossierDeValidationCard";

interface Props {
  dossierDeValidation: DossierDeValidationType;
  historyDossierDeValidation: DossierDeValidationType[];
}

export const ReadOnlyDossierDeValidationView = (props: Props) => {
  const { dossierDeValidation, historyDossierDeValidation } = props;

  return (
    <div className="flex flex-col mt-6 gap-10">
      <HistoryDossierDeValidationView
        historyDossierDeValidation={historyDossierDeValidation}
      />

      <Alert
        severity="success"
        title="Dossier de validation envoyé"
        description="Le dossier de validation a été envoyé. Retrouvez ci-dessous les documents qui le composent."
      />

      <DossierDeValidationCard
        key={dossierDeValidation.id}
        dossierDeValidation={dossierDeValidation}
      />
    </div>
  );
};
