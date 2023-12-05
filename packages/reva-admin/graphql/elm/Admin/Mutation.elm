-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Mutation exposing (..)

import Admin.Enum.CandidateTypology
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


type alias AccountCreateAccountOptionalArguments =
    { account : OptionalArgument Admin.InputObject.AccountInput }


account_createAccount :
    (AccountCreateAccountOptionalArguments -> AccountCreateAccountOptionalArguments)
    -> SelectionSet decodesTo Admin.Object.Account
    -> SelectionSet decodesTo RootMutation
account_createAccount fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { account = Absent }

        optionalArgs____ =
            [ Argument.optional "account" filledInOptionals____.account Admin.InputObject.encodeAccountInput ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "account_createAccount" optionalArgs____ object____ Basics.identity


type alias AccountUpdateAccountRequiredArguments =
    { accountId : Data.Scalar.Id
    , accountData : Admin.InputObject.UpdateAccountInput
    }


account_updateAccount :
    AccountUpdateAccountRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Account
    -> SelectionSet decodesTo RootMutation
account_updateAccount requiredArgs____ object____ =
    Object.selectionForCompositeField "account_updateAccount" [ Argument.required "accountId" requiredArgs____.accountId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "accountData" requiredArgs____.accountData Admin.InputObject.encodeUpdateAccountInput ] object____ Basics.identity


type alias CandidacySubmitCandidacyRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    }


candidacy_submitCandidacy :
    CandidacySubmitCandidacyRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_submitCandidacy requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_submitCandidacy" [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias CandidacyUpdateCertificationRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    , departmentId : Data.Scalar.Id
    }


candidacy_updateCertification :
    CandidacyUpdateCertificationRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateCertification requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateCertification" [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "certificationId" requiredArgs____.certificationId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "departmentId" requiredArgs____.departmentId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias CandidacyUpdateCertificationWithinOrganismScopeRequiredArguments =
    { candidacyId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    }


candidacy_updateCertificationWithinOrganismScope :
    CandidacyUpdateCertificationWithinOrganismScopeRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateCertificationWithinOrganismScope requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateCertificationWithinOrganismScope" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "certificationId" requiredArgs____.certificationId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


type alias CandidacyAddExperienceOptionalArguments =
    { experience : OptionalArgument Admin.InputObject.ExperienceInput }


type alias CandidacyAddExperienceRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    }


candidacy_addExperience :
    (CandidacyAddExperienceOptionalArguments -> CandidacyAddExperienceOptionalArguments)
    -> CandidacyAddExperienceRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Experience
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_addExperience fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { experience = Absent }

        optionalArgs____ =
            [ Argument.optional "experience" filledInOptionals____.experience Admin.InputObject.encodeExperienceInput ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_addExperience" (optionalArgs____ ++ [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ]) object____ (Basics.identity >> Decode.nullable)


type alias CandidacyUpdateExperienceOptionalArguments =
    { experience : OptionalArgument Admin.InputObject.ExperienceInput }


type alias CandidacyUpdateExperienceRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    , experienceId : Data.Scalar.Id
    }


candidacy_updateExperience :
    (CandidacyUpdateExperienceOptionalArguments -> CandidacyUpdateExperienceOptionalArguments)
    -> CandidacyUpdateExperienceRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Experience
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateExperience fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { experience = Absent }

        optionalArgs____ =
            [ Argument.optional "experience" filledInOptionals____.experience Admin.InputObject.encodeExperienceInput ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_updateExperience" (optionalArgs____ ++ [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "experienceId" requiredArgs____.experienceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ]) object____ (Basics.identity >> Decode.nullable)


type alias CandidacyRemoveExperienceRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    , experienceId : Data.Scalar.Id
    }


candidacy_removeExperience :
    CandidacyRemoveExperienceRequiredArguments
    -> SelectionSet (Maybe Data.Scalar.Void) RootMutation
candidacy_removeExperience requiredArgs____ =
    Object.selectionForField "(Maybe Data.Scalar.Void)" "candidacy_removeExperience" [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "experienceId" requiredArgs____.experienceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecVoid |> .decoder |> Decode.nullable)


type alias CandidacyUpdateGoalsRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    , goals : List Admin.InputObject.CandidateGoalInput
    }


candidacy_updateGoals :
    CandidacyUpdateGoalsRequiredArguments
    -> SelectionSet Int RootMutation
candidacy_updateGoals requiredArgs____ =
    Object.selectionForField "Int" "candidacy_updateGoals" [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "goals" requiredArgs____.goals (Admin.InputObject.encodeCandidateGoalInput |> Encode.list) ] Decode.int


type alias CandidacyUpdateContactRequiredArguments =
    { candidateId : Data.Scalar.Id
    , candidateData : Admin.InputObject.UpdateCandidateInput
    }


