module Page.Candidacy exposing
    ( Model
    , Msg
    , init
    , resetSelected
    , update
    , updateTab
    , view
    )

import Accessibility exposing (h1, h4)
import Admin.Enum.CandidacyStatusStep as Step
import Admin.Enum.DossierDeValidationDecision as DossierDeValidationDecision
import Admin.Enum.FinanceModule as FinanceModule
import Api.Candidacy
import Api.Form.Admissibility
import Api.Form.Archive
import Api.Form.CancelDropOut
import Api.Form.DossierDeValidation
import Api.Form.DropOut
import Api.Form.ExamInfo
import Api.Form.Feasibility
import Api.Form.PaymentRequestUniFvae
import Api.Form.PaymentRequestUniReva
import Api.Form.PaymentUploadsAndConfirmationUniFvae
import Api.Form.PaymentUploadsUniReva
import Api.Form.ReadyForJuryEstimatedDate
import Api.Form.Unarchive
import Api.Referential
import Api.Token
import BetaGouv.DSFR.Button as Button
import Browser.Navigation as Nav
import Data.Candidacy as Candidacy exposing (Candidacy, CandidacyId, candidacyIdToString)
import Data.Context exposing (Context)
import Data.DossierDeValidation
import Data.Feasibility
import Data.Form.Archive
import Data.Form.CancelDropOut
import Data.Form.DossierDeValidation
import Data.Form.DropOut
import Data.Form.Feasibility
import Data.Form.PaymentRequestUniFvae
import Data.Form.PaymentRequestUniReva
import Data.Form.PaymentUploadsAndConfirmationUniFvae
import Data.Form.ReadyForJuryEstimatedDate
import Data.Form.Unarchive
import Data.Referential exposing (Referential)
import Html exposing (Html, div, h2, p, text)
import Html.Attributes exposing (alt, attribute, class, name)
import Html.Attributes.Extra exposing (role)
import Page.Form as Form
import Page.Form.Admissibility
import Page.Form.Archive
import Page.Form.CancelDropOut
import Page.Form.DossierDeValidation
import Page.Form.DropOut
import Page.Form.ExamInfo
import Page.Form.Feasibility
import Page.Form.PaymentRequestUniFvae
import Page.Form.PaymentRequestUniReva
import Page.Form.PaymentUploadsAndConfirmationUniFvae
import Page.Form.PaymentUploadsUniReva
import Page.Form.ReadyForJuryEstimatedDate
import Page.Form.Unarchive
import RemoteData exposing (RemoteData(..))
import Route
import String exposing (String)
import View
import View.Candidacy
import View.Candidacy.NavigationSteps as NavigationSteps
import View.Candidacy.Tab exposing (Tab, Value(..))
import View.Candidate
import View.Date as Date
import View.Feasibility.Decision
import View.FileLink exposing (viewFileLink)
import View.Tabs


type Msg
    = GotCandidacyResponse (RemoteData (List String) Candidacy)
    | GotCandidacyDeletionResponse (RemoteData (List String) String)
    | GotCandidacyArchivingResponse (RemoteData (List String) ())
    | GotCandidacyUnarchivingResponse (RemoteData (List String) ())
    | GotCandidacyTakingOverResponse (RemoteData (List String) ())
    | GotFormMsg (Form.Msg ( Candidacy, Referential ))
    | GotReferentialResponse (RemoteData (List String) Referential)


type alias State =
    { referential : RemoteData (List String) Referential
    }


type alias Model =
    { form : Form.Model ( Candidacy, Referential )
    , selected : RemoteData (List String) Candidacy
    , state : State
    , tab : Tab
    }


init : Context -> Tab -> ( Model, Cmd Msg )
init context tab =
    let
        ( formModel, formCmd ) =
            Form.init

        defaultModel : Model
        defaultModel =
            { form = formModel
            , selected = NotAsked
            , state = { referential = RemoteData.NotAsked }
            , tab = tab
            }

        defaultCmd =
            Cmd.batch
                [ Api.Referential.get context.endpoint context.token GotReferentialResponse
                , Cmd.map GotFormMsg formCmd
                ]
    in
    ( defaultModel, defaultCmd )
        |> updateTab context tab


