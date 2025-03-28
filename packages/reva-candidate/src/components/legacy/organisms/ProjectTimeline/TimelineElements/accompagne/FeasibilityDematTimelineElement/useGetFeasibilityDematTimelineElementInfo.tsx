import { useCandidacy } from "@/components/candidacy/candidacy.context";
import { useFeatureFlipping } from "@/components/feature-flipping/featureFlipping";
import { TimeLineElementStatus } from "@/components/legacy/molecules/Timeline/Timeline";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { format } from "date-fns";

interface InformationWithIconProps {
  children: React.ReactNode;
  title: string;
}

const InformationWithIcon = ({ children, title }: InformationWithIconProps) => (
  <div className="text-dsfrGray-500 max-w-3xl">
    <p className="text-sm" role="status">
      {title}
    </p>
    <div className="flex gap-2">
      <span className="fr-icon fr-icon-information-fill mr-2 self-center" />
      {children}
    </div>
  </div>
);

interface GetFeasibilityTimelineElementInfoResult {
  informationComponent: React.ReactNode;
  status: TimeLineElementStatus;
  badgeStatus: React.ReactNode;
}

const TEXT_DEFAULT =
  "Le dossier constitué à cette étape vous permettra d'accéder à votre accompagnement VAE.";

const TEXT_WHEN_ADMISSIBLE =
  "Lorsqu'il est recevable, le dossier de faisabilité vous permet d'accéder à votre parcours VAE.";

const BadgeNonValable = (
  <Badge
    severity="warning"
    data-test="feasibility-timeline-element-non-valable-badge"
  >
    Non valable
  </Badge>
);

