import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const sendToCandidate = graphql(`
  mutation sendToCandidate(
    $dematerializedFeasibilityFileId: ID!
    $candidacyId: ID!
  ) {
    dematerialized_feasibility_file_sendToCandidate(
      dematerializedFeasibilityFileId: $dematerializedFeasibilityFileId
      candidacyId: $candidacyId
    )
  }
`);

const feasibilityWithDematerializedFeasibilityFileSendFileCandidateByCandidacyId =
  graphql(`
    query feasibilityWithDematerializedFeasibilityFileSendFileCandidateByCandidacyId(
      $candidacyId: ID!
    ) {
      feasibility_getActiveFeasibilityByCandidacyId(candidacyId: $candidacyId) {
        dematerializedFeasibilityFile {
          id
          sentToCandidateAt
          aapDecision
          aapDecisionComment
          candidateDecisionComment
          prerequisites {
            id
            label
            state
          }
          firstForeignLanguage
          secondForeignLanguage
          option
          blocsDeCompetences {
            text
            certificationCompetenceBloc {
              id
              code
              label
              FCCompetences
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
          attachments {
            type
            file {
              name
              previewUrl
              mimeType
            }
          }
          eligibilityRequirement
          eligibilityValidUntil
          swornStatementFile {
            name
            previewUrl
            mimeType
          }
        }
        candidacy {
          individualHourCount
          collectiveHourCount
          additionalHourCount
          isCertificationPartial
          basicSkills {
            label
            id
          }
          mandatoryTrainings {
            label
            id
          }
          certification {
            label
            codeRncp
            level
            degree {
              longLabel
              level
            }
          }
          goals {
            id
            label
            isActive
          }
          experiences {
            id
            title
            startedAt
            duration
            description
          }
          certificateSkills
          candidate {
            highestDegree {
              longLabel
            }
            niveauDeFormationLePlusEleve {
              longLabel
            }
            highestDegreeLabel
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
            country {
              id
              label
            }
            nationality
            gender
            phone
            city
            street
            zip
          }
        }
      }
    }
  `);

export const useSendFileCandidate = () => {
  const { graphqlClient } = useGraphQlClient();
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();

  const { data: getCandidacyByIdResponse } = useQuery({
    queryKey: [
      candidacyId,
      "dematerializedFeasibilityFileSendFileCandidateByCandidacyId",
    ],
    queryFn: () =>
      graphqlClient.request(
        feasibilityWithDematerializedFeasibilityFileSendFileCandidateByCandidacyId,
        {
          candidacyId,
        },
      ),
  });

  const { mutateAsync: sendToCandidateMutation } = useMutation({
    mutationFn: (dematerializedFeasibilityFileId: string) =>
      graphqlClient.request(sendToCandidate, {
        dematerializedFeasibilityFileId,
        candidacyId,
      }),
  });

  const feasibility =
    getCandidacyByIdResponse?.feasibility_getActiveFeasibilityByCandidacyId;
  const dematerializedFeasibilityFile =
    feasibility?.dematerializedFeasibilityFile;
  const dematerializedFeasibilityFileId = dematerializedFeasibilityFile?.id;
  const candidacy = feasibility?.candidacy;
  return {
    dematerializedFeasibilityFileId,
    candidacy,
    sendToCandidateMutation,
    dematerializedFeasibilityFile,
  };
};
