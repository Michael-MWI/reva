"use client";
import { SubscriptionRequestCard } from "@/app/(admin)/subscriptions/components/subscription-request-card/SubscriptionRequestCard";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { SearchList } from "@/components/search/search-list/SearchList";
import { graphql } from "@/graphql/generated";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const getPendingSubscriptionRequestV2s = graphql(`
  query getPendingSubscriptionRequestV2s($offset: Int, $searchFilter: String) {
    subscription_getSubscriptionRequestV2s(
      status: PENDING
      limit: 10
      offset: $offset
      searchFilter: $searchFilter
    ) {
      rows {
        id
        companyName
        createdAt
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

const PendingSubscriptionRequestV2sPage = () => {
  const { graphqlClient } = useGraphQlClient();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const currentPage = page ? Number.parseInt(page) : 1;
  const searchFilter = searchParams.get("search") || "";

  const {
    data: getPendingSubscriptionRequestsResponse,
    status: getPendingSubscriptionRequestsStatus,
  } = useQuery({
    queryKey: ["getPendingSubscriptionRequests", searchFilter, currentPage],
    queryFn: () =>
      graphqlClient.request(getPendingSubscriptionRequestV2s, {
        offset: (currentPage - 1) * RECORDS_PER_PAGE,
        searchFilter,
      }),
  });

  const subscriptionRequestPage =
    getPendingSubscriptionRequestsResponse?.subscription_getSubscriptionRequestV2s;
  return (
    subscriptionRequestPage && (
      <div className="flex flex-col">
        <h1>Espace pro administrateur</h1>
        <p>
          En tant qu'administrateur des conseillers, vous avez la possibilité
          d'ajouter ou d'accepter de nouveaux architecte de parcours ou
          certificateur.
        </p>
        {getPendingSubscriptionRequestsStatus === "success" && (
          <SearchList
            title="Inscriptions en attente"
            searchFilter={searchFilter}
            searchResultsPage={subscriptionRequestPage}
          >
            {(r) => (
              <SubscriptionRequestCard
                key={r.id}
                companyName={r.companyName}
                createdAtLabel="Date d'envoi de l'inscription"
                createdAt={new Date(r.createdAt)}
                href={`/subscriptions/v2/${r.id}`}
              />
            )}
          </SearchList>
        )}
      </div>
    )
  );
};

export default PendingSubscriptionRequestV2sPage;
