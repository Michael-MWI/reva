module Route exposing
    ( CandidacyFilters
    , CertificationsFilters
    , Route(..)
    , emptyCandidacyFilters
    , fromUrl
    , href
    , toString
    )

import Admin.Enum.CandidacyStatusFilter as CandidacyStatusFilter exposing (CandidacyStatusFilter)
import Data.Candidacy exposing (candidacyIdFromString, candidacyIdToString)
import Html
import Html.Attributes
import Url
import Url.Builder
import Url.Parser as Parser exposing ((</>), (<?>), Parser, map, oneOf, s, string, top)
import Url.Parser.Query as Query
import View.Candidacy.Tab as Tab


type alias CandidacyFilters =
    { status : CandidacyStatusFilter, page : Int }


type alias CertificationsFilters =
    { organismId : Maybe String
    , page : Int
    }


type Route
    = Candidacy Tab.Tab
    | Candidacies CandidacyFilters
    | Home
    | Login
    | Logout
    | NotFound
    | SiteMap


emptyCandidacyFilters : CandidacyFilters
emptyCandidacyFilters =
    { status = CandidacyStatusFilter.ActiveHorsAbandon, page = 1 }


parser : String -> Parser (Route -> a) a
parser baseUrl =
    let
        candidacyTab value p =
            map (\rawId -> Candidacy { value = value, candidacyId = candidacyIdFromString rawId }) p

        topLevel topName p =
            s topName </> p

        subLevel topName path =
            topLevel topName (string </> s path)

        candidacyStatusStringToStatusFilter s =
            Maybe.withDefault CandidacyStatusFilter.ActiveHorsAbandon (CandidacyStatusFilter.fromString (Maybe.withDefault "" s))

        toCandidaciesRoute s p =
            Candidacies (CandidacyFilters (candidacyStatusStringToStatusFilter s) (p |> Maybe.andThen String.toInt |> Maybe.withDefault 1))
    in
    s baseUrl
        </> oneOf
                [ top |> map Home
                , s "auth" </> s "login" |> map Login
                , s "auth" </> s "logout" |> map Logout
                , s "plan-du-site" |> map SiteMap
                , s "candidacies" <?> Query.string "status" <?> Query.string "page" |> map toCandidaciesRoute
                , topLevel "candidacies" string |> candidacyTab Tab.Profile
                , subLevel "candidacies" "admissibility" |> candidacyTab Tab.Admissibility
                , subLevel "candidacies" "ready-for-jury-estimated-date" |> candidacyTab Tab.ReadyForJuryEstimatedDate
                , subLevel "candidacies" "dossier-de-validation" |> candidacyTab Tab.DossierDeValidation
                , subLevel "candidacies" "archive" |> candidacyTab Tab.Archive
                , subLevel "candidacies" "unarchive" |> candidacyTab Tab.Unarchive
                , subLevel "candidacies" "drop-out" |> candidacyTab Tab.DropOut
                , subLevel "candidacies" "cancel-drop-out" |> candidacyTab Tab.CancelDropOut
                , subLevel "candidacies" "funding" |> candidacyTab Tab.FundingRequest
                , subLevel "candidacies" "payment" |> candidacyTab Tab.PaymentRequest
                , subLevel "candidacies" "payment" </> s "confirmation" |> candidacyTab Tab.PaymentRequestConfirmation
                , subLevel "candidacies" "payment" </> s "uploads" |> candidacyTab Tab.PaymentUploads
                , subLevel "candidacies" "examInfo" |> candidacyTab Tab.ExamInfo
                , subLevel "candidacies" "jury" |> candidacyTab Tab.JuryDate
                , subLevel "candidacies" "jury" </> s "date" |> candidacyTab Tab.JuryDate
                , subLevel "candidacies" "jury" </> s "result" |> candidacyTab Tab.JuryResult
                , subLevel "candidacies" "feasibility" |> candidacyTab Tab.Feasibility
                ]


fromUrl : String -> Url.Url -> Route
fromUrl baseUrl url =
    Parser.parse (parser baseUrl) url
        |> Maybe.withDefault NotFound


href : String -> Route -> Html.Attribute msg
href baseUrl route =
    Html.Attributes.href <| toString baseUrl route


toString : String -> Route -> String
toString baseUrl route =
    let
        topLevel path params =
            Url.Builder.absolute (baseUrl :: path) params

        subLevel candidacyId path params =
            topLevel ([ "candidacies", candidacyIdToString candidacyId ] ++ path) params
    in
    case route of
        Home ->
            topLevel [ "" ] []

        Login ->
            topLevel [ "auth", "login" ] []

        Logout ->
            topLevel [ "auth", "logout" ] []

        NotFound ->
            topLevel [ "not-found" ] []

        SiteMap ->
            topLevel [ "plan-du-site" ] []

        Candidacies filters ->
            topLevel [ "candidacies" ]
                [ Url.Builder.string "status" (CandidacyStatusFilter.toString filters.status), Url.Builder.int "page" filters.page ]

        Candidacy tab ->
            tabToString topLevel subLevel tab


tabToString :
    (List String -> List Url.Builder.QueryParameter -> String)
    -> (Data.Candidacy.CandidacyId -> List String -> List Url.Builder.QueryParameter -> String)
    -> Tab.Tab
    -> String
tabToString topLevel subLevel tab =
    let
        default path =
            subLevel tab.candidacyId path []
    in
    case tab.value of
        Tab.Profile ->
            topLevel [ "candidacies", candidacyIdToString tab.candidacyId ] []

        Tab.Archive ->
            default [ "archive" ]

        Tab.Unarchive ->
            default [ "unarchive" ]

        Tab.DropOut ->
            default [ "drop-out" ]

        Tab.CancelDropOut ->
            default [ "cancel-drop-out" ]

        Tab.PaymentRequest ->
            default [ "payment" ]

        Tab.PaymentRequestConfirmation ->
            default [ "payment", "confirmation" ]

        Tab.PaymentUploads ->
            default [ "payment", "uploads" ]

        Tab.FundingRequest ->
            default [ "funding" ]

        Tab.Admissibility ->
            default [ "admissibility" ]

        Tab.ExamInfo ->
            default [ "examInfo" ]

        Tab.JuryDate ->
            default [ "jury", "date" ]

        Tab.JuryResult ->
            default [ "jury", "result" ]

        Tab.Feasibility ->
            default [ "feasibility" ]

        Tab.ReadyForJuryEstimatedDate ->
            default [ "ready-for-jury-estimated-date" ]

        Tab.DossierDeValidation ->
            default [ "dossier-de-validation" ]
