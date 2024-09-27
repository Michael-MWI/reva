export type CandidacyLogUserProfile =
  | "ADMIN"
  | "CANDIDAT"
  | "CERTIFICATEUR"
  | "AAP";

export type CandidacyLogEventTypeAndDetails =
  | {
      eventType:
        | "CANDIDATE_CONTACT_INFORMATION_UPDATED"
        | "CANDIDATE_CIVIL_INFORMATION_UPDATED"
        | "CANDIDATE_UPDATED"
        | "CANDIDATE_REGISTRATION_CONFIRMED"
        | "CANDIDATE_PROFILE_UPDATED"
        | "DOSSIER_DE_VALIDATION_SENT"
        | "DOSSIER_DE_VALIDATION_PROBLEM_SIGNALED"
        | "CANDIDACY_SUBMITTED"
        | "EXPERIENCE_ADDED"
        | "EXPERIENCE_UPDATED"
        | "GOALS_UPDATED"
        | "CONTACT_INFO_UPDATED"
        | "CANDIDACY_DELETED"
        | "CANDIDACY_ARCHIVED"
        | "CANDIDACY_UNARCHIVED"
        | "CANDIDACY_TAKEN_OVER"
        | "TRAINING_FORM_SUBMITTED"
        | "TRAINING_FORM_CONFIRMED"
        | "CANDIDACY_DROPPED_OUT"
        | "CANDIDACY_DROP_OUT_CANCELED"
        | "ADMISSIBILITY_FVAE_UPDATED"
        | "ADMISSIBILITY_UPDATED"
        | "FEASIBILITY_SENT"
        | "FEASIBILITY_VALIDATED"
        | "FEASIBILITY_REJECTED"
        | "FEASIBILITY_MARKED_AS_INCOMPLETE"
        | "FUNDING_REQUEST_CREATED"
        | "PAYMENT_REQUEST_CREATED_OR_UPDATED"
        | "PAYMENT_REQUEST_CONFIRMED"
        | "TYPE_ACCOMPAGNEMENT_UPDATED";
      details?: undefined;
    }
  | {
      eventType: "CERTIFICATION_UPDATED";
      details: {
        certification: { id: string; label: string; codeRncp: string };
      };
    }
  | {
      eventType: "ORGANISM_SELECTED";
      details: { organism: { id: string; label: string } };
    }
  | {
      eventType: "APPOINTMENT_INFO_UPDATED";
      details: { firstAppointmentOccuredAt: Date };
    }
  | {
      eventType: "TYPOLOGY_AND_CCN_INFO_UPDATED";
      details: {
        ccn?: { id: string; idcc: string; label: string };
        typology: string;
      };
    }
  | {
      eventType: "READY_FOR_JURY_ESTIMATED_DATE_UPDATED";
      details: {
        readyForJuryEstimatedAt: Date;
      };
    }
  | {
      eventType: "JURY_EXAM_INFO_UPDATED";
      details: {
        examResult: string | null;
        estimatedExamDate: Date | null;
        actualExamDate: Date | null;
      };
    }
  | {
      eventType: "JURY_RESULT_UPDATED";
      details: {
        result: string;
      };
    }
  | {
      eventType: "JURY_SESSION_SCHEDULED";
      details: { dateOfSession: Date; timeOfSession?: string };
    }
  | {
      eventType: "ADMISSIBILITY_FVAE_UPDATED";
      details: { isAlreadyAdmissible: boolean; expiresAt: Date | null };
    }
  | {
      eventType: "TYPE_ACCOMPAGNEMENT_UPDATED";
      details: { typeAccompagnement: string };
    };

export type CandidacyLog = {
  id: string;
  createdAt: Date;
  userProfile: CandidacyLogUserProfile;
} & CandidacyLogEventTypeAndDetails;
