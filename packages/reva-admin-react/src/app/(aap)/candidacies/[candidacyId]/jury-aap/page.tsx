"use client";

import { DateDeJuryTab } from "./_components/DateDeJuryTab";
import { ResultatTab } from "./_components/ResultatTab";

import Tabs from "@codegouvfr/react-dsfr/Tabs";
import { useParams } from "next/navigation";

import { CandidacyBackButton } from "@/components/candidacy-back-button/CandidacyBackButton";

const AapJuryPage = () => {
  const { candidacyId } = useParams();
  return (
    <div className="flex flex-col">
      <CandidacyBackButton candidacyId={candidacyId as string} />
      <h1>Jury</h1>
      <Tabs
        tabs={[
          {
            label: "Date de jury",
            content: <DateDeJuryTab />,
          },
          {
            label: "Résultat",
            content: <ResultatTab />,
          },
        ]}
      />
    </div>
  );
};

export default AapJuryPage;
