"use server";
import { client } from "@/helpers/graphql/urql-client/urqlClient";
import { gql } from "@urql/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const redirectCommanditaireVaeCollective = async () => {
  const cookieStore = await cookies();
  const tokens = cookieStore.get("tokens");

  if (!tokens) {
    throw new Error("Session expirée, veuillez vous reconnecter");
  }

  const { accessToken } = JSON.parse(tokens.value);

  if (!accessToken) {
    redirect("/login");
  }

  const result = await client.query(
    gql`
      query getCommanditaireVaeCollectiveAccount {
        account_getAccountForConnectedUser {
          commanditaireVaeCollective {
            id
          }
        }
      }
    `,
    {},
    { fetchOptions: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );

  redirect(
    `/commanditaires/${result.data?.account_getAccountForConnectedUser.commanditaireVaeCollective.id}`,
  );
};
