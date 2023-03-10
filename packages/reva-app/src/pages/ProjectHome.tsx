import { useActor } from "@xstate/react";
import { ProjectTimeline } from "components/organisms/ProjectTimeline/ProjectTimeline";
import { Interpreter } from "xstate";

import { Button } from "../components/atoms/Button";
import { Header } from "../components/atoms/Header";
import { Loader } from "../components/atoms/Icons";
import { NameBadge } from "../components/molecules/NameBadge/NameBadge";
import { Page } from "../components/organisms/Page";
import { Certification } from "../interface";
import { MainContext, MainEvent } from "../machines/main.machine";
import { projectProgress } from "../utils/projectProgress";

interface ProjectHomeProps {
  certification: Certification;
  mainService: Interpreter<MainContext, any, MainEvent, any, any>;
}

export const ProjectHome = ({
  certification,
  mainService,
}: ProjectHomeProps) => {
  const [state, send] = useActor(mainService);

  const isHomeReady =
    !state.matches({ projectHome: "fakeLoading" }) &&
    !state.matches({ projectHome: "loading" }) &&
    !state.matches({ projectHome: "retry" }) &&
    !state.matches("submissionHome");

  const progress = projectProgress(state.context);
  const isProjectComplete = progress === 100;

  const projectButtonHandler = () =>
    progress === 100 ? send("VALIDATE_PROJECT") : send("OPEN_HELP");

  const retryErrorScreen = (
    <div
      data-test="project-home-error"
      className="absolute ml-[-16px] mt-[-16px] lg:ml-[-64px] lg:mt-[-80px]  w-full  bg-neutral-100 h-full grow flex flex-col text-center items-center justify-center px-10"
    >
      <Header label="Oups..." size="small" />
      <p>{state.context.error}</p>
      <div className="mt-8">
        <Button
          data-test="submission-home-retry-candidate"
          size="small"
          label="Réessayer"
          onClick={() =>
            send({
              type: "SUBMIT_CERTIFICATION",
              certification,
            })
          }
        />
      </div>
    </div>
  );

  const loadingScreen = (
    <div
      data-test="project-home-loading"
      className="absolute ml-[-16px] mt-[-16px] lg:ml-[-64px] lg:mt-[-80px] w-full h-full flex flex-col bg-neutral-100 grow text-center items-center justify-center px-10"
    >
      <Header label="Connexion en cours" size="small" />
      <div className="mt-8 w-8">
        <Loader />
      </div>
    </div>
  );

  const homeScreen = (
    <div data-test={`project-home-ready`}>
      <div>
        <h1 className="text-lg font-bold text-dsfrGray-500">Bienvenue 🤝,</h1>
        <NameBadge className="mt-4" />
        <p className="my-4 pr-6 text-dsfrGray-500 text-base">
          Reva est une expérimentation visant à simplifier la Validation des
          Acquis de l'Expérience (VAE). Vous avez une expérience dans les
          secteurs de la dépendance et de la santé ? Choisissez votre diplôme et
          laissez-vous accompagner !
        </p>

        <ProjectTimeline className="mt-8" dataTest="project-home-timeline" />
      </div>
      <div className="bg-white flex flex-col items-center pt-32 pb-12 sm:pb-4">
        <Button
          data-test={`project-home-validate${
            !isProjectComplete ? "-locked" : ""
          }`}
          locked={!isProjectComplete}
          onClick={projectButtonHandler}
          type="submit"
          loading={state.matches("projectHome.submitting")}
          label="Valider"
          primary={false}
          size="medium"
        />
      </div>
    </div>
  );

  return (
    <Page direction={state.context.direction}>
      {(state.matches({ projectHome: "loading" }) ||
        state.matches({ projectHome: "fakeLoading" })) &&
        loadingScreen}
      {state.matches({ projectHome: "retry" }) && retryErrorScreen}
      {isHomeReady && homeScreen}
    </Page>
  );
};
