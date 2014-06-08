/**************/
/*  REQUIRES  */
/**************/
var request = require("request");
var cheerio = require("cheerio");
var Firebase = require("firebase");

/***************/
/*  NICKNAMES  */
/***************/
var opponentNicknames = {"Adrian": "TODO","Air Force": "Falcons","Alabama": "Crimson Tide","Albion": "TODO","Alma": " TODO","American Medical": "TODO","Arizona": "Wildcats","Arizona State": "Sun Devils","Army": "Black Knights","BYU": "Cougars","Baylor": "Bears","Beloit": "Buccaneers","Bennett Medical College (Chicago)": "TODO","Boston College": "Eagles","Buchtel (Akron)": "TODO","Butler": "Bulldogs","California": "TODO","Carlisle": "TODO","Carnegie Tech": "TODO","Case Tech": "TODO","Chicago": "TODO","Chicago Dental Surgeons": "TODO","Chicago Medical College": "TODO","Chicago Physicians & Surgeons": "TODO","Christian Brothers": "TODO","Cincinnati": "Bearcats","Clemson": "Tigers","Coe": "Kohawks","College of the Pacific": "TODO","Colorado": "Buffaloes","Connecticut": "Huskies","Creighton": "Blue Jays","Dartmouth": "Big Green","De La Salle": "Green Archers","DePauw": "Tigers","Detroit": "Titans","Drake": "Bulldogs","Duke": "Blue Devils","Englewood High School": "TODO","Florida": "Gators","Florida State": "Seminoles","Franklin": "Grizzlies","Georgia": "Bulldogs","Georgia Tech": "Yellow Jackets","Goshen": "Maple Leafs","Great Lakes": "TODO","Harvard Prep": "TODO","Haskell": "TODO","Hawai'i": "Rainbow Warriors","Highland Views": "TODO","Hillsdale": "TODO","Houston": "Cougars","Illinois": "Fighting Illini","Illinois Cycling Club": "TODO","Indiana": "Hoosiers","Indianapolis Artillery": "TODO","Iowa": "Hawkeyes","Iowa Pre-Flight": "TODO","Kalamazoo": "Fighting Hornets","Kansas": "Jayhawks","Knox": "Prairie Fire","LSU": "Tigers","Lake Forest": "Foresters","Lombard": "TODO","Loyola (Chicago)": "Ramblers","Loyola (New Orleans)": "Wolfpack","Marquette": "Golden Eagles","Maryland": "Terrapins","Miami": "Hurricanes","Miami (Ohio)": "RedHawks","Michigan": "Wolverines","Michigan St": "TODO - change to Michigan State","Michigan State": "Spartans","Minnesota": "Golden Gophers","Mississippi": "Rebels","Missouri": "Tigers","Missouri Osteopaths": "TODO","Morningside": "Mustangs","Morris Harvey": "TODO","Mount Union": "Purple Raiders","Navy": "Midshipmen","Nebraska": "Cornhuskers","Nevada": "Wolf Pack","North Carolina": "Tar Heels","North Carolina State": "Wolfpack","North Division High School (Chicago)": "TODO","Northwestern": "Wildcats","Northwestern Law": "TODO","Ohio Medical University": "TODO","Ohio Northern": "Polar Bears","Ohio State": "Buckeyes","Oklahoma": "Sooners","Olivet": "Tigers","Oregon": "Ducks","Oregon State": "Beavers","Penn": "Quakers","Penn State": "Nittany Lions","Pennsylvania": "TODO - change to Penn?","Pittsburgh": "Panthers","Princeton": "Tigers","Purdue": "Boilermakers","Rice": "Owls","Rose Poly": "TODO","Rush Medical": "TODO","Rutgers": "Scarlet Knights","SMU": "Mustangs","Saint Louis": "Billikens","San Diego State": "Aztecs","South Bend Athletic Club": "TODO","South Bend Commercial Athletic Club": "TODO","South Bend High School": "TODO","South Bend Howard Park": "TODO","South Carolina": "Gamecocks","South Dakota": "Coyotes","South Florida": "Bulls","St. Bonaventure": "Bonnies","St. Viator": "TODO - also normalize on St. or Saint","St. Vincent's (Chicago)": "TODO","Stanford": "Cardinal","Syracuse": "Orange","TCU": "Horned Frogs","Temple": "Owls","Tennessee": "Volunteers","Texas": "Longhorns","Texas A&M": "Aggies","Toledo Athletic Association": "TODO","Tulane": "Green Wave","Tulsa": "Golden Hurricane","UCLA": "Bruins","USC": "Trojans","Utah": "Utes","Valparaiso": "Crusaders","Vanderbilt": "Commodores","Virginia": "Cavaliers","Wabash": "Little Giants","Wake Forest": "Demon Deacons","Washington": "Huskies","Washington & Jefferson": "Presidents","Washington (St. Lous)": "Bears","Washington St": "TODO - normalize St and State","Washington State": "Cougars","West Virginia": "Mountaineers","Western Michigan": "Broncos","Western Reserve": "TODO","Wisconsin": "Badgers","Yale": "Elis"};

