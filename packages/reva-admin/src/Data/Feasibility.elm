module Data.Feasibility exposing (FeasibilityCountByCategory, FeasibilitySummary, FeasibilitySummaryPage, feasibilityCategoryFilterToReadableString)

import Admin.Enum.FeasibilityCategoryFilter exposing (FeasibilityCategoryFilter)
import Data.Pagination exposing (PaginationInfo)
import Data.Scalar


type alias Candidate =
    { firstname : String
    , lastname : String
    }


type alias FeasibilitySummary =
    { id : Data.Scalar.Id
    , feasibilityFileSentAt : Data.Scalar.Timestamp
    , certificationLabel : Maybe String
    , candidateFirstname : Maybe String
    , candidatelastname : Maybe String
    , departmentLabel : Maybe String
    , departmentCode : Maybe String
    }


type alias FeasibilitySummaryPage =
    { rows : List FeasibilitySummary
    , info : PaginationInfo
    }


type alias FeasibilityCountByCategory =
    { all : Int
    }


feasibilityCategoryFilterToReadableString : FeasibilityCategoryFilter -> String
feasibilityCategoryFilterToReadableString categoryFilter =
    case categoryFilter of
        _ ->
            "Tous les dossiers"
