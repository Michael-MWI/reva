import Keycloak from "keycloak-connect";
import mercurius from "mercurius";

import {
  FunctionalCodeError,
  FunctionalError,
} from "../shared/error/functionalError";
import { logger } from "../shared/logger";
import { createAccount } from "./features/createAccount";
import { getAccountByKeycloakId } from "./features/getAccountByKeycloakId";
import { getImpersonateUrl } from "./features/impersonate";
import { updateAccountById } from "./features/updateAccount";
import { disableAccountById } from "./features/disableAccount";

export const resolvers = {
  Mutation: {
    account_createAccount: async (
      _: any,
      params: {
        account: {
          email: string;
          username: string;
          firstname?: string;
          lastname?: string;
          group: KeyCloakGroup;
          organismId?: string;
        };
      },
      context: {
        reply: any;
        auth: any;
        app: {
          keycloak: Keycloak.Keycloak;
        };
      },
    ) => {
      if (!context.auth.hasRole("admin")) {
        throw new Error("Not authorized");
      }
      return createAccount({
        ...params.account,
      });
    },
    account_updateAccount: async (
      _parent: unknown,
      params: {
        accountId: string;
        accountData: {
          email: string;
          firstname: string;
          lastname: string;
        };
      },
      context: GraphqlContext,
    ) => {
      try {
        if (context.auth.userInfo?.sub == undefined) {
          throw new FunctionalError(
            FunctionalCodeError.TECHNICAL_ERROR,
            "Not authorized",
          );
        }

        const hasRole = context.auth.hasRole;
        if (!hasRole("admin")) {
          throw new Error("Utilisateur non autorisé");
        }

        return updateAccountById(params);
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
    account_disableAccount: async (
      _parent: unknown,
      params: {
        accountId: string;
      },
      context: GraphqlContext,
    ) => {
      try {
        if (context.auth.userInfo?.sub == undefined) {
          throw new FunctionalError(
            FunctionalCodeError.TECHNICAL_ERROR,
            "Not authorized",
          );
        }

        const hasRole = context.auth.hasRole;
        if (!hasRole("admin")) {
          throw new Error("Utilisateur non autorisé");
        }

        return disableAccountById(params);
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
  },
  Query: {
    account_getAccountForConnectedUser: async (
      _parent: unknown,
      _params: unknown,
      context: GraphqlContext,
    ) =>
      getAccountByKeycloakId({ keycloakId: context.auth.userInfo?.sub || "" }),
    account_getImpersonateUrl: async (
      _parent: unknown,
      params: {
        input: { accountId?: string; candidateId?: string };
      },
      context: GraphqlContext,
    ) => {
      try {
        if (context.auth.userInfo?.sub == undefined) {
          throw new FunctionalError(
            FunctionalCodeError.TECHNICAL_ERROR,
            "Not authorized",
          );
        }

        if (!context.auth.hasRole("admin")) {
          throw new Error("Utilisateur non autorisé");
        }

        return getImpersonateUrl(
          {
            hasRole: context.auth.hasRole,
            keycloakId: context.auth.userInfo?.sub,
          },
          params.input,
        );
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
  },
};