initCandidacy : Context -> CandidacyId -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
initCandidacy context candidacyId ( model, cmd ) =
    ( { model | selected = Loading }
    , Cmd.batch [ Api.Candidacy.get context.endpoint context.token GotCandidacyResponse candidacyId, cmd ]
    )


resetSelected : ( Model, Cmd msg ) -> ( Model, Cmd msg )
resetSelected ( model, cmd ) =
    ( { model | selected = NotAsked }, cmd )


withReferential : RemoteData (List String) Referential -> State -> State
withReferential referential state =
    { state | referential = referential }



-- VIEW


view :
    Context
    -> Model
    -> Html Msg
view context model =
    let
        newCandidacySummaryPageActive =
            List.member "NEW_CANDIDACY_SUMMARY_PAGE" context.activeFeatures

        urlAndTarget =
            if newCandidacySummaryPageActive then
                ( context.adminReactUrl ++ "/candidacies/" ++ candidacyIdToString model.tab.candidacyId ++ "/summary", "_self" )

            else
                ( Route.toString context.baseUrl (Route.Candidacy (Tab model.tab.candidacyId View.Candidacy.Tab.Profile)), "" )

        viewArticle name c =
            View.article
                name
                (Tuple.first urlAndTarget)
                "Aperçu de la candidature"
                c

        viewWithTabs name title tabs activeTabContent =
            viewArticle name
                [ h1 [ class "text-dsfrBlack-500 text-4xl mb-8" ] [ text title ]
                , View.Tabs.view tabs activeTabContent
                ]

        viewFormWithTabs name title tabs =
            let
                remoteReferential =
                    RemoteData.map2 Tuple.pair model.selected model.state.referential
            in
            viewWithTabs name
                title
                tabs
                [ Form.view remoteReferential model.form |> Html.map GotFormMsg ]

        viewForm name =
            viewArticle
                name
                [ Form.view (RemoteData.map2 Tuple.pair model.selected model.state.referential) model.form
                    |> Html.map GotFormMsg
                ]

        candidacyLink candidacyId tab =
            Route.toString context.baseUrl (Route.Candidacy <| Tab candidacyId tab)

        displayWithCandidacy f =
            case model.selected of
                Success candidacy ->
                    f candidacy

                _ ->
                    div [ class "h-[800px]" ] []

        readyForJuryEstimatedDate candidacyId isActive =
            { label = "Date prévisionnelle"
            , href = candidacyLink candidacyId ReadyForJuryEstimatedDate
            , isActive = isActive
            }

        dossierValidationTab candidacyId isActive =
            { label = "Dépôt du dossier"
            , href = candidacyLink candidacyId DossierDeValidation
            , isActive = isActive
            }

        juryDateTab candidacyId isActive =
            { label = "Date de jury"
            , href = candidacyLink candidacyId JuryDate
            , isActive = isActive
            }

        juryResultTab candidacyId isActive =
            { label = "Résultat"
            , href = candidacyLink candidacyId JuryResult
            , isActive = isActive
            }

        content =
            case model.tab.value of
                Archive ->
                    viewForm "archive"

                Unarchive ->
                    viewForm "unarchive"

                DropOut ->
                    viewForm "drop-out"

                CancelDropOut ->
                    viewForm "cancel-drop-out"

                FundingRequest ->
                    case model.selected of
                        Success candidacy ->
                            viewForm "funding"

                        _ ->
                            div [] []

                PaymentRequest ->
                    case model.selected of
                        Success candidacy ->
                            case candidacy.financeModule of
                                FinanceModule.Unireva ->
                                    viewForm "payment"

                                FinanceModule.Unifvae ->
                                    viewForm "payment"

                        _ ->
                            div [] []

                PaymentRequestConfirmation ->
                    viewForm "payment-confirmation"

                PaymentUploads ->
                    viewForm "payment-uploads"

                Profile ->
                    viewCandidacyPanel context model

                Admissibility ->
                    viewForm "admissibility"

                ReadyForJuryEstimatedDate ->
                    displayWithCandidacy <|
                        \candidacy ->
                            viewFormWithTabs "readyForJuryEstimatedDate"
                                "Dossier de validation"
                                [ readyForJuryEstimatedDate candidacy.id True
                                , dossierValidationTab candidacy.id False
                                ]

                DossierDeValidation ->
                    displayWithCandidacy <|
                        \candidacy ->
                            let
                                viewDossierDeValidationForm =
                                    viewFormWithTabs "readyForJuryEstimatedDate"
                                        "Dossier de validation"
                                        [ readyForJuryEstimatedDate candidacy.id False
                                        , dossierValidationTab candidacy.id True
                                        ]
                            in
                            case candidacy.activeDossierDeValidation of
                                Just dossierDeValidation ->
                                    case dossierDeValidation.decision of
                                        DossierDeValidationDecision.Pending ->
                                            viewMain context "dossier-de-validation-sent" <|
                                                viewDossierDeValidationSent context candidacy dossierDeValidation

                                        _ ->
                                            viewDossierDeValidationForm

                                Nothing ->
                                    viewDossierDeValidationForm

                ExamInfo ->
                    viewForm "examInfo"

                JuryDate ->
                    displayWithCandidacy <|
                        \candidacy ->
                            viewWithTabs "jury"
                                "Jury"
                                [ juryDateTab candidacy.id True
                                , juryResultTab candidacy.id False
                                ]
                                []

                JuryResult ->
                    displayWithCandidacy <|
                        \candidacy ->
                            viewWithTabs "jury"
                                "Jury"
                                [ juryDateTab candidacy.id False
                                , juryResultTab candidacy.id True
                                ]
                                []

                Feasibility ->
                    case model.selected of
                        Success candidacy ->
                            case candidacy.feasibility of
                                Just feasibility ->
                                    case feasibility.decision of
                                        Data.Feasibility.Incomplete _ ->
                                            viewForm "feasibility"

                                        _ ->
                                            viewMain context "feasibility-sent" <|
                                                viewFeasibilitySent context candidacy feasibility

                                Nothing ->
                                    viewForm "feasibility"

                        _ ->
                            viewForm "feasibility"
    in
    View.layout context
        "Accéder aux étapes du parcours"
        (NavigationSteps.view model.selected)
        [ content ]


