import debug from "debug";
import { IFieldResolver, MercuriusContext } from "mercurius";
import { prismaClient } from "../../../../prisma/client";

const log = debug("gql:security");

export const isCertificationAuthorityOwner =
  (next: IFieldResolver<unknown>) =>
  async (
    root: any,
    args: Record<string, any>,
    context: MercuriusContext,
    info: any,
  ) => {
    log("isCertificationAuthorityOwner");

    const certificationAuthorityId = root.certificationAuthorityId;

    if (!certificationAuthorityId) {
      throw new Error('args "certificationAuthorityId" is missing');
    }

    if (!context.auth.hasRole("manage_certification_authority_local_account")) {
      log("not authorized");

      throw new Error(
        "Vous n'êtes pas autorisé à consulter cette authorité de certification..",
      );
    }

    const account = await prismaClient.account.findUnique({
      where: {
        keycloakId: context.auth.userInfo.sub,
      },
    });

    if (account?.certificationAuthorityId != certificationAuthorityId) {
      log("not authorized");

      throw new Error(
        "Vous n'êtes pas autorisé à consulter cette authorité de certification.",
      );
    }

    log("authorized");

    return next(root, args, context, info);
  };
