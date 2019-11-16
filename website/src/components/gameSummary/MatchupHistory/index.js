import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {getGamesAgainstTeam} from '../../../utils';

import StatsSection from '../../common/StatsSection';
import HistoricalMatchup from './HistoricalMatchup';

import {Records, RecentMatchups, MatchupHistoryWrapper} from './index.styles';

const MatchupHistory = ({game, opponentId, numGamesToDisplay}) => {
  const {past, future} = getGamesAgainstTeam(opponentId);

  let gaps;
  let gamesToShow;
  if (typeof numGamesToDisplay === 'undefined') {
    // If the number of games to display is not specfied, display all games.
    gamesToShow = [...past, ...future];
  } else {
    const futureGameSeasons = future.map(({season}) => season);

    let numPastGamesToDisplay = numGamesToDisplay;
    if (future.length !== 0) {
      // Always show the next matchup.
      numPastGamesToDisplay -= 1;

      // If the currently viewed season is a future game, show all future games leading up to it.
      const futureGameSeasonsIndex = _.indexOf(futureGameSeasons, game.season);
      if (futureGameSeasonsIndex !== -1) {
        numPastGamesToDisplay -= futureGameSeasonsIndex + 1;
      }
    }

    gaps = {
      left: [],
      right: [],
    };
    let hiddenPriorGamesCount = past.length - numPastGamesToDisplay;
    let hiddenFutureGamesCount = future.length;
    gamesToShow = _.takeRight(past, numPastGamesToDisplay);
    if (future.length !== 0) {
      // Always show the next matchup.
      gamesToShow.push(future[0]);
      hiddenFutureGamesCount--;

      const futureGameSeasonsIndex = _.indexOf(futureGameSeasons, game.season);
      if (futureGameSeasonsIndex === 0 && future.length > 1) {
        // If the currently viewed season is the next matchup and there are multipe future matchups,
        // show the following matchup as well.
        hiddenFutureGamesCount--;
        gamesToShow.push(future[1]);
      } else if (futureGameSeasonsIndex > 0) {
        // If the currently viewed season is a future matchup which is not the next matchup, show it
        // as well, including a gap between the matchups if they are not sequential.
        hiddenFutureGamesCount--;
        gamesToShow.push(future[futureGameSeasonsIndex]);

        if (futureGameSeasonsIndex !== 1) {
          gaps.right.push(future[0].season);
          gaps.left.push(future[futureGameSeasonsIndex].season);
        }
      }
    }
  }

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

  past.forEach(({result, isHomeGame}) => {
    recordAgainstTeam.overall[result] += 1;
    recordAgainstTeam[isHomeGame ? 'home' : 'away'][result] += 1;
  });

  const homeOrAway = game.isHomeGame ? 'home' : 'away';

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
            <p>Overall Record</p>
            <p>
              {recordAgainstTeam.overall.W}-{recordAgainstTeam.overall.L}-
              {recordAgainstTeam.overall.T}
            </p>
          </div>
          <div>
            <p>{game.isHomeGame ? 'Home' : 'Away'} Record</p>
            <p>
              {recordAgainstTeam[homeOrAway].W}-{recordAgainstTeam[homeOrAway].L}-
              {recordAgainstTeam[homeOrAway].T}
            </p>
          </div>
        </Records>
        <RecentMatchups>
          {gamesToShow.map(({result, score, season, weekIndex, isHomeGame}, i, coll) => {
            let specialPosition;
            if (i === 0) {
              specialPosition = 'first';
            } else if (i === _.size(coll) - 1) {
              specialPosition = 'last';
            }

            return (
              <HistoricalMatchup
                key={`${season}-${weekIndex}`}
                score={score}
                result={result}
                season={season}
                weekIndex={weekIndex}
                isHomeGame={isHomeGame}
                isSelected={season === game.season}
                isSeasonOnTop={i % 2 === 0}
                gaps={{left: _.includes(gaps.left, season), right: _.includes(gaps.right, season)}}
                specialPosition={specialPosition}
              />
            );
          })}
        </RecentMatchups>
      </MatchupHistoryWrapper>
    </StatsSection>
  );
};

MatchupHistory.propTypes = {
  game: PropTypes.object.isRequired,
  opponentId: PropTypes.string.isRequired,
  numGamesToDisplay: PropTypes.number,
};

export default MatchupHistory;
