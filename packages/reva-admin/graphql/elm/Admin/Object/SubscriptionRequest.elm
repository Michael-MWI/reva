-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.SubscriptionRequest exposing (..)

import Admin.Enum.LegalStatus
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


id : SelectionSet Data.Scalar.Id Admin.Object.SubscriptionRequest
id =
    Object.selectionForField "Data.Scalar.Id" "id" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecId |> .decoder)


companyName : SelectionSet String Admin.Object.SubscriptionRequest
companyName =
    Object.selectionForField "String" "companyName" [] Decode.string


companyLegalStatus : SelectionSet Admin.Enum.LegalStatus.LegalStatus Admin.Object.SubscriptionRequest
companyLegalStatus =
    Object.selectionForField "Enum.LegalStatus.LegalStatus" "companyLegalStatus" [] Admin.Enum.LegalStatus.decoder


companySiret : SelectionSet String Admin.Object.SubscriptionRequest
companySiret =
    Object.selectionForField "String" "companySiret" [] Decode.string


companyAddress : SelectionSet String Admin.Object.SubscriptionRequest
companyAddress =
    Object.selectionForField "String" "companyAddress" [] Decode.string


companyBillingAddress : SelectionSet String Admin.Object.SubscriptionRequest
companyBillingAddress =
    Object.selectionForField "String" "companyBillingAddress" [] Decode.string


companyBillingEmail : SelectionSet String Admin.Object.SubscriptionRequest
companyBillingEmail =
    Object.selectionForField "String" "companyBillingEmail" [] Decode.string


companyBic : SelectionSet String Admin.Object.SubscriptionRequest
companyBic =
    Object.selectionForField "String" "companyBic" [] Decode.string


companyIban : SelectionSet String Admin.Object.SubscriptionRequest
companyIban =
    Object.selectionForField "String" "companyIban" [] Decode.string


accountFirstname : SelectionSet String Admin.Object.SubscriptionRequest
accountFirstname =
    Object.selectionForField "String" "accountFirstname" [] Decode.string


accountLastname : SelectionSet String Admin.Object.SubscriptionRequest
accountLastname =
    Object.selectionForField "String" "accountLastname" [] Decode.string


accountEmail : SelectionSet String Admin.Object.SubscriptionRequest
accountEmail =
    Object.selectionForField "String" "accountEmail" [] Decode.string


accountPhoneNumber : SelectionSet String Admin.Object.SubscriptionRequest
accountPhoneNumber =
    Object.selectionForField "String" "accountPhoneNumber" [] Decode.string
