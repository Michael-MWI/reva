module View exposing (AlertType(..), alert, article, backLink, errors, image, infoBlock, infoHint, layout, logo, noNavLayout, noticeInfo, popupErrors, skeleton, stepper, summaryBlock, title, warningHint)

import Accessibility exposing (a, br, button, h3, h5, nav, p, span)
import Accessibility.Aria as Aria
import Html exposing (Html, div, h2, h6, img, node, text)
import Html.Attributes exposing (attribute, class, id, src)
import Html.Attributes.Extra exposing (role)
import Url.Builder
import View.Helpers exposing (dataTest)


title : String -> Html msg
title s =
    h2
        [ class "text-4xl font-medium text-gray-900 leading-none"
        , class "mt-6 mb-10"
        ]
        [ text s ]


image : List (Html.Attribute msg) -> String -> String -> Html msg
image attributes baseUrl imgName =
    img ((src <| Url.Builder.absolute [ baseUrl, imgName ] []) :: attributes) []


skeleton : String -> Html msg
skeleton extraClass =
    div
        [ class "animate-pulse bg-gray-100"
        , class extraClass
        ]
        []


baseLayout : List (Html msg) -> Html msg
baseLayout content =
    node "main"
        [ role "main"
        , class "flex relative"
        , class "md:bg-gradient-to-r from-[#557AFF] to-[#2400FF]"
        , id "content"
        ]
        [ div
            [ class "fr-container" ]
            [ div
                [ class "md:mt-16 fr-grid-row"
                , class "bg-white mb-12"
                ]
                content
            ]
        ]


layout : String -> List (Html msg) -> List (Html msg) -> Html msg
layout navButtonLabel navContent content =
    baseLayout
        [ div
            [ class "fr-col-12 fr-col-md-3 fr-col-lg-4" ]
            [ nav
                [ role "navigation"
                , attribute "aria-label" "Menu latéral"
                , class "fr-sidemenu bg-white"
                , class "h-full lg:pl-2 pr-0 py-2 md:py-6"
                ]
                [ div
                    [ class "h-full md:border-r mr-1 lg:mr-0" ]
                    [ div
                        [ class "fr-sidemenu__inner"
                        , class "shadow-none pr-0"
                        , class "h-full lg:pl-4 md:pb-24"
                        ]
                      <|
                        -- When the nav context is empty, we remove the wrapper.
                        -- As a result, on mobile, we can close the nav when browsing to a new page
                        if navContent == [] then
                            [ div [ class "h-12 mr-24 animate-pulse" ] [] ]

                        else
                            [ button
                                [ class "fr-sidemenu__btn"
                                , attribute "aria-controls" "fr-sidemenu-wrapper"
                                , attribute "aria-expanded" "false"
                                ]
                                [ text navButtonLabel ]
                            , div
                                [ class "fr-collapse"
                                , id "fr-sidemenu-wrapper"
                                ]
                                navContent
                            ]
                    ]
                ]
            ]
        , div
            [ class "fr-col-12 fr-col-md-9 fr-col-lg-8 pt-3 md:pt-0" ]
            content
        ]


noNavLayout : List (Html msg) -> Html msg
noNavLayout content =
    baseLayout
        [ div
            [ class "bg-white sm:shadow"
            , class "fr-col-12 mb-24"
            ]
            content
        ]


article : String -> Html.Attribute Never -> String -> List (Accessibility.Html msg) -> Html msg
article dataTestValue backLinkRoute backLinkLabel content =
    div
        [ class "bg-white px-4 pt-0 sm:px-8 sm:pt-6"
        , dataTest dataTestValue
        ]
        [ backLink backLinkRoute backLinkLabel
        , Accessibility.article [ class "mt-6" ] content
        ]


errors : List String -> Html msg
errors l =
    div [ class "text-red-500", role "alert" ] <| List.map (\e -> div [] [ text e ]) l


