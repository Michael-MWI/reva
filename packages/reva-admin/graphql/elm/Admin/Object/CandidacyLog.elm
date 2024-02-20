-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.CandidacyLog exposing (..)

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


id : SelectionSet Data.Scalar.Id Admin.Object.CandidacyLog
id =
    Object.selectionForField "Data.Scalar.Id" "id" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecId |> .decoder)


userAccount :
    SelectionSet decodesTo Admin.Object.Account
    -> SelectionSet decodesTo Admin.Object.CandidacyLog
userAccount object____ =
    Object.selectionForCompositeField "userAccount" [] object____ Basics.identity


message : SelectionSet String Admin.Object.CandidacyLog
message =
    Object.selectionForField "String" "message" [] Decode.string


createdAt : SelectionSet Data.Scalar.Timestamp Admin.Object.CandidacyLog
createdAt =
    Object.selectionForField "Data.Scalar.Timestamp" "createdAt" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecTimestamp |> .decoder)