// TODO: add auth and prompt to delete old Firebase data
var firebaseRef = new Firebase("https://notreda-me.firebaseio.com/");
firebaseRef.remove(function() {
  /**************/
  /*  SCRAPING  */
  /**************/
  // Loop through every year since 1187
  for (var year = 1887; year < 2016; ++year) {
    // TODO: Skip 1890 and 1891 since und.com doesn't have data for those years

    (function(year) {
      // Get the html of the current year's schedule from und.com
      request({
        uri: "http://www.und.com/sports/m-footbl/sched/data/nd-m-footbl-sched-" + year + ".html"
      }, function(error, response, body) {
        var $ = cheerio.load(body);
        var scheduleTable = $("#schedtable");

        if (scheduleTable.length === 1) {
          console.log("Scraping " + year + " schedule");

          // Loop through each row in the schedule table
          scheduleTable.find("tr").each(function(i, row) {
            // Ignore the headings row
            if (!$(row).hasClass("event-table-headings")) {
              // Rows with four cells constitute an actual game
              var rowCells = $(row).children("td");
              if (rowCells.length === 4) {
                var isBowlGame = false;
                var numOvertimes = 0;

                // Determine if it is a home game
                var isHomeGame = ($(row).attr("bgcolor") === "#d1d1d1");

                // Get the date
                var date = $(rowCells[0]).text().trim();

                // Get the opponent
                var opponent = $(rowCells[1]).text().trim();

                // Ignore Blue-Gold spring games
                if (opponent.indexOf("Game") === -1) {
                  // Strip off the "vs."" or "at" at the beginning
                  opponent = opponent.slice(3).trim();

                  // Remove "(**** Bowl)" from any bowl games
                  if (opponent.indexOf("Bowl") !== -1) {
                    isBowlGame = true;
                    opponent = opponent.split("(")[0].trim();
                  }

                  // Get the opponent's nickname
                  var opponentNickname = opponentNicknames[opponent];

                  // Get the location
                  var location = $(rowCells[2]).text().trim();

                  // TODO: clean up state abbreviations

                  // Get the result
                  var result = $(rowCells[3]).text().trim();

                  // Ignore cancelled games
                  if (result !== "Cancelled") {
                    // If the game has already been played, get the results and scores
                    if (result[0] === "W" || result[0] === "L") {
                      var resultData = result.split(", ");
                      result = resultData[0];
                      var scores = resultData[1].split("-");

                      // Calculate the number of overtimes, if applicable
                      if (scores[1].indexOf("OT") !== -1 || scores[1].indexOf("ot") !== -1) {
                        numOvertimes = scores[1].split("(")[1][0];
                        if (numOvertimes.toUpperCase() === "O") {
                          numOvertimes = 1;
                        }
                        scores[1] = scores[1].split("(")[0];
                      }

                      // Get the home and away scores
                      if ((result === "W" && isHomeGame) || (result === "L" && !isHomeGame)) {
                        homeTeamScore = scores[0];
                        awayTeamScore = scores[1];
                      }
                      else {
                        homeTeamScore = scores[1];
                        awayTeamScore = scores[0];
                      }

                      // Add the game to Firebase
                      console.log("Adding game to Firebase");
                      firebaseRef.child(year).push({
                        homeTeam: {
                          name: (isHomeGame ? "Notre Dame" : opponent),
                          nickname: (isHomeGame ? "Fighting Irish" : opponentNickname),
                          score: homeTeamScore
                        },
                        awayTeam: {
                          name: (!isHomeGame ? "Notre Dame" : opponent),
                          nickname: (!isHomeGame ? "Fighting Irish" : opponentNickname),
                          score: awayTeamScore
                        },
                        location: location,
                        date: date,
                        isHomeGame: isHomeGame,
                        isBowlGame: isBowlGame,
                        numOvertimes: numOvertimes
                      });
                    }

                    // Otherwise, add the future game to Firebase
                    else {
                      console.log("Adding future game to Firebase");
                      firebaseRef.child(year).push({
                        location: location,
                        date: date,
                        time: result,
                        isHomeGame: isHomeGame
                      });
                    }
                  }
                }
              }
            }
          });
        }
        else {
          console.log("Schedule unavailable for " + year);
        }
      });
    })(year);
  }
});