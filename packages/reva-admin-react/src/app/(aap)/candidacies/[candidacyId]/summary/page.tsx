"use client";
import { CandidacySummaryBottomButtons } from "@/app/(aap)/candidacies/[candidacyId]/summary/_components/CandidacySummaryBottomButtons";
import { CandidateExperiencesSectionCard } from "@/app/(aap)/candidacies/[candidacyId]/summary/_components/CandidateExperiencesSectionCard";
import { useTakeOverCandidacy } from "@/app/(aap)/candidacies/[candidacyId]/summary/_components/takeOverCondidacy";
import { useAuth } from "@/components/auth/auth";
import { EnhancedSectionCard } from "@/components/card/enhanced-section-card/EnhancedSectionCard";
import { GrayCard } from "@/components/card/gray-card/GrayCard";
import { Impersonate } from "@/components/impersonate";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { CertificationCard } from "./_components/CertificationCard";
import { checkCandidateFields } from "./_components/checkCandidateFields";
import useCandidateSummary from "./_components/useCandidateSummary";

const CandidacySummaryPage = () => {
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();

  const { candidacy } = useCandidateSummary(candidacyId);

  const { takeOverCandidacy } = useTakeOverCandidacy();

  const { isAdmin } = useAuth();

  //mark the candidacy as "taken over" when the AAP opens it
  useEffect(() => {
    if (candidacy) {
      if (candidacy.status === "VALIDATION") {
        takeOverCandidacy({
          candidacyId: candidacy.id,
          candidacyActiveStatus: candidacy.status,
        });
      }
    }
  }, [candidacy, takeOverCandidacy]);

  if (!candidacy) return null;

  const { candidate, goals } = candidacy;

  const isCandidateInformationCompleted = checkCandidateFields(candidate, [
    "firstname",
    "lastname",
    "phone",
    "email",
    "department",
    "birthdate",
    "country",
    "birthCity",
    "nationality",
    "street",
    "zip",
    "city",
    "phone",
    "email",
  ]);

  const isCandidateProfileCompleted = checkCandidateFields(candidate, [
    "highestDegree",
    "niveauDeFormationLePlusEleve",
  ]);

  const candidateHasAddressCompleted = checkCandidateFields(candidate, [
    "street",
    "zip",
    "city",
    "department",
  ]);

  const showFundingAlert = candidacy.financeModule === "hors_plateforme";

  const isCandidateEditable =
    candidacy.feasibilityFormat === "DEMATERIALIZED" &&
    (!candidacy.feasibility?.feasibilityFileSentAt ||
      candidacy.feasibility?.decision === "INCOMPLETE");

  return (
    <>
      <div>
        <div className="flex justify-between mb-1">
          <h1>Résumé de la candidature</h1>

          <Impersonate candidateId={candidacy.candidate?.id} />
        </div>

        <p>
          Vous pouvez compléter ou modifier ces informations jusqu'à l'envoi du
          dossier de faisabilité.
        </p>
        {showFundingAlert && (
          <Alert
            data-test="funding-request-not-available-alert"
            severity="warning"
            title="Ce parcours n’est plus finançable via France VAE "
            description={
              <div>
                <p>
                  En revanche, il peut en partie être financé par le Compte
                  Personnel de Formation du candidat.
                </p>
                <p>
                  Ce dernier peut consulter ses droits depuis la plateforme Mon
                  Compte Formation.
                </p>
              </div>
            }
          />
        )}
      </div>
      {!!candidate && (
        <>
          <ul className="flex flex-col gap-8 pl-0 mt-8">
            <EnhancedSectionCard
              data-test="candidate-information"
              title="Les informations du candidat"
              buttonOnClickHref={`/candidacies/${candidacyId}/summary/candidate-information`}
              status={
                isCandidateInformationCompleted ? "COMPLETED" : "TO_COMPLETE"
              }
              isEditable={isCandidateEditable}
            >
              <dl>
                <dt className="sr-only">Prénom et nom</dt>
                <dd>
                  {candidate.firstname} {candidate.lastname}
                </dd>
                <dt className="sr-only">
                  Date de naissance, département et nationalité
                </dt>
                <dd>
                  {candidate.birthdate &&
                    format(candidate.birthdate, "dd/MM/yyyy")}{" "}
                  {candidate.department.label} ({candidate.department.code}){" "}
                  {candidate.nationality}
                </dd>
                <dt className="sr-only">Téléphone</dt>
                <dd>{candidate.phone}</dd>
                <dt className="sr-only">Adresse email</dt>
                <dd>{candidate.email}</dd>
                <dt className="sr-only">Adresse</dt>
                <dd>
                  {candidateHasAddressCompleted &&
                    `${candidate.street}, ${candidate.zip} ${candidate.city}, ${candidate.department.label}`}
                </dd>
              </dl>
            </EnhancedSectionCard>
            {candidacy.feasibilityFormat === "DEMATERIALIZED" && (
              <EnhancedSectionCard
                data-test="candidate-profile"
                title="Son profil"
                buttonOnClickHref={`/candidacies/${candidacyId}/summary/candidate-profile`}
                isEditable={isCandidateEditable}
                status={
                  isCandidateProfileCompleted ? "COMPLETED" : "TO_COMPLETE"
                }
              >
                {isCandidateProfileCompleted && (
                  <div className="flex flex-col">
                    <p className="font-bold mb-0">
                      Niveau de la formation la plus élevée
                    </p>
                    <p className="mb-2">
                      {candidate.niveauDeFormationLePlusEleve?.label}
                    </p>
                    <p className="mb-0 font-bold">
                      Niveau de la certification obtenue la plus élevée
                    </p>
                    <p className="mb-2">{candidate.highestDegree?.label}</p>
                    {candidate.highestDegreeLabel && (
                      <>
                        <p className="font-bold mb-0">
                          Intitulé de la certification la plus élevée obtenue
                        </p>
                        <p className="mb-2">{candidate.highestDegreeLabel}</p>
                      </>
                    )}
                  </div>
                )}
              </EnhancedSectionCard>
            )}
            <CertificationCard candidacy={candidacy} />

            <GrayCard>
              <span className="text-2xl font-bold mb-5">Ses objectifs</span>
              {goals?.length ? (
                <ul>
                  {goals.map((g) => (
                    <li key={g.id}>{g.label}</li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0">Non renseigné</p>
              )}
            </GrayCard>
            {isAdmin && (
              <GrayCard>
                <div className="flex flex-row justify-between mb-5">
                  <span className="text-2xl font-bold">
                    Son architecte de parcours
                  </span>

                  {candidacy.organism?.maisonMereAAP?.id && (
                    <Button
                      priority="secondary"
                      linkProps={{
                        href: `/maison-mere-aap/${candidacy.organism?.maisonMereAAP?.id}`,
                      }}
                    >
                      Voir son profil
                    </Button>
                  )}
                </div>
                {candidacy.organism ? (
                  <>
                    <p className="mb-0">{candidacy.organism.label}</p>
                    <p className="mb-0">
                      {candidacy.organism.contactAdministrativeEmail}
                    </p>
                  </>
                ) : (
                  <p className="mb-0">Pas encore d'AAP sélectionné</p>
                )}
              </GrayCard>
            )}
            <CandidateExperiencesSectionCard
              candidacyId={candidacyId}
              isEditable={candidacy.feasibilityFormat === "DEMATERIALIZED"}
              experiences={candidacy.experiences.map((e) => ({
                id: e.id,
                title: e.title,
                description: e.description,
                startedAt: new Date(e.startedAt),
                duration: e.duration,
              }))}
            />
          </ul>
          <CandidacySummaryBottomButtons
            candidacyId={candidacyId}
            candidacy={candidacy}
          />
        </>
      )}
    </>
  );
};

export default CandidacySummaryPage;
