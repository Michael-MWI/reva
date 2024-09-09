import { CandidacyStatusStep } from "@prisma/client";

export interface CandidacyDropOut {
  status: CandidacyStatusStep;
  otherReasonContent?: string | null;
}
export interface Candidacy {
  id: string;
  isCertificationPartial?: boolean | null;
  departmentId?: string | null;
  createdAt: Date;
  financeModule: FinanceModule;
}

type FinanceModule = "unireva" | "unifvae" | "hors_plateforme";

export interface ExperienceInput {
  title: string;
  startedAt: Date;
  duration: Duration;
  description: string;
}

type Duration =
  | "unknown"
  | "lessThanOneYear"
  | "betweenOneAndThreeYears"
  | "moreThanThreeYears"
  | "moreThanFiveYears"
  | "moreThanTenYears";

export interface Admissibility {
  id: string;
  isCandidateAlreadyAdmissible: boolean;
  reportSentAt: Date | null;
  certifierRespondedAt: Date | null;
  responseAvailableToCandidateAt: Date | null;
  status: AdmissibilityStatus | null;
}

type AdmissibilityStatus = "ADMISSIBLE" | "NOT_ADMISSIBLE";

export interface AdmissibilityFvae {
  isAlreadyAdmissible: boolean;
  expiresAt: Date | null;
}

export enum CandidacyBusinessEvent {
  SUBMITTED_CANDIDACY = "Submitted Candidacy",
  TOOK_OVER_CANDIDACY = "Took over candidacy",
  UPDATED_CERTIFICATION = "Updated Certification",
  ADDED_EXPERIENCE = "Added experience",
  UPDATED_EXPERIENCE = "Updated experience",
  UPDATED_GOALS = "Updated goals",
  UPDATED_CONTACT = "Updated contact",
  DELETED_CANDIDACY = "Deleted candidacy",
  ARCHIVED_CANDIDACY = "Archived candidacy",
  UNARCHIVED_CANDIDACY = "Unarchived candidacy",
  UPDATED_APPOINTMENT_INFO = "Updated appointment info",
  SELECTED_ORGANISM = "Selected organism",
  SUBMITTED_TRAINING_FORM = "Submitted training form",
  CONFIRMED_TRAINING_FORM = "Confirmed training form",
  UPDATED_ADMISSIBILITY = "Updated admissibility",
  DROPPED_OUT_CANDIDACY = "Dropped out candidacy",
  CANCELED_DROPPED_OUT_CANDIDACY = "Canceled dropped out candidacy",
  UPDATED_EXAM_INFO = "Updated exam information",
  CREATED_FUNDING_REQUEST_UNIFVAE = "Created a funding request (unifvae)",
}
export const candidacyStatusFilters = [
  "ACTIVE_HORS_ABANDON",
  "ABANDON",
  "REORIENTEE",
  "ARCHIVE_HORS_ABANDON_HORS_REORIENTATION",
  "PARCOURS_CONFIRME_HORS_ABANDON",
  "PRISE_EN_CHARGE_HORS_ABANDON",
  "PARCOURS_ENVOYE_HORS_ABANDON",
  "DOSSIER_FAISABILITE_ENVOYE_HORS_ABANDON",
  "DOSSIER_FAISABILITE_RECEVABLE_HORS_ABANDON",
  "DOSSIER_FAISABILITE_INCOMPLET_HORS_ABANDON",
  "DOSSIER_FAISABILITE_NON_RECEVABLE_HORS_ABANDON",
  "DOSSIER_DE_VALIDATION_ENVOYE_HORS_ABANDON",
  "DOSSIER_DE_VALIDATION_SIGNALE_HORS_ABANDON",
  "JURY_HORS_ABANDON",
  "JURY_PROGRAMME_HORS_ABANDON",
  "JURY_PASSE_HORS_ABANDON",
  "DEMANDE_FINANCEMENT_ENVOYE_HORS_ABANDON",
  "DEMANDE_PAIEMENT_ENVOYEE_HORS_ABANDON",
  "VALIDATION_HORS_ABANDON",
  "PROJET_HORS_ABANDON",
] as const;

export type CandidacyStatusFilter = (typeof candidacyStatusFilters)[number];

export interface SearchOrganismFilter {
  distanceStatus?: string;
  pmr?: boolean;
  zip?: string;
}
