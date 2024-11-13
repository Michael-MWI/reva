"use client";
import { WhiteCard } from "@/components/card/white-card/WhiteCard";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { SearchList } from "@/components/search/search-list/SearchList";
import { graphql } from "@/graphql/generated";
import { CertificationStatus } from "@/graphql/generated/graphql";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { format } from "date-fns";

const getCertificationsQuery = graphql(`
  query getCertificationsForListPage(
    $offset: Int
    $searchFilter: String
    $status: CertificationStatus
  ) {
    searchCertificationsForAdmin(
      limit: 10
      offset: $offset
      searchText: $searchFilter
      status: $status
    ) {
      rows {
        id
        label
        codeRncp
        status
        certificationAuthorityStructure {
          label
        }
        expiresAt
      }
      info {
        totalRows
        totalPages
        currentPage
      }
    }
  }
`);

const RECORDS_PER_PAGE = 10;
const CertificationListPage = () => {
  const { graphqlClient } = useGraphQlClient();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const currentPage = page ? Number.parseInt(page) : 1;
  const searchFilter = searchParams.get("search") || "";
  const status = searchParams.get("status");

  const {
    data: getCertificationsResponse,
    status: getCertificationsQueryStatus,
  } = useQuery({
    queryKey: ["getCertifications", searchFilter, currentPage, status],
    queryFn: () =>
      graphqlClient.request(getCertificationsQuery, {
        offset: (currentPage - 1) * RECORDS_PER_PAGE,
        searchFilter,
        status: status as CertificationStatus,
      }),
  });

  const certificationPage =
    getCertificationsResponse?.searchCertificationsForAdmin;
  return (
    certificationPage && (
      <div className="flex flex-col w-full">
        <h1>Gestion des certifications</h1>
        {getCertificationsQueryStatus === "success" && (
          <SearchList
            title={`Certifications ${
              status
                ? status === "AVAILABLE"
                  ? "disponibles"
                  : "inactives"
                : ""
            }`}
            searchFilter={searchFilter}
            searchResultsPage={certificationPage}
          >
            {(c) => (
              <WhiteCard key={c.id} className="gap-2">
                <span className="text-gray-500 text-sm">{c.codeRncp}</span>
                <span className="text-lg font-bold">{c.label}</span>
                <span>{c.certificationAuthorityStructure?.label}</span>
                <span>Expire le: {format(c.expiresAt, "dd/MM/yyyy")}</span>
                <Tag
                  small
                  className={`mt-2 text-black ${
                    c.status === "AVAILABLE" ? "bg-green-300" : "bg-red-400"
                  } `}
                >
                  {c.status === "AVAILABLE" ? "Disponible" : "Inactive"}
                </Tag>
                <Button
                  className="mt-2 ml-auto"
                  linkProps={{
                    href: `/certifications/${c.id}`,
                  }}
                >
                  Accéder à la certification
                </Button>
              </WhiteCard>
            )}
          </SearchList>
        )}
      </div>
    )
  );
};

export default CertificationListPage;
