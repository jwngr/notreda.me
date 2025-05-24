# Data Notes | notreda.me

## Table of Contents

- [Overview](#overview)
- [Location](#location)
- [Kickoff date](#kickoff-date)
- [Weather](#weather)
- [Nickname](#nickname)
- [Edge Cases](#edge-cases)
  - [Long Strings](#long-strings)
  - [Short Strings](#short-strings)

## Overview

Given the drastic variation in the amount of data available for historic Notre Dame football games,
[the collected data](../data/) contains many irregularities which are difficult to keep
track of. This page notes the most important ones for easy reference.

### Location

The `location` object can have any of the following formats:

1. `"TBD"` - Future games which do not yet have a game location.
1. `{city, state, stadium}` - Completed and future domestic games.
1. `{city, state}` - Completed domestic games without stadium information.
1. `{city, country, stadium}` - Completed and future international games.
1. **Not present** - Notre Dame home games (non-neutral site) where the location is computed
   dynamically at runtime based on the season and date.

### Kickoff date

The `date` must be one of the following formats:

1. Long `string` (1965 - present) - ISO 8601 date string (e.g., "2014-08-30T18:30:00-05:00") with
   date and time
1. Short `string` (1887 - 1964) - Short date string for games with known dates but no time (e.g., "04/20/1888")
1. `"TBD"` - Future games without a scheduled date

### Weather

Weather is not available for many completed games. All games prior to the 1936 season and even games
as recent as 1989 are missing weather info.

Weather is only present for future games with set kickoff times which are less than a week away. As
such, most future games - with the possible exception of the next upcoming game - are missing
weather info.

All games with a `weather` key have the following format:

- `icon` - Weather conditions, as determined by [OpenWeather](https://openweathermap.org/). This is
always present, but may have a value of "unknown" if accurate data was not available.
- `temperature` - Temperature at kickoff, rounded to the nearest degree Fahrenheit.

### Nickname

Some teams do not have a nickname, including Rush Medical (1894), Illinois Cycling Club (1895), and
Indianapolis Artillery (1895).

### Edge Cases

#### Long Strings

- **Longest team name:** Chicago Physicians & Surgeons (CHI-P&S) [29 letters]
- **Longest team nickname:** Fighting Engineers (ROSE) [18 letters]

#### Short Strings

- **Shortest team name:** USC (USC) [3 letters]
- **Shortest team nickname:** Fighting Engineers (ROSE) [18 letters]
