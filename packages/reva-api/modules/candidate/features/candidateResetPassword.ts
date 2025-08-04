import {
  FunctionalCodeError,
  FunctionalError,
} from "@/modules/shared/error/functionalError";
import { prismaClient } from "@/prisma/client";

import {
  getAccountInIAM,
  getJWTContent,
  resetPassword,
} from "@/modules/shared/auth/auth.helper";
import { CandidateResetPasswordInput } from "../candidate.types";

import { getCandidateByKeycloakId } from "./getCandidateByKeycloakId";

export const candidateResetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const candidateAuthenticationInput = (await getJWTContent(
    token,
  )) as CandidateResetPasswordInput;

  if (candidateAuthenticationInput.action === "reset-password") {
    const account = await getAccountInIAM(
      candidateAuthenticationInput.email,
      process.env.KEYCLOAK_APP_REALM as string,
    );

    if (!account) {
      throw new FunctionalError(
        FunctionalCodeError.ACCOUNT_IN_IAM_NOT_FOUND,
        `Candidat non trouvé`,
      );
    }

    const candidate = await getCandidateByKeycloakId({
      keycloakId: account?.id || "",
    });

    if (!candidate) {
      throw new Error("Candidat non trouvé");
    }

    await resetPassword(
      candidate.keycloakId,
      password,
      process.env.KEYCLOAK_APP_REALM as string,
    );

    // Track password update
    await prismaClient.candidate.update({
      where: { id: candidate.id },
      data: { passwordUpdatedAt: new Date() },
    });
  } else {
    throw new FunctionalError(
      FunctionalCodeError.TECHNICAL_ERROR,
      `Action non reconnue`,
    );
  }
};
