"use client";
import { useState } from "react";
import Image from "next/image";
import { CandidacyBackButton } from "@/components/candidacy-back-button/CandidacyBackButton";
import { useFeatureflipping } from "@/components/feature-flipping/featureFlipping";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { SearchList } from "@/components/search/search-list/SearchList";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import { ADMIN_ELM_URL } from "@/config/config";
import { graphql } from "@/graphql/generated";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { CertificationCard } from "./_components/certification-card";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import CallOut from "@codegouvfr/react-dsfr/CallOut";

const modal = createModal({
  id: "confirm-reorientation",
  isOpenedByDefault: false,
});

const getCertificationsQuery = graphql(`
  query getCertificationsForCandidate(
    $organismId: UUID
    $offset: Int
    $searchFilter: String
  ) {
    searchCertificationsForCandidate(
      limit: 10
      offset: $offset
      searchText: $searchFilter
      status: AVAILABLE
      organismId: $organismId
    ) {
      rows {
        id
        label
        codeRncp
        typeDiplome {
          label
        }
      }
      info {
        totalRows
        totalPages
        currentPage
      }
    }
  }
`);

const getCandidacyQuery = graphql(`
  query getCandidacyForReorientation($candidacyId: ID!) {
    getCandidacyById(id: $candidacyId) {
      organismId
      certification {
        id
        label
        codeRncp
        typeDiplome {
          label
        }
      }
    }
  }
`);

const updateCertificationMutation = graphql(`
  mutation updateCertificationWithinOrganismScope(
    $candidacyId: ID!
    $certificationId: ID!
  ) {
    candidacy_updateCertificationWithinOrganismScope(
      candidacyId: $candidacyId
      certificationId: $certificationId
    ) {
      id
    }
  }
`);

const RECORDS_PER_PAGE = 10;

