"use client";
import {
  FeasibilityForm,
  FeasibilityFormData,
} from "@/app/feasibilities/[feasibilityId]/FeasibilityForm";
import { useFeasibilityPageLogic } from "@/app/feasibilities/[feasibilityId]/feasibilityPageLogic";
import { AuthenticatedLink } from "@/components/authenticated-link/AuthenticatedLink";
import { errorToast } from "@/components/toast/toast";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { format } from "date-fns/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";

const FeasibilityPage = () => {
  const { feasibility, submitFeasibilityDecision } = useFeasibilityPageLogic();
  const router = useRouter();

  const handleFormSubmit = async (data: FeasibilityFormData) => {
    const result = await submitFeasibilityDecision({
      decision: data.decision,
      comment: data.comment,
      infoFile: data?.infoFile?.[0],
    });
    if (result.ok) {
      router.push("/feasibilities?CATEGORY=ALL");
    } else {
      errorToast(result.statusText);
    }
  };

  return (
    <div className="flex flex-col flex-1 mb-2">
      <Link
        href="/feasibilities?CATEGORY=ALL"
        className="fr-icon-arrow-left-line fr-link--icon-left text-blue-900 text-lg mr-auto"
      >
        Tous les dossiers
      </Link>
      {feasibility && (
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold mt-8">
            {feasibility.candidacy.candidate?.firstname}{" "}
            {feasibility.candidacy.candidate?.lastname}
          </h1>
          <p className="text-2xl font-bold">
            {feasibility.candidacy.certification?.label}
          </p>
          {feasibility.feasibilityFile && (
            <GrayBlock>
              <FileLink
                text={feasibility.feasibilityFile.name}
                url={feasibility.feasibilityFile.url}
              />
            </GrayBlock>
          )}
          {feasibility.IDFile && (
            <GrayBlock>
              <FileLink
                text={feasibility.IDFile.name}
                url={feasibility.IDFile.url}
              />
              <Alert
                className="mt-4"
                title="Attention"
                description="La pièce d’identité du candidat sera effacée de nos serveurs lorsque la recevabilité sera prononcée (recevable, non recevable ou incomplet)."
                severity="warning"
              />
            </GrayBlock>
          )}
          {feasibility.documentaryProofFile && (
            <GrayBlock>
              <FileLink
                text={feasibility.documentaryProofFile.name}
                url={feasibility.documentaryProofFile.url}
              />
            </GrayBlock>
          )}
          {feasibility.certificateOfAttendanceFile && (
            <GrayBlock>
              <FileLink
                text={feasibility.certificateOfAttendanceFile.name}
                url={feasibility.certificateOfAttendanceFile.url}
              />
            </GrayBlock>
          )}
          <GrayBlock>
            <h5 className="text-2xl font-bold mb-4">
              Architecte accompagnateur de parcours
            </h5>
            <h6 className="text-xl font-bold mb-4">
              {feasibility.candidacy.organism?.label}
            </h6>
            <p className="text-lg mb-0">
              {feasibility.candidacy.organism?.contactAdministrativeEmail}
            </p>
          </GrayBlock>
          {feasibility.decision === "PENDING" ? (
            <FeasibilityForm className="mt-4" onSubmit={handleFormSubmit} />
          ) : (
            <FeasibilityDecisionInfo
              decision={feasibility.decision}
              decisionSentAt={feasibility.decisionSentAt}
              decisionComment={feasibility.decisionComment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FeasibilityPage;

const GrayBlock = ({ children }: { children: ReactNode }) => (
  <div className="bg-neutral-100 px-8 pt-6 pb-8 w-full">{children}</div>
);

const FeasibilityDecisionInfo = ({
  decision,
  decisionSentAt,
  decisionComment,
}: {
  decision: "ADMISSIBLE" | "REJECTED" | "INCOMPLETE";
  decisionSentAt: Date;
  decisionComment?: string | null;
}) => {
  const decisionLabel = useMemo(() => {
    switch (decision) {
      case "ADMISSIBLE":
        return "Recevable";
      case "REJECTED":
        return "Non recevable";
      case "INCOMPLETE":
        return "Dossier incomplet";
    }
  }, [decision]);

  const decisionDateLabel = useMemo(() => {
    switch (decision) {
      case "ADMISSIBLE":
        return "Dossier validé";
      case "REJECTED":
        return "Dossier rejeté";
      case "INCOMPLETE":
        return "Dossier marqué incomplet";
    }
  }, [decision]);

  return (
    <>
      <GrayBlock>
        <h5 className="text-2xl font-bold mb-4">
          Décision prise concernant ce dossier
        </h5>
        <h6 className="text-xl font-bold mb-4">{decisionLabel}</h6>
        <p className="text-lg mb-0">
          {decisionDateLabel} le {format(decisionSentAt, "d/MM/yyyy")}
        </p>
      </GrayBlock>
      <GrayBlock>
        <h5 className="text-2xl font-bold mb-4">Motifs de la décision</h5>
        {decisionComment ? (
          <p>{decisionComment}</p>
        ) : (
          <p className="italic">Motifs non précisés</p>
        )}
      </GrayBlock>
    </>
  );
};

const FileLink = ({ url, text }: { url: string; text: string }) => (
  <AuthenticatedLink
    text={text}
    title={text}
    url={url}
    className="fr-link text-2xl font-semibold"
  />
);
