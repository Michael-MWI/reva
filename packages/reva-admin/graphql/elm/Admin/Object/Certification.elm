-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.Certification exposing (..)

import Admin.Enum.CertificationStatus
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
import Json.Decode as Decode


id : SelectionSet Data.Scalar.Id Admin.Object.Certification
id =
    Object.selectionForField "Data.Scalar.Id" "id" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecId |> .decoder)


label : SelectionSet String Admin.Object.Certification
label =
    Object.selectionForField "String" "label" [] Decode.string


summary : SelectionSet String Admin.Object.Certification
summary =
    Object.selectionForField "String" "summary" [] Decode.string


acronym : SelectionSet String Admin.Object.Certification
acronym =
    Object.selectionForField "String" "acronym" [] Decode.string


level : SelectionSet Int Admin.Object.Certification
level =
    Object.selectionForField "Int" "level" [] Decode.int


activities : SelectionSet (Maybe String) Admin.Object.Certification
activities =
    Object.selectionForField "(Maybe String)" "activities" [] (Decode.string |> Decode.nullable)


activityArea : SelectionSet (Maybe String) Admin.Object.Certification
activityArea =
    Object.selectionForField "(Maybe String)" "activityArea" [] (Decode.string |> Decode.nullable)


accessibleJobType : SelectionSet (Maybe String) Admin.Object.Certification
accessibleJobType =
    Object.selectionForField "(Maybe String)" "accessibleJobType" [] (Decode.string |> Decode.nullable)


abilities : SelectionSet (Maybe String) Admin.Object.Certification
abilities =
    Object.selectionForField "(Maybe String)" "abilities" [] (Decode.string |> Decode.nullable)


codeRncp : SelectionSet String Admin.Object.Certification
codeRncp =
    Object.selectionForField "String" "codeRncp" [] Decode.string


status : SelectionSet Admin.Enum.CertificationStatus.CertificationStatus Admin.Object.Certification
status =
    Object.selectionForField "Enum.CertificationStatus.CertificationStatus" "status" [] Admin.Enum.CertificationStatus.decoder
