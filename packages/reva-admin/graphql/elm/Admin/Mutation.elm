-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Mutation exposing (..)

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


account_createAccount : SelectionSet (Maybe Data.Scalar.Void) RootMutation
account_createAccount =
    Object.selectionForField "(Maybe Data.Scalar.Void)" "account_createAccount" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecVoid |> .decoder |> Decode.nullable)


type alias CandidacyCreateCandidacyRequiredArguments =
    { candidacy : Admin.InputObject.CandidacyInput }


candidacy_createCandidacy :
    CandidacyCreateCandidacyRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_createCandidacy requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_createCandidacy" [ Argument.required "candidacy" requiredArgs____.candidacy Admin.InputObject.encodeCandidacyInput ] object____ (Basics.identity >> Decode.nullable)


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
    , regionId : Data.Scalar.Id
    }


candidacy_updateCertification :
    CandidacyUpdateCertificationRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateCertification requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateCertification" [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "certificationId" requiredArgs____.certificationId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "regionId" requiredArgs____.regionId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ (Basics.identity >> Decode.nullable)


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


type alias CandidacyUpdateContactOptionalArguments =
    { email : OptionalArgument String
    , phone : OptionalArgument String
    }


type alias CandidacyUpdateContactRequiredArguments =
    { deviceId : Data.Scalar.Id
    , candidacyId : Data.Scalar.Id
    }


candidacy_updateContact :
    (CandidacyUpdateContactOptionalArguments -> CandidacyUpdateContactOptionalArguments)
    -> CandidacyUpdateContactRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_updateContact fillInOptionals____ requiredArgs____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { email = Absent, phone = Absent }

        optionalArgs____ =
            [ Argument.optional "email" filledInOptionals____.email Encode.string, Argument.optional "phone" filledInOptionals____.phone Encode.string ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "candidacy_updateContact" (optionalArgs____ ++ [ Argument.required "deviceId" requiredArgs____.deviceId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ]) object____ (Basics.identity >> Decode.nullable)


type alias CandidacyArchiveByIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_archiveById :
    CandidacyArchiveByIdRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_archiveById requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_archiveById" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] object____ Basics.identity


type alias CandidacyDeleteByIdRequiredArguments =
    { candidacyId : Data.Scalar.Id }


candidacy_deleteById :
    CandidacyDeleteByIdRequiredArguments
    -> SelectionSet String RootMutation
candidacy_deleteById requiredArgs____ =
    Object.selectionForField "String" "candidacy_deleteById" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId) ] Decode.string


type alias CandidacyUpdateAppointmentInformationsRequiredArguments =
    { candidacyId : Data.Scalar.Id
    , candidateTypologyInformations : Admin.InputObject.CandidateTypologyInformationsInput
    , appointmentInformations : Admin.InputObject.AppointmentInformationsInput
    }


candidacy_updateAppointmentInformations :
    CandidacyUpdateAppointmentInformationsRequiredArguments
    -> SelectionSet decodesTo Admin.Object.Candidacy
    -> SelectionSet decodesTo RootMutation
candidacy_updateAppointmentInformations requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_updateAppointmentInformations" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecId), Argument.required "candidateTypologyInformations" requiredArgs____.candidateTypologyInformations Admin.InputObject.encodeCandidateTypologyInformationsInput, Argument.required "appointmentInformations" requiredArgs____.appointmentInformations Admin.InputObject.encodeAppointmentInformationsInput ] object____ Basics.identity


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
    -> SelectionSet (Maybe decodesTo) RootMutation
candidacy_selectOrganism requiredArgs____ object____ =
    Object.selectionForCompositeField "candidacy_selectOrganism" [ Argument.required "candidacyId" requiredArgs____.candidacyId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid), Argument.required "organismId" requiredArgs____.organismId (Data.Scalar.codecs |> Admin.Scalar.unwrapEncoder .codecUuid) ] object____ (Basics.identity >> Decode.nullable)