popupErrors : List String -> Html msg
popupErrors messages =
    case messages of
        [] ->
            text ""

        _ ->
            div
                [ class "fixed z-[1000] top-12 sm:top-6 inset-x-0 pointer-events-none"
                , class "w-full flex flex-col items-center justify-center"
                ]
                [ div
                    [ class "mx-2 bg-white max-w-2xl"
                    , class "fr-alert fr-alert--error fr-alert--sm"
                    , role "alert"
                    ]
                  <|
                    h3 [ class "fr-alert__title" ] [ text "Une erreur est survenue" ]
                        :: List.map
                            (\error -> p [] [ text error ])
                            messages
                ]


backLink : Html.Attribute Never -> String -> Accessibility.Html msg
backLink linkAttribute label =
    a
        [ linkAttribute
        , class "fr-link fr-fi-arrow-left-line fr-link--icon-left"
        , class "my-4 text-lg"
        ]
        [ text label ]


infoBlock : String -> List (Html msg) -> Html msg
infoBlock label contents =
    div [ class "mb-6 px-6 py-6 bg-neutral-100" ] <|
        h3 [ class "text-2xl font-bold mb-2" ] [ text label ]
            :: contents


infoHint : String -> Html msg
infoHint label =
    p [ class "flex text-xs text-dsfrBlue-400" ]
        [ span [ class "fr-icon-info-fill fr-icon--sm mr-1", Aria.hidden True ] []
        , text label
        ]


warningHint : String -> Html msg
warningHint label =
    p [ class "flex text-xs text-dsfrOrange-500" ]
        [ span [ class "fr-icon-warning-fill fr-icon--sm mr-1", Aria.hidden True ] []
        , text label
        ]


logo : Accessibility.Html msg
logo =
    p [ class "fr-logo" ] [ text "République", br [], text "française" ]


summaryBlock : String -> List (Html msg) -> Html msg
summaryBlock titleValue content =
    div
        [ class "bg-neutral-100 px-8 pt-6 pb-8 w-full" ]
    <|
        if titleValue == "" then
            content

        else
            h5
                [ class "text-2xl mb-4" ]
                [ text titleValue ]
                :: content


noticeInfo : List (Html.Attribute msg) -> List (Html msg) -> Html msg
noticeInfo attributes content =
    div
        (class "fr-notice fr-notice--info" :: attributes)
        [ div
            [ class "fr-container" ]
            [ div
                [ class "fr-notice__body" ]
                [ div
                    [ class "fr-notice__title" ]
                    content
                ]
            ]
        ]


type AlertType
    = Warning
    | Error
    | Success
    | Info


alert : AlertType -> List (Html.Attribute msg) -> String -> List (Html msg) -> Html msg
alert alertType attributes alertTitle content =
    let
        alertClass =
            case alertType of
                Warning ->
                    "fr-alert--warning"

                Error ->
                    "fr-alert--error"

                Success ->
                    "fr-alert--success"

                Info ->
                    "fr-alert--info"
    in
    div
        ([ class ("fr-alert " ++ alertClass), role "alert" ]
            ++ attributes
        )
    <|
        h6
            []
            [ text alertTitle ]
            :: content


stepper :
    { currentStep : Int
    , totalSteps : Int
    , currentTitle : String
    , nextTitle : Maybe String
    }
    -> Html msg
stepper config =
    div
        [ class "fr-stepper" ]
        [ h2
            [ class "fr-stepper__title" ]
            [ span
                [ class "fr-stepper__state" ]
                [ text "Étape "
                , text (String.fromInt config.currentStep)
                , text " sur "
                , text (String.fromInt config.totalSteps)
                ]
            , text config.currentTitle
            ]
        , div
            [ class "fr-stepper__steps"
            , attribute "data-fr-current-step" (String.fromInt config.currentStep)
            , attribute "data-fr-steps" (String.fromInt config.totalSteps)
            ]
            []
        , case config.nextTitle of
            Just nextTitle ->
                p
                    [ class "fr-stepper__details" ]
                    [ span [ class "fr-text--bold" ] [ text "Étape suivante : " ]
                    , text nextTitle
                    ]

            Nothing ->
                text ""
        ]
