import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { useKeycloakContext } from "contexts/keycloakContext";
import { CertificateDetails } from "pages/CertificateDetails";
import { ProjectSubmissionConfirmation } from "pages/ProjectSubmissionConfirmation";
import { useEffect, useRef } from "react";
import { useCrisp } from "utils/useCrisp";

import { Footer } from "./components/organisms/Footer";
import { Header } from "./components/organisms/Header/Header";
import { useMainMachineContext } from "./contexts/MainMachineContext/MainMachineContext";
import { Certification, Contact } from "./interface";
import { Certificates } from "./pages/Certificates";
import { Error } from "./pages/Error";
import { LoginConfirmation } from "./pages/LoginConfirmation";
import { LoginHome } from "./pages/LoginHome";
import { LogoutConfirmation } from "./pages/LogoutConfirmation";
import { ProjectContact } from "./pages/ProjectContact";
import { ProjectContactConfirmation } from "./pages/ProjectContactConfirmation";
import { ProjectDroppedOut } from "./pages/ProjectDroppedOut";
import { ProjectExperience } from "./pages/ProjectExperience";
import { ProjectGoals } from "./pages/ProjectGoals";
import { ProjectHome } from "./pages/ProjectHome";
import { ProjectOrganisms } from "./pages/ProjectOrganisms";
import { TrainingProgramSummary } from "./pages/TrainingProgramSummary";

type ScrollTopWrapperProps = {
  offset?: number;
  children: React.ReactNode;
};

const ScrollTopWrapper = (props: ScrollTopWrapperProps): JSX.Element => {
  const { offset, children } = props;

  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo({ top: offset || 0 });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

function App() {
  const { state, mainService } = useMainMachineContext();
  const authContext = useKeycloakContext();

  const { configureUser, resetUser } = useCrisp();

  useEffect(() => {
    if (authContext?.keycloakUser) {
      const { id, email } = authContext?.keycloakUser;

      configureUser({
        id,
        email,
      });
    } else {
      resetUser();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext?.keycloakUser]);

  // @ts-ignore
  window.state = state;

  const certificatesPage = () => (
    <ScrollTopWrapper>
      <Certificates key="show-results" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const certificateDetailsPage = () => (
    <ScrollTopWrapper>
      <CertificateDetails />
    </ScrollTopWrapper>
  );

  const projectGoalsPage = () => (
    <ScrollTopWrapper>
      <ProjectGoals key="project-goals" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const projectOrganismsPage = () => (
    <ScrollTopWrapper>
      <ProjectOrganisms key="project-organism" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const projectExperiencePage = () => (
    <ScrollTopWrapper>
      <ProjectExperience key="project-experience" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const loginHomePage = () => (
    <ScrollTopWrapper>
      <LoginHome key="login-home" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const loginConfirmationPage = () => (
    <ScrollTopWrapper>
      <LoginConfirmation key="login-confirmation" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const logoutConfirmationPage = () => (
    <ScrollTopWrapper>
      <LogoutConfirmation key="logout-confirmation" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const projectContactPage = () => (
    <ScrollTopWrapper>
      <ProjectContact key="project-contact" mainService={mainService} />
    </ScrollTopWrapper>
  );

  const projectContactConfirmationPage = () => (
    <ScrollTopWrapper>
      <ProjectContactConfirmation key="project-contact-confirmation" />
    </ScrollTopWrapper>
  );

  const refHomePageScrollTop = useRef<number>(0);

  const projectHomePage = ({
    certification,
  }: {
    certification: Certification;
  }) => (
    <ScrollTopWrapper offset={refHomePageScrollTop.current}>
      <ProjectHome
        key={`project-home-ready`}
        mainService={mainService}
        certification={certification}
      />
    </ScrollTopWrapper>
  );

  const projectDroppedOutPage = (contact: Contact) => {
    const firstname = contact?.firstname ?? "";
    const lastname = contact?.lastname ?? "";
    const fullName = `${firstname} ${lastname}`;
    return (
      <ScrollTopWrapper>
        <ProjectDroppedOut
          candidateEmail={contact?.email ?? ""}
          candidateName={fullName}
          supportEmail="support@vae.gouv.fr"
        />
      </ScrollTopWrapper>
    );
  };

  const errorPage = () => <Error key="error-page" mainService={mainService} />;

  const projectSubmissionConfirmationPage = () => (
    <ScrollTopWrapper>
      <ProjectSubmissionConfirmation />
    </ScrollTopWrapper>
  );

  const pageContent = (
    <>
      {["loadingCertifications", "searchResults", "searchResultsError"].some(
        state.matches
      ) && certificatesPage()}

      {["certificateDetails", "submittingSelectedCertification"].some(
        state.matches
      ) && certificateDetailsPage()}

      {state.matches("loginHome") && loginHomePage()}
      {state.matches("loginConfirmation") && loginConfirmationPage()}
      {state.matches("logoutConfirmation") && logoutConfirmationPage()}

      {state.matches("projectSubmissionConfirmation") &&
        projectSubmissionConfirmationPage()}

      {state.matches("projectContact") && projectContactPage()}
      {state.matches("projectContactConfirmation") &&
        projectContactConfirmationPage()}

      {state.matches("projectExperience") && projectExperiencePage()}

      {state.matches("projectGoals") && projectGoalsPage()}

      {state.matches("projectOrganism") && projectOrganismsPage()}

      {state.matches("projectDroppedOut") &&
        projectDroppedOutPage(state.context.contact)}

      {state.matches("trainingProgramSummary") && (
        <ScrollTopWrapper>
          <TrainingProgramSummary
            key="training-program-summary"
            mainService={mainService}
          />
        </ScrollTopWrapper>
      )}

      {state.matches("projectHome") || state.matches("trainingProgramConfirmed")
        ? projectHomePage({
            certification: state.context.certification,
          })
        : null}

      {state.matches("error") && errorPage()}
    </>
  );

  return (
    <div
      id="main-scroll"
      className="h-screen w-screen flex flex-col overflow-auto"
      onScroll={(e) => {
        if (state.matches("projectHome")) {
          const element = e.target as Element;
          refHomePageScrollTop.current = element.scrollTop;
        }
      }}
    >
      <SkipLinks
        links={[
          {
            anchor: "#content",
            label: "Contenu",
          },
          {
            anchor: "#footer",
            label: "Pied de page",
          },
        ]}
      />
      <Header />
      <div className="xl:bg-candidate">
        <main
          role="main"
          id="content"
          className="fr-container lg:shadow-lifted bg-white xl:my-8"
        >
          {pageContent}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
