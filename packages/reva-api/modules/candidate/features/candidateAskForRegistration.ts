import { TypeAccompagnement } from "../candidate.types";
import {
  sendRegistrationEmailToCandidateAccompagne,
  sendRegistrationEmailToCandidateAutonome,
} from "../emails";

interface CandidateInput {
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  departmentId: string;
  certificationId?: string;
  typeAccompagnement: TypeAccompagnement;
}

export const askForRegistration = async (params: CandidateInput) => {
  if (params.typeAccompagnement === "AUTONOME") {
    await sendRegistrationEmailToCandidateAutonome(params);
  } else {
    await sendRegistrationEmailToCandidateAccompagne(params);
  }
  return "ok";
};
