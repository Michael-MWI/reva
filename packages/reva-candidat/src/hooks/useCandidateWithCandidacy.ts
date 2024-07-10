import { useQuery } from "@tanstack/react-query";
import { isBefore } from "date-fns";

import { graphql } from "@/graphql/generated";

import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";

const GET_CANDIDATE_WITH_CANDIDACY = graphql(`
  query candidate_getCandidateWithCandidacy {
    candidate_getCandidateWithCandidacy {
      firstname
      firstname2
      firstname3
      lastname
      email
      givenName
      birthdate
      birthCity
      birthDepartment {
        label
        code
        region {
          code
          label
        }
      }
      nationality
      gender
      phone
      city
      street
      zip
      department {
        id
        code
        label
      }
      highestDegree {
        level
        longLabel
      }
      niveauDeFormationLePlusEleve {
        level
      }
      candidacy {
        id
        email
        firstAppointmentOccuredAt
        candidacyStatuses {
          id
          createdAt
          status
          isActive
        }
        certification {
          id
          label
          level
          codeRncp
          degree {
            longLabel
            level
          }
        }
        goals {
          id
          label
          order
          needsAdditionalInformation
          isActive
        }
        experiences {
          id
          title
          startedAt
          duration
          description
        }
        organism {
          id
          label
          contactAdministrativeEmail
          contactAdministrativePhone
          informationsCommerciales {
            id
            nom
            emailContact
            telephone
          }
        }
        financeModule
        additionalHourCount
        basicSkills {
          id
          label
        }
        certificateSkills
        collectiveHourCount
        individualHourCount
        mandatoryTrainings {
          id
          label
        }
        otherTraining
        isCertificationPartial
        feasibilityFormat
        feasibility {
          id
          feasibilityFileSentAt
          decision
          decisionComment
          decisionSentAt
          decisionFile {
            name
            url
          }
        }
        activeDossierDeValidation {
          id
          decision
          decisionComment
          decisionSentAt
        }
        jury {
          id
          dateOfSession
          timeOfSession
          timeSpecified
          addressOfSession
          informationOfSession
          result
          dateOfResult
          informationOfResult
          convocationFile {
            name
            url
          }
        }
        dematerializedFeasibilityFile {
          id
          sentToCandidateAt
          aapDecision
          aapDecisionComment
          prerequisites {
            label
            state
          }
          firstForeignLanguage
          secondForeignLanguage
          option
          blocsDeCompetences {
            certificationCompetenceBloc {
              id
              code
              label
              isOptional
              FCCompetences
              competences {
                id
                label
              }
            }
          }
          certificationCompetenceDetails {
            text
            certificationCompetence {
              id
              label
            }
          }
          swornStatementFile {
            name
            previewUrl
            url
            mimeType
          }
          attachments {
            type
            file {
              name
              previewUrl
              mimeType
            }
          }
        }
      }
    }
  }
`);

export const useCandidateWithCandidacy = () => {
  const { graphqlClient } = useGraphQlClient();

  const candidateWithCandidacy = useQuery({
    queryKey: ["getCandidateWithCandidacy"],
    queryFn: () => graphqlClient.request(GET_CANDIDATE_WITH_CANDIDACY),
  });

  const refetch = candidateWithCandidacy.refetch;

  const candidate =
    candidateWithCandidacy.data?.candidate_getCandidateWithCandidacy;

  const candidacy = candidate?.candidacy;

  const candidacyStatus = candidacy?.candidacyStatuses.find(
    (status) => status.isActive,
  )?.status;

  const isTrainingConfirmed =
    candidacy?.candidacyStatuses.findIndex(
      (status) => status.status == "PARCOURS_CONFIRME",
    ) != -1;

  // candidate can edit project if a training has not been sent and if the first appointment date has not passed
  const canEditCandidacy =
    (candidacyStatus === "PROJET" ||
      candidacyStatus === "VALIDATION" ||
      candidacyStatus === "PRISE_EN_CHARGE") &&
    (!candidacy?.firstAppointmentOccuredAt ||
      isBefore(new Date(), candidacy.firstAppointmentOccuredAt));

  const candidacyAlreadySubmitted = candidacyStatus !== "PROJET";

  return {
    refetch,
    candidate,
    candidacy,
    candidacyStatus,
    canEditCandidacy,
    candidacyAlreadySubmitted,
    isTrainingConfirmed,
  };
};
