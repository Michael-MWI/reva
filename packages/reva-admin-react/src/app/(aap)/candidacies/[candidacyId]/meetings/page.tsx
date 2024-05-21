"use client";
import { CandidacyBackButton } from "@/components/candidacy-back-button/CandidacyBackButton";
import { FormOptionalFieldsDisclaimer } from "@/components/form-optional-fields-disclaimer/FormOptionalFieldsDisclaimer";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { Impersonate } from "@/components/impersonate";
import { SmallNotice } from "@/components/small-notice/SmallNotice";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import { graphql } from "@/graphql/generated";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  format,
  parse,
  isAfter,
  isBefore,
  startOfToday,
  addMonths,
} from "date-fns";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    firstAppointmentOccuredAt: z.string({
      required_error:
        "Cette information est obligatoire pour continuer le parcours. Le candidat pourra modifier sa candidature jusqu'à cette date, au-delà de laquelle toute modification sera bloquée.",
    }),
    candidacyCreatedAt: z.string(),
  })
  .superRefine(({ firstAppointmentOccuredAt, candidacyCreatedAt }, ctx) => {
    const today = startOfToday();

    if (
      isAfter(
        parse(firstAppointmentOccuredAt, "yyyy-MM-dd", new Date()),
        addMonths(today, 3),
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["firstAppointmentOccuredAt"],
        message: "La date de rendez-vous doit être dans les 3 prochains mois",
      });
    }

    if (
      isBefore(
        parse(firstAppointmentOccuredAt, "yyyy-MM-dd", new Date()),
        parse(candidacyCreatedAt, "yyyy-MM-dd", new Date()),
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["firstAppointmentOccuredAt"],
        message:
          "La date de rendez-vous ne peut pas être inférieure à la date de création de la candidature",
      });
    }
  });

type FormData = z.infer<typeof schema>;

const getCandidacyQuery = graphql(`
  query getCandidacyForMeetingsPage($candidacyId: ID!) {
    getCandidacyById(id: $candidacyId) {
      firstAppointmentOccuredAt
      createdAt
      candidate {
        id
      }
    }
  }
`);

const updateCandidacyFirstAppointmentInformationsMutation = graphql(`
  mutation updateCandidacyFirstAppointmentInformationsMutation(
    $candidacyId: ID!
    $appointmentInformations: AppointmentInformationsInput!
  ) {
    candidacy_updateAppointmentInformations(
      candidacyId: $candidacyId
      appointmentInformations: $appointmentInformations
    ) {
      id
    }
  }
`);

const MeetingsPage = () => {
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const { graphqlClient } = useGraphQlClient();
  const queryClient = useQueryClient();

  const { data: getCandidacyResponse, status: getCandidacyStatus } = useQuery({
    queryKey: ["getCandidacy", candidacyId],
    queryFn: () =>
      graphqlClient.request(getCandidacyQuery, {
        candidacyId,
      }),
  });

  const updateCandidacyFirstAppointmentInformations = useMutation({
    mutationFn: ({
      candidacyId,
      firstAppointmentOccuredAt,
    }: {
      candidacyId: string;
      firstAppointmentOccuredAt: Date;
    }) =>
      graphqlClient.request(
        updateCandidacyFirstAppointmentInformationsMutation,
        {
          candidacyId,
          appointmentInformations: {
            firstAppointmentOccuredAt: firstAppointmentOccuredAt.getTime(),
          },
        },
      ),
  });

  const firstAppointmentOccuredAt =
    getCandidacyResponse?.getCandidacyById?.firstAppointmentOccuredAt;

  const candidateId = getCandidacyResponse?.getCandidacyById?.candidate?.id;

  const candidacyCreatedAt = getCandidacyResponse?.getCandidacyById?.createdAt;

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await updateCandidacyFirstAppointmentInformations.mutateAsync({
        candidacyId,
        firstAppointmentOccuredAt: parse(
          data.firstAppointmentOccuredAt,
          "yyyy-MM-dd",
          new Date(),
        ),
      });
      queryClient.invalidateQueries({ queryKey: [candidacyId] });
      successToast("Les modifications ont bien été enregistrées");
    } catch (e) {
      graphqlErrorToast(e);
    }
  });

  const resetForm = useCallback(() => {
    reset({
      firstAppointmentOccuredAt: firstAppointmentOccuredAt
        ? format(firstAppointmentOccuredAt, "yyyy-MM-dd")
        : undefined,
      candidacyCreatedAt: candidacyCreatedAt
        ? format(candidacyCreatedAt, "yyyy-MM-dd")
        : undefined,
    });
  }, [reset, firstAppointmentOccuredAt, candidacyCreatedAt]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <div className="flex flex-col">
      <CandidacyBackButton candidacyId={candidacyId} />
      <div className="flex flex-row justify-between">
        <h1>Rendez-vous pédagogique</h1>
        <Impersonate candidateId={candidateId} />
      </div>
      <FormOptionalFieldsDisclaimer />
      {getCandidacyStatus === "success" && (
        <form
          onSubmit={handleFormSubmit}
          onReset={(e) => {
            e.preventDefault();
            resetForm();
          }}
          className="flex flex-col mt-8"
        >
          <Input
            className="max-w-xs"
            label="Date du premier rendez-vous pédagogique"
            hintText="Date au format 31/12/2022"
            nativeInputProps={{
              type: "date",
              min:
                candidacyCreatedAt && format(candidacyCreatedAt, "yyyy-MM-dd"),
              max: format(
                new Date().setMonth(new Date().getMonth() + 3),
                "yyyy-MM-dd",
              ),
              ...register("firstAppointmentOccuredAt"),
            }}
            state={errors.firstAppointmentOccuredAt ? "error" : "default"}
            stateRelatedMessage={errors.firstAppointmentOccuredAt?.message}
          />

          <input type="hidden" {...register("candidacyCreatedAt")} />

          <SmallNotice>
            Le candidat pourra modifier sa candidature jusqu'à cette date,
            au-delà de laquelle toute modification sera bloquée.
          </SmallNotice>
          <div className="flex flex-col md:flex-row gap-4 items-center self-center md:self-end mt-10">
            <Button disabled={isSubmitting}>Enregistrer</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MeetingsPage;