candidacy_updateContact :
    CandidacyUpdateContactRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidate
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateContact requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateContact" [ Argument.required "candidateId" requiredArgs____.candidateId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidateData" requiredArgs____.candidateData Admin.InputObject.encodeUpdateCandidateInput ] object____ (Basics.identity >> Decode.nullable)


type alias CandidacyArchiveByIdOptionalArguments =
    { reorientationReasonId : OptionalArgument Data.Scalar.Uuid }


type alias CandidacyArchiveByIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_archiveById :
    (CandidacyArchiveByIdOptionalArguments -> CandidacyArchiveByIdOptionalArguments)
    -> CandidacyArchiveByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_archiveById fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { reorientationReasonId = Absent }

        optionalArgs____ =
            [ Argument.optional "reorientationReasonId" filledInOptionals____.reorientationReasonId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_archiveById" (optionalArgs____ ++ [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ]) object____ Basics.identity


type alias CandidacyUnarchiveByIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_unarchiveById :
    CandidacyUnarchiveByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_unarchiveById requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_unarchiveById" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


type alias CandidacyDeleteByIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_deleteById :
    CandidacyDeleteByIdRequiredArguments
    -> SelectionSet String RootMutation
candidacy_deleteById requiredArgs____ =
    Object.selectionForField "String" "candidacy_deleteById" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] Decode.string


type alias CandidacyUpdateAppointmentInformationsRequiredArguments =
    { candidacyId : Data.Scalar.Id
    , appointmentInformations : Admin.InputObject.AppointmentInformationsInput
    }


candidacy_updateAppointmentInformations :
    CandidacyUpdateAppointmentInformationsRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_updateAppointmentInformations requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateAppointmentInformations" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "appointmentInformations" requiredArgs____.appointmentInformations Admin.InputObject.encodeAppointmentInformationsInput ] object____ Basics.identity


type alias CandidacyTakeOverRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_takeOver :
    CandidacyTakeOverRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_takeOver requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_takeOver" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


type alias CandidacySelectOrganismRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , organismId : Data.Scalar.Uuid
    }


candidacy_selectOrganism :
    CandidacySelectOrganismRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_selectOrganism requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_selectOrganism" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "organismId" requiredArgs____.organismId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ Basics.identity


type alias CandidacySubmitTypologyFormOptionalArguments =
    { additionalInformation : OptionalArgument String
    , ccnId : OptionalArgument Data.Scalar.Id
    }


type alias CandidacySubmitTypologyFormRequiredArguments =
    { candidacyId : Data.Scalar.Id
    , typology : Admin.Enum.CandidateTypology.CandidateTypology
    }


candidacy_submitTypologyForm :
    (CandidacySubmitTypologyFormOptionalArguments -> CandidacySubmitTypologyFormOptionalArguments)
    -> CandidacySubmitTypologyFormRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_submitTypologyForm fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { additionalInformation = Absent, ccnId = Absent }

        optionalArgs____ =
            [ Argument.optional "additionalInformation" filledInOptionals____.additionalInformation Encode.string, Argument.optional "ccnId" filledInOptionals____.ccnId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_submitTypologyForm" (optionalArgs____ ++ [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "typology" requiredArgs____.typology (Encode.enum Admin.Enum.CandidateTypology.toString) ]) object____ Basics.identity


type alias CandidacySubmitTrainingFormRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , training : Admin.InputObject.TrainingInput
    }


candidacy_submitTrainingForm :
    CandidacySubmitTrainingFormRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_submitTrainingForm requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_submitTrainingForm" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "training" requiredArgs____.training Admin.InputObject.encodeTrainingInput ] object____ Basics.identity


type alias CandidacyConfirmTrainingFormRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


candidacy_confirmTrainingForm :
    CandidacyConfirmTrainingFormRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_confirmTrainingForm requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_confirmTrainingForm" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ Basics.identity


type alias CandidacyDropOutRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , dropOut : Admin.InputObject.DropOutInput
    }


candidacy_dropOut :
    CandidacyDropOutRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_dropOut requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_dropOut" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "dropOut" requiredArgs____.dropOut Admin.InputObject.encodeDropOutInput ] object____ Basics.identity


type alias CandidacyCancelDropOutByIdRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


candidacy_cancelDropOutById :
    CandidacyCancelDropOutByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_cancelDropOutById requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_cancelDropOutById" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ Basics.identity


type alias CandidacyUpdateAdmissibilityRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , admissibility : Admin.InputObject.AdmissibilityInput
    }


candidacy_updateAdmissibility :
    CandidacyUpdateAdmissibilityRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Admissibility
    -> SelectionSet decodesTo RootMutation