viewFeasibilitySent : Context -> Candidacy -> Data.Feasibility.Feasibility -> List (Html msg)
viewFeasibilitySent context candidacy feasibility =
    let
        feasibilityFileNameAndUrl =
            ( feasibility.file.name, feasibility.file.url )

        iDFileNameAndUrl =
            case feasibility.iDFile of
                Just iDFile ->
                    ( iDFile.name, iDFile.url )

                Nothing ->
                    ( "", "" )

        documentaryProofFileNameAndUrl =
            case feasibility.documentaryProofFile of
                Just documentaryProofFile ->
                    ( documentaryProofFile.name, documentaryProofFile.url )

                Nothing ->
                    ( "", "" )

        certificateOfAttendancefFileNameAndUrl =
            case feasibility.certificateOfAttendanceFile of
                Just certificateOfAttendanceFile ->
                    ( certificateOfAttendanceFile.name, certificateOfAttendanceFile.url )

                Nothing ->
                    ( "", "" )

        subTitle s =
            h2
                [ class "text-2xl mb-3" ]
                [ text s ]
    in
    [ h1 [] [ text "Dossier de faisabilité" ]
    , div
        [ class "flex flex-col gap-y-8 mb-10" ]
        [ View.Candidate.viewWithCertification
            (candidacy.certification |> Maybe.map .label)
            candidacy.candidate
        , div []
            [ subTitle "Décision prise concernant ce dossier"
            , div [ class "bg-neutral-100 text-lg px-8 pt-6 pb-8 w-full" ] [ View.Feasibility.Decision.view feasibility ]
            ]
        , viewFileLink context (Tuple.first feasibilityFileNameAndUrl) (Tuple.second feasibilityFileNameAndUrl)
        , viewFileLink context (Tuple.first iDFileNameAndUrl) (Tuple.second iDFileNameAndUrl)
        , viewFileLink context (Tuple.first documentaryProofFileNameAndUrl) (Tuple.second documentaryProofFileNameAndUrl)
        , viewFileLink context (Tuple.first certificateOfAttendancefFileNameAndUrl) (Tuple.second certificateOfAttendancefFileNameAndUrl)
        , feasibility.certificationAuthority
            |> Maybe.map View.Candidate.viewCertificationAuthority
            |> Maybe.withDefault (text "")
        , if List.length feasibility.history == 0 then
            text ""

          else
            div []
                [ if List.length feasibility.history == 1 then
                    subTitle "Décision précédente"

                  else
                    subTitle "Décisions précédentes"
                , View.summaryBlockWithItems (List.map View.Feasibility.Decision.view feasibility.history)
                ]
        ]
    ]