export const useGetFeasibilityDematTimelineElementInfo =
  (): GetFeasibilityTimelineElementInfoResult => {
    const { candidacy, feasibility } = useCandidacy();
    const { isFeatureActive } = useFeatureFlipping();
    const candidacyActualisationIsActive = isFeatureActive(
      "candidacy_actualisation",
    );
    const isCaduque = candidacy.isCaduque;
    const dematerializedFile = feasibility?.dematerializedFeasibilityFile;

    const certificationDecisions = ["ADMISSIBLE", "REJECTED", "INCOMPLETE"];
    const decision = feasibility?.decision;
    const decisionSentAt = feasibility?.decisionSentAt;
    const decisionComment = feasibility?.decisionComment;
    const candidateHasConfirmedDematerializedFile =
      !!dematerializedFile?.candidateConfirmationAt;

    const hasSwornStatement = !!dematerializedFile?.swornStatementFile;
    const sentToCandidateAt = dematerializedFile?.sentToCandidateAt;

    const isPendingAAP =
      candidateHasConfirmedDematerializedFile && hasSwornStatement;
    const isPendingCandidate =
      !!sentToCandidateAt && !candidateHasConfirmedDematerializedFile;
    const isPendingSwornDeclaration =
      !hasSwornStatement && candidateHasConfirmedDematerializedFile;
    const isPendingCertificationAuthority =
      !!feasibility?.feasibilityFileSentAt &&
      !certificationDecisions.includes(decision as string);

    const formatDate = (date: number) => format(date, "dd/MM/yyyy");

    const pendingContestationCaducite =
      candidacy?.candidacyContestationsCaducite?.find(
        (c) =>
          c?.certificationAuthorityContestationDecision === "DECISION_PENDING",
      );

    const hasConfirmedCaducite =
      candidacy?.candidacyContestationsCaducite?.some(
        (contestation) =>
          contestation?.certificationAuthorityContestationDecision ===
          "CADUCITE_CONFIRMED",
      );

    switch (true) {
      case !dematerializedFile:
        return {
          informationComponent: null,
          status: "disabled",
          badgeStatus: null,
        };

      case hasConfirmedCaducite:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_DEFAULT}>
              <p className="italic mb-0 text-sm">
                Après étude de votre contestation, le certificateur a décidé que
                votre recevabilité n'était plus valable. Cela signifie que votre
                parcours VAE s'arrête ici.
              </p>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: BadgeNonValable,
        };

      case !!pendingContestationCaducite:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_DEFAULT}>
              <p className="italic mb-0 text-sm">
                Votre contestation a été faite le{" "}
                {format(
                  pendingContestationCaducite.contestationSentAt,
                  "dd/MM/yyyy",
                )}
                . Elle a été envoyée à votre certificateur qui y répondra dans
                les meilleurs délais.
              </p>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: BadgeNonValable,
        };

      case isCaduque && candidacyActualisationIsActive:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_DEFAULT}>
              <div className="italic">
                <p className="mb-0 text-sm">
                  Parce que vous ne vous êtes pas actualisé à temps, votre
                  recevabilité est désormais caduque. Cela signifie que votre
                  parcours VAE s'arrête ici. Vous pouvez contester cette
                  décision en cliquant sur le bouton “Contester”.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: BadgeNonValable,
        };

      // Rest of the cases remain unchanged...
      case decision === "ADMISSIBLE":
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <div className="italic">
                <p className="mb-0 text-sm">
                  Votre dossier de faisabilité a été jugé recevable par le
                  certificateur le {formatDate(decisionSentAt as number)}.
                </p>
                <p className="mb-0 text-sm">
                  Votre accompagnateur va prendre contact avec vous
                  prochainement pour démarrer votre accompagnement.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "readonly",
          badgeStatus: <Badge severity="success">Recevable</Badge>,
        };

      case decision === "REJECTED":
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <div className="italic">
                <p className="text-sm">
                  Votre dossier de faisabilité n&apos;a pas été accepté par le
                  certificateur, cela met donc fin à votre parcours France VAE.
                </p>
                <p className="text-sm">
                  <b>Commentaire du certificateur :</b>
                  <br />"{decisionComment}" -{" "}
                  {formatDate(decisionSentAt as number)}
                </p>
                <p className="text-sm mb-0">
                  Pour plus d&apos;informations, vous pouvez contacter votre
                  accompagnateur en lui écrivant à l&apos;e-mail indiqué dans
                  l&apos;étape &quot;Votre organisme d&apos;accompagnement&quot;
                  ci-dessus.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "readonly",
          badgeStatus: <Badge severity="error">Non recevable</Badge>,
        };

      case isPendingCertificationAuthority:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <p className="italic mb-0 text-sm">
                Votre dossier de faisabilité a été transmis au certificateur.
                Vous recevrez une réponse dans un délai de 2 mois maximum, par
                e-mail et dans certains cas en plus par courrier. Votre
                accompagnateur sera lui aussi informé de la décision du
                certificateur.
              </p>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: <Badge severity="info">ENVOYÉ AU CERTIFICATEUR</Badge>,
        };

      case isPendingAAP:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <div className="italic">
                <p className="mb-0 text-sm">
                  Vous avez transmis votre attestation sur l'honneur le{" "}
                  {formatDate(
                    dematerializedFile.swornStatementFile?.createdAt as number,
                  )}
                  .
                </p>
                <p className="mb-0 text-sm">
                  Votre accompagnateur va envoyer votre dossier au certificateur
                  afin qu'il puisse se prononcer sur votre recevabilité.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: (
            <Badge severity="info">
              En attente d&apos;envoi au certificateur
            </Badge>
          ),
        };

      case isPendingSwornDeclaration:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <p className="italic mb-0 text-sm">
                L'accompagnateur doit maintenant télécharger votre attestation
                sur l'honneur et l'ajouter à votre dossier de faisabilité.
              </p>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: (
            <Badge severity="info">En attente de l'attestation</Badge>
          ),
        };

      case isPendingCandidate:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_DEFAULT}>
              <p className="italic mb-0 text-sm">
                Votre dossier de faisabilité vous a été transmis le{" "}
                {formatDate(sentToCandidateAt as number)}. Vérifiez les
                informations renseignées par votre organisme accompagnateur et
                transmettez nous l&apos;attestation sur l&apos;honneur signée de
                votre part.
              </p>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: (
            <Badge severity="info">En attente de votre validation</Badge>
          ),
        };

      case decision === "INCOMPLETE":
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_WHEN_ADMISSIBLE}>
              <div className="italic">
                <p className="text-sm">
                  Votre dossier de faisabilité a été déclaré incomplet par le
                  certificateur. Contactez votre accompagnateur pour prendre
                  connaissance des éléments manquants et renvoyer votre dossier
                  mis à jour.
                </p>
                <p className="text-sm">
                  <b className="not-italic">Commentaire du certificateur :</b>
                  <br />
                  &quot;{decisionComment}&quot;
                </p>
                <p className="text-sm mb-0">
                  Pour plus d&apos;informations, vous pouvez contacter votre
                  accompagnateur en lui écrivant à l&apos;e-mail indiqué dans
                  l&apos;étape &quot;Votre organisme d&apos;accompagnement&quot;
                  ci-dessus.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: <Badge severity="warning">Dossier incomplet</Badge>,
        };

      default:
        return {
          informationComponent: (
            <InformationWithIcon title={TEXT_DEFAULT}>
              <div className="flex flex-col gap-1 italic">
                <p className="mb-0 text-sm">
                  Votre accompagnateur est en train de finaliser la
                  co-construction de votre dossier de faisabilité. Quand il aura
                  terminé :
                </p>
                <p className="mb-0 text-sm">1. vous recevrez un e-mail,</p>
                <p className="mb-0 text-sm">
                  2. puis vous aurez à valider ce parcours dans votre espace
                  candidat.
                </p>
              </div>
            </InformationWithIcon>
          ),
          status: "active",
          badgeStatus: null,
        };
    }
  };
