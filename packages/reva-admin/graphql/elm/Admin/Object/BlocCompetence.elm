-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.BlocCompetence exposing (..)

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


code : SelectionSet String Admin.Object.BlocCompetence
code =
    Object.selectionForField "String" "CODE" [] Decode.string


libelle : SelectionSet String Admin.Object.BlocCompetence
libelle =
    Object.selectionForField "String" "LIBELLE" [] Decode.string


listeCompetences : SelectionSet String Admin.Object.BlocCompetence
listeCompetences =
    Object.selectionForField "String" "LISTE_COMPETENCES" [] Decode.string


parsedCompetences : SelectionSet (List String) Admin.Object.BlocCompetence
parsedCompetences =
    Object.selectionForField "(List String)" "PARSED_COMPETENCES" [] (Decode.string |> Decode.list)


modalitesEvaluation : SelectionSet (Maybe String) Admin.Object.BlocCompetence
modalitesEvaluation =
    Object.selectionForField "(Maybe String)" "MODALITES_EVALUATION" [] (Decode.string |> Decode.nullable)


facultatif : SelectionSet (Maybe Bool) Admin.Object.BlocCompetence
facultatif =
    Object.selectionForField "(Maybe Bool)" "FACULTATIF" [] (Decode.bool |> Decode.nullable)