candidacy_updateAdmissibility requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateAdmissibility" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "admissibility" requiredArgs____.admissibility Admin.InputObject.encodeAdmissibilityInput ] object____ Basics.identity


type alias CandidacyUpdateExamInfoRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , examInfo : Admin.InputObject.ExamInfoInput
    }


candidacy_updateExamInfo :
    CandidacyUpdateExamInfoRequiredArguments
    -> SelectionSet decodesTo Admin.Object.ExamInfo
    -> SelectionSet decodesTo RootMutation
candidacy_updateExamInfo requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateExamInfo" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "examInfo" requiredArgs____.examInfo Admin.InputObject.encodeExamInfoInput ] object____ Basics.identity


type alias CandidateAskForRegistrationRequiredArguments =
    { candidate : Admin.InputObject.CandidateInput }


candidate_askForRegistration :
    CandidateAskForRegistrationRequiredArguments
    -> SelectionSet String RootMutation
candidate_askForRegistration requiredArgs____ =
    Object.selectionForField "String" "candidate_askForRegistration" [ Argument.required "candidate" requiredArgs____.candidate Admin.InputObject.encodeCandidateInput ] Decode.string


type alias CandidateAskForLoginRequiredArguments =
    { email : String }


candidate_askForLogin :
    CandidateAskForLoginRequiredArguments
    -> SelectionSet String RootMutation
candidate_askForLogin requiredArgs____ =
    Object.selectionForField "String" "candidate_askForLogin" [ Argument.required "email" requiredArgs____.email Encode.string ] Decode.string


type alias CandidateLoginRequiredArguments =
    { token : String }


candidate_login :
    CandidateLoginRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CandidateLogged
    -> SelectionSet decodesTo RootMutation
candidate_login requiredArgs____ object____ =
    Object.selectionForCompositeField "candidate_login" [ Argument.required "token" requiredArgs____.token Encode.string ] object____ Basics.identity


type alias CertificationAuthorityUpdateCertificationAuthorityRequiredArguments =
    { certificationAuthorityId : Data.Scalar.Id
    , certificationAuthorityData : Admin.InputObject.UpdateCertificationAuthorityInput
    }


certification_authority_updateCertificationAuthority :
    CertificationAuthorityUpdateCertificationAuthorityRequiredArguments
    -> SelectionSet decodesTo Admin.Object.CertificationAuthority
    -> SelectionSet decodesTo RootMutation
certification_authority_updateCertificationAuthority requiredArgs____ object____ =
    Object.selectionForCompositeField "certification_authority_updateCertificationAuthority" [ Argument.required "certificationAuthorityId" requiredArgs____.certificationAuthorityId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "certificationAuthorityData" requiredArgs____.certificationAuthorityData Admin.InputObject.encodeUpdateCertificationAuthorityInput ] object____ Basics.identity


type alias CandidacyCreateFundingRequestUnifvaeRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , fundingRequest : Admin.InputObject.FundingRequestUnifvaeInput
    }


candidacy_createFundingRequestUnifvae :
    CandidacyCreateFundingRequestUnifvaeRequiredArguments
    -> SelectionSet decodesTo Admin.Object.FundingRequestUnifvae
    -> SelectionSet decodesTo RootMutation
candidacy_createFundingRequestUnifvae requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_createFundingRequestUnifvae" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "fundingRequest" requiredArgs____.fundingRequest Admin.InputObject.encodeFundingRequestUnifvaeInput ] object____ Basics.identity


type alias CandidacyCreateOrUpdatePaymentRequestUnifvaeRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , paymentRequest : Admin.InputObject.PaymentRequestUnifvaeInput
    }


candidacy_createOrUpdatePaymentRequestUnifvae :
    CandidacyCreateOrUpdatePaymentRequestUnifvaeRequiredArguments
    -> SelectionSet decodesTo Admin.Object.PaymentRequestUnifvae
    -> SelectionSet decodesTo RootMutation
candidacy_createOrUpdatePaymentRequestUnifvae requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_createOrUpdatePaymentRequestUnifvae" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "paymentRequest" requiredArgs____.paymentRequest Admin.InputObject.encodePaymentRequestUnifvaeInput ] object____ Basics.identity


type alias CandidacyCreateOrUpdatePaymentRequestRequiredArguments =
    { candidacyId : Data.Scalar.Uuid
    , paymentRequest : Admin.InputObject.PaymentRequestInput
    }


candidacy_createOrUpdatePaymentRequest :
    CandidacyCreateOrUpdatePaymentRequestRequiredArguments
    -> SelectionSet decodesTo Admin.Object.PaymentRequest
    -> SelectionSet decodesTo RootMutation
