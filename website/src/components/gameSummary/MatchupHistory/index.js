import _ from 'lodash';
import React from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';

import {useWindowSize} from '../../../hooks';

import {getMatchupsAgainstTeam, getFilteredMatchupsAgainstTeam} from '../../../lib/matchupHistory';

import StatsSection from '../../common/StatsSection';
import HistoricalMatchup from './HistoricalMatchup';

import {Records, RecentMatchups, MatchupHistoryWrapper} from './index.styles';

const _areConsecutiveMatchups = (allSeasonsWithMatchupsAgainstTeam, season1, season2) => {
  return (
    _.indexOf(allSeasonsWithMatchupsAgainstTeam, season1) ===
    _.indexOf(allSeasonsWithMatchupsAgainstTeam, season2) - 1
  );
};

const _getMaxMatchupsCountFromWindowWidth = (width) => {
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

const MatchupHistory = ({game: selectedGame}) => {
  const {past: pastMatchupsAgainstTeam, future: futureMatchupsAgainstTeam} = getMatchupsAgainstTeam(
    selectedGame.opponentId
  );

  const {width} = useWindowSize();
  const maxMatchupsCount = _getMaxMatchupsCountFromWindowWidth(width);

  const matchupsToShow = getFilteredMatchupsAgainstTeam(
    selectedGame.opponentId,
    selectedGame.season,
    maxMatchupsCount
  );

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
        <RecentMatchups matchupsCount={matchupsToShow.length}>
          {matchupsToShow.map(({result, score, season, weekIndex, isHomeGame}, i) => {
            let specialPositions = {
              first: i === 0,
              last: i === _.size(matchupsToShow) - 1,
            };

            return (
              <HistoricalMatchup
                key={`historical-matchup-${season}-${weekIndex}`}
                score={score}
                result={result}
                season={season}
                weekIndex={weekIndex}
                isHomeGame={isHomeGame}
                isSelected={season === selectedGame.season && weekIndex === selectedGame.weekIndex}
                isSeasonOnTop={i % 2 === 0}
                gaps={{
                  left:
                    i > 0 &&
                    !_areConsecutiveMatchups(
                      allSeasonsWithMatchupsAgainstTeam,
                      matchupsToShow[i + -1].season,
                      season
                    ),
                  right:
                    i < _.size(matchupsToShow) - 1 &&
                    !_areConsecutiveMatchups(
                      allSeasonsWithMatchupsAgainstTeam,
                      season,
                      matchupsToShow[i + 1].season
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

MatchupHistory.propTypes = {
  game: PropTypes.object.isRequired,
};

export default MatchupHistory;
