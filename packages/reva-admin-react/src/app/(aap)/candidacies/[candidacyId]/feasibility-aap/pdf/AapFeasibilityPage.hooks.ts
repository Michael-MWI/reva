import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";
import { useQuery } from "@tanstack/react-query";

const getCandidacyQuery = graphql(`
  query getCandidacyForFeasibility($candidacyId: ID!) {
    getCandidacyById(id: $candidacyId) {
      id
      candidate {
        id
        firstname
        lastname
      }
      department {
        id
        label
      }
      certification {
        id
        label
        codeRncp
        typeDiplome {
          label
        }
      }
      certificationAuthorities {
        id
        label
        contactFullName
        contactEmail
      }
      feasibility {
        id
        decision
        decisionSentAt
        decisionComment
        certificationAuthority {
          id
          label
          contactFullName
          contactEmail
        }
        feasibilityUploadedPdf {
          feasibilityFile {
            name
            url
          }
          IDFile {
            name
            url
          }
          documentaryProofFile {
            name
            url
          }
          certificateOfAttendanceFile {
            name
            url
          }
        }
        history {
          id
          decision
          decisionSentAt
          decisionComment
        }
      }
    }
  }
`);

export const useAapFeasibility = (candidacyId: string) => {
  const { graphqlClient } = useGraphQlClient();

  const candidacy = useQuery({
    queryKey: [candidacyId, "getCandidacyForFeasibility"],
    queryFn: () =>
      graphqlClient.request(getCandidacyQuery, {
        candidacyId,
      }),
  });

  return { candidacy };
};
