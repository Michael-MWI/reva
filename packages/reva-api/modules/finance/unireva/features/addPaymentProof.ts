import {
  Either,
  EitherAsync,
  Just,
  Left,
  Maybe,
  Nothing,
  Right,
} from "purify-ts";

import {
  FunctionalCodeError,
  FunctionalError,
} from "../../../shared/error/functionalError";
import { UploadedFile } from "../../../shared/file";
import { FileUploadSpoolerEntry, PaymentRequest } from "../finance.types";

import { addFileToUploadSpooler } from "../database/fileUploadSpooler";
import { getFundingRequest } from "../database/fundingRequests";
import { getPaymentRequestByCandidacyId } from "../database/paymentRequest";

interface AddPaymentProofParams {
  fileMaxSize: number;
  candidacyId: string;
  invoice?: UploadedFile;
  appointment?: UploadedFile;
}

export const addPaymentProof = async ({
  fileMaxSize,
  candidacyId,
  appointment,
  invoice,
}: AddPaymentProofParams): Promise<Either<FunctionalError, any>> => {
  if (!invoice && !appointment) {
    return Promise.resolve(
      Left(
        new FunctionalError(
          FunctionalCodeError.UPLOAD_PAYMENT_PROOF_NO_ATTACHEMENT,
          "No document to upload",
        ),
      ),
    );
  }

  let paymentRequestId: string, fundingRequestNumAction: string;

  const getPaymentRequestIdEitherAsync = EitherAsync.fromPromise(async () => {
    const paymentRequestEither = await getPaymentRequestByCandidacyId({
      candidacyId,
    });
    if (paymentRequestEither.isRight()) {
      const paymentRequestMaybe = paymentRequestEither.extract();
      if (paymentRequestMaybe.isNothing()) {
        return Left("Payment request not found");
      }
      paymentRequestId = (paymentRequestMaybe.extract() as PaymentRequest).id;
    }
    return paymentRequestEither;
  });

  const getNumActionEitherAsync = EitherAsync.fromPromise(async () => {
    const fundingRequestEither = await getFundingRequest({
      candidacyId,
    });
    if (fundingRequestEither.isRight()) {
      const fundingRequest = fundingRequestEither.extract();
      if (fundingRequest === null) {
        return Left("Funding request not found");
      }
      fundingRequestNumAction = fundingRequest.numAction;
    }
    return fundingRequestEither;
  });

  const addFileToSpoolerEitherAsync = (
    data: FileUploadSpoolerEntry,
  ): EitherAsync<string, Maybe<string>> => {
    return EitherAsync.fromPromise(async () => {
      if (data.fileContent) {
        if (data.fileContent.byteLength > fileMaxSize) {
          return Left("Le fichier envoyé dépasse la taille maximale acceptée");
        }
        const spoolerIdEither = await addFileToUploadSpooler({
          description: data.description,
          destinationFileName: data.destinationFileName,
          destinationPath: data.destinationPath,
          fileContent: data.fileContent,
        });
        if (spoolerIdEither.isLeft()) {
          return spoolerIdEither;
        }
        return Right(Just(spoolerIdEither.extract()));
      }
      return Promise.resolve(Right(Nothing));
    });
  };

  const addInvoiceToSpooler = (fileContent: UploadedFile) => {
    const { filename, mimetype } = fileContent;
    return addFileToSpoolerEitherAsync({
      destinationFileName: `facture_${fundingRequestNumAction}.${getFilenameExtension(
        filename,
      )}`,
      destinationPath: "import",
      description: `Facture pour paymentRequestId ${paymentRequestId} (${filename} - ${mimetype})`,
      fileContent: fileContent._buf,
    });
  };

  const addAppointmentToSpooler = (fileContent: UploadedFile) => {
    const { filename, mimetype } = fileContent;
    return addFileToSpoolerEitherAsync({
      destinationFileName: `presence_${fundingRequestNumAction}.${getFilenameExtension(
        filename,
      )}`,
      destinationPath: "import",
      description: `Feuille de présence pour paymentRequestId ${paymentRequestId} (${filename} - ${mimetype})`,
      fileContent: fileContent._buf,
    });
  };

  return getPaymentRequestIdEitherAsync
    .chain(() => getNumActionEitherAsync)
    .chain(() =>
      invoice ? addInvoiceToSpooler(invoice) : Promise.resolve(Right(Nothing)),
    )
    .chain(() =>
      appointment
        ? addAppointmentToSpooler(appointment)
        : Promise.resolve(Right(Nothing)),
    )
    .mapLeft(
      (msg) => new FunctionalError(FunctionalCodeError.TECHNICAL_ERROR, msg),
    )
    .run();
};

function getFilenameExtension(filename: string) {
  return filename.split(".").pop();
}
