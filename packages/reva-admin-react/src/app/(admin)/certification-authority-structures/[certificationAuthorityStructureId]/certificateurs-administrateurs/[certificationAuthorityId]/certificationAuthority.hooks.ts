import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getCertificationAuthority = graphql(`
  query getCertificationAuthoritySForAdminPage($id: ID!) {
    certification_authority_getCertificationAuthority(id: $id) {
      id
      label
      contactFullName
      contactEmail
      regions {
        id
        code
        label
        departments {
          id
          code
          label
        }
      }
      certifications {
        id
        typeDiplome {
          label
        }
        label
        summary
        codeRncp
        domaines {
          id
          label
        }
      }
      certificationAuthorityStructure {
        id
        label
      }
      certificationAuthorityLocalAccounts {
        account {
          id
          firstname
          lastname
          email
        }
      }
    }
  }
`);

export const useCertificationAuthority = () => {
  const { graphqlClient } = useGraphQlClient();

  const { certificationAuthorityId } = useParams<{
    certificationAuthorityId: string;
  }>();

  const {
    data: getCertificationAuthorityResponse,
    status: getCertificationAuthorityStatus,
  } = useQuery({
    queryKey: [certificationAuthorityId, "getCertificationAuthority"],
    queryFn: () =>
      graphqlClient.request(getCertificationAuthority, {
        id: certificationAuthorityId,
      }),
  });

  const certificationAuthority =
    getCertificationAuthorityResponse?.certification_authority_getCertificationAuthority;

  return { certificationAuthority, getCertificationAuthorityStatus };
};
