from datetime import datetime
from urllib2 import urlopen
import json
from bs4 import BeautifulSoup
from collections import defaultdict
import pprint

"""Populates the database with schedule information."""
# Load Notre Dame's schedule


if (__name__ == "__main__"):
    # Create a dictionary to hold the schedule
    schedule = defaultdict(list)

    # Loop through every year since 1187
    for year in range(1887, 2016):
        print "Scraping " + str(year) + " schedule"
        # Skip 1890 and 1891 since und.com doesn't have data for those years
        if (year not in [1890, 1891]):
            # Get the html of the current year's schedule from und.com
            html = urlopen("http://www.und.com/sports/m-footbl/sched/data/nd-m-footbl-sched-" + str(year) + ".html").read()

            # Turn the html into Beautiful Soup
            soup = BeautifulSoup(html)

            # Find the schedule table
            scheduleTable = soup.find(id = "schedtable")
            #if (scheduleTable):
            if (True):
                # Get each row/game in the table
                trs = scheduleTable.findAll("tr")

                # Ignore the headings row if it exists
                if (trs[0]["class"] == "event-table-headings"):
                    trs = trs[1:]

                # Loop through each row/game
                for i, tr in enumerate(trs):
                    # Rows with four cells constitute an actual game
                    tds = tr.findAll("td")
                    if (len(tds) == 4 and tds[0].text != "Date"):
                        # Get the date
                        date = tds[0].text
                        if (not date):
                            continue

                        # Get the opponent (ignoring Blue-Gold games)
                        opponent = " ".join(tds[1].text.split(" ")[1:]).strip()
                        if ("Blue-Gold" in opponent):
                            continue

                        # Get the location
                        location = tds[2].text

                        # Get the result
                        if (tds[3].text == "Cancelled"):
                            continue
                        if (len(tds[3].text.split(", ")) == 2):
                            # The game has already been played
                            result = tds[3].text.split(", ")[0]
                            scores = tds[3].text.split(", ")[1].split("-")
                            otGame = False
                            if ("OT" in scores[1] or "ot" in scores[1]):
                                otData = scores[1].split(" ")
                                scores[1] = otData[0]
                                numOts = otData[1]
                                otGame = True

                            if (result == "W"):
                                notreDameScore = int(scores[0])
                                opponentScore = int(scores[1])
                            else:
                                notreDameScore = int(scores[1])
                                opponentScore = int(scores[0])
                        else:
                            # The game has not yet been played
                            notreDameScore = -1
                            opponentScore = -1

                        # TODO: add OT info

                        # Add the current game to the schedule dicitonary
                        schedule[year].append({
                            "date": date,
                            "location": location,
                            "opponent": opponent,
                            "opponentMascot": "",
                            "notreDameScore": notreDameScore,
                            "opponentScore": opponentScore,
                            "isHomeGame": (tr["bgcolor"] == "#d1d1d1"),
                            ".priority": i
                        })

    # Write the schedule data as JSON to the output file
    outputFile = open("notreDameSchedule.json", "w")
    outputFile.write(json.dumps(schedule, indent=2))