import { Candidacy } from "@/graphql/generated/graphql";

export const ChoixCandidatBlock = ({ candidacy }: { candidacy: Candidacy }) => {
  return (
    <div className="w-full ">
      <h2 className="text-xl">2. Choix du candidat</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <p className="text-sm font-bold">CERTIFICATION CHOISIE</p>
          <p className="m-0">
            {candidacy?.certification?.label ?? "Aucune certification choisie"}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">ACCOMPAGNATEUR CHOISI</p>
          <p className="m-0">{candidacy?.organism?.label ?? "Non précisé"}</p>
        </div>
      </div>
    </div>
  );
};