viewDossierDeValidationSent : Context -> Candidacy -> Data.DossierDeValidation.DossierDeValidation -> List (Html msg)
viewDossierDeValidationSent context candidacy dossierDeValidation =
    let
        dossierDeValidationFileNameAndUrl =
            ( dossierDeValidation.dossierDeValidationFile.name, dossierDeValidation.dossierDeValidationFile.url )
    in
    [ h1 [] [ text "Dossier de validation" ]
    , div
        [ class "flex flex-col gap-y-8 mb-6" ]
        ([ View.alert View.Success
            [ class "my-8" ]
            "Dossier de validation envoyé"
            [ p [] [ text "Le dossier de validation a été envoyé. Retrouvez ci-dessous les documents qui le composent." ]
            ]
         , p [] [ text ("Dossier envoyé le : " ++ Date.toSmallFormat dossierDeValidation.dossierDeValidationSentAt) ]
         , h4 [ class "text-[18px] mb-0" ] [ text "Contenu du dossier" ]
         , viewFileLink context (Tuple.first dossierDeValidationFileNameAndUrl) (Tuple.second dossierDeValidationFileNameAndUrl)
         ]
            ++ List.map (\d -> viewFileLink context d.name d.url) dossierDeValidation.dossierDeValidationOtherFiles
        )
    ]


viewCandidacyPanel : Context -> Model -> Html Msg
viewCandidacyPanel context model =
    viewMain context "profile" <|
        case model.selected of
            NotAsked ->
                []

            Loading ->
                [ View.skeleton "mt-6 mb-10 w-full sm:w-96 h-8"
                , View.skeleton "mb-12 w-full w-96 h-5"
                , View.skeleton "w-full h-32 mb-6"
                , View.skeleton "w-full h-64 mb-6"
                , View.skeleton "w-full h-64 mb-12"
                ]

            Failure errors ->
                List.map text errors

            Success candidacy ->
                View.Candidacy.view
                    context
                    { candidacy = candidacy
                    , referential = model.state.referential
                    }


viewMain : Context -> String -> List (Html msg) -> Html msg
viewMain context dataTest content =
    View.article
        dataTest
        (Route.toString context.baseUrl (Route.Candidacies Route.emptyCandidacyFilters))
        "Toutes les candidatures"
        content



-- UPDATE


update : Context -> Msg -> Model -> ( Model, Cmd Msg )
update context msg model =
    case msg of
        GotCandidacyResponse remoteCandidacy ->
            ( { model | selected = remoteCandidacy }, Cmd.none )
                |> updateTab context model.tab

        GotCandidacyDeletionResponse (Failure err) ->
            ( { model | selected = Failure err }, Cmd.none )

        GotCandidacyDeletionResponse _ ->
            ( { model | selected = NotAsked }, Cmd.none )

        GotCandidacyArchivingResponse _ ->
            ( { model | selected = NotAsked }, Cmd.none )

        GotCandidacyUnarchivingResponse _ ->
            ( { model | selected = NotAsked }, Cmd.none )

        GotCandidacyTakingOverResponse _ ->
            ( model, Cmd.none )

        GotFormMsg formMsg ->
            let
                ( formModel, formCmd ) =
                    Form.update context formMsg model.form
            in
            ( { model | form = formModel }, Cmd.map GotFormMsg formCmd )

        GotReferentialResponse remoteReferentials ->
            ( { model | state = model.state |> withReferential remoteReferentials }
            , Cmd.none
            )


