-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Query exposing (..)

import Admin.Enum.AccountGroup
import Admin.Enum.CandidacyStatusFilter
import Admin.Enum.CertificationStatus
import Admin.Enum.DossierDeValidationCategoryFilter
import Admin.Enum.FeasibilityCategoryFilter
import Admin.Enum.JuryCategoryFilter
import Admin.Enum.StatutValidationInformationsJuridiquesMaisonMereAAP
import Admin.Enum.SubscriptionRequestStatus
import Admin.InputObject
import Admin.Interface
import Admin.Object
import Admin.Scalar
import Admin.Union
import Data.Scalar
import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode exposing (Decoder)


type alias AccountGetAccountsOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , groupFilter : OptionalArgument Admin.Enum.AccountGroup.AccountGroup
    , searchFilter : OptionalArgument String
    }


account_getAccounts :
    (AccountGetAccountsOptionalArguments -> AccountGetAccountsOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.AccountsPaginated
    -> SelectionSet decodesTo RootQuery
account_getAccounts fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, groupFilter = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "groupFilter" filledInOptionals____.groupFilter (Encode.enum Admin.Enum.AccountGroup.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "account_getAccounts" optionalArgs____ object____ Basics.identity


type alias AccountGetAccountRequiredArguments =
    { id : Data.Scalar.Id }


account_getAccount :
    AccountGetAccountRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Account
    -> SelectionSet (Maybe decodesTo) RootQuery
account_getAccount requiredArgs____ object____ =
    Object.selectionForCompositeField "account_getAccount" [ Argument.required "id" requiredArgs____.id (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


account_getAccountForConnectedUser :
    SelectionSet decodesTo Admin.Object.Account
    -> SelectionSet (Maybe decodesTo) RootQuery
account_getAccountForConnectedUser object____ =
    Object.selectionForCompositeField "account_getAccountForConnectedUser" [] object____ (Basics.identity >> Decode.nullable)


type alias AccountGetImpersonateUrlRequiredArguments =
    { input : Admin.InputObject.GetImpersonateUrlInput }


account_getImpersonateUrl :
    AccountGetImpersonateUrlRequiredArguments
    -> SelectionSet (Maybe String) RootQuery
account_getImpersonateUrl requiredArgs____ =
    Object.selectionForField "(Maybe String)" "account_getImpersonateUrl" [ Argument.required "input" requiredArgs____.input Admin.InputObject.encodeGetImpersonateUrlInput ] (Decode.string |> Decode.nullable)


type alias GetCandidacyByIdRequiredArguments =
    { id : Data.Scalar.Id }


getCandidacyById :
    GetCandidacyByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootQuery
getCandidacyById requiredArgs____ object____ =
    Object.selectionForCompositeField "getCandidacyById" [ Argument.required "id" requiredArgs____.id (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias GetCandidaciesOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , statusFilter : OptionalArgument Admin.Enum.CandidacyStatusFilter.CandidacyStatusFilter
    , searchFilter : OptionalArgument String
    }


getCandidacies :
    (GetCandidaciesOptionalArguments -> GetCandidaciesOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CandidacySummaryPage
    -> SelectionSet decodesTo RootQuery
getCandidacies fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, statusFilter = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "statusFilter" filledInOptionals____.statusFilter (Encode.enum Admin.Enum.CandidacyStatusFilter.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "getCandidacies" optionalArgs____ object____ Basics.identity


getTrainings :
    SelectionSet decodesTo Admin.Object.Training
    -> SelectionSet (List decodesTo) RootQuery
getTrainings object____ =
    Object.selectionForCompositeField "getTrainings" [] object____ (Basics.identity >> Decode.list)


type alias GetRandomOrganismsForCandidacyOptionalArguments =
    { searchText : OptionalArgument String
    , searchFilter : OptionalArgument Admin.InputObject.SearchOrganismFilter
    }


type alias GetRandomOrganismsForCandidacyRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


getRandomOrganismsForCandidacy :
    (GetRandomOrganismsForCandidacyOptionalArguments -> GetRandomOrganismsForCandidacyOptionalArguments)
    -> GetRandomOrganismsForCandidacyRequiredArguments
    -> SelectionSet decodesTo Admin.Object.RamdomOrganisms
    -> SelectionSet decodesTo RootQuery
getRandomOrganismsForCandidacy fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchText = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchText" filledInOptionals____.searchText Encode.string, Argument.optional "searchFilter" filledInOptionals____.searchFilter Admin.InputObject.encodeSearchOrganismFilter ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "getRandomOrganismsForCandidacy" (optionalArgs____ ++ [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ]) object____ Basics.identity


getBasicSkills :
    SelectionSet decodesTo Admin.Object.BasicSkill
    -> SelectionSet (List decodesTo) RootQuery
getBasicSkills object____ =
    Object.selectionForCompositeField "getBasicSkills" [] object____ (Basics.identity >> Decode.list)


type alias CandidacyCandidacyCountByStatusOptionalArguments =
    { searchFilter : OptionalArgument String }


candidacy_candidacyCountByStatus :
    (CandidacyCandidacyCountByStatusOptionalArguments -> CandidacyCandidacyCountByStatusOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CandidacyCountByStatus
    -> SelectionSet decodesTo RootQuery
candidacy_candidacyCountByStatus fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_candidacyCountByStatus" optionalArgs____ object____ Basics.identity


type alias CandidacyGetCandidacyCcnsOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchFilter : OptionalArgument String
    }


candidacy_getCandidacyCcns :
    (CandidacyGetCandidacyCcnsOptionalArguments -> CandidacyGetCandidacyCcnsOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CandidacyConventionCollectivePaginated
    -> SelectionSet decodesTo RootQuery
candidacy_getCandidacyCcns fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_getCandidacyCcns" optionalArgs____ object____ Basics.identity


type alias CandidacyMenuGetCandidacyMenuRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacyMenu_getCandidacyMenu :
    CandidacyMenuGetCandidacyMenuRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CandidacyMenu
    -> SelectionSet decodesTo RootQuery
candidacyMenu_getCandidacyMenu requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacyMenu_getCandidacyMenu" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


candidate_getCandidateWithCandidacy :
    SelectionSet decodesTo Admin.Object.Candidate
    -> SelectionSet decodesTo RootQuery
candidate_getCandidateWithCandidacy object____ =
    Object.selectionForCompositeField "candidate_getCandidateWithCandidacy" [] object____ Basics.identity


type alias CertificationAuthorityGetCertificationAuthorityRequiredArguments =
    { id : Data.Scalar.Id }


certification_authority_getCertificationAuthority :
    CertificationAuthorityGetCertificationAuthorityRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CertificationAuthority
    -> SelectionSet (Maybe decodesTo) RootQuery
certification_authority_getCertificationAuthority requiredArgs____ object____ =
    Object.selectionForCompositeField "certification_authority_getCertificationAuthority" [ Argument.required "id" requiredArgs____.id (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias CertificationAuthorityGetCertificationAuthoritiesOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchFilter : OptionalArgument String
    }


certification_authority_getCertificationAuthorities :
    (CertificationAuthorityGetCertificationAuthoritiesOptionalArguments -> CertificationAuthorityGetCertificationAuthoritiesOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CertificationAuthorityPaginated
    -> SelectionSet decodesTo RootQuery
certification_authority_getCertificationAuthorities fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "certification_authority_getCertificationAuthorities" optionalArgs____ object____ Basics.identity


type alias CertificationAuthoritySearchCertificationAuthoritiesAndLocalAccountsOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchFilter : OptionalArgument String
    }


certification_authority_searchCertificationAuthoritiesAndLocalAccounts :
    (CertificationAuthoritySearchCertificationAuthoritiesAndLocalAccountsOptionalArguments -> CertificationAuthoritySearchCertificationAuthoritiesAndLocalAccountsOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CertificationAuhtorityOrLocalAccountPaginated
    -> SelectionSet decodesTo RootQuery
certification_authority_searchCertificationAuthoritiesAndLocalAccounts fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "certification_authority_searchCertificationAuthoritiesAndLocalAccounts" optionalArgs____ object____ Basics.identity


type alias CertificationAuthorityGetCertificationAuthorityLocalAccountRequiredArguments =
    { id : Data.Scalar.Id }


certification_authority_getCertificationAuthorityLocalAccount :
    CertificationAuthorityGetCertificationAuthorityLocalAccountRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CertificationAuthorityLocalAccount
    -> SelectionSet (Maybe decodesTo) RootQuery
certification_authority_getCertificationAuthorityLocalAccount requiredArgs____ object____ =
    Object.selectionForCompositeField "certification_authority_getCertificationAuthorityLocalAccount" [ Argument.required "id" requiredArgs____.id (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias CertificationAuthorityGetCertificationAuthoritiesToTransferCandidacyOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchFilter : OptionalArgument String
    }


type alias CertificationAuthorityGetCertificationAuthoritiesToTransferCandidacyRequiredArguments =
    { candidacyId : String }


certification_authority_getCertificationAuthoritiesToTransferCandidacy :
    (CertificationAuthorityGetCertificationAuthoritiesToTransferCandidacyOptionalArguments -> CertificationAuthorityGetCertificationAuthoritiesToTransferCandidacyOptionalArguments)
    -> CertificationAuthorityGetCertificationAuthoritiesToTransferCandidacyRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CertificationAuthorityPaginated
    -> SelectionSet decodesTo RootQuery
certification_authority_getCertificationAuthoritiesToTransferCandidacy fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "certification_authority_getCertificationAuthoritiesToTransferCandidacy" (optionalArgs____ ++ [ Argument.required "candidacyId" requiredArgs____.candidacyId Encode.string ]) object____ Basics.identity


type alias DematerializedFeasibilityFileGetByCandidacyIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


dematerialized_feasibility_file_getByCandidacyId :
    DematerializedFeasibilityFileGetByCandidacyIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.DematerializedFeasibilityFile
    -> SelectionSet (Maybe decodesTo) RootQuery
dematerialized_feasibility_file_getByCandidacyId requiredArgs____ object____ =
    Object.selectionForCompositeField "dematerialized_feasibility_file_getByCandidacyId" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias DossierDeValidationGetDossierDeValidationByIdRequiredArguments =
    { dossierDeValidationId : Data.Scalar.Id }


dossierDeValidation_getDossierDeValidationById :
    DossierDeValidationGetDossierDeValidationByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.DossierDeValidation
    -> SelectionSet (Maybe decodesTo) RootQuery
dossierDeValidation_getDossierDeValidationById requiredArgs____ object____ =
    Object.selectionForCompositeField "dossierDeValidation_getDossierDeValidationById" [ Argument.required "dossierDeValidationId" requiredArgs____.dossierDeValidationId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias DossierDeValidationGetDossiersDeValidationOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , categoryFilter : OptionalArgument Admin.Enum.DossierDeValidationCategoryFilter.DossierDeValidationCategoryFilter
    , searchFilter : OptionalArgument String
    }


dossierDeValidation_getDossiersDeValidation :
    (DossierDeValidationGetDossiersDeValidationOptionalArguments -> DossierDeValidationGetDossiersDeValidationOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.DossierDeValidationPage
    -> SelectionSet decodesTo RootQuery
dossierDeValidation_getDossiersDeValidation fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, categoryFilter = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "categoryFilter" filledInOptionals____.categoryFilter (Encode.enum Admin.Enum.DossierDeValidationCategoryFilter.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "dossierDeValidation_getDossiersDeValidation" optionalArgs____ object____ Basics.identity


type alias DossierDeValidationDossierDeValidationCountByCategoryOptionalArguments =
    { searchFilter : OptionalArgument String }


dossierDeValidation_dossierDeValidationCountByCategory :
    (DossierDeValidationDossierDeValidationCountByCategoryOptionalArguments -> DossierDeValidationDossierDeValidationCountByCategoryOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.DossierDeValidationCountByCategory
    -> SelectionSet decodesTo RootQuery
dossierDeValidation_dossierDeValidationCountByCategory fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "dossierDeValidation_dossierDeValidationCountByCategory" optionalArgs____ object____ Basics.identity


type alias FeasibilityCountByCategoryOptionalArguments =
    { searchFilter : OptionalArgument String }


feasibilityCountByCategory :
    (FeasibilityCountByCategoryOptionalArguments -> FeasibilityCountByCategoryOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.FeasibilityCountByCategory
    -> SelectionSet decodesTo RootQuery
feasibilityCountByCategory fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "feasibilityCountByCategory" optionalArgs____ object____ Basics.identity


type alias FeasibilitiesOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , categoryFilter : OptionalArgument Admin.Enum.FeasibilityCategoryFilter.FeasibilityCategoryFilter
    , searchFilter : OptionalArgument String
    }


feasibilities :
    (FeasibilitiesOptionalArguments -> FeasibilitiesOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.FeasibilityPage
    -> SelectionSet decodesTo RootQuery
feasibilities fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, categoryFilter = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "categoryFilter" filledInOptionals____.categoryFilter (Encode.enum Admin.Enum.FeasibilityCategoryFilter.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "feasibilities" optionalArgs____ object____ Basics.identity


type alias FeasibilityRequiredArguments =
    { feasibilityId : Data.Scalar.Id }


feasibility :
    FeasibilityRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Feasibility
    -> SelectionSet (Maybe decodesTo) RootQuery
feasibility requiredArgs____ object____ =
    Object.selectionForCompositeField "feasibility" [ Argument.required "feasibilityId" requiredArgs____.feasibilityId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


activeFeaturesForConnectedUser : SelectionSet (List String) RootQuery
activeFeaturesForConnectedUser =
    Object.selectionForField "(List String)" "activeFeaturesForConnectedUser" [] (Decode.string |> Decode.list)


featureFlipping_getFeatures :
    SelectionSet decodesTo Admin.Object.Feature
    -> SelectionSet (List decodesTo) RootQuery
featureFlipping_getFeatures object____ =
    Object.selectionForCompositeField "featureFlipping_getFeatures" [] object____ (Basics.identity >> Decode.list)


type alias CandidacyGetFundingRequestUnifvaeRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


candidacy_getFundingRequestUnifvae :
    CandidacyGetFundingRequestUnifvaeRequiredArguments
    -> SelectionSet decodesTo Admin.Object.FundingRequestUnifvae
    -> SelectionSet (Maybe decodesTo) RootQuery
candidacy_getFundingRequestUnifvae requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_getFundingRequestUnifvae" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ (Basics.identity >> Decode.nullable)


type alias CandidateGetFundingRequestRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


candidate_getFundingRequest :
    CandidateGetFundingRequestRequiredArguments
    -> SelectionSet decodesTo Admin.Object.FundingRequestInformations
    -> SelectionSet decodesTo RootQuery
candidate_getFundingRequest requiredArgs____ object____ =
    Object.selectionForCompositeField "candidate_getFundingRequest" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ Basics.identity


type alias JuryGetJuriesOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , categoryFilter : OptionalArgument Admin.Enum.JuryCategoryFilter.JuryCategoryFilter
    , searchFilter : OptionalArgument String
    }


jury_getJuries :
    (JuryGetJuriesOptionalArguments -> JuryGetJuriesOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.JuryPage
    -> SelectionSet decodesTo RootQuery
jury_getJuries fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, categoryFilter = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "categoryFilter" filledInOptionals____.categoryFilter (Encode.enum Admin.Enum.JuryCategoryFilter.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "jury_getJuries" optionalArgs____ object____ Basics.identity


type alias JuryJuryCountByCategoryOptionalArguments =
    { searchFilter : OptionalArgument String }


jury_juryCountByCategory :
    (JuryJuryCountByCategoryOptionalArguments -> JuryJuryCountByCategoryOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.JuryCountByCategory
    -> SelectionSet decodesTo RootQuery
jury_juryCountByCategory fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "jury_juryCountByCategory" optionalArgs____ object____ Basics.identity


type alias OrganismGetOrganismRequiredArguments =
    { id : Data.Scalar.Id }


organism_getOrganism :
    OrganismGetOrganismRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Organism
    -> SelectionSet (Maybe decodesTo) RootQuery
organism_getOrganism requiredArgs____ object____ =
    Object.selectionForCompositeField "organism_getOrganism" [ Argument.required "id" requiredArgs____.id (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias OrganismGetMaisonMereAAPsOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchFilter : OptionalArgument String
    , legalValidationStatus : OptionalArgument Admin.Enum.StatutValidationInformationsJuridiquesMaisonMereAAP.StatutValidationInformationsJuridiquesMaisonMereAAP
    }


organism_getMaisonMereAAPs :
    (OrganismGetMaisonMereAAPsOptionalArguments -> OrganismGetMaisonMereAAPsOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.MaisonMereAAPsPaginated
    -> SelectionSet decodesTo RootQuery
organism_getMaisonMereAAPs fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchFilter = Absent, legalValidationStatus = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string, Argument.optional "legalValidationStatus" filledInOptionals____.legalValidationStatus (Encode.enum Admin.Enum.StatutValidationInformationsJuridiquesMaisonMereAAP.toString) ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "organism_getMaisonMereAAPs" optionalArgs____ object____ Basics.identity


type alias OrganismGetMaisonMereAAPByIdRequiredArguments =
    { maisonMereAAPId : Data.Scalar.Id }


organism_getMaisonMereAAPById :
    OrganismGetMaisonMereAAPByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.MaisonMereAAP
    -> SelectionSet decodesTo RootQuery
organism_getMaisonMereAAPById requiredArgs____ object____ =
    Object.selectionForCompositeField "organism_getMaisonMereAAPById" [ Argument.required "maisonMereAAPId" requiredArgs____.maisonMereAAPId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


getReferential :
    SelectionSet decodesTo Admin.Object.Referential
    -> SelectionSet decodesTo RootQuery
getReferential object____ =
    Object.selectionForCompositeField "getReferential" [] object____ Basics.identity


type alias SearchCertificationsForCandidateOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , departmentId : OptionalArgument Data.Scalar.Uuid
    , organismId : OptionalArgument Data.Scalar.Uuid
    , searchText : OptionalArgument String
    , status : OptionalArgument Admin.Enum.CertificationStatus.CertificationStatus
    }


searchCertificationsForCandidate :
    (SearchCertificationsForCandidateOptionalArguments -> SearchCertificationsForCandidateOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CertificationPage
    -> SelectionSet decodesTo RootQuery
searchCertificationsForCandidate fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, departmentId = Absent, organismId = Absent, searchText = Absent, status = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "departmentId" filledInOptionals____.departmentId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.optional "organismId" filledInOptionals____.organismId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.optional "searchText" filledInOptionals____.searchText Encode.string, Argument.optional "status" filledInOptionals____.status (Encode.enum Admin.Enum.CertificationStatus.toString) ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "searchCertificationsForCandidate" optionalArgs____ object____ Basics.identity


type alias SearchCertificationsForAdminOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , searchText : OptionalArgument String
    , status : OptionalArgument Admin.Enum.CertificationStatus.CertificationStatus
    }


searchCertificationsForAdmin :
    (SearchCertificationsForAdminOptionalArguments -> SearchCertificationsForAdminOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.CertificationPage
    -> SelectionSet decodesTo RootQuery
searchCertificationsForAdmin fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, searchText = Absent, status = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "searchText" filledInOptionals____.searchText Encode.string, Argument.optional "status" filledInOptionals____.status (Encode.enum Admin.Enum.CertificationStatus.toString) ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "searchCertificationsForAdmin" optionalArgs____ object____ Basics.identity


type alias GetCertificationRequiredArguments =
    { certificationId : Data.Scalar.Id }


getCertification :
    GetCertificationRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Certification
    -> SelectionSet decodesTo RootQuery
getCertification requiredArgs____ object____ =
    Object.selectionForCompositeField "getCertification" [ Argument.required "certificationId" requiredArgs____.certificationId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


getRegions :
    SelectionSet decodesTo Admin.Object.Region
    -> SelectionSet (List decodesTo) RootQuery
getRegions object____ =
    Object.selectionForCompositeField "getRegions" [] object____ (Basics.identity >> Decode.list)


getDepartments :
    SelectionSet decodesTo Admin.Object.Department
    -> SelectionSet (List decodesTo) RootQuery
getDepartments object____ =
    Object.selectionForCompositeField "getDepartments" [] object____ (Basics.identity >> Decode.list)


getDegrees :
    SelectionSet decodesTo Admin.Object.Degree
    -> SelectionSet (List decodesTo) RootQuery
getDegrees object____ =
    Object.selectionForCompositeField "getDegrees" [] object____ (Basics.identity >> Decode.list)


getVulnerabilityIndicators :
    SelectionSet decodesTo Admin.Object.VulnerabilityIndicator
    -> SelectionSet (List decodesTo) RootQuery
getVulnerabilityIndicators object____ =
    Object.selectionForCompositeField "getVulnerabilityIndicators" [] object____ (Basics.identity >> Decode.list)


getDropOutReasons :
    SelectionSet decodesTo Admin.Object.DropOutReason
    -> SelectionSet (List decodesTo) RootQuery
getDropOutReasons object____ =
    Object.selectionForCompositeField "getDropOutReasons" [] object____ (Basics.identity >> Decode.list)


getReorientationReasons :
    SelectionSet decodesTo Admin.Object.ReorientationReason
    -> SelectionSet (List decodesTo) RootQuery
getReorientationReasons object____ =
    Object.selectionForCompositeField "getReorientationReasons" [] object____ (Basics.identity >> Decode.list)


getDomaines :
    SelectionSet decodesTo Admin.Object.Domaine
    -> SelectionSet (List decodesTo) RootQuery
getDomaines object____ =
    Object.selectionForCompositeField "getDomaines" [] object____ (Basics.identity >> Decode.list)


getConventionCollectives :
    SelectionSet decodesTo Admin.Object.ConventionCollective
    -> SelectionSet (List decodesTo) RootQuery
getConventionCollectives object____ =
    Object.selectionForCompositeField "getConventionCollectives" [] object____ (Basics.identity >> Decode.list)


getTypeDiplomes :
    SelectionSet decodesTo Admin.Object.TypeDiplome
    -> SelectionSet (List decodesTo) RootQuery
getTypeDiplomes object____ =
    Object.selectionForCompositeField "getTypeDiplomes" [] object____ (Basics.identity >> Decode.list)


getCertificationAuthorityTags : SelectionSet (List String) RootQuery
getCertificationAuthorityTags =
    Object.selectionForField "(List String)" "getCertificationAuthorityTags" [] (Decode.string |> Decode.list)


type alias GetFCCertificationRequiredArguments =
    { rncp : Data.Scalar.Id }


getFCCertification :
    GetFCCertificationRequiredArguments
    -> SelectionSet decodesTo Admin.Object.FCCertification
    -> SelectionSet (Maybe decodesTo) RootQuery
getFCCertification requiredArgs____ object____ =
    Object.selectionForCompositeField "getFCCertification" [ Argument.required "rncp" requiredArgs____.rncp (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


getCountries :
    SelectionSet decodesTo Admin.Object.Country
    -> SelectionSet (List decodesTo) RootQuery
getCountries object____ =
    Object.selectionForCompositeField "getCountries" [] object____ (Basics.identity >> Decode.list)


type alias GetEtablissementRequiredArguments =
    { siret : Data.Scalar.Id }


getEtablissement :
    GetEtablissementRequiredArguments
    -> SelectionSet decodesTo Admin.Object.EtablissementDiffusible
    -> SelectionSet (Maybe decodesTo) RootQuery
getEtablissement requiredArgs____ object____ =
    Object.selectionForCompositeField "getEtablissement" [ Argument.required "siret" requiredArgs____.siret (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias GetEtablissementAsAdminRequiredArguments =
    { siret : Data.Scalar.Id }


getEtablissementAsAdmin :
    GetEtablissementAsAdminRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Etablissement
    -> SelectionSet (Maybe decodesTo) RootQuery
getEtablissementAsAdmin requiredArgs____ object____ =
    Object.selectionForCompositeField "getEtablissementAsAdmin" [ Argument.required "siret" requiredArgs____.siret (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias SubscriptionGetSubscriptionRequestsOptionalArguments =
    { offset : OptionalArgument Int
    , limit : OptionalArgument Int
    , status : OptionalArgument Admin.Enum.SubscriptionRequestStatus.SubscriptionRequestStatus
    , searchFilter : OptionalArgument String
    }


subscription_getSubscriptionRequests :
    (SubscriptionGetSubscriptionRequestsOptionalArguments -> SubscriptionGetSubscriptionRequestsOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.SubscriptionRequestsPaginated
    -> SelectionSet decodesTo RootQuery
subscription_getSubscriptionRequests fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { offset = Absent, limit = Absent, status = Absent, searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "status" filledInOptionals____.status (Encode.enum Admin.Enum.SubscriptionRequestStatus.toString), Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "subscription_getSubscriptionRequests" optionalArgs____ object____ Basics.identity


type alias SubscriptionGetSubscriptionRequestRequiredArguments =
    { subscriptionRequestId : Data.Scalar.Id }


subscription_getSubscriptionRequest :
    SubscriptionGetSubscriptionRequestRequiredArguments
    -> SelectionSet decodesTo Admin.Object.SubscriptionRequest
    -> SelectionSet (Maybe decodesTo) RootQuery
subscription_getSubscriptionRequest requiredArgs____ object____ =
    Object.selectionForCompositeField "subscription_getSubscriptionRequest" [ Argument.required "subscriptionRequestId" requiredArgs____.subscriptionRequestId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias SubscriptionGetSubscriptionCountByStatusOptionalArguments =
    { searchFilter : OptionalArgument String }


subscription_getSubscriptionCountByStatus :
    (SubscriptionGetSubscriptionCountByStatusOptionalArguments -> SubscriptionGetSubscriptionCountByStatusOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.SubscriptionCountByStatus
    -> SelectionSet decodesTo RootQuery
subscription_getSubscriptionCountByStatus fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { searchFilter = Absent }

        optionalArgs____ =
            [ Argument.optional "searchFilter" filledInOptionals____.searchFilter Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "subscription_getSubscriptionCountByStatus" optionalArgs____ object____ Basics.identity
