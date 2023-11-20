-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Object.OrganismInformationsCommerciales exposing (..)

import Admin.Enum.ConformiteNormeAccessibilite
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


id : SelectionSet Data.Scalar.Uuid Admin.Object.OrganismInformationsCommerciales
id =
    Object.selectionForField "Data.Scalar.Uuid" "id" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecUuid |> .decoder)


organismId : SelectionSet Data.Scalar.Uuid Admin.Object.OrganismInformationsCommerciales
organismId =
    Object.selectionForField "Data.Scalar.Uuid" "organismId" [] (Data.Scalar.codecs |> Admin.Scalar.unwrapCodecs |> .codecUuid |> .decoder)


nom : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
nom =
    Object.selectionForField "(Maybe String)" "nom" [] (Decode.string |> Decode.nullable)


telephone : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
telephone =
    Object.selectionForField "(Maybe String)" "telephone" [] (Decode.string |> Decode.nullable)


siteInternet : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
siteInternet =
    Object.selectionForField "(Maybe String)" "siteInternet" [] (Decode.string |> Decode.nullable)


emailContact : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
emailContact =
    Object.selectionForField "(Maybe String)" "emailContact" [] (Decode.string |> Decode.nullable)


adresseNumeroEtNomDeRue : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
adresseNumeroEtNomDeRue =
    Object.selectionForField "(Maybe String)" "adresseNumeroEtNomDeRue" [] (Decode.string |> Decode.nullable)


adresseInformationsComplementaires : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
adresseInformationsComplementaires =
    Object.selectionForField "(Maybe String)" "adresseInformationsComplementaires" [] (Decode.string |> Decode.nullable)


adresseCodePostal : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
adresseCodePostal =
    Object.selectionForField "(Maybe String)" "adresseCodePostal" [] (Decode.string |> Decode.nullable)


adresseVille : SelectionSet (Maybe String) Admin.Object.OrganismInformationsCommerciales
adresseVille =
    Object.selectionForField "(Maybe String)" "adresseVille" [] (Decode.string |> Decode.nullable)


conformeNormesAccessbilite : SelectionSet (Maybe Admin.Enum.ConformiteNormeAccessibilite.ConformiteNormeAccessibilite) Admin.Object.OrganismInformationsCommerciales
conformeNormesAccessbilite =
    Object.selectionForField "(Maybe Enum.ConformiteNormeAccessibilite.ConformiteNormeAccessibilite)" "conformeNormesAccessbilite" [] (Admin.Enum.ConformiteNormeAccessibilite.decoder |> Decode.nullable)
