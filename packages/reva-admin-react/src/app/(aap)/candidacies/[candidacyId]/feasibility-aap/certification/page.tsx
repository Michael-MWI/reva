"use client";
import { useCertificationPageLogic } from "@/app/(aap)/candidacies/[candidacyId]/feasibility-aap/certification/certificationPageLogic";
import { FormOptionalFieldsDisclaimer } from "@/components/form-optional-fields-disclaimer/FormOptionalFieldsDisclaimer";
import { FormButtons } from "@/components/form/form-footer/FormButtons";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  option: z.string(),
  firstForeignLanguage: z.string(),
  secondForeignlanguage: z.string(),
  completion: z.enum(["PARTIAL", "COMPLETE"], {
    invalid_type_error: "Merci de remplir ce champ",
  }),
  competenceBlocs: z
    .object({
      competenceBlocId: z.string(),
      label: z.string(),
      checked: z.boolean(),
    })
    .array(),
});

type FormData = z.infer<typeof schema>;

const CertificationPage = () => {
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();
  const router = useRouter();
  const feasibilitySummaryUrl = `/candidacies/${candidacyId}/feasibility-aap`;

  const {
    candidacy,
    certification,
    dematerializedFeasibilityFile,
    updateFeasibilityCertification,
  } = useCertificationPageLogic();

  const defaultValues = useMemo(
    () => ({
      option: dematerializedFeasibilityFile?.option || "",
      firstForeignLanguage:
        dematerializedFeasibilityFile?.firstForeignLanguage || "",
      secondForeignlanguage:
        dematerializedFeasibilityFile?.secondForeignLanguage || "",
      completion: candidacy?.isCertificationPartial
        ? ("PARTIAL" as const)
        : ("COMPLETE" as const),
      competenceBlocs: certification?.competenceBlocs?.map((bloc) => ({
        competenceBlocId: bloc.id,
        label: bloc.code ? `${bloc.code} - ${bloc.label}` : bloc.label,
        checked:
          dematerializedFeasibilityFile?.blocsDeCompetences.some(
            (bc) => bc.certificationCompetenceBloc.id === bloc.id,
          ) || candidacy?.isCertificationPartial === false,
      })),
    }),
    [
      candidacy?.isCertificationPartial,
      certification?.competenceBlocs,
      dematerializedFeasibilityFile?.blocsDeCompetences,
      dematerializedFeasibilityFile?.firstForeignLanguage,
      dematerializedFeasibilityFile?.option,
      dematerializedFeasibilityFile?.secondForeignLanguage,
    ],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const completion = useWatch({ name: "completion", control });
  const competenceBlocFields = watch("competenceBlocs", []);

  const resetForm = useCallback(
    () => reset(defaultValues),
    [defaultValues, reset],
  );

  useEffect(resetForm, [resetForm]);

  const handleFormSubmit = handleSubmit(
    async (data) => {
      try {
        await updateFeasibilityCertification.mutateAsync({
          option: data.option,
          firstForeignLanguage: data.firstForeignLanguage,
          secondForeignLanguage: data.secondForeignlanguage,
          completion: data.completion,
          blocDeCompetencesIds: data.competenceBlocs
            .filter((bloc) => bloc.checked)
            .map((bloc) => bloc.competenceBlocId),
        });
        successToast("Modifications enregistrées");
        router.push(feasibilitySummaryUrl);
      } catch (error) {
        graphqlErrorToast(error);
      }
    },
    (error) => {
      console.error(error);
    },
  );

  const handleCertificationCompletionChange = useCallback(
    (completion: "PARTIAL" | "COMPLETE") => {
      switch (completion) {
        case "COMPLETE": {
          setValue(
            "competenceBlocs",
            competenceBlocFields.map((bloc) => ({ ...bloc, checked: true })),
          );
          break;
        }
        case "PARTIAL": {
          setValue(
            "competenceBlocs",
            competenceBlocFields.map((bloc) => ({ ...bloc, checked: false })),
          );
          break;
        }
      }
    },
    [competenceBlocFields, setValue],
  );

  const handleCompetenceBlocChange = useCallback(
    (index: number, checked: boolean) => {
      const allChecked = competenceBlocFields.every((bloc, i) =>
        i === index ? checked : bloc.checked,
      );

      setValue("completion", allChecked ? "COMPLETE" : "PARTIAL");
    },
    [competenceBlocFields, setValue],
  );

  return (
    <div className="flex flex-col">
      <h1>Descriptif de la certification</h1>
      <FormOptionalFieldsDisclaimer />
      <p className="text-xl mb-10">
        Choisissez les blocs de compétences sur lesquels le candidat souhaite se
        positionner
      </p>
      <div className="flex gap-2">
        <span className="fr-icon fr-icon--lg fr-icon-award-fill" />
        <div className="flex flex-col">
          <p className="text-xl font-bold mb-0">{certification?.label}</p>
          <p className="text-sm text-dsfr-light-text-mention-grey">
            RNCP {certification?.codeRncp}
          </p>
        </div>
      </div>
      <a
        href={`https://www.francecompetences.fr/recherche/rncp/${certification?.codeRncp}/`}
        target="_blank"
        className="fr-link mr-auto"
      >
        Lire les détails de la fiche diplôme
      </a>
      {certification && (
        <form
          className="mt-6"
          onSubmit={handleFormSubmit}
          onReset={(e) => {
            e.preventDefault();
            resetForm();
          }}
        >
          <Input
            label="Option ou parcours"
            hintText="(Le cas échéant)"
            nativeInputProps={{ ...register("option") }}
            data-test="certification-option-input"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Langue vivante 1"
              hintText="(Le cas échéant)"
              nativeInputProps={{ ...register("firstForeignLanguage") }}
              data-test="certification-first-foreign-language-input"
            />
            <Input
              label="Langue vivante 2"
              hintText="(Le cas échéant)"
              nativeInputProps={{ ...register("secondForeignlanguage") }}
              data-test="certification-second-foreign-language-input"
            />
          </div>

          <RadioButtons
            className="mb-4"
            legend="Le candidat / la candidate vise :"
            options={[
              {
                label: "La certification dans sa totalité",
                nativeInputProps: {
                  value: "COMPLETE",
                  ...register("completion", {
                    onChange: (e) =>
                      handleCertificationCompletionChange(e.target.value),
                  }),
                },
              },
              {
                label:
                  "Un ou plusieurs bloc(s) de compétences de la certification",
                nativeInputProps: {
                  value: "PARTIAL",
                  ...register("completion", {
                    onChange: (e) =>
                      handleCertificationCompletionChange(e.target.value),
                  }),
                },
              },
            ]}
            state={errors.completion ? "error" : "default"}
            stateRelatedMessage={errors.completion?.message}
            data-test="certification-completion-radio-buttons"
          />

          <Checkbox
            legend={
              <span className="text-xl font-bold">
                Bloc(s) de compétence visé(s)
              </span>
            }
            disabled={!completion}
            options={competenceBlocFields.map((bloc, blocIndex) => ({
              label: bloc.label,
              nativeInputProps: {
                key: bloc.competenceBlocId,
                ...register(`competenceBlocs.${blocIndex}.checked`, {
                  onChange: (e) =>
                    handleCompetenceBlocChange(blocIndex, e.target.checked),
                }),
              },
            }))}
            data-test="competence-blocs-checkbox"
          />
          <FormButtons
            backUrl={`/candidacies/${candidacyId}/feasibility-aap`}
            formState={{
              isDirty:
                isDirty ||
                !dematerializedFeasibilityFile?.certificationPartComplete,
              canSubmit:
                completion == "PARTIAL" &&
                competenceBlocFields.every((bloc) => !bloc.checked)
                  ? false
                  : true,
              isSubmitting,
            }}
          />
        </form>
      )}
    </div>
  );
};

export default CertificationPage;
