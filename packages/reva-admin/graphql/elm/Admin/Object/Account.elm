-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.Account exposing (..)

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


id : SelectionSet Data.Scalar.Uuid Admin.Object.Account
id =
    Object.selectionForField "Data.Scalar.Uuid" "id" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecUuid |> .decoder)


keycloakId : SelectionSet String Admin.Object.Account
keycloakId =
    Object.selectionForField "String" "keycloakId" [] Decode.string


email : SelectionSet String Admin.Object.Account
email =
    Object.selectionForField "String" "email" [] Decode.string


firstname : SelectionSet (Maybe String) Admin.Object.Account
firstname =
    Object.selectionForField "(Maybe String)" "firstname" [] (Decode.string |> Decode.nullable)


lastname : SelectionSet (Maybe String) Admin.Object.Account
lastname =
    Object.selectionForField "(Maybe String)" "lastname" [] (Decode.string |> Decode.nullable)


certificationAuthority :
    SelectionSet decodesTo Admin.Object.CertificationAuthority
    -> SelectionSet (Maybe decodesTo) Admin.Object.Account
certificationAuthority object____ =
    Object.selectionForCompositeField "certificationAuthority" [] object____ (Basics.identity >> Decode.nullable)


organism :
    SelectionSet decodesTo Admin.Object.Organism
    -> SelectionSet (Maybe decodesTo) Admin.Object.Account
organism object____ =
    Object.selectionForCompositeField "organism" [] object____ (Basics.identity >> Decode.nullable)


agences :
    SelectionSet decodesTo Admin.Object.Organism
    -> SelectionSet (List decodesTo) Admin.Object.Account
agences object____ =
    Object.selectionForCompositeField "agences" [] object____ (Basics.identity >> Decode.list)
