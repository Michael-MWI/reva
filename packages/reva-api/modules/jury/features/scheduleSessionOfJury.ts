import { v4 as uuidV4 } from "uuid";

import { isBefore, startOfDay } from "date-fns";

import { prismaClient } from "../../../prisma/client";
import { FileService, UploadedFile } from "../../shared/file";
import { sendJuryScheduledCandidateEmail } from "../emails/sendJuryScheduledCandidateEmail";
import { sendJuryScheduledAAPEmail } from "../emails/sendJuryScheduledAAPEmail";

interface ScheduleSessionOfJury {
  candidacyId: string;
  date: string;
  time?: string;
  address?: string;
  information?: string;
  convocationFile?: UploadedFile;
}

export const scheduleSessionOfJury = async (params: ScheduleSessionOfJury) => {
  const { candidacyId, date, time, address, information, convocationFile } =
    params;

  const candidacy = await prismaClient.candidacy.findFirst({
    where: { id: candidacyId },
    include: {
      Feasibility: { where: { isActive: true } },
      candidate: true,
      organism: true,
      Jury: { where: { isActive: true } },
      candidacyStatuses: true,
    },
  });
  if (!candidacy) {
    throw new Error("La candidature n'a pas été trouvée");
  }

  const isDossierDeValidationSent =
    candidacy.candidacyStatuses?.findIndex(
      ({ status }) => status == "DOSSIER_DE_VALIDATION_ENVOYE",
    ) != -1;

  if (!isDossierDeValidationSent) {
    throw new Error("Le dossier de validation n'a pas été envoyé");
  }

  const activeJury = candidacy.Jury[0];
  if (activeJury) {
    const dateOfJuryHasNotPassed = activeJury
      ? isBefore(new Date(), startOfDay(activeJury.dateOfSession))
      : false;

    if (!dateOfJuryHasNotPassed) {
      throw new Error("La date du jury est passée");
    }

    if (activeJury.result) {
      throw new Error("Le résultat du jury a déjà été renseigné");
    }
  }

  const convocationFileId = uuidV4();
  if (convocationFile) {
    await uploadFile({
      candidacyId,
      fileUuid: convocationFileId,
      file: convocationFile,
    });
  }

  await prismaClient.jury.updateMany({
    where: { candidacyId },
    data: { isActive: false },
  });

  const jury = await prismaClient.jury.create({
    data: {
      candidacy: { connect: { id: candidacyId } },
      dateOfSession: new Date(date),
      timeOfSession: time,
      addressOfSession: address,
      informationOfSession: information,
      convocationFile: convocationFile
        ? {
            create: {
              name: convocationFile.filename,
              mimeType: convocationFile.mimetype,
              id: convocationFileId,
            },
          }
        : undefined,
      certificationAuthority: {
        connect: { id: candidacy.Feasibility[0].certificationAuthorityId },
      },
    },
    include: {
      certificationAuthority: true,
    },
  });

  if (candidacy.candidate) {
    sendJuryScheduledCandidateEmail({
      email: candidacy.candidate.email,
      dateOfSession: new Date(date),
      timeOfSession: time,
      addressOfSession: address,
      convocationFile,
    });

    if (candidacy.organism?.contactAdministrativeEmail) {
      sendJuryScheduledAAPEmail({
        candidacyId,
        email: candidacy.organism?.contactAdministrativeEmail,
        candidateFullName: `${candidacy.candidate.firstname} ${candidacy.candidate.lastname}`,
        dateOfSession: new Date(date),
        timeOfSession: time,
      });
    }
  }

  // await updateCandidacyStatus({
  //   candidacyId,
  //   status: "DOSSIER_DE_VALIDATION_ENVOYE",
  // });

  return jury;
};

const uploadFile = ({
  candidacyId,
  fileUuid,
  file,
}: {
  candidacyId: string;
  fileUuid: string;
  file: UploadedFile;
}) =>
  FileService.getInstance().uploadFile(
    {
      fileKeyPath: `${candidacyId}/${fileUuid}`,
      fileType: file.mimetype,
    },
    file._buf,
  );
