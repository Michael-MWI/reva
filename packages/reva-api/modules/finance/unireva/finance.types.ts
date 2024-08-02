import { Decimal } from "@prisma/client/runtime/library";
import { Organism } from "../../organism/organism.types";

export interface FundingRequest {
  basicSkills: any;
  basicSkillsCost: Decimal;
  basicSkillsHourCount: number;
  candidacyId: string;
  certificateSkills: string;
  certificateSkillsCost: Decimal;
  certificateSkillsHourCount: number;
  collectiveCost: Decimal;
  collectiveHourCount: number;
  diagnosisCost: Decimal;
  diagnosisHourCount: number;
  examCost: Decimal;
  examHourCount: number;
  id: string;
  individualCost: Decimal;
  individualHourCount: number;
  mandatoryTrainings: any;
  mandatoryTrainingsCost: Decimal;
  mandatoryTrainingsHourCount: number;
  otherTraining: string;
  otherTrainingCost: Decimal;
  otherTrainingHourCount: number;
  postExamCost: Decimal;
  postExamHourCount: number;
  totalCost?: Decimal;
  companion: Organism | null;
  numAction: string;
}

export interface PaymentRequest {
  id: string;
  diagnosisEffectiveHourCount: number;
  diagnosisEffectiveCost: Decimal;
  postExamEffectiveHourCount: number;
  postExamEffectiveCost: Decimal;
  individualEffectiveHourCount: number;
  individualEffectiveCost: Decimal;
  collectiveEffectiveHourCount: number;
  collectiveEffectiveCost: Decimal;
  mandatoryTrainingsEffectiveHourCount: number;
  mandatoryTrainingsEffectiveCost: Decimal;
  basicSkillsEffectiveHourCount: number;
  basicSkillsEffectiveCost: Decimal;
  certificateSkillsEffectiveHourCount: number;
  certificateSkillsEffectiveCost: Decimal;
  otherTrainingEffectiveHourCount: number;
  otherTrainingEffectiveCost: Decimal;
  examEffectiveHourCount: number;
  examEffectiveCost: Decimal;
  invoiceNumber: string;
}

export interface PaymentRequestBatchContent {
  NumAction: string;
  NumFacture: string;
  SiretAP: string;
  NbHeureReaJury: number;
  CoutHeureReaJury: number;
  NbHeureReaAPDiag: number;
  CoutHeureReaAPDiag: number;
  NbHeureReaAccVAEInd: number;
  CoutHeureReaAccVAEInd: number;
  NbHeureReaAPPostJury: number;
  CoutHeureReaAPPostJury: number;
  NbHeureReaAccVAEColl: number;
  CoutHeureReaAccVAEColl: number;
  NbHeureReaTotalActesFormatifs: number;
  NbHeureReaComplFormObligatoire: number;
  CoutHeureReaComplFormObligatoire: number;
  NbHeureReaComplFormSavoirsDeBase: number;
  CoutHeureReaComplFormSavoirsDeBase: number;
  NbHeureReaComplFormBlocDeCompetencesCertifiant: number;
  CoutHeureReaComplFormBlocDeCompetencesCertifiant: number;
  NBHeureReaActeFormatifComplémentaire_Autre: number;
  CoutHeureReaActeFormatifComplémentaire_Autre: number;
}
