module Page.Form.DropOut exposing (..)

import Data.Candidacy exposing (Candidacy)
import Data.Form exposing (FormData)
import Data.Form.DropOut
import Data.Form.Helper
import Data.Referential exposing (Referential)
import Html exposing (p, text)
import Html.Attributes exposing (class)
import List.Extra
import Page.Form as Form exposing (Element(..), Form)
import View exposing (AlertType(..))


form : FormData -> ( Candidacy, Referential ) -> Form
form _ ( candidacy, referential ) =
    let
        keys =
            Data.Form.DropOut.keys

        dropOutReasons =
            List.filter (\dr -> dr.isActive) referential.dropOutReasons |> Data.Form.Helper.toIdList

        maybeDropOutOtherReasonValue =
            List.Extra.find (\reason -> reason.label == "Autre") referential.dropOutReasons
                |> Maybe.map .id

        displayDropOutWarning =
            candidacy.dropOutDate == Nothing
    in
    { elements =
        [ ( "info"
          , Form.StaticHtml <|
                if displayDropOutWarning then
                    View.alert View.Info
                        [ class "mb-10" ]
                        ""
                        [ p []
                            [ text "Si vous déclarez l’abandon du candidat il ne pourra plus re-candidater dans le cadre de France VAE"
                            ]
                        , p [] [ text "Si le cas d’abandon n’est pas listé ci-dessous, privilégiez la suppression de la candidature." ]
                        ]

                else
                    text ""
          )
        , ( keys.dropOutReason, Form.Select "Quelle est la raison de l'abandon ?" dropOutReasons )
        , ( keys.otherReasonContent
          , maybeDropOutOtherReasonValue
                |> Maybe.map (\reason -> Form.SelectOther "dropOutReason" reason "Autre raison")
                |> Maybe.withDefault Form.Empty
          )
        , ( keys.droppedOutAt, Form.Date "Date (optionnel)" )
        ]
    , saveLabel = Nothing
    , submitLabel = "Enregistrer"
    , title = "Abandon du candidat"
    }
