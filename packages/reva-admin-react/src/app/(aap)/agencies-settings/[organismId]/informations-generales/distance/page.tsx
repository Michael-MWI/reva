"use client";
import { SmallNotice } from "@/components/small-notice/SmallNotice";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useInformationsGeneralesRemotePage } from "./informationsGeneralesRemote.hook";
import { FormOptionalFieldsDisclaimer } from "@/components/form-optional-fields-disclaimer/FormOptionalFieldsDisclaimer";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { RemoteZone } from "@/graphql/generated/graphql";
import {
  InformationsGeneralesRemoteFormData,
  informationsGeneralesRemoteFormSchema,
} from "./informationsGeneralesRemoteFormSchema";

const InformationsGeneralesPage = () => {
  const {
    organism,
    getOrganismStatus,
    refetchOrganism,
    createOrUpdateInformationsCommercialesAndRemoteStatus,
  } = useInformationsGeneralesRemotePage();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InformationsGeneralesRemoteFormData>({
    resolver: zodResolver(informationsGeneralesRemoteFormSchema),
  });

  const handleReset = useCallback(() => {
    reset({
      ...organism?.informationsCommerciales,
      isRemoteFranceMetropolitaine: organism?.remoteZones?.includes(
        "FRANCE_METROPOLITAINE",
      ),
      isRemoteGuadeloupe: organism?.remoteZones?.includes("GUADELOUPE"),
      isRemoteGuyane: organism?.remoteZones?.includes("GUYANE"),
      isRemoteLaReunion: organism?.remoteZones?.includes("LA_REUNION"),
      isRemoteMartinique: organism?.remoteZones?.includes("MARTINIQUE"),
      isRemoteMayotte: organism?.remoteZones?.includes("MAYOTTE"),
      isNotRemote: !organism?.isRemote,
    } as InformationsGeneralesRemoteFormData);
  }, [organism, reset]);

  useEffect(() => handleReset(), [handleReset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      const {
        isNotRemote,
        isRemoteFranceMetropolitaine,
        isRemoteGuadeloupe,
        isRemoteGuyane,
        isRemoteLaReunion,
        isRemoteMartinique,
        isRemoteMayotte,
        ...informationsCommerciales
      } = data;

      const remoteZones: RemoteZone[] = [];

      if (!isNotRemote) {
        if (isRemoteFranceMetropolitaine) {
          remoteZones.push("FRANCE_METROPOLITAINE");
        }
        if (isRemoteGuadeloupe) {
          remoteZones.push("GUADELOUPE");
        }
        if (isRemoteGuyane) {
          remoteZones.push("GUYANE");
        }
        if (isRemoteLaReunion) {
          remoteZones.push("LA_REUNION");
        }
        if (isRemoteMartinique) {
          remoteZones.push("MARTINIQUE");
        }
        if (isRemoteMayotte) {
          remoteZones.push("MAYOTTE");
        }
      }

      await createOrUpdateInformationsCommercialesAndRemoteStatus.mutateAsync({
        organismId: organism?.id,
        isRemote: !isNotRemote,
        remoteZones,
        informationsCommerciales,
      });
      successToast("modifications enregistrées");
      await refetchOrganism();
    } catch (e) {
      graphqlErrorToast(e);
    }
  });

  const { isNotRemote } = useWatch({ control });

  return (
    <div className="flex flex-col">
      <h1>Informations générales</h1>
      <FormOptionalFieldsDisclaimer />
      <p>
        Renseignez les informations qui seront affichées dans les résultats de
        recherche des candidats puis sélectionnez les zones où se dérouleront
        vos accompagnements à remote.{" "}
      </p>

      {getOrganismStatus === "success" && (
        <>
          <form
            className="flex flex-col mt-6"
            onSubmit={handleFormSubmit}
            onReset={(e) => {
              e.preventDefault();
              handleReset();
            }}
          >
            <Checkbox
              className="col-span-2 mb-4"
              options={[
                {
                  label: "Je ne souhaite pas faire d’accompagnement à remote.",
                  nativeInputProps: { ...register("isNotRemote") },
                },
              ]}
              state={errors.isNotRemote ? "error" : "default"}
              stateRelatedMessage={errors.isNotRemote?.message}
            />
            <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Input
                disabled={isNotRemote}
                className="col-span-3"
                label="Nom de la structure (affiché aux candidats)"
                state={errors.nom ? "error" : "default"}
                stateRelatedMessage={errors.nom?.message}
                nativeInputProps={{ ...register("nom") }}
              />
              <Input
                disabled={isNotRemote}
                label="Téléphone"
                nativeInputProps={{
                  ...register("telephone"),
                }}
                state={errors.telephone ? "error" : "default"}
                stateRelatedMessage={errors.telephone?.message}
              />
              <Input
                disabled={isNotRemote}
                label="E-mail de contact"
                state={errors.emailContact ? "error" : "default"}
                stateRelatedMessage={errors.emailContact?.message}
                nativeInputProps={{
                  ...register("emailContact"),
                }}
              />
              <Input
                disabled={isNotRemote}
                label="Site internet (optionnel)"
                nativeInputProps={{
                  ...register("siteInternet"),
                }}
              />
            </fieldset>
            <fieldset className="flex flex-col mt-6">
              <Checkbox
                disabled={isNotRemote}
                legend="Quelles zones seront couvertes en distanciel ?"
                hintText="Vous pouvez sélectionnez une ou plusieurs zones."
                options={[
                  {
                    label: "France métropolitaine",
                    nativeInputProps: {
                      ...register("isRemoteFranceMetropolitaine"),
                    },
                  },
                  {
                    label: "Guadeloupe",
                    nativeInputProps: {
                      ...register("isRemoteGuadeloupe"),
                    },
                  },
                  {
                    label: "Guyane",
                    nativeInputProps: {
                      ...register("isRemoteGuyane"),
                    },
                  },

                  {
                    label: "Martinique",
                    nativeInputProps: {
                      ...register("isRemoteMartinique"),
                    },
                  },
                  {
                    label: "Mayotte",
                    nativeInputProps: {
                      ...register("isRemoteMayotte"),
                    },
                  },
                  {
                    label: "La Réunion",
                    nativeInputProps: {
                      ...register("isRemoteLaReunion"),
                    },
                  },
                ]}
                state={
                  errors.isRemoteFranceMetropolitaine ? "error" : "default"
                }
                stateRelatedMessage={
                  errors.isRemoteFranceMetropolitaine?.message
                }
              />
            </fieldset>
            <div className="flex flex-col md:flex-row gap-4 self-center md:self-end mt-8">
              <Button priority="secondary" type="reset">
                Réinitialiser
              </Button>
              <Button disabled={isSubmitting}>Enregistrer</Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default InformationsGeneralesPage;
