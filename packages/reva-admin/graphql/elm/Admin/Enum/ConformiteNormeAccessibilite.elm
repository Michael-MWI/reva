-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Admin.Enum.ConformiteNormeAccessibilite exposing (..)

import Json.Decode as Decode exposing (Decoder)


type ConformiteNormeAccessibilite
    = Conforme
    | NonConforme
    | EtablissementNeRecoitPasDePublic


list : List ConformiteNormeAccessibilite
list =
    [ Conforme, NonConforme, EtablissementNeRecoitPasDePublic ]


decoder : Decoder ConformiteNormeAccessibilite
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "CONFORME" ->
                        Decode.succeed Conforme

                    "NON_CONFORME" ->
                        Decode.succeed NonConforme

                    "ETABLISSEMENT_NE_RECOIT_PAS_DE_PUBLIC" ->
                        Decode.succeed EtablissementNeRecoitPasDePublic

                    _ ->
                        Decode.fail ("Invalid ConformiteNormeAccessibilite type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : ConformiteNormeAccessibilite -> String
toString enum____ =
    case enum____ of
        Conforme ->
            "CONFORME"

        NonConforme ->
            "NON_CONFORME"

        EtablissementNeRecoitPasDePublic ->
            "ETABLISSEMENT_NE_RECOIT_PAS_DE_PUBLIC"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe ConformiteNormeAccessibilite
fromString enumString____ =
    case enumString____ of
        "CONFORME" ->
            Just Conforme

        "NON_CONFORME" ->
            Just NonConforme

        "ETABLISSEMENT_NE_RECOIT_PAS_DE_PUBLIC" ->
            Just EtablissementNeRecoitPasDePublic

        _ ->
            Nothing
