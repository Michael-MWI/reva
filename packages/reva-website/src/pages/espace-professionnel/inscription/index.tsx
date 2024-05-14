"use client";

import { FormOptionalFieldsDisclaimer } from "@/components/form/form-optional-fields-disclaimer/FormOptionalFieldsDisclaimer";
import { OrganismBackground } from "@/components/layout/blue-layout/OrganismBackground";
import { MainLayout } from "@/components/layout/main-layout/MainLayout";
import {
  ProfessionalSpaceSubscriptionProvider,
  useProfessionalSpaceSubscriptionContext,
} from "@/components/professional-space/inscription/context/ProfessionalSpaceSubscriptionContext";
import { AccountInfoStepForm } from "@/components/professional-space/inscription/form/AccountInfoStepForm";
import { CguStep } from "@/components/professional-space/inscription/form/CguStep";
import { CompanyDocumentsStepForm } from "@/components/professional-space/inscription/form/CompanyDocumentsStepForm";
import { CompanySiretStepForm } from "@/components/professional-space/inscription/form/CompanySiretStepForm";
import Head from "next/head";

const PageContent = () => {
  const { currentStep } = useProfessionalSpaceSubscriptionContext();
  switch (currentStep) {
    case "cguStep":
      return <CguStep />;
    case "companySiretStep":
      return <CompanySiretStepForm />;
    case "accountInfoStep":
      return <AccountInfoStepForm />;
    case "companyDocumentsStep":
      return <CompanyDocumentsStepForm />;
    default:
      return <div>unknown step</div>;
  }
};

const ProfessionalSpaceCreationPage = ({}) => {
  return (
    <MainLayout>
      <Head>
        <title>
          Création d'un compte professionnel - France VAE | Prenez votre avenir
          professionnel en main
        </title>
      </Head>
      <OrganismBackground>
        <h1 className="mb-12">
          Créez le compte administrateur de votre établissement (direction
          nationale ou régionale)
          <FormOptionalFieldsDisclaimer />
        </h1>
        <ProfessionalSpaceSubscriptionProvider>
          <PageContent />
        </ProfessionalSpaceSubscriptionProvider>
      </OrganismBackground>
    </MainLayout>
  );
};

export default ProfessionalSpaceCreationPage;
