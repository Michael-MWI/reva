import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getOrganismQuery = graphql(`
  query getOrganismForModalitesAccompagnementPage($organismId: ID!) {
    organism_getOrganism(id: $organismId) {
      id
      informationsCommerciales {
        id
        nom
        telephone
        siteInternet
        emailContact
        adresseNumeroEtNomDeRue
        adresseInformationsComplementaires
        adresseCodePostal
        adresseVille
        conformeNormesAccessbilite
      }
      organismOnDepartments {
        id
        departmentId
        isRemote
        isOnSite
      }
      maisonMereAAP {
        maisonMereAAPOnDepartements {
          estADistance
          estSurPlace
          departement {
            id
            code
            label
            region {
              id
              code
              label
            }
          }
        }
      }
    }
  }
`);

const createOrUpdateInformationsCommercialesAndInterventionZoneMutation =
  graphql(`
    mutation createOrUpdateInformationsCommercialesAndInterventionZoneMutation(
      $createOrUpdateInformationsCommercialesInput: CreateOrUpdateInformationsCommercialesInput!
      $updateInterventionZoneInput: UpdateOrganismInterventionZoneInput!
    ) {
      organism_createOrUpdateInformationsCommerciales(
        informationsCommerciales: $createOrUpdateInformationsCommercialesInput
      ) {
        id
      }
      organism_updateOrganismInterventionZone(
        data: $updateInterventionZoneInput
      ) {
        id
      }
    }
  `);

export const useModalitesAccompagnementPage = () => {
  const { graphqlClient } = useGraphQlClient();

  const { organismId } = useParams<{ organismId: string }>();

  const {
    data: getOrganismResponse,
    status: getOrganismStatus,
    refetch: refetchOrganism,
  } = useQuery({
    queryKey: [organismId, "organism"],
    queryFn: () =>
      graphqlClient.request(getOrganismQuery, {
        organismId,
      }),
  });

  const organism = getOrganismResponse?.organism_getOrganism;
  const maisonMereAAP =
    getOrganismResponse?.organism_getOrganism?.maisonMereAAP;

  const createOrUpdateInformationsCommercialesAndInterventionZone = useMutation(
    {
      mutationFn: ({
        organismId,
        informationsCommerciales,
        interventionZone,
      }: {
        organismId: string;
        informationsCommerciales: {
          nom: string;
        };
        interventionZone: {
          departmentId: string;
          isOnSite: boolean;
          isRemote: boolean;
        }[];
      }) =>
        graphqlClient.request(
          createOrUpdateInformationsCommercialesAndInterventionZoneMutation,
          {
            createOrUpdateInformationsCommercialesInput: {
              organismId,
              ...informationsCommerciales,
            },
            updateInterventionZoneInput: { organismId, interventionZone },
          },
        ),
    },
  );

  return {
    organism,
    maisonMereAAP,
    getOrganismStatus,
    refetchOrganism,
    createOrUpdateInformationsCommercialesAndInterventionZone,
  };
};
