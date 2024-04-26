module Data.Jury exposing (Jury)

import Admin.Enum.JuryResult exposing (JuryResult)
import Time exposing (Posix)


type alias Jury =
    { dateOfSession : Posix
    , addressOfSession : Maybe String
    , informationOfSession : Maybe String
    , informationOfResult : Maybe String
    , result : Maybe JuryResult
    }