updateTab : Context -> Tab -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
updateTab context tab ( model, cmd ) =
    let
        newModel =
            { model | tab = tab }

        candidacyTab tabValue =
            Route.Candidacy (Tab tab.candidacyId tabValue)

        pushUrl tabValue =
            Nav.pushUrl
                context.navKey
                (Route.toString context.baseUrl tabValue)

        newCandidacySummaryPageActive =
            List.member "NEW_CANDIDACY_SUMMARY_PAGE" context.activeFeatures

        redirectToProfile =
            if newCandidacySummaryPageActive then
                Nav.load (context.adminReactUrl ++ "/candidacies/" ++ candidacyIdToString tab.candidacyId ++ "/summary")

            else
                pushUrl <| candidacyTab Profile
    in
    case ( tab.value, model.selected ) of
        ( View.Candidacy.Tab.Archive, Success candidacy ) ->
            let
                formStatus =
                    if Candidacy.lastStatus candidacy.statuses == Step.Archive then
                        Form.ReadOnly

                    else
                        Form.Editable

                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.Archive.form formStatus
                        , onLoad = Just <| Api.Form.Archive.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.Archive.archive tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.Archive.validate
                        , status = formStatus
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.Unarchive, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.Unarchive.form
                        , onLoad = Just <| Api.Form.Unarchive.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.Unarchive.unarchive tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.Unarchive.validate
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.DropOut, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.DropOut.form
                        , onLoad = Just <| Api.Form.DropOut.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.DropOut.dropOut tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.DropOut.validate
                        , status =
                            if candidacy.dropOutDate /= Nothing then
                                Form.ReadOnly

                            else
                                Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.CancelDropOut, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.CancelDropOut.form
                        , onLoad = Just <| Api.Form.CancelDropOut.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.CancelDropOut.cancelDropOut tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.CancelDropOut.validate
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.ReadyForJuryEstimatedDate, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.ReadyForJuryEstimatedDate.form
                        , onLoad = Just <| Api.Form.ReadyForJuryEstimatedDate.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.ReadyForJuryEstimatedDate.set tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.ReadyForJuryEstimatedDate.validate
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.DossierDeValidation, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.DossierDeValidation.form
                        , onLoad = Nothing
                        , onSave = Nothing
                        , onSubmit = Api.Form.DossierDeValidation.submit tab.candidacyId context.restApiEndpoint
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.DossierDeValidation.validate
                        , status =
                            Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.PaymentRequest, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    if candidacy.financeModule == FinanceModule.Unifvae then
                        Form.updateForm context
                            { form = Page.Form.PaymentRequestUniFvae.form candidacy.certification
                            , onLoad = Just <| Api.Form.PaymentRequestUniFvae.get tab.candidacyId
                            , onSave = Nothing
                            , onSubmit = Api.Form.PaymentRequestUniFvae.createOrUpdate tab.candidacyId
                            , onRedirect = pushUrl <| candidacyTab PaymentUploads
                            , onValidate = Data.Form.PaymentRequestUniFvae.validate
                            , status =
                                if Candidacy.isPaymentRequestSent candidacy then
                                    Form.ReadOnly

                                else
                                    Form.Editable
                            }
                            model.form

                    else
                        Form.updateForm context
                            { form = Page.Form.PaymentRequestUniReva.form candidacy.certification
                            , onLoad = Just <| Api.Form.PaymentRequestUniReva.get tab.candidacyId
                            , onSave = Nothing
                            , onSubmit = Api.Form.PaymentRequestUniReva.createOrUpdate tab.candidacyId
                            , onRedirect = pushUrl <| candidacyTab PaymentUploads
                            , onValidate = Data.Form.PaymentRequestUniReva.validate
                            , status =
                                if Candidacy.isPaymentRequestSent candidacy then
                                    Form.ReadOnly

                                else
                                    Form.Editable
                            }
                            model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.PaymentUploads, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    if candidacy.financeModule == FinanceModule.Unifvae then
                        Form.updateForm context
                            { form =
                                Page.Form.PaymentUploadsAndConfirmationUniFvae.form
                                    { backUrl =
                                        Route.toString context.baseUrl <|
                                            Route.Candidacy (Tab candidacy.id View.Candidacy.Tab.PaymentRequest)
                                    }
                            , onLoad = Just <| Api.Form.PaymentRequestUniFvae.get tab.candidacyId
                            , onSave = Nothing
                            , onSubmit = Api.Form.PaymentUploadsAndConfirmationUniFvae.submit tab.candidacyId context.restApiEndpoint
                            , onRedirect = redirectToProfile
                            , onValidate = Data.Form.PaymentUploadsAndConfirmationUniFvae.validateConfirmation
                            , status = Form.Editable
                            }
                            model.form

                    else
                        Form.updateForm context
                            { form = Page.Form.PaymentUploadsUniReva.form
                            , onLoad = Nothing
                            , onSave = Nothing
                            , onSubmit = Api.Form.PaymentUploadsUniReva.submit tab.candidacyId context.restApiEndpoint
                            , onRedirect = pushUrl <| candidacyTab PaymentRequestConfirmation
                            , onValidate = \_ _ -> Ok ()
                            , status = Form.Editable
                            }
                            model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.PaymentRequestConfirmation, Success _ ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.PaymentRequestUniReva.confirmationForm
                        , onLoad = Just <| Api.Form.PaymentRequestUniReva.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.PaymentRequestUniReva.confirm tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = Data.Form.PaymentRequestUniReva.validateConfirmation
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.Admissibility, Success _ ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.Admissibility.form
                        , onLoad = Just <| Api.Form.Admissibility.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.Admissibility.update tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = \_ _ -> Ok ()
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.Feasibility, Success candidacy ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.Feasibility.form
                        , onLoad = Nothing
                        , onSave = Nothing
                        , onSubmit = Api.Form.Feasibility.submit tab.candidacyId candidacy.certificationAuthorities context.restApiEndpoint
                        , onRedirect = pushUrl <| candidacyTab Feasibility
                        , onValidate = Data.Form.Feasibility.validateSubmittedFiles
                        , status =
                            if (candidacy.feasibility /= Nothing && not (Candidacy.isStatusEqual candidacy Step.DossierFaisabiliteIncomplet)) || List.isEmpty candidacy.certificationAuthorities then
                                Form.ReadOnly

                            else
                                Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( View.Candidacy.Tab.Profile, NotAsked ) ->
            initCandidacy context tab.candidacyId ( newModel, cmd )
                |> withTakeOver context tab.candidacyId

        ( View.Candidacy.Tab.ExamInfo, Success _ ) ->
            let
                ( formModel, formCmd ) =
                    Form.updateForm context
                        { form = Page.Form.ExamInfo.form
                        , onLoad = Just <| Api.Form.ExamInfo.get tab.candidacyId
                        , onSave = Nothing
                        , onSubmit = Api.Form.ExamInfo.update tab.candidacyId
                        , onRedirect = redirectToProfile
                        , onValidate = \_ _ -> Ok ()
                        , status = Form.Editable
                        }
                        model.form
            in
            ( { newModel | form = formModel }, Cmd.map GotFormMsg formCmd )

        ( _, NotAsked ) ->
            initCandidacy context tab.candidacyId ( newModel, cmd )

        _ ->
            ( newModel, cmd )


withTakeOver : Context -> CandidacyId -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
withTakeOver context candidacyId ( model, cmds ) =
    let
        isAdmin =
            Api.Token.isAdmin context.token

        -- admins can never take over a candidacy
        commands =
            if not isAdmin then
                [ cmds, Api.Candidacy.takeOver context.endpoint context.token GotCandidacyTakingOverResponse candidacyId ]

            else
                [ cmds ]
    in
    ( model, Cmd.batch commands )
