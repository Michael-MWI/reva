module Api.Form.PaymentUploadsAndConfirmationUniFvae exposing (submit)

import Api.Token exposing (Token)
import Data.Candidacy exposing (CandidacyId)
import Data.Form exposing (FormData)
import Data.Form.PaymentUploadsAndConfirmationUniFvae
import Data.Referential
import Http
import RemoteData exposing (RemoteData(..))
import Task


submit :
    CandidacyId
    -> String
    -> String
    -> Token
    -> (RemoteData (List String) () -> msg)
    -> ( Data.Candidacy.Candidacy, Data.Referential.Referential )
    -> FormData
    -> Cmd msg
submit candidacyId restApiEndpoint _ token toMsg ( _, _ ) formData =
    let
        keys =
            Data.Form.PaymentUploadsAndConfirmationUniFvae.keys

        invoiceFiles =
            Data.Form.getFiles keys.invoiceFiles formData
                |> List.map (\( _, file ) -> ( "invoice", file ))

        certificateOfAttendanceFiles =
            Data.Form.getFiles keys.certificateOfAttendanceFiles formData
                |> List.map (\( _, file ) -> ( "certificateOfAttendance", file ))

        withFiles files body =
            files
                |> List.map (\( name, file ) -> Http.filePart name file)
                |> (++) body

        post files =
            Http.request
                { method = "POST"
                , headers = [ Http.header "authorization" ("Bearer " ++ Api.Token.toString token) ]
                , url = restApiEndpoint ++ "/payment-request-unifvae/confirmation"
                , body =
                    [ Http.stringPart "candidacyId" (Data.Candidacy.candidacyIdToString candidacyId) ]
                        |> withFiles files
                        |> Http.multipartBody
                , expect = mayExpectError (RemoteData.fromResult >> toMsg)
                , timeout = Nothing
                , tracker = Nothing
                }

        error msg =
            Task.succeed (RemoteData.Failure [ msg ])
                |> Task.perform toMsg
    in
    case ( invoiceFiles, certificateOfAttendanceFiles ) of
        ( [ invoiceFile ], [ certificateOfAttendanceFile ] ) ->
            post [ invoiceFile, certificateOfAttendanceFile ]

        ( [ _ ], [] ) ->
            error "Veuillez choisir une attestation de présence."

        ( [], [ _ ] ) ->
            error "Veuillez choisir une facture."

        ( [], [] ) ->
            error "Veuillez choisir une facture et une attestation de présence."

        ( _, _ ) ->
            error "Vous ne pouvez pas envoyer plus d'une facture et plus d'une attestation de présence."


mayExpectError : (Result (List String) () -> msg) -> Http.Expect msg
mayExpectError toMsg =
    Http.expectStringResponse toMsg <|
        \response ->
            case response of
                Http.BadStatus_ metadata errorBody ->
                    if metadata.statusCode == 413 then
                        Err [ "Le fichier que vous tentez d'envoyer est trop volumineux. Veuillez soumettre un fichier d'une taille inférieure à 10 Mo." ]

                    else
                        Err [ errorBody ]

                Http.GoodStatus_ _ _ ->
                    Ok ()

                _ ->
                    Err [ "Une erreur est survenue" ]
