export interface ExamInfo {
  id: string;
  examResult: ExamResult | null;
  estimatedExamDate: Date | null;
  actualExamDate: Date | null;
}

type ExamResult =
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "PARTIAL_CERTIFICATION_SUCCESS"
  | "FAILURE";

type JuryResult =
  | "FULL_SUCCESS_OF_FULL_CERTIFICATION"
  | "FULL_SUCCESS_OF_PARTIAL_CERTIFICATION"
  | "PARTIAL_SUCCESS_OF_FULL_CERTIFICATION"
  | "PARTIAL_SUCCESS_OF_PARTIAL_CERTIFICATION"
  | "PARTIAL_SUCCESS_PENDING_CONFIRMATION"
  | "FAILURE"
  | "CANDIDATE_EXCUSED"
  | "CANDIDATE_ABSENT";

export interface JuryInfo {
  result: JuryResult;
  informationOfResult?: string;
}
