# Data Notes | notreda.me

## Table of Contents

- [Overview](#overview)
- [Location](#location)
- [Date / Time](#date-time)
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

The `location` object is present for all games and can have any of the following formats:

1. `"TBD"` - Future games which do not yet have a game location.
1. `{city, state, stadium}` - Completed and future domestic games.
1. `{city, state}` - Completed domestic games without stadium information.
1. `{city, country, stadium}` - Completed and future international games.

### Date / Time

Game dates and times can have any of the following formats:

1. `{fullDate}` - Completed games with the latest date format.
2. `{date, time}` - Completed games with an older date format that needs to be updated.
3. `{date}` - Completed games with no kickoff time information yet or future games with no scheduled
   kickoff time.

### Weather

Weather is not available for many completed games. All games prior to the 1936 season and even games
as recent as 1989 are missing weather info.

Weather is only present for future games with set kickoff times which are less than a week away. As
such, most future games - with the possible exception of the next upcoming game - are missing
weather info.

All games with a `weather` key have the following format:

- `icon` - Weather conditions, as determined by Dark Sky. This is always present, but may have a
  value of "unknown" if accurate data was not available.
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
