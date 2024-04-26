export enum FunctionalCodeError {
  TECHNICAL_ERROR = "TECHNICAL_ERROR",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  COMPANION_NOT_FOUND = "COMPANION_NOT_FOUND",
  CANDIDACY_NOT_CREATED = "CANDIDACY_NOT_CREATED",
  CANDIDACY_ALREADY_EXISTS = "CANDIDACY_ALREADY_EXISTS",
  CANDIDACY_DOES_NOT_EXIST = "CANDIDACY_DOES_NOT_EXIST",
  CANDIDACY_ALREADY_DROPPED_OUT = "CANDIDACY_ALREADY_DROPPED_OUT",
  CANDIDACY_NOT_DROPPED_OUT = "CANDIDACY_NOT_DROPPED_OUT",
  CANDIDACY_INVALID_DROP_OUT_REASON = "CANDIDACY_INVALID_DROP_OUT_REASON",
  CANDIDACY_INVALID_REORIENTATION_REASON = "CANDIDACY_INVALID_REORIENTATION_REASON",
  CANDIDACY_DROP_OUT_FAILED = "CANDIDACY_DROP_OUT_FAILED",
  CANDIDACY_CANCEL_DROP_OUT_FAILED = "CANDIDACY_CANCEL_DROP_OUT_FAILED",
  CERTIFICATION_AUTHORITY_NOT_FOUND = "CERTIFICATION_AUTHORITY_NOT_FOUND",
  EXPERIENCE_DOES_NOT_EXIST = "EXPERIENCE_DOES_NOT_EXIST",
  EXPERIENCE_NOT_CREATED = "EXPERIENCE_NOT_CREATED",
  EXPERIENCE_NOT_UPDATED = "EXPERIENCE_NOT_UPDATED",
  GOALS_NOT_UPDATED = "GOALS_NOT_UPDATED",
  CERTIFICATION_NOT_UPDATED = "CERTIFICATION_NOT_UPDATED",
  STATUS_NOT_UPDATED = "STATUS_NOT_UPDATED",
  CONTACT_NOT_UPDATED = "CONTACT_NOT_UPDATED",
  CANDIDACIES_NOT_FOUND = "CANDIDACIES_NOT_FOUND",
  CANDIDACIES_NOT_DELETED = "CANDIDACIES_NOT_DELETED",
  CANDIDACIES_NOT_ARCHIVED = "CANDIDACIES_NOT_ARCHIVED",
  CANDIDACY_ALREADY_ARCHIVED = "CANDIDACY_ALREADY_ARCHIVED",
  CANDIDACY_IS_REORIENTATION = "CANDIDACY_IS_REORIENTATION",
  CANDIDACIES_NOT_TAKEN_OVER = "CANDIDACIES_NOT_TAKEN_OVER",
  APPOINTMENT_INFORMATIONS_NOT_SAVED = "APPOINTMENT_INFORMATIONS_NOT_SAVED",
  ACCOUNT_EMAIL_EMPTY = "ACCOUNT_EMAIL_EMPTY",
  ACCOUNT_ORGANISMID_EMPTY = "ACCOUNT_ORGANISMID_EMPTY",
  ACCOUNT_CERTIFICATION_AUTHORITY_ID_EMPTY = "ACCOUNT_CERTIFICATION_AUTHORITY_ID_EMPTY",
  ACCOUNT_ALREADY_EXISTS = "ACCOUNT_ALREADY_EXISTS",
  ACCOUNT_IN_IAM_NOT_CREATED = "ACCOUNT_IN_IAM_NOT_CREATED",
  ACCOUNT_WITH_PROFILE_NOT_CREATED = "ACCOUNT_WITH_PROFILE_NOT_CREATED",
  ACCOUNT_IN_IAM_NOT_FOUND = "ACCOUNT_IN_IAM_NOT_FOUND",
  ACCOUNT_IN_IAM_ALREADY_EXISTS = "ACCOUNT_IN_IAM_ALREADY_EXISTS",
  AAP_ORGANISMS_NOT_FOUND = "AAP_ORGANISMS_NOT_FOUND",
  ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
  MAISON_MERE_AAP_NOT_FOUND = "MAISON_MERE_AAP_NOT_FOUND",
  ORGANISM_NOT_UPDATED = "ORGANISM_NOT_UPDATED",
  ORGANISM_NOT_FOUND = "ORGANISM_NOT_FOUND",
  ORGANISM_ALREADY_EXISTS = "ORGANISM_ALREADY_EXISTS",
  TRAINING_FORM_NOT_SUBMITTED = "TRAINING_FORM_NOT_SUBMITTED",
  TRAINING_FORM_NOT_CONFIRMED = "TRAINING_FORM_NOT_CONFIRMED",
  CANDIDATE_JWT_GENERATION_ERROR = "CANDIDATE_JWT_GENERATION_ERROR",
  CANDIDATE_REGISTRATION_EMAIL_ERROR = "CANDIDATE_REGISTRATION_EMAIL_ERROR",
  CANDIDATE_LOGIN_EMAIL_ERROR = "CANDIDATE_LOGIN_EMAIL_ERROR",
  CANDIDATE_INVALID_TOKEN = "CANDIDATE_INVALID_TOKEN",
  CANDIDATE_NOT_FOUND = "CANDIDATE_NOT_FOUND",
  CANDIDATE_NOT_SAVED = "CANDIDATE_NOT_SAVED",
  IAM_TOKEN_NOT_GENERATED = "IAM_TOKEN_NOT_GENERATED",
  FUNDING_REQUEST_NOT_POSSIBLE = "FUNDING_REQUEST_NOT_POSSIBLE",
  PAYMENT_REQUEST_NOT_CONFIRMED = "PAYMENT_REQUEST_NOT_CONFIRMED",
  UPLOAD_PAYMENT_PROOF_NO_ATTACHEMENT = "UPLOAD_PAYMENT_PROOF_NO_ATTACHEMENT",
  SUBSCRIPTION_REQUEST_NOT_FOUND = "SUBSCRIPTION_REQUEST_NOT_FOUND",
  SUBSCRIPTION_REQUEST_ALREADY_EXISTS = "SUBSCRIPTION_REQUEST_ALREADY_EXISTS",
  SUBSCRIPTION_REQUEST_HAS_MATCHING_ORGANISM = "SUBSCRIPTION_REQUEST_HAS_MATCHING_ORGANISM",
  NEW_CANDIDACY_MAIL_NOT_SENT = "NEW_CANDIDACY_MAIL_NOT_SENT",
}

export class FunctionalError {
  code: FunctionalCodeError;
  message: string;
  errors: string[];

  constructor(
    code: FunctionalCodeError,
    message: string,
    errors: string[] = [],
  ) {
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}
