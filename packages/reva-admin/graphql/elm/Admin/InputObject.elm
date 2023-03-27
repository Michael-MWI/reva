-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.InputObject exposing (..)

import Admin.Enum.AccountGroup
import Admin.Enum.AdmissibilityStatus
import Admin.Enum.CandidateTypology
import Admin.Enum.Duration
import Admin.Enum.Gender
import Admin.Enum.LegalStatus
import Admin.Enum.Sort
import Admin.Interface
import Admin.Object
import Admin.Scalar
import Admin.Union
import Data.Scalar
import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode


buildAccountInput :
    AccountInputRequiredFields
    -> (AccountInputOptionalFields -> AccountInputOptionalFields)
    -> AccountInput
buildAccountInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { firstname = Absent, lastname = Absent, organismId = Absent }
    in
    { email = required____.email, username = required____.username, firstname = optionals____.firstname, lastname = optionals____.lastname, group = required____.group, organismId = optionals____.organismId }


type alias AccountInputRequiredFields =
    { email : String
    , username : String
    , group : Admin.Enum.AccountGroup.AccountGroup
    }


type alias AccountInputOptionalFields =
    { firstname : OptionalArgument String
    , lastname : OptionalArgument String
    , organismId : OptionalArgument Data.Scalar.Uuid
    }


{-| Type for the AccountInput input object.
-}
type alias AccountInput =
    { email : String
    , username : String
    , firstname : OptionalArgument String
    , lastname : OptionalArgument String
    , group : Admin.Enum.AccountGroup.AccountGroup
    , organismId : OptionalArgument Data.Scalar.Uuid
    }


