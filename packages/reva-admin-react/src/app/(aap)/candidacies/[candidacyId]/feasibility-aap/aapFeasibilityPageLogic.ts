import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";

const getCandidacyById = graphql(`
  query getCandidacyByIdForAAPFeasibilityPage($candidacyId: ID!) {
    getCandidacyById(id: $candidacyId) {
      individualHourCount
      collectiveHourCount
      additionalHourCount
      isCertificationPartial
      organism {
        contactAdministrativePhone
        contactAdministrativeEmail
        adresseVille
        adresseCodePostal
        adresseInformationsComplementaires
        adresseNumeroEtNomDeRue
        emailContact
        telephone
        nomPublic
        label
      }
      certificationAuthorities {
        contactFullName
        contactEmail
        contactPhone
        label
      }
      certificationAuthorityLocalAccounts {
        contactFullName
        contactEmail
        contactPhone
      }
      experiences {
        id
        title
        startedAt
        duration
        description
      }
      mandatoryTrainings {
        id
        label
      }
      goals {
        id
        label
      }
      basicSkills {
        id
        label
      }
      certification {
        label
        codeRncp
      }
      feasibility {
        decision
        decisionSentAt
        decisionComment
        feasibilityFileSentAt
        certificationAuthority {
          label
          contactFullName
          contactEmail
          contactPhone
        }
        history {
          id
          decision
          decisionComment
          decisionSentAt
        }
        dematerializedFeasibilityFile {
          swornStatementFile {
            name
            previewUrl
            mimeType
          }
          isReadyToBeSentToCandidate
          isReadyToBeSentToCertificationAuthority
          sentToCandidateAt
          certificationPartComplete
          competenceBlocsPartCompletion
          attachmentsPartComplete
          prerequisitesPartComplete
          firstForeignLanguage
          secondForeignLanguage
          option
          prerequisites {
            id
            label
            state
          }
          blocsDeCompetences {
            complete
            text
            certificationCompetenceBloc {
              id
              code
              label
              competences {
                id
                label
              }
            }
          }
          certificationCompetenceDetails {
            state
            certificationCompetence {
              id
              label
            }
          }
          aapDecision
          aapDecisionComment
          candidateDecisionComment
          attachments {
            id
            file {
              previewUrl
              name
            }
          }
          eligibilityRequirement
          eligibilityValidUntil
        }
      }
      isCaduque
      lastActivityDate
      candidacyContestationsCaducite {
        certificationAuthorityContestationDecision
      }
    }
  }
`);

export const useAapFeasibilityPageLogic = () => {
  const { graphqlClient } = useGraphQlClient();
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();

  const { data: getCandidacyByIdResponse, status: getCandidacyByIdStatus } =
    useQuery({
      queryKey: [candidacyId, "getCandidacyByIdForAAPFeasibilityPage"],
      queryFn: () =>
        graphqlClient.request(getCandidacyById, {
          candidacyId,
        }),
    });

  const candidacy = getCandidacyByIdResponse?.getCandidacyById;
  const certification = candidacy?.certification;
  const feasibility = candidacy?.feasibility;
  const dematerializedFeasibilityFile =
    candidacy?.feasibility?.dematerializedFeasibilityFile;
  return {
    certification,
    candidacy,
    dematerializedFeasibilityFile,
    queryStatus: getCandidacyByIdStatus,
    feasibility,
    isCertificationPartial: candidacy?.isCertificationPartial,
  };
};
