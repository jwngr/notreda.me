DATA IRREGULARITIES (institutional knowledge I need to write down):

- Locations come in four forms:
  {city, state, stadium} (games played inside the USA; many games)
  {city, state} (games played inside the USA without a stadium; many games)
  {city, country, stadium} (games played outside the USA; few games)
  "TBD" (future games that do not have a location set yet; few games)
  Some coordinates are not super accurate (mostly the older stadiums that don't show up right away on Google Maps; those I just picked the center of the city or whatever default football stadium it had, even if it wasn't the same stadium name)
- Timestamps comes in N forms:
  fullDate
  date + time (played games)
  date (future games with no time set yet)
  timestamp (recently removed from codebase, was it a good idea or not?)
- isHomeGame
  May be wrong for many Navy games?
- weather
  - Many old games do not have any weather info.
  - All games with weather have both temperature and icon (although icon is "unknown" for many games)
  - Most future games (except maybe the next game) do not have any weather info.
- Team names
  - Longest: Chicago Physicians & Surgeons (CHI-P&S; 29 letters)
  - Shortest: USC (USC; 3 letters)
- Nicknames
  - Longest: Fighting Engineers (ROSE; 18 letters)
  - Shortest: Utes (Utah; 4 letters); Owls (Rice; 4 letters)
  - Some team do not have a nickname (e.g, Rush Medical (1894), Illinois Cycling Club (1895), Indianapolis Artillery (1895))

Run test with every property to see if I can completely list all of them and determine if they
should be cleaned up if they are trying to do too much.

TODO task:

- Add stadiums for away games without stadiums (and make sure to update the lat / lons and weather for that game as a result)
