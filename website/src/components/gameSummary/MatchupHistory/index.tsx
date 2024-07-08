import _ from 'lodash';
import React from 'react';
import Media from 'react-media';

import {getFilteredMatchupsAgainstTeam, getMatchupsAgainstTeam} from '../../../lib/matchupHistory';
import {useWindowSize} from '../../../lib/useWindowSize';
import {GameInfo} from '../../../models';
import {StatsSection} from '../../common/StatsSection';
import {HistoricalMatchup} from './HistoricalMatchup';
import {MatchupHistoryWrapper, RecentMatchups, Records} from './index.styles';

const _getMaxMatchupsCountFromWindowWidth = (width: number): number => {
  if (width > 1420) {
    return 15;
  } else if (width > 1326) {
    return 13;
  } else if (width > 1250) {
    return 11;
  } else if (width > 1200) {
    return 9;
  } else if (width > 1110) {
    return 11;
  } else if (width > 970) {
    return 9;
  } else if (width > 950) {
    return 7;
  } else if (width > 680) {
    return 15;
  } else if (width > 600) {
    return 13;
  } else if (width > 520) {
    return 11;
  } else if (width > 440) {
    return 9;
  } else if (width > 360) {
    return 7;
  } else {
    return 5;
  }
};

export const MatchupHistory: React.FC<{
  readonly selectedGame: GameInfo;
  readonly selectedSeason: number;
}> = ({selectedGame, selectedSeason}) => {
  const {past: pastMatchupsAgainstTeam, future: futureMatchupsAgainstTeam} = getMatchupsAgainstTeam(
    selectedGame.opponentId
  );

  const {width} = useWindowSize();
  const maxMatchupsCount = _getMaxMatchupsCountFromWindowWidth(width);

  const matchupsToShow = getFilteredMatchupsAgainstTeam({
    opponentId: selectedGame.opponentId,
    selectedSeason,
    maxMatchupsCount,
  });

  const recordAgainstTeam = {
    overall: {
      W: 0,
      L: 0,
      T: 0,
    },
    home: {
      W: 0,
      L: 0,
      T: 0,
    },
    away: {
      W: 0,
      L: 0,
      T: 0,
    },
  };

  pastMatchupsAgainstTeam.forEach(({result, isHomeGame}) => {
    if (!result) return;
    recordAgainstTeam.overall[result] += 1;
    recordAgainstTeam[isHomeGame ? 'home' : 'away'][result] += 1;
  });

  const selectedGameHomeOrAway = selectedGame.isHomeGame ? 'home' : 'away';
  const allSeasonsWithMatchupsAgainstTeam = [
    ...pastMatchupsAgainstTeam,
    ...futureMatchupsAgainstTeam,
  ].map(({season}) => season);

  return (
    <StatsSection title="Matchup History" style={{marginTop: '32px'}}>
      <MatchupHistoryWrapper>
        <Records>
          <div>
            <p>Meetings</p>
            <p>
              {recordAgainstTeam.overall.W +
                recordAgainstTeam.overall.L +
                recordAgainstTeam.overall.T}
            </p>
          </div>
          <div>
            <Media query="(max-width: 600px)">
              {(matches) => (matches ? <p>Overall</p> : <p>Overall Record</p>)}
            </Media>
            <p>
              {recordAgainstTeam.overall.W}-{recordAgainstTeam.overall.L}-
              {recordAgainstTeam.overall.T}
            </p>
          </div>
          <div>
            <Media query="(max-width: 600px)">
              {(matches) =>
                matches ? (
                  <p>{_.capitalize(selectedGameHomeOrAway)}</p>
                ) : (
                  <p>{_.capitalize(selectedGameHomeOrAway)} Record</p>
                )
              }
            </Media>
            <p>
              {recordAgainstTeam[selectedGameHomeOrAway].W}-
              {recordAgainstTeam[selectedGameHomeOrAway].L}-
              {recordAgainstTeam[selectedGameHomeOrAway].T}
            </p>
          </div>
        </Records>
        <RecentMatchups $matchupsCount={matchupsToShow.length}>
          {matchupsToShow.map((historicalGame, i) => {
            if (!historicalGame) return null;

            const specialPositions = {
              first: i === 0,
              last: i === matchupsToShow.length - 1,
            };

            const isFirst = i === 0;
            const isLast = i === matchupsToShow.length - 1;
            const previousHistoricalGame = matchupsToShow[i - 1];
            const nextHistoricalGame = matchupsToShow[i + 1];

            return (
              <HistoricalMatchup
                key={`historical-matchup-${historicalGame.season}-${historicalGame.weekIndex}`}
                score={historicalGame.score ?? null}
                result={historicalGame.result ?? null}
                season={historicalGame.season}
                weekIndex={historicalGame.weekIndex}
                isHomeGame={historicalGame.isHomeGame}
                isSelected={
                  // TODO: Introduce `Games.equals`
                  selectedGame.opponentId === historicalGame.opponentId &&
                  selectedGame.date === historicalGame.date &&
                  selectedGame.fullDate === historicalGame.fullDate
                }
                isSeasonOnTop={i % 2 === 0}
                // Show gap indicators on either side if the previous / next displayed season is
                // not actually the next / previous season due to list truncation.
                // TODO: Properly handle seasons with multiple games against the same team (e.g.
                // Clemson 2020).
                gaps={{
                  left: Boolean(
                    !isFirst &&
                      previousHistoricalGame &&
                      allSeasonsWithMatchupsAgainstTeam.indexOf(historicalGame.season) !==
                        allSeasonsWithMatchupsAgainstTeam.indexOf(previousHistoricalGame.season) + 1
                  ),
                  right: Boolean(
                    !isLast &&
                      nextHistoricalGame &&
                      allSeasonsWithMatchupsAgainstTeam.indexOf(historicalGame.season) !==
                        allSeasonsWithMatchupsAgainstTeam.indexOf(nextHistoricalGame.season) - 1
                  ),
                }}
                specialPositions={specialPositions}
              />
            );
          })}
        </RecentMatchups>
      </MatchupHistoryWrapper>
    </StatsSection>
  );
};
