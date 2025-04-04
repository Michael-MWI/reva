import { logCandidacyAuditEvent } from "../../candidacy-log/features/logCandidacyAuditEvent";
import { updateCertification } from "../../candidacy/certification/features/updateCertification";
import { getFirstActiveCandidacyByCandidateId } from "../../candidacy/features/getFirstActiveCandidacyByCandidateId";
import { getCertificationById } from "../../referential/features/getCertificationById";
import { isCertificationAvailable } from "../../referential/features/isCertificationAvailable";
import {
  FunctionalCodeError,
  FunctionalError,
} from "../../shared/error/functionalError";
import {
  createCandidateAccountInIAM,
  generateIAMToken,
  getCandidateAccountInIAM,
  getJWTContent,
} from "../auth.helper";
import {
  CandidateAuthenticationInput,
  CandidateRegistrationInput,
} from "../candidate.types";
import { createCandidateWithCandidacy } from "./createCandidateWithCandidacy";
import { getCandidateByKeycloakId } from "./getCandidateByKeycloakId";

export const candidateAuthentication = async ({ token }: { token: string }) => {
  const candidateAuthenticationInput = (await getJWTContent(
    token,
  )) as CandidateAuthenticationInput;

  if (candidateAuthenticationInput.action === "registration") {
    const account = await getCandidateAccountInIAM(
      candidateAuthenticationInput.email,
    );

    if (account) {
      return loginCandidate({
        email: candidateAuthenticationInput.email,
      });
    } else {
      return confirmRegistration({
        candidateRegistrationInput: candidateAuthenticationInput,
      });
    }
  } else if (candidateAuthenticationInput.action === "login") {
    return loginCandidate({
      email: candidateAuthenticationInput.email,
    });
  } else {
    throw new FunctionalError(
      FunctionalCodeError.TECHNICAL_ERROR,
      `Action non reconnue`,
    );
  }
};

const confirmRegistration = async ({
  candidateRegistrationInput,
}: {
  candidateRegistrationInput: CandidateRegistrationInput;
}) => {
  const { certificationId, ...candidateInput } = candidateRegistrationInput;
  const candidateKeycloakId = await createCandidateAccountInIAM({
    email: candidateInput.email,
    firstname: candidateInput.firstname,
    lastname: candidateInput.lastname,
  });

  const candidate = await createCandidateWithCandidacy({
    ...candidateInput,
    keycloakId: candidateKeycloakId,
  });

  const candidacy = await getFirstActiveCandidacyByCandidateId({
    candidateId: candidate.id,
  });

  if (!candidacy) {
    throw new Error("Candidature non trouvée");
  }

  // if the candidate has selected a certification during its registration, we assign it if it's available
  if (
    certificationId &&
    (await isCertificationAvailable({
      certificationId,
    }))
  ) {
    const certification = await getCertificationById({ certificationId });
    if (!certification) {
      throw new Error("Certification non trouvée");
    }

    await updateCertification({
      candidacyId: candidacy.id,
      author: "candidate",
      certificationId,
      feasibilityFormat:
        candidacy.typeAccompagnement === "ACCOMPAGNE"
          ? certification.feasibilityFormat
          : "UPLOADED_PDF",
    });
  }

  const tokens = await generateIAMToken(candidateKeycloakId);
  const iamToken = {
    tokens,
    candidate,
  };

  await logCandidacyAuditEvent({
    candidacyId: candidacy.id,
    eventType: "CANDIDATE_REGISTRATION_CONFIRMED",
    userRoles: [],
    userKeycloakId: candidateKeycloakId,
    userEmail: candidateInput.email,
  });

  return iamToken;
};

const loginCandidate = async ({ email }: { email: string }) => {
  const account = await getCandidateAccountInIAM(email);

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

  const tokens = await generateIAMToken(candidate.keycloakId);
  const iamToken = {
    tokens,
    candidate,
  };

  return iamToken;
};
