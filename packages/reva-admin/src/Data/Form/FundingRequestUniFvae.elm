module Data.Form.FundingRequestUniFvae exposing (FundingRequest, fromDict, keys, maybeFundingRequest, toDict, validate)

import Admin.Enum.Gender exposing (Gender(..))
import Admin.Scalar exposing (Decimal, Uuid)
import Data.Candidacy exposing (Candidacy)
import Data.Candidate exposing (genderFromString, genderToString)
import Data.Form exposing (FormData)
import Data.Form.Helper as Helper
import Data.Referential exposing (BasicSkill, MandatoryTraining, Referential)
import Dict exposing (Dict)


keys =
    { candidateSecondname = "candidateSecondname"
    , candidateThirdname = "candidateThirdname"
    , candidateGender = "candidateGender"
    , individualHourCount = "individualHourCount"
    , individualCost = "individualCost"
    , collectiveHourCount = "collectiveHourCount"
    , collectiveCost = "collectiveCost"
    , mandatoryTrainingIds = "mandatoryTrainingIds"
    , mandatoryTrainingsHourCount = "mandatoryTrainingsHourCount"
    , mandatoryTrainingsCost = "mandatoryTrainingsCost"
    , basicSkillsIds = "basicSkillsIds"
    , basicSkillsHourCount = "basicSkillsHourCount"
    , basicSkillsCost = "basicSkillsCost"
    , certificateSkillsHourCount = "certificateSkillsHourCount"
    , certificateSkillsCost = "certificateSkillsCost"
    , otherTrainingHourCount = "otherTrainingHourCount"
    , otherTrainingCost = "otherTrainingCost"
    }


fromDict : List BasicSkill -> List MandatoryTraining -> FormData -> FundingRequest
fromDict basicSkillsIds mandatoryTrainingIds formData =
    let
        decode =
            Helper.decode keys formData
    in
    FundingRequest
        (decode.maybe.string .candidateSecondname)
        (decode.maybe.string .candidateThirdname)
        (decode.generic .candidateGender genderFromString Undisclosed)
        (decode.decimal .individualHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .individualCost (Admin.Scalar.Decimal "0"))
        (decode.decimal .collectiveHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .collectiveCost (Admin.Scalar.Decimal "0"))
        (decode.list basicSkillsIds)
        (decode.decimal .basicSkillsHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .basicSkillsCost (Admin.Scalar.Decimal "0"))
        (decode.list mandatoryTrainingIds)
        (decode.decimal .mandatoryTrainingsHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .mandatoryTrainingsCost (Admin.Scalar.Decimal "0"))
        (decode.decimal .certificateSkillsHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .certificateSkillsCost (Admin.Scalar.Decimal "0"))
        (decode.decimal .otherTrainingHourCount (Admin.Scalar.Decimal "0"))
        (decode.decimal .otherTrainingCost (Admin.Scalar.Decimal "0"))


type alias FundingRequest =
    { candidateSecondname : Maybe String
    , candidateThirdname : Maybe String
    , candidateGender : Gender
    , individualHourCount : Decimal
    , individualCost : Decimal
    , collectiveHourCount : Decimal
    , collectiveCost : Decimal
    , basicSkillsIds : List String
    , basicSkillsHourCount : Decimal
    , basicSkillsCost : Decimal
    , mandatoryTrainingIds : List String
    , mandatoryTrainingsHourCount : Decimal
    , mandatoryTrainingsCost : Decimal
    , certificateSkillsHourCount : Decimal
    , certificateSkillsCost : Decimal
    , otherTrainingHourCount : Decimal
    , otherTrainingCost : Decimal
    }


validate : ( Candidacy, Referential ) -> FormData -> Result (List String) ()
validate ( candidacy, _ ) formData =
    Result.Ok ()


toDict : FundingRequest -> Dict String String
toDict funding =
    let
        string key =
            Just <| key funding

        decimal key =
            Just <| Helper.decimalToString <| key funding

        mandatoryTrainingsChecked =
            Helper.toCheckedList funding.mandatoryTrainingIds

        basicSkillsChecked =
            Helper.toCheckedList funding.basicSkillsIds

        fundingList =
            [ ( .candidateSecondname, string (.candidateSecondname >> Maybe.withDefault "") )
            , ( .candidateGender, Just (genderToString funding.candidateGender) )
            , ( .candidateThirdname, string (.candidateThirdname >> Maybe.withDefault "") )
            , ( .individualHourCount, decimal .individualHourCount )
            , ( .individualCost, decimal .individualCost )
            , ( .collectiveHourCount, decimal .collectiveHourCount )
            , ( .collectiveCost, decimal .collectiveCost )
            , ( .basicSkillsHourCount, decimal .basicSkillsHourCount )
            , ( .basicSkillsCost, decimal .basicSkillsCost )
            , ( .mandatoryTrainingsHourCount, decimal .mandatoryTrainingsHourCount )
            , ( .mandatoryTrainingsCost, decimal .mandatoryTrainingsCost )
            , ( .certificateSkillsHourCount, decimal .certificateSkillsHourCount )
            , ( .certificateSkillsCost, decimal .certificateSkillsCost )
            , ( .otherTrainingHourCount, decimal .otherTrainingHourCount )
            , ( .otherTrainingCost, decimal .otherTrainingCost )
            ]
                |> Helper.toKeyedList keys
    in
    Dict.fromList (mandatoryTrainingsChecked ++ basicSkillsChecked ++ fundingList)


defaultFundingRequest : List Uuid -> List Uuid -> Dict String String
defaultFundingRequest basicSkillIds mandatoryTrainingIds =
    let
        mandatoryTrainingsChecked =
            Helper.uuidToCheckedList mandatoryTrainingIds

        basicSkillsChecked =
            Helper.uuidToCheckedList basicSkillIds
    in
    Dict.fromList (mandatoryTrainingsChecked ++ basicSkillsChecked)


maybeFundingRequest : Maybe FundingRequest -> List Uuid -> List Uuid -> Dict String String
maybeFundingRequest maybeFr basicSkillIds mandatoryTrainingIds =
    case maybeFr of
        Just funding ->
            toDict funding

        Nothing ->
            defaultFundingRequest basicSkillIds mandatoryTrainingIds
