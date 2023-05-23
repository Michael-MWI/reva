module View.Candidacy.Filters exposing (Filters, view)

import Admin.Enum.CandidacyStatusFilter as CandidacyStatusFilter exposing (CandidacyStatusFilter)
import Admin.Enum.CandidacyStatusStep exposing (CandidacyStatusStep(..))
import Data.Candidacy as Candidacy exposing (CandidacyCountByStatus, candidacyStatusFilterToReadableString)
import Data.Context exposing (Context)
import Html exposing (Html, a, div, label, li, span, text, ul)
import Html.Attributes exposing (class, classList, id)
import Route


type alias Filters =
    { search : Maybe String
    , status : CandidacyStatusFilter
    }


view :
    CandidacyCountByStatus
    -> Filters
    -> Context
    -> List (Html msg)
view candidacyCountByStatus filters context =
    let
        count : CandidacyStatusFilter -> Int
        count status =
            case status of
                CandidacyStatusFilter.ActiveHorsAbandon ->
                    candidacyCountByStatus.activeHorsAbandon

                CandidacyStatusFilter.Abandon ->
                    candidacyCountByStatus.abandon

                CandidacyStatusFilter.ReorienteeHorsAbandon ->
                    candidacyCountByStatus.reorienteeHorsAbandon

                CandidacyStatusFilter.ArchiveHorsAbandonHorsReorientation ->
                    candidacyCountByStatus.archiveHorsAbandonHorsReorientation

                CandidacyStatusFilter.DemandePaiementEnvoyeeHorsAbandon ->
                    candidacyCountByStatus.demandePaiementEnvoyeHorsAbandon

                CandidacyStatusFilter.DemandeFinancementEnvoyeHorsAbandon ->
                    candidacyCountByStatus.demandeFinancementEnvoyeHorsAbandon

                CandidacyStatusFilter.ParcoursConfirmeHorsAbandon ->
                    candidacyCountByStatus.parcourConfirmeHorsAbandon

                CandidacyStatusFilter.ParcoursEnvoyeHorsAbandon ->
                    candidacyCountByStatus.parcoursEnvoyeHorsAbandon

                CandidacyStatusFilter.PriseEnChargeHorsAbandon ->
                    candidacyCountByStatus.priseEnChargeHorsAbandon

                CandidacyStatusFilter.ValidationHorsAbandon ->
                    candidacyCountByStatus.validationHorsAbandon

                CandidacyStatusFilter.ProjetHorsAbandon ->
                    candidacyCountByStatus.projetHorsAbandon

        link status label =
            viewLink context filters (count status) status label

        statuses : List CandidacyStatusFilter
        statuses =
            [ CandidacyStatusFilter.ValidationHorsAbandon
            , CandidacyStatusFilter.PriseEnChargeHorsAbandon
            , CandidacyStatusFilter.ParcoursEnvoyeHorsAbandon
            , CandidacyStatusFilter.ParcoursConfirmeHorsAbandon
            , CandidacyStatusFilter.DemandeFinancementEnvoyeHorsAbandon
            , CandidacyStatusFilter.DemandePaiementEnvoyeeHorsAbandon
            ]

        viewFilter : CandidacyStatusFilter -> Html msg
        viewFilter status =
            link status (candidacyStatusFilterToReadableString status)
    in
    [ ul
        [ class "font-semibold text-gray-900 py-2"
        , class "fr-sidemenu__list"
        ]
        [ viewFilter CandidacyStatusFilter.ActiveHorsAbandon
        , li
            []
            [ ul
                [ class "ml-3 font-normal" ]
              <|
                List.map viewFilter statuses
            ]
        , viewFilter CandidacyStatusFilter.Abandon
        , viewFilter CandidacyStatusFilter.ReorienteeHorsAbandon
        , viewFilter CandidacyStatusFilter.ArchiveHorsAbandonHorsReorientation
        , viewFilter CandidacyStatusFilter.ProjetHorsAbandon
        ]
    ]


viewLink : Context -> Filters -> Int -> CandidacyStatusFilter -> String -> Html msg
viewLink context filters count statusFilter label =
    let
        isSelected =
            filters.status == statusFilter
    in
    li
        []
        [ a
            [ class "block group my-4 py-1 px-2"
            , class "flex items-start justify-between transition"
            , class "border-l-2 border-transparent"
            , classList
                [ ( "text-blue-900 border-blue-900"
                  , isSelected
                  )
                , ( "hover:text-blue-900"
                  , not isSelected
                  )
                ]
            , Route.href context.baseUrl <|
                Route.Candidacies { status = statusFilter }
            ]
            [ text label, viewCount count ]
        ]


viewCount : Int -> Html msg
viewCount count =
    text <| String.concat [ " (", String.fromInt count, ")" ]
