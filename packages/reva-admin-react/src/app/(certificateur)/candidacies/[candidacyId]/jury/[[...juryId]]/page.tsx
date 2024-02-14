"use client";
import Link from "next/link";

import { Tabs } from "@codegouvfr/react-dsfr/Tabs";

import { useJuryPageLogic } from "./juryPageLogic";

import { DateDeJury } from "./DateDeJury";
import { Resultat } from "./Resultat";

interface Props {
  params: {
    candidacyId: string;
    juryId?: string[];
  };
}

const JuryPage = (_props: Props) => {
  const { getCandidacy } = useJuryPageLogic();

  const candidacyStatuses =
    getCandidacy.data?.getCandidacyById?.candidacyStatuses;

  const isDossierDeValidationSent =
    candidacyStatuses?.findIndex(
      ({ status }) => status == "DOSSIER_DE_VALIDATION_ENVOYE",
    ) != -1;

  return (
    <div className="flex flex-col w-full">
      <Link
        href="/candidacies/juries"
        className="fr-icon-arrow-left-line fr-link--icon-left text-blue-900 text-lg mr-auto"
      >
        Tous les dossiers
      </Link>
      <h1 className="text-3xl font-bold my-8">Jury</h1>

      {!getCandidacy.isLoading && isDossierDeValidationSent && (
        <Tabs
          tabs={[
            {
              label: "Date de jury",
              isDefault: true,
              content: <DateDeJury />,
            },
            {
              label: "Résultat",
              content: <Resultat />,
            },
          ]}
        />
      )}

      {!getCandidacy.isLoading && !isDossierDeValidationSent && (
        <div className="flex flex-col">
          <p className="text-gray-600">
            Veuillez envoyer le dossier de validation afin d'accéder à la
            section jury.
          </p>
        </div>
      )}
    </div>
  );
};

export default JuryPage;
