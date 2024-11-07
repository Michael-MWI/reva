import { FeasibilityDecision as FeasibilityDecisionEnum } from "@/graphql/generated/graphql";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { formatDate } from "date-fns";
import { ReactNode } from "react";

type FeasibilityHistory = {
  id: string;
  decision: FeasibilityDecisionEnum;
  decisionSentAt?: number | null;
  decisionComment?: string | null;
};

const Info = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <dl className={`m-2 ${className || ""}`}>
    <dt className="font-bold mb-1">{title}</dt>
    <dd>{children}</dd>
  </dl>
);

export const FeasibilityDecisionHistory = ({
  label,
  decisions,
  className,
}: {
  label: string;
  decisions: FeasibilityHistory[];
  className?: string;
}) => (
  <Accordion label={label} className={`${className || ""}`}>
    <div className="flex flex-col">
      {decisions.map((d) => (
        <FeasibilityDecision
          key={d.id}
          {...d}
          className="pt-4 pb-3 first:border-none last:border-t-[1.5px] first:pt-0"
        />
      ))}
    </div>
  </Accordion>
);

const titleMap = {
  ADMISSIBLE: `Dossier recevable`,
  INCOMPLETE: `Dossier incomplet`,
  REJECTED: `Dossier non recevable`,
};

const FeasibilityDecision = ({
  decisionSentAt,
  decisionComment,
  decision,
  className,
}: FeasibilityHistory & {
  className?: string;
}) => {
  if (decision === "COMPLETE") {
    return null;
  }
  return (
    <div className={`grid md:grid-cols-2 ${className || ""}`}>
      <Info title="Décision">
        {titleMap[decision as keyof typeof titleMap]}
      </Info>
      <Info title="Décision prise le : ">
        {decisionSentAt ? formatDate(decisionSentAt, "dd/MM/yyyy") : ""}
      </Info>
      <Info title="Commentaire : ">{decisionComment}</Info>
    </div>
  );
};