const ReorientationPage = () => {
  const { graphqlClient } = useGraphQlClient();
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();
  const [searchFilter, setSearchFilter] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const pageParam = params.get("page");
  const queryClient = useQueryClient();

  const currentPage = pageParam ? Number.parseInt(pageParam) : 1;

  const updateSearchFilter = (newSearchFilter: string) => {
    setSearchFilter(newSearchFilter);
    router.push(pathname);
  };

  const { data: getCandidacyResponse } = useQuery({
    queryKey: ["getCandidacy", candidacyId],
    queryFn: () =>
      graphqlClient.request(getCandidacyQuery, {
        candidacyId,
      }),
  });

  const candidacy = getCandidacyResponse?.getCandidacyById;
  const organismId = candidacy?.organismId;

  const {
    data: getCertificationsResponse,
    status: getCertificationsQueryStatus,
  } = useQuery({
    queryKey: ["getCertifications", searchFilter, currentPage, organismId],
    queryFn: () =>
      graphqlClient.request(getCertificationsQuery, {
        offset: (currentPage - 1) * RECORDS_PER_PAGE,
        searchFilter,
        organismId,
      }),
    enabled: !!organismId,
  });

  const updateCertification = useMutation({
    mutationFn: ({
      candidacyId,
      certificationId,
    }: {
      candidacyId: string;
      certificationId: string;
    }) =>
      graphqlClient.request(updateCertificationMutation, {
        candidacyId,
        certificationId,
      }),
  });

  const { isFeatureActive } = useFeatureflipping();

  const handleSubmitCertification = async (certificationId: string) => {
    try {
      await updateCertification.mutateAsync({
        candidacyId,
        certificationId,
      });
      successToast("La certification a bien été modifiée.");
      queryClient.invalidateQueries({ queryKey: [candidacyId] });

      const backUrl = isFeatureActive("NEW_CANDIDACY_SUMMARY_PAGE")
        ? `/candidacies/${candidacyId}/summary`
        : `${ADMIN_ELM_URL}/candidacies/${candidacyId}`;
      router.push(backUrl);
    } catch (e) {
      graphqlErrorToast(e);
    }
  };

  const certificationPage =
    getCertificationsResponse?.searchCertificationsForCandidate;

  const [selectedCertificationId, setSelectedCertificationId] = useState<
    string | undefined
  >();

  const selectedCertification = certificationPage?.rows.find(
    (c) => c.id == selectedCertificationId,
  );

  return (
    certificationPage && (
      <div className="flex flex-col w-full">
        <CandidacyBackButton candidacyId={candidacyId} />
        <h1>Changement de certification</h1>
        <p>
          Vous pouvez changer la certification du candidat jusqu'à l’envoi de
          son dossier de faisabilité.
        </p>
        <div className="mb-12">
          <label className="text-xs font-bold py-2">
            Certification choisie par le candidat
          </label>

          <CertificationCard
            label={candidacy?.certification?.label}
            codeRncp={candidacy?.certification?.codeRncp}
            typeDiplomeLabel={candidacy?.certification?.typeDiplome.label}
          />
        </div>
        {getCertificationsQueryStatus === "success" && (
          <>
            <SearchList
              hint={() => (
                <label className="mb-2">{`Recherchez parmi les certifications que vous dispensez`}</label>
              )}
              searchFilter={searchFilter}
              searchResultsPage={certificationPage}
              updateSearchFilter={updateSearchFilter}
            >
              {(c) => (
                <div
                  key={c.id}
                  className="flex flex-col justify-between border-b pb-6 px-4"
                >
                  <div className="flex flex-row justify-between">
                    <div className="text-gray-500 text-sm">
                      <span className="fr-icon-checkbox-circle-line mr-1"></span>
                      {c.typeDiplome.label}
                    </div>
                    <div className="text-gray-500 text-sm">{c.codeRncp}</div>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    <div className="text-lg font-bold pr-4">{c.label}</div>
                    <Button
                      className="mt-2 ml-auto"
                      priority="tertiary"
                      onClick={() => {
                        setSelectedCertificationId(c.id);
                        modal.open();
                      }}
                    >
                      Choisir
                    </Button>
                  </div>
                </div>
              )}
            </SearchList>

            {certificationPage.rows.length == 0 && <NoResult />}
          </>
        )}

        <>
          <modal.Component
            title="Changement de certification"
            className="modal-confirm-reorientation"
            size="large"
            buttons={[
              {
                priority: "secondary",
                children: "Annuler",
              },
              {
                priority: "primary",
                onClick: () => {
                  if (selectedCertificationId) {
                    handleSubmitCertification(selectedCertificationId);
                  }
                },
                children: "Enregistrer",
              },
            ]}
          >
            <div className="flex flex-col gap-4">
              <p>
                Vous vous apprêtez à changer la certification du candidat.
                Celui-ci sera effectif si vous enregistrez ce choix.
                Souhaitez-vous continuer ?
              </p>

              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <CertificationCard
                    label={candidacy?.certification?.label}
                    codeRncp={candidacy?.certification?.codeRncp}
                    typeDiplomeLabel={
                      candidacy?.certification?.typeDiplome.label
                    }
                  />
                </div>

                <div>
                  <span
                    className="fr-icon-arrow-right-line"
                    aria-hidden="true"
                  ></span>
                </div>

                <div className="flex-1">
                  <CertificationCard
                    label={selectedCertification?.label}
                    codeRncp={selectedCertification?.codeRncp}
                    typeDiplomeLabel={selectedCertification?.typeDiplome.label}
                  />
                </div>
              </div>
            </div>
          </modal.Component>
        </>
      </div>
    )
  );
};

const NoResult = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-6">
      <Image
        className=""
        width="207"
        height="235"
        src="/admin2/components/no-result.svg"
        alt="Pas de résultat"
      />

      <h3 className="mb-0">Aucun résultat trouvé</h3>
      <p className="text-center">
        Êtes-vous sûr de dispenser la certification recherchée ?
        <br />
        <br />
        Si le candidat souhaite une certification que vous ne proposez pas, il
        peut modifier son choix depuis son espace personnel avant son
        rendez-vous pédagogique.
      </p>

      <div className="flex flex-col gap-4 p-8 border-2 border-gray-100 rounded-2xl">
        <div className="flex flex-row items-center gap-2">
          <span className="fr-icon-info-line" aria-hidden="true"></span>
          <h6 className="m-0">En savoir plus</h6>
        </div>
        <CallOut>
          Du fait de son déploiement progressif, tous les diplômes ne sont pas
          encore couverts par France VAE. De nouvelles certifications seront
          ajoutées en 2025.
          <br />
          <br />
          <a
            href={`https://metabase.vae.gouv.fr/question/695-liste-des-certifications-disponibles`}
            target="_blank"
            className="fr-link text-2l font-semibold break-words text-black"
          >
            Lire les détails de la fiche diplôme
          </a>
        </CallOut>
      </div>
    </div>
  );
};

export default ReorientationPage;