{-| Encode a AccountInput into a value that can be used as an argument.
-}
encodeAccountInput : AccountInput -> Value
encodeAccountInput input____ =
    Encode.maybeObject
        [ ( "email", Encode.string input____.email |> Just ), ( "username", Encode.string input____.username |> Just ), ( "firstname", Encode.string |> Encode.optional input____.firstname ), ( "lastname", Encode.string |> Encode.optional input____.lastname ), ( "group", Encode.enum Admin.Enum.AccountGroup.toString input____.group |> Just ), ( "organismId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.optional input____.organismId ) ]


buildAdmissibilityInput :
    AdmissibilityInputRequiredFields
    -> (AdmissibilityInputOptionalFields -> AdmissibilityInputOptionalFields)
    -> AdmissibilityInput
buildAdmissibilityInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { reportSentAt = Absent, certifierRespondedAt = Absent, responseAvailableToCandidateAt = Absent, status = Absent }
    in
    { isCandidateAlreadyAdmissible = required____.isCandidateAlreadyAdmissible, reportSentAt = optionals____.reportSentAt, certifierRespondedAt = optionals____.certifierRespondedAt, responseAvailableToCandidateAt = optionals____.responseAvailableToCandidateAt, status = optionals____.status }


type alias AdmissibilityInputRequiredFields =
    { isCandidateAlreadyAdmissible : Bool }


type alias AdmissibilityInputOptionalFields =
    { reportSentAt : OptionalArgument Data.Scalar.Timestamp
    , certifierRespondedAt : OptionalArgument Data.Scalar.Timestamp
    , responseAvailableToCandidateAt : OptionalArgument Data.Scalar.Timestamp
    , status : OptionalArgument Admin.Enum.AdmissibilityStatus.AdmissibilityStatus
    }


{-| Type for the AdmissibilityInput input object.
-}
type alias AdmissibilityInput =
    { isCandidateAlreadyAdmissible : Bool
    , reportSentAt : OptionalArgument Data.Scalar.Timestamp
    , certifierRespondedAt : OptionalArgument Data.Scalar.Timestamp
    , responseAvailableToCandidateAt : OptionalArgument Data.Scalar.Timestamp
    , status : OptionalArgument Admin.Enum.AdmissibilityStatus.AdmissibilityStatus
    }


{-| Encode a AdmissibilityInput into a value that can be used as an argument.
-}
encodeAdmissibilityInput : AdmissibilityInput -> Value
encodeAdmissibilityInput input____ =
    Encode.maybeObject
        [ ( "isCandidateAlreadyAdmissible", Encode.bool input____.isCandidateAlreadyAdmissible |> Just ), ( "reportSentAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) |> Encode.optional input____.reportSentAt ), ( "certifierRespondedAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) |> Encode.optional input____.certifierRespondedAt ), ( "responseAvailableToCandidateAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) |> Encode.optional input____.responseAvailableToCandidateAt ), ( "status", Encode.enum Admin.Enum.AdmissibilityStatus.toString |> Encode.optional input____.status ) ]


buildAppointmentInformationsInput :
    AppointmentInformationsInputRequiredFields
    -> (AppointmentInformationsInputOptionalFields -> AppointmentInformationsInputOptionalFields)
    -> AppointmentInformationsInput
buildAppointmentInformationsInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { firstAppointmentOccuredAt = Absent }
    in
    { firstAppointmentOccuredAt = optionals____.firstAppointmentOccuredAt, wasPresentAtFirstAppointment = required____.wasPresentAtFirstAppointment, appointmentCount = required____.appointmentCount }


type alias AppointmentInformationsInputRequiredFields =
    { wasPresentAtFirstAppointment : Bool
    , appointmentCount : Int
    }


type alias AppointmentInformationsInputOptionalFields =
    { firstAppointmentOccuredAt : OptionalArgument Data.Scalar.Timestamp }


{-| Type for the AppointmentInformationsInput input object.
-}
type alias AppointmentInformationsInput =
    { firstAppointmentOccuredAt : OptionalArgument Data.Scalar.Timestamp
    , wasPresentAtFirstAppointment : Bool
    , appointmentCount : Int
    }


{-| Encode a AppointmentInformationsInput into a value that can be used as an argument.
-}
encodeAppointmentInformationsInput : AppointmentInformationsInput -> Value
encodeAppointmentInformationsInput input____ =
    Encode.maybeObject
        [ ( "firstAppointmentOccuredAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) |> Encode.optional input____.firstAppointmentOccuredAt ), ( "wasPresentAtFirstAppointment", Encode.bool input____.wasPresentAtFirstAppointment |> Just ), ( "appointmentCount", Encode.int input____.appointmentCount |> Just ) ]


buildCandidacyInput :
    CandidacyInputRequiredFields
    -> CandidacyInput
buildCandidacyInput required____ =
    { deviceId = required____.deviceId, certificationId = required____.certificationId, regionId = required____.regionId }


type alias CandidacyInputRequiredFields =
    { deviceId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    , regionId : Data.Scalar.Id
    }


{-| Type for the CandidacyInput input object.
-}
type alias CandidacyInput =
    { deviceId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    , regionId : Data.Scalar.Id
    }


{-| Encode a CandidacyInput into a value that can be used as an argument.
-}
encodeCandidacyInput : CandidacyInput -> Value
encodeCandidacyInput input____ =
    Encode.maybeObject
        [ ( "deviceId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.deviceId |> Just ), ( "certificationId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.certificationId |> Just ), ( "regionId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.regionId |> Just ) ]


buildCandidateGoalInput :
    CandidateGoalInputRequiredFields
    -> (CandidateGoalInputOptionalFields -> CandidateGoalInputOptionalFields)
    -> CandidateGoalInput
buildCandidateGoalInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { additionalInformation = Absent }
    in
    { goalId = required____.goalId, additionalInformation = optionals____.additionalInformation }


type alias CandidateGoalInputRequiredFields =
    { goalId : Data.Scalar.Id }


type alias CandidateGoalInputOptionalFields =
    { additionalInformation : OptionalArgument String }


{-| Type for the CandidateGoalInput input object.
-}
type alias CandidateGoalInput =
    { goalId : Data.Scalar.Id
    , additionalInformation : OptionalArgument String
    }


{-| Encode a CandidateGoalInput into a value that can be used as an argument.
-}
encodeCandidateGoalInput : CandidateGoalInput -> Value
encodeCandidateGoalInput input____ =
    Encode.maybeObject
        [ ( "goalId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.goalId |> Just ), ( "additionalInformation", Encode.string |> Encode.optional input____.additionalInformation ) ]


buildCandidateInput :
    CandidateInputRequiredFields
    -> CandidateInput
buildCandidateInput required____ =
    { email = required____.email, phone = required____.phone, firstname = required____.firstname, lastname = required____.lastname }


type alias CandidateInputRequiredFields =
    { email : String
    , phone : String
    , firstname : String
    , lastname : String
    }


{-| Type for the CandidateInput input object.
-}
type alias CandidateInput =
    { email : String
    , phone : String
    , firstname : String
    , lastname : String
    }


{-| Encode a CandidateInput into a value that can be used as an argument.
-}
encodeCandidateInput : CandidateInput -> Value
encodeCandidateInput input____ =
    Encode.maybeObject
        [ ( "email", Encode.string input____.email |> Just ), ( "phone", Encode.string input____.phone |> Just ), ( "firstname", Encode.string input____.firstname |> Just ), ( "lastname", Encode.string input____.lastname |> Just ) ]


buildCandidateTypologyInformationsInput :
    CandidateTypologyInformationsInputRequiredFields
    -> (CandidateTypologyInformationsInputOptionalFields -> CandidateTypologyInformationsInputOptionalFields)
    -> CandidateTypologyInformationsInput
buildCandidateTypologyInformationsInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { additionalInformation = Absent }
    in
    { typology = required____.typology, additionalInformation = optionals____.additionalInformation }


type alias CandidateTypologyInformationsInputRequiredFields =
    { typology : Admin.Enum.CandidateTypology.CandidateTypology }


type alias CandidateTypologyInformationsInputOptionalFields =
    { additionalInformation : OptionalArgument String }


{-| Type for the CandidateTypologyInformationsInput input object.
-}
type alias CandidateTypologyInformationsInput =
    { typology : Admin.Enum.CandidateTypology.CandidateTypology
    , additionalInformation : OptionalArgument String
    }


{-| Encode a CandidateTypologyInformationsInput into a value that can be used as an argument.
-}
encodeCandidateTypologyInformationsInput : CandidateTypologyInformationsInput -> Value
encodeCandidateTypologyInformationsInput input____ =
    Encode.maybeObject
        [ ( "typology", Encode.enum Admin.Enum.CandidateTypology.toString input____.typology |> Just ), ( "additionalInformation", Encode.string |> Encode.optional input____.additionalInformation ) ]


buildCertificationChangeInput :
    CertificationChangeInputRequiredFields
    -> CertificationChangeInput
buildCertificationChangeInput required____ =
    { candidacyId = required____.candidacyId, certificationId = required____.certificationId }


type alias CertificationChangeInputRequiredFields =
    { candidacyId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    }


{-| Type for the CertificationChangeInput input object.
-}
type alias CertificationChangeInput =
    { candidacyId : Data.Scalar.Id
    , certificationId : Data.Scalar.Id
    }


{-| Encode a CertificationChangeInput into a value that can be used as an argument.
-}
encodeCertificationChangeInput : CertificationChangeInput -> Value
encodeCertificationChangeInput input____ =
    Encode.maybeObject
        [ ( "candidacyId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.candidacyId |> Just ), ( "certificationId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) input____.certificationId |> Just ) ]


buildDropOutInput :
    DropOutInputRequiredFields
    -> (DropOutInputOptionalFields -> DropOutInputOptionalFields)
    -> DropOutInput
buildDropOutInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { otherReasonContent = Absent }
    in
    { droppedOutAt = required____.droppedOutAt, dropOutReasonId = required____.dropOutReasonId, otherReasonContent = optionals____.otherReasonContent }


type alias DropOutInputRequiredFields =
    { droppedOutAt : Data.Scalar.Timestamp
    , dropOutReasonId : Data.Scalar.Uuid
    }


type alias DropOutInputOptionalFields =
    { otherReasonContent : OptionalArgument String }


{-| Type for the DropOutInput input object.
-}
type alias DropOutInput =
    { droppedOutAt : Data.Scalar.Timestamp
    , dropOutReasonId : Data.Scalar.Uuid
    , otherReasonContent : OptionalArgument String
    }


{-| Encode a DropOutInput into a value that can be used as an argument.
-}
encodeDropOutInput : DropOutInput -> Value
encodeDropOutInput input____ =
    Encode.maybeObject
        [ ( "droppedOutAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) input____.droppedOutAt |> Just ), ( "dropOutReasonId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) input____.dropOutReasonId |> Just ), ( "otherReasonContent", Encode.string |> Encode.optional input____.otherReasonContent ) ]


buildExperienceInput :
    ExperienceInputRequiredFields
    -> ExperienceInput
buildExperienceInput required____ =
    { title = required____.title, startedAt = required____.startedAt, duration = required____.duration, description = required____.description }


type alias ExperienceInputRequiredFields =
    { title : String
    , startedAt : Data.Scalar.Timestamp
    , duration : Admin.Enum.Duration.Duration
    , description : String
    }


{-| Type for the ExperienceInput input object.
-}
type alias ExperienceInput =
    { title : String
    , startedAt : Data.Scalar.Timestamp
    , duration : Admin.Enum.Duration.Duration
    , description : String
    }


{-| Encode a ExperienceInput into a value that can be used as an argument.
-}
encodeExperienceInput : ExperienceInput -> Value
encodeExperienceInput input____ =
    Encode.maybeObject
        [ ( "title", Encode.string input____.title |> Just ), ( "startedAt", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecTimestamp) input____.startedAt |> Just ), ( "duration", Encode.enum Admin.Enum.Duration.toString input____.duration |> Just ), ( "description", Encode.string input____.description |> Just ) ]


buildFullCandidateInput :
    (FullCandidateInputOptionalFields -> FullCandidateInputOptionalFields)
    -> FullCandidateInput
buildFullCandidateInput fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { gender = Absent, firstname = Absent, firstname2 = Absent, firstname3 = Absent, lastname = Absent, email = Absent, phone = Absent, highestDegreeId = Absent, vulnerabilityIndicatorId = Absent }
    in
    { gender = optionals____.gender, firstname = optionals____.firstname, firstname2 = optionals____.firstname2, firstname3 = optionals____.firstname3, lastname = optionals____.lastname, email = optionals____.email, phone = optionals____.phone, highestDegreeId = optionals____.highestDegreeId, vulnerabilityIndicatorId = optionals____.vulnerabilityIndicatorId }


type alias FullCandidateInputOptionalFields =
    { gender : OptionalArgument Admin.Enum.Gender.Gender
    , firstname : OptionalArgument String
    , firstname2 : OptionalArgument String
    , firstname3 : OptionalArgument String
    , lastname : OptionalArgument String
    , email : OptionalArgument String
    , phone : OptionalArgument String
    , highestDegreeId : OptionalArgument Data.Scalar.Uuid
    , vulnerabilityIndicatorId : OptionalArgument Data.Scalar.Uuid
    }


{-| Type for the FullCandidateInput input object.
-}
type alias FullCandidateInput =
    { gender : OptionalArgument Admin.Enum.Gender.Gender
    , firstname : OptionalArgument String
    , firstname2 : OptionalArgument String
    , firstname3 : OptionalArgument String
    , lastname : OptionalArgument String
    , email : OptionalArgument String
    , phone : OptionalArgument String
    , highestDegreeId : OptionalArgument Data.Scalar.Uuid
    , vulnerabilityIndicatorId : OptionalArgument Data.Scalar.Uuid
    }


{-| Encode a FullCandidateInput into a value that can be used as an argument.
-}
encodeFullCandidateInput : FullCandidateInput -> Value
encodeFullCandidateInput input____ =
    Encode.maybeObject
        [ ( "gender", Encode.enum Admin.Enum.Gender.toString |> Encode.optional input____.gender ), ( "firstname", Encode.string |> Encode.optional input____.firstname ), ( "firstname2", Encode.string |> Encode.optional input____.firstname2 ), ( "firstname3", Encode.string |> Encode.optional input____.firstname3 ), ( "lastname", Encode.string |> Encode.optional input____.lastname ), ( "email", Encode.string |> Encode.optional input____.email ), ( "phone", Encode.string |> Encode.optional input____.phone ), ( "highestDegreeId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.optional input____.highestDegreeId ), ( "vulnerabilityIndicatorId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.optional input____.vulnerabilityIndicatorId ) ]


buildFundingRequestInput :
    FundingRequestInputRequiredFields
    -> (FundingRequestInputOptionalFields -> FundingRequestInputOptionalFields)
    -> FundingRequestInput
buildFundingRequestInput required____ fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { companionId = Absent }
    in
    { companionId = optionals____.companionId, diagnosisHourCount = required____.diagnosisHourCount, diagnosisCost = required____.diagnosisCost, postExamHourCount = required____.postExamHourCount, postExamCost = required____.postExamCost, individualHourCount = required____.individualHourCount, individualCost = required____.individualCost, collectiveHourCount = required____.collectiveHourCount, collectiveCost = required____.collectiveCost, basicSkillsIds = required____.basicSkillsIds, basicSkillsHourCount = required____.basicSkillsHourCount, basicSkillsCost = required____.basicSkillsCost, mandatoryTrainingsIds = required____.mandatoryTrainingsIds, mandatoryTrainingsHourCount = required____.mandatoryTrainingsHourCount, mandatoryTrainingsCost = required____.mandatoryTrainingsCost, certificateSkills = required____.certificateSkills, certificateSkillsHourCount = required____.certificateSkillsHourCount, certificateSkillsCost = required____.certificateSkillsCost, otherTraining = required____.otherTraining, examHourCount = required____.examHourCount, examCost = required____.examCost }


type alias FundingRequestInputRequiredFields =
    { diagnosisHourCount : Int
    , diagnosisCost : Data.Scalar.Decimal
    , postExamHourCount : Int
    , postExamCost : Data.Scalar.Decimal
    , individualHourCount : Int
    , individualCost : Data.Scalar.Decimal
    , collectiveHourCount : Int
    , collectiveCost : Data.Scalar.Decimal
    , basicSkillsIds : List Data.Scalar.Uuid
    , basicSkillsHourCount : Int
    , basicSkillsCost : Data.Scalar.Decimal
    , mandatoryTrainingsIds : List Data.Scalar.Uuid
    , mandatoryTrainingsHourCount : Int
    , mandatoryTrainingsCost : Data.Scalar.Decimal
    , certificateSkills : String
    , certificateSkillsHourCount : Int
    , certificateSkillsCost : Data.Scalar.Decimal
    , otherTraining : String
    , examHourCount : Int
    , examCost : Data.Scalar.Decimal
    }


type alias FundingRequestInputOptionalFields =
    { companionId : OptionalArgument Data.Scalar.Uuid }


{-| Type for the FundingRequestInput input object.
-}
type alias FundingRequestInput =
    { companionId : OptionalArgument Data.Scalar.Uuid
    , diagnosisHourCount : Int
    , diagnosisCost : Data.Scalar.Decimal
    , postExamHourCount : Int
    , postExamCost : Data.Scalar.Decimal
    , individualHourCount : Int
    , individualCost : Data.Scalar.Decimal
    , collectiveHourCount : Int
    , collectiveCost : Data.Scalar.Decimal
    , basicSkillsIds : List Data.Scalar.Uuid
    , basicSkillsHourCount : Int
    , basicSkillsCost : Data.Scalar.Decimal
    , mandatoryTrainingsIds : List Data.Scalar.Uuid
    , mandatoryTrainingsHourCount : Int
    , mandatoryTrainingsCost : Data.Scalar.Decimal
    , certificateSkills : String
    , certificateSkillsHourCount : Int
    , certificateSkillsCost : Data.Scalar.Decimal
    , otherTraining : String
    , examHourCount : Int
    , examCost : Data.Scalar.Decimal
    }


{-| Encode a FundingRequestInput into a value that can be used as an argument.
-}
encodeFundingRequestInput : FundingRequestInput -> Value
encodeFundingRequestInput input____ =
    Encode.maybeObject
        [ ( "companionId", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.optional input____.companionId ), ( "diagnosisHourCount", Encode.int input____.diagnosisHourCount |> Just ), ( "diagnosisCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.diagnosisCost |> Just ), ( "postExamHourCount", Encode.int input____.postExamHourCount |> Just ), ( "postExamCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.postExamCost |> Just ), ( "individualHourCount", Encode.int input____.individualHourCount |> Just ), ( "individualCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.individualCost |> Just ), ( "collectiveHourCount", Encode.int input____.collectiveHourCount |> Just ), ( "collectiveCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.collectiveCost |> Just ), ( "basicSkillsIds", ((Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.list) input____.basicSkillsIds |> Just ), ( "basicSkillsHourCount", Encode.int input____.basicSkillsHourCount |> Just ), ( "basicSkillsCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.basicSkillsCost |> Just ), ( "mandatoryTrainingsIds", ((Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.list) input____.mandatoryTrainingsIds |> Just ), ( "mandatoryTrainingsHourCount", Encode.int input____.mandatoryTrainingsHourCount |> Just ), ( "mandatoryTrainingsCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.mandatoryTrainingsCost |> Just ), ( "certificateSkills", Encode.string input____.certificateSkills |> Just ), ( "certificateSkillsHourCount", Encode.int input____.certificateSkillsHourCount |> Just ), ( "certificateSkillsCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.certificateSkillsCost |> Just ), ( "otherTraining", Encode.string input____.otherTraining |> Just ), ( "examHourCount", Encode.int input____.examHourCount |> Just ), ( "examCost", (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecDecimal) input____.examCost |> Just ) ]


buildPaymentRequestInput :
    PaymentRequestInputRequiredFields
    -> PaymentRequestInput
buildPaymentRequestInput required____ =
    { diagnosisEffectiveHourCount = required____.diagnosisEffectiveHourCount, postExamEffectiveHourCount = required____.postExamEffectiveHourCount, individualEffectiveHourCount = required____.individualEffectiveHourCount, collectiveEffectiveHourCount = required____.collectiveEffectiveHourCount, mandatoryTrainingsEffectiveHourCount = required____.mandatoryTrainingsEffectiveHourCount, basicSkillsEffectiveHourCount = required____.basicSkillsEffectiveHourCount, certificateSkillsEffectiveHourCount = required____.certificateSkillsEffectiveHourCount, examEffectiveHourCount = required____.examEffectiveHourCount, invoiceNumber = required____.invoiceNumber }


type alias PaymentRequestInputRequiredFields =
    { diagnosisEffectiveHourCount : Int
    , postExamEffectiveHourCount : Int
    , individualEffectiveHourCount : Int
    , collectiveEffectiveHourCount : Int
    , mandatoryTrainingsEffectiveHourCount : Int
    , basicSkillsEffectiveHourCount : Int
    , certificateSkillsEffectiveHourCount : Int
    , examEffectiveHourCount : Int
    , invoiceNumber : String
    }


{-| Type for the PaymentRequestInput input object.
-}
type alias PaymentRequestInput =
    { diagnosisEffectiveHourCount : Int
    , postExamEffectiveHourCount : Int
    , individualEffectiveHourCount : Int
    , collectiveEffectiveHourCount : Int
    , mandatoryTrainingsEffectiveHourCount : Int
    , basicSkillsEffectiveHourCount : Int
    , certificateSkillsEffectiveHourCount : Int
    , examEffectiveHourCount : Int
    , invoiceNumber : String
    }


{-| Encode a PaymentRequestInput into a value that can be used as an argument.
-}
encodePaymentRequestInput : PaymentRequestInput -> Value
encodePaymentRequestInput input____ =
    Encode.maybeObject
        [ ( "diagnosisEffectiveHourCount", Encode.int input____.diagnosisEffectiveHourCount |> Just ), ( "postExamEffectiveHourCount", Encode.int input____.postExamEffectiveHourCount |> Just ), ( "individualEffectiveHourCount", Encode.int input____.individualEffectiveHourCount |> Just ), ( "collectiveEffectiveHourCount", Encode.int input____.collectiveEffectiveHourCount |> Just ), ( "mandatoryTrainingsEffectiveHourCount", Encode.int input____.mandatoryTrainingsEffectiveHourCount |> Just ), ( "basicSkillsEffectiveHourCount", Encode.int input____.basicSkillsEffectiveHourCount |> Just ), ( "certificateSkillsEffectiveHourCount", Encode.int input____.certificateSkillsEffectiveHourCount |> Just ), ( "examEffectiveHourCount", Encode.int input____.examEffectiveHourCount |> Just ), ( "invoiceNumber", Encode.string input____.invoiceNumber |> Just ) ]


buildSubscriptionRequestInput :
    SubscriptionRequestInputRequiredFields
    -> SubscriptionRequestInput
buildSubscriptionRequestInput required____ =
    { companyName = required____.companyName, companyLegalStatus = required____.companyLegalStatus, companySiret = required____.companySiret, companyAddress = required____.companyAddress, companyBillingAddress = required____.companyBillingAddress, companyBillingEmail = required____.companyBillingEmail, companyBic = required____.companyBic, companyIban = required____.companyIban, accountFirstname = required____.accountFirstname, accountLastname = required____.accountLastname, accountEmail = required____.accountEmail, accountPhoneNumber = required____.accountPhoneNumber }


type alias SubscriptionRequestInputRequiredFields =
    { companyName : String
    , companyLegalStatus : Admin.Enum.LegalStatus.LegalStatus
    , companySiret : String
    , companyAddress : String
    , companyBillingAddress : String
    , companyBillingEmail : String
    , companyBic : String
    , companyIban : String
    , accountFirstname : String
    , accountLastname : String
    , accountEmail : String
    , accountPhoneNumber : String
    }


{-| Type for the SubscriptionRequestInput input object.
-}
type alias SubscriptionRequestInput =
    { companyName : String
    , companyLegalStatus : Admin.Enum.LegalStatus.LegalStatus
    , companySiret : String
    , companyAddress : String
    , companyBillingAddress : String
    , companyBillingEmail : String
    , companyBic : String
    , companyIban : String
    , accountFirstname : String
    , accountLastname : String
    , accountEmail : String
    , accountPhoneNumber : String
    }


{-| Encode a SubscriptionRequestInput into a value that can be used as an argument.
-}
encodeSubscriptionRequestInput : SubscriptionRequestInput -> Value
encodeSubscriptionRequestInput input____ =
    Encode.maybeObject
        [ ( "companyName", Encode.string input____.companyName |> Just ), ( "companyLegalStatus", Encode.enum Admin.Enum.LegalStatus.toString input____.companyLegalStatus |> Just ), ( "companySiret", Encode.string input____.companySiret |> Just ), ( "companyAddress", Encode.string input____.companyAddress |> Just ), ( "companyBillingAddress", Encode.string input____.companyBillingAddress |> Just ), ( "companyBillingEmail", Encode.string input____.companyBillingEmail |> Just ), ( "companyBic", Encode.string input____.companyBic |> Just ), ( "companyIban", Encode.string input____.companyIban |> Just ), ( "accountFirstname", Encode.string input____.accountFirstname |> Just ), ( "accountLastname", Encode.string input____.accountLastname |> Just ), ( "accountEmail", Encode.string input____.accountEmail |> Just ), ( "accountPhoneNumber", Encode.string input____.accountPhoneNumber |> Just ) ]


buildSubscriptionRequestOrderByInput :
    (SubscriptionRequestOrderByInputOptionalFields -> SubscriptionRequestOrderByInputOptionalFields)
    -> SubscriptionRequestOrderByInput
buildSubscriptionRequestOrderByInput fillOptionals____ =
    let
        optionals____ =
            fillOptionals____
                { companyName = Absent, accountLastname = Absent }
    in
    { companyName = optionals____.companyName, accountLastname = optionals____.accountLastname }


type alias SubscriptionRequestOrderByInputOptionalFields =
    { companyName : OptionalArgument Admin.Enum.Sort.Sort
    , accountLastname : OptionalArgument Admin.Enum.Sort.Sort
    }


{-| Type for the SubscriptionRequestOrderByInput input object.
-}
type alias SubscriptionRequestOrderByInput =
    { companyName : OptionalArgument Admin.Enum.Sort.Sort
    , accountLastname : OptionalArgument Admin.Enum.Sort.Sort
    }


{-| Encode a SubscriptionRequestOrderByInput into a value that can be used as an argument.
-}
encodeSubscriptionRequestOrderByInput : SubscriptionRequestOrderByInput -> Value
encodeSubscriptionRequestOrderByInput input____ =
    Encode.maybeObject
        [ ( "companyName", Encode.enum Admin.Enum.Sort.toString |> Encode.optional input____.companyName ), ( "accountLastname", Encode.enum Admin.Enum.Sort.toString |> Encode.optional input____.accountLastname ) ]


buildTrainingInput :
    TrainingInputRequiredFields
    -> TrainingInput
buildTrainingInput required____ =
    { certificateSkills = required____.certificateSkills, otherTraining = required____.otherTraining, individualHourCount = required____.individualHourCount, collectiveHourCount = required____.collectiveHourCount, additionalHourCount = required____.additionalHourCount, validatedByCandidate = required____.validatedByCandidate, basicSkillIds = required____.basicSkillIds, mandatoryTrainingIds = required____.mandatoryTrainingIds, isCertificationPartial = required____.isCertificationPartial }


type alias TrainingInputRequiredFields =
    { certificateSkills : String
    , otherTraining : String
    , individualHourCount : Int
    , collectiveHourCount : Int
    , additionalHourCount : Int
    , validatedByCandidate : Bool
    , basicSkillIds : List Data.Scalar.Uuid
    , mandatoryTrainingIds : List Data.Scalar.Uuid
    , isCertificationPartial : Bool
    }


{-| Type for the TrainingInput input object.
-}
type alias TrainingInput =
    { certificateSkills : String
    , otherTraining : String
    , individualHourCount : Int
    , collectiveHourCount : Int
    , additionalHourCount : Int
    , validatedByCandidate : Bool
    , basicSkillIds : List Data.Scalar.Uuid
    , mandatoryTrainingIds : List Data.Scalar.Uuid
    , isCertificationPartial : Bool
    }


{-| Encode a TrainingInput into a value that can be used as an argument.
-}
encodeTrainingInput : TrainingInput -> Value
encodeTrainingInput input____ =
    Encode.maybeObject
        [ ( "certificateSkills", Encode.string input____.certificateSkills |> Just ), ( "otherTraining", Encode.string input____.otherTraining |> Just ), ( "individualHourCount", Encode.int input____.individualHourCount |> Just ), ( "collectiveHourCount", Encode.int input____.collectiveHourCount |> Just ), ( "additionalHourCount", Encode.int input____.additionalHourCount |> Just ), ( "validatedByCandidate", Encode.bool input____.validatedByCandidate |> Just ), ( "basicSkillIds", ((Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.list) input____.basicSkillIds |> Just ), ( "mandatoryTrainingIds", ((Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) |> Encode.list) input____.mandatoryTrainingIds |> Just ), ( "isCertificationPartial", Encode.bool input____.isCertificationPartial |> Just ) ]