candidacy_createOrUpdatePaymentRequest requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_createOrUpdatePaymentRequest" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "paymentRequest" requiredArgs____.paymentRequest Admin.InputObject.encodePaymentRequestInput ] object____ Basics.identity


type alias CandidacyConfirmPaymentRequestRequiredArguments =
    { candidacyId : Data.Scalar.Uuid }


candidacy_confirmPaymentRequest :
    CandidacyConfirmPaymentRequestRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_confirmPaymentRequest requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_confirmPaymentRequest" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ Basics.identity


type alias OrganismUpdateOrganismRequiredArguments =
    { organismId : Data.Scalar.Id
    , organismData : Admin.InputObject.UpdateOrganismInput
    }


organism_updateOrganism :
    OrganismUpdateOrganismRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Organism
    -> SelectionSet decodesTo RootMutation
organism_updateOrganism requiredArgs____ object____ =
    Object.selectionForCompositeField "organism_updateOrganism" [ Argument.required "organismId" requiredArgs____.organismId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "organismData" requiredArgs____.organismData Admin.InputObject.encodeUpdateOrganismInput ] object____ Basics.identity


type alias OrganismCreateOrUpdateInformationsCommercialesRequiredArguments =
    { informationsCommerciales : Admin.InputObject.CreateOrUpdateInformationsCommercialesInput }


organism_createOrUpdateInformationsCommerciales :
    OrganismCreateOrUpdateInformationsCommercialesRequiredArguments
    -> SelectionSet decodesTo Admin.Object.OrganismInformationsCommerciales
    -> SelectionSet decodesTo RootMutation
organism_createOrUpdateInformationsCommerciales requiredArgs____ object____ =
    Object.selectionForCompositeField "organism_createOrUpdateInformationsCommerciales" [ Argument.required "informationsCommerciales" requiredArgs____.informationsCommerciales Admin.InputObject.encodeCreateOrUpdateInformationsCommercialesInput ] object____ Basics.identity


type alias OrganismUpdateFermePourAbsenceOuCongesRequiredArguments =
    { organismId : Data.Scalar.Id
    , fermePourAbsenceOuConges : Bool
    }


organism_updateFermePourAbsenceOuConges :
    OrganismUpdateFermePourAbsenceOuCongesRequiredArguments
    -> SelectionSet decodesTo Admin.Object.OrganismInformationsCommerciales
    -> SelectionSet decodesTo RootMutation
organism_updateFermePourAbsenceOuConges requiredArgs____ object____ =
    Object.selectionForCompositeField "organism_updateFermePourAbsenceOuConges" [ Argument.required "organismId" requiredArgs____.organismId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "fermePourAbsenceOuConges" requiredArgs____.fermePourAbsenceOuConges Encode.bool ] object____ Basics.identity


type alias SubscriptionCreateSubscriptionRequestRequiredArguments =
    { subscriptionRequest : Admin.InputObject.SubscriptionRequestInput }


subscription_createSubscriptionRequest :
    SubscriptionCreateSubscriptionRequestRequiredArguments
    -> SelectionSet decodesTo Admin.Object.SubscriptionRequest
    -> SelectionSet decodesTo RootMutation
subscription_createSubscriptionRequest requiredArgs____ object____ =
    Object.selectionForCompositeField "subscription_createSubscriptionRequest" [ Argument.required "subscriptionRequest" requiredArgs____.subscriptionRequest Admin.InputObject.encodeSubscriptionRequestInput ] object____ Basics.identity


type alias SubscriptionValidateSubscriptionRequestRequiredArguments =
    { subscriptionRequestId : Data.Scalar.Id }


subscription_validateSubscriptionRequest :
    SubscriptionValidateSubscriptionRequestRequiredArguments
    -> SelectionSet (Maybe String) RootMutation
subscription_validateSubscriptionRequest requiredArgs____ =
    Object.selectionForField "(Maybe String)" "subscription_validateSubscriptionRequest" [ Argument.required "subscriptionRequestId" requiredArgs____.subscriptionRequestId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] (Decode.string |> Decode.nullable)


type alias SubscriptionRejectSubscriptionRequestRequiredArguments =
    { subscriptionRequestId : Data.Scalar.Id
    , reason : String
    }


subscription_rejectSubscriptionRequest :
    SubscriptionRejectSubscriptionRequestRequiredArguments
    -> SelectionSet (Maybe String) RootMutation
subscription_rejectSubscriptionRequest requiredArgs____ =
    Object.selectionForField "(Maybe String)" "subscription_rejectSubscriptionRequest" [ Argument.required "subscriptionRequestId" requiredArgs____.subscriptionRequestId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "reason" requiredArgs____.reason Encode.string ] (Decode.string |> Decode.nullable)
