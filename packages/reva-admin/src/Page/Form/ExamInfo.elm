module Page.Form.ExamInfo exposing (..)

import Admin.Enum.ExamResult exposing (..)
import Data.Candidacy exposing (Candidacy)
import Data.ExamInfo exposing (examResultToString)
import Data.Form exposing (FormData)
import Data.Form.ExamInfo
import Data.Referential exposing (Referential)
import Page.Form as Form exposing (Form)


form : FormData -> ( Candidacy, Referential ) -> Form
form formData _ =
    let
        keys =
            Data.Form.ExamInfo.keys

        examResultList =
            [ ( "Non renseigné", Nothing )
            , ( "Réussite", Just Success )
            , ( "Réussite partielle", Just PartialSuccess )
            , ( "Réussite à une demande initiale de certification partielle", Just PartialCertificationSucccess )
            , ( "Échec", Just Failure )
            ]
                |> List.map (\( id, result ) -> ( id, examResultToString result ))

        elements =
            [ ( keys.estimatedExamDate, Form.Date "Date prévisionnelle de passage devant le jury" )
            , ( keys.actualExamDate, Form.Date "Date réelle de passage devant le jury" )
            , ( keys.examResult, Form.Select "Résultat obtenu par le candidat" examResultList )
            ]
    in
    { elements = elements
    , saveLabel = Nothing
    , submitLabel = "Valider"
    , title = "Jury"
    }
