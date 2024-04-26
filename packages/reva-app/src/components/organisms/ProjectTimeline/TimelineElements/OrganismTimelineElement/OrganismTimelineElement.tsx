import { Button } from "@codegouvfr/react-dsfr/Button";
import { TimelineElement } from "components/molecules/Timeline/Timeline";
import { useProjectTimeline } from "components/organisms/ProjectTimeline/ProjectTimeline";
import { useMainMachineContext } from "contexts/MainMachineContext/MainMachineContext";

export const OrganismTimelineElement = () => {
  const { state, mainService } = useMainMachineContext();
  const { getTimelineElementStatus } = useProjectTimeline();

  const organism = state.context.organism;
  const informationsCommerciales = organism?.informationsCommerciales;

  const organismDisplayInfo = organism
    ? {
        label: informationsCommerciales?.nom || organism?.label,
        email:
          informationsCommerciales?.emailContact ||
          organism?.contactAdministrativeEmail,
        phone:
          informationsCommerciales?.telephone ||
          organism?.contactAdministrativePhone,
      }
    : undefined;

  return (
    <TimelineElement
      title="Votre organisme d'accompagnement"
      description="Il vous guide tout au long du parcours"
      status={getTimelineElementStatus({
        previousElementFilled:
          !!state.context.certification &&
          !!state.context.experiences.rest.length, //certification can be unfilled after the goals have been filled if the certification becomes inactive, hence the additional  !!state.context.certification condition
        currentElementFilled: !!state.context.organism,
      })}
    >
      {({ status }) => (
        <>
          {organismDisplayInfo && (
            <div className="flex flex-col p-4 border border-dsfrBlue-500">
              {state.context.organism?.label && (
                <h3
                  data-test="project-home-organism-label"
                  className="text-base font-medium mb-0"
                >
                  {organismDisplayInfo?.label}
                </h3>
              )}
              <address className="not-italic text-base">
                <span data-test="project-home-organism-email">
                  {organismDisplayInfo.email}
                </span>
                {organismDisplayInfo.phone && (
                  <>
                    &nbsp; - &nbsp;
                    <span data-test="project-home-organism-phone">
                      {organismDisplayInfo.phone}
                    </span>
                  </>
                )}
              </address>
            </div>
          )}
          <div className="mt-4 text-sm text-slate-400">
            {status !== "readonly" && (
              <Button
                data-test="project-home-edit-organism"
                priority="secondary"
                onClick={() => mainService.send("EDIT_ORGANISM")}
                disabled={status === "disabled"}
              >
                {state.context.organism
                  ? "Modifiez votre organisme d'accompagnement"
                  : "Choisir votre organisme d'accompagnement"}
              </Button>
            )}
          </div>
        </>
      )}
    </TimelineElement>
  );
};
