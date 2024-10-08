"use client";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AccountForm from "../components/account-form/AccountForm.component";
import OrganismForm from "../components/organism-form/OrganismForm.component";
import CertificationAuthorityForm from "../components/certification-authority-form/CertificationAuthority.component";
import { BackButton } from "@/components/back-button/BackButton";
import { Impersonate } from "@/components/impersonate";

const getAccount = graphql(`
  query getAccount($accountId: ID!) {
    account_getAccount(id: $accountId) {
      id
      firstname
      lastname
      email
      organism {
        id
        label
        website
        contactAdministrativeEmail
        contactAdministrativePhone
      }
      certificationAuthority {
        id
        label
        contactFullName
        contactEmail
      }
    }
  }
`);

const AccountPage = () => {
  const { accountId }: { accountId: string } = useParams();

  const { graphqlClient } = useGraphQlClient();

  const { data: getAccountResponse } = useQuery({
    queryKey: ["getAccount", accountId],
    queryFn: () =>
      graphqlClient.request(getAccount, {
        accountId,
      }),
  });

  const account = getAccountResponse?.account_getAccount;

  if (!account) {
    return <></>;
  }

  const organism = account.organism;
  const certificationAuthority = account.certificationAuthority;

  return (
    account && (
      <div className="flex-1 px-8 py-4">
        <BackButton
          href={`/accounts/${
            organism ? "organisms" : "certification-authorities"
          }`}
        >
          Toutes les comptes
        </BackButton>

        <div className="flex justify-between">
          <h1>Compte utilisateur</h1>

          <Impersonate accountId={account.id} />
        </div>

        <AccountForm account={account} />

        {organism && <OrganismForm organism={organism} />}

        {certificationAuthority && (
          <CertificationAuthorityForm
            certificationAuthority={certificationAuthority}
          />
        )}
      </div>
    )
  );
};

export default AccountPage;
