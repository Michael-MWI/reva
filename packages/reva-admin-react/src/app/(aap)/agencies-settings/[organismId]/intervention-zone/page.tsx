"use client";
import { ZoneIntervention } from "@/app/(aap)/agencies-settings/_components/zone-intervention/ZoneIntervention";
import { useZoneInterventionAAP } from "@/app/(aap)/agencies-settings/_components/zone-intervention/zoneInterventionAAP.hook";
import { useAuth } from "@/components/auth/auth";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useController, useForm } from "react-hook-form";
import {
  InterventionZoneFormData,
  interventionZoneFormSchema,
} from "./interventionZoneFormSchema";
import { useInterventionZonePage } from "./interventionZonePage.hook";

const InterventionZonePage = () => {
  const {
    interventionZoneIsError,
    maisonMereAAP,
    organism,
    updateOrganismInterventionZone,
  } = useInterventionZonePage();

  const { isGestionnaireMaisonMereAAP } = useAuth();
  const {
    reset,
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<InterventionZoneFormData>({
    resolver: zodResolver(interventionZoneFormSchema),
    defaultValues: {
      zoneInterventionDistanciel: [],
      zoneInterventionPresentiel: [],
    },
  });

  const { getZonesIntervention, mergeZonesIntervention } =
    useZoneInterventionAAP();

  const zonesIntervention = useMemo(
    () =>
      getZonesIntervention({
        maisonMereAAPOnDepartements:
          maisonMereAAP?.maisonMereAAPOnDepartements || [],
        organismOnDepartments: organism?.organismOnDepartments || [],
      }),
    [getZonesIntervention, maisonMereAAP, organism],
  );

  const onSiteInterventionZoneController = useController({
    name: "zoneInterventionPresentiel",
    control,
  });

  const remoteInterventionZoneController = useController({
    name: "zoneInterventionDistanciel",
    control,
  });

  const handleReset = useCallback(() => {
    reset({
      zoneInterventionDistanciel: zonesIntervention.remote,
      zoneInterventionPresentiel: zonesIntervention.onSite,
    });
  }, [reset, zonesIntervention]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const interventionZone = mergeZonesIntervention({
      onSiteZone: data.zoneInterventionPresentiel,
      remoteZone: data.zoneInterventionDistanciel,
    });

    try {
      await updateOrganismInterventionZone.mutateAsync({
        organismId: organism?.id || "",
        interventionZone,
      });
      successToast({
        title: "modifications enregistrées",
      });
    } catch (e) {
      graphqlErrorToast(e);
    }
  });

  return (
    <div className="flex flex-col w-full">
      <h1>Zone d'intervention</h1>

      {interventionZoneIsError && (
        <Alert
          className="mb-6"
          severity="error"
          title="Une erreur est survenue pendant la récupération de la zone d'intervention."
        />
      )}

      {maisonMereAAP && (
        <form
          className="flex flex-col gap-4"
          onSubmit={handleFormSubmit}
          onReset={(e) => {
            e.preventDefault();
            handleReset();
          }}
        >
          <fieldset className="flex gap-4 w-full mt-4">
            <ZoneIntervention
              type="ON_SITE"
              zoneIntervention={onSiteInterventionZoneController.field.value}
              onChange={onSiteInterventionZoneController.field.onChange}
              disabled={!isGestionnaireMaisonMereAAP}
            />
            <ZoneIntervention
              type="REMOTE"
              zoneIntervention={remoteInterventionZoneController.field.value}
              onChange={remoteInterventionZoneController.field.onChange}
              disabled={!isGestionnaireMaisonMereAAP}
            />
          </fieldset>
          {isGestionnaireMaisonMereAAP && (
            <div className="flex flex-col md:flex-row gap-4 self-center md:self-end mt-8">
              <Button priority="secondary" type="reset">
                Réinitialiser
              </Button>
              <Button disabled={isSubmitting}>Enregistrer</Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default InterventionZonePage;
