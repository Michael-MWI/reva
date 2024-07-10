import { useRouter } from "next/navigation";
import { format } from "date-fns";

import Button from "@codegouvfr/react-dsfr/Button";

import { TimelineElement } from "@/components/legacy/molecules/Timeline/Timeline";

import { useCandidateWithCandidacy } from "@/hooks/useCandidateWithCandidacy";

export const FeasibilityDematTimelineElement = () => {
  const router = useRouter();

  const { candidacy } = useCandidateWithCandidacy();

  if (!candidacy) {
    return null;
  }

  const { dematerializedFeasibilityFile: feasibility } = candidacy;

  const PENDING_AAP = feasibility && !feasibility.sentToCandidateAt;
  const PENDING_CANDIDATE = feasibility && feasibility.sentToCandidateAt;

  const INCOMPLETE = false;
  const ADMISSIBLE = false;
  const REJECTED = false;

  let text: React.ReactNode = "";

  if (PENDING_AAP) {
    text = (
      <>
        <span>
          Votre accompagnateur est en train de finaliser la co-construction de
          votre dossier de faisabilité.
        </span>
        <br />
        <span>Lorsqu’il aura terminé :</span>
        <br />
        <span>1. vous recevrez un e-mail</span>
        <br />
        <span>
          2. puis vous aurez à valider ce parcours dans votre espace candidat.
        </span>
      </>
    );
  } else if (PENDING_CANDIDATE) {
    text = (
      <>
        <span>
          Vous avez reçu votre dossier de faisabilité{" "}
          {format(feasibility.sentToCandidateAt!, "dd/MM/yyyy")}. Votre
          accompagnateur est en train d’y apporter quelques modifications. Vous
          recevrez prochainement la nouvelle version de votre dossier.
        </span>
      </>
    );
  }

  const icon = "fr-icon-information-fill";

  return (
    <TimelineElement
      title="Recevabilité"
      status={
        ADMISSIBLE || REJECTED
          ? "readonly"
          : PENDING_AAP || PENDING_CANDIDATE || INCOMPLETE
            ? "active"
            : "disabled"
      }
      description={
        !!feasibility ? (
          <p className="text-sm text-dsfrGray-500 mt-4 mb-0" role="status">
            Le dossier constitué à cette étape vous permettra d’accéder à votre
            accompagnement VAE.
          </p>
        ) : undefined
      }
    >
      {!!feasibility && (
        <>
          <div className="flex text-dsfrGray-500">
            <span className={`fr-icon ${icon} mr-2 self-center mb-6`} />
            <div>
              <p className="text-sm italic">{text}</p>
            </div>
          </div>
          <div>
            <Button
              data-test="vérifier-votre-dossier-de-faisabilité"
              priority="primary"
              disabled={!feasibility.sentToCandidateAt}
              nativeButtonProps={{
                onClick: () => {
                  router.push("/validate-feasibility");
                },
              }}
            >
              {feasibility.swornStatementFile
                ? "Consultez"
                : "Vérifiez votre dossier"}
            </Button>
          </div>
        </>
      )}
    </TimelineElement>
  );
};
