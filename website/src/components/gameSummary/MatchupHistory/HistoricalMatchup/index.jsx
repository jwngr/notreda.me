import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import {FootballShape} from '../../../common/FootballShape';
import {FootballScoreWrapper, HistoricalMatchupWrapper, Season} from './index.styles';

export const HistoricalMatchup = ({
  gaps,
  score,
  season,
  result,
  weekIndex,
  isHomeGame,
  isSelected,
  isSeasonOnTop,
  specialPositions,
}) => {
  let text;
  let title;
  if (result) {
    const ndScore = isHomeGame ? score.home : score.away;
    const opponentScore = isHomeGame ? score.away : score.home;

    text = `${ndScore}-${opponentScore}`;

    const winLossOrTie = result === 'W' ? 'win' : result === 'L' ? 'loss' : 'tie';

    title = `${season} Notre Dame ${winLossOrTie} by a score of ${ndScore} to ${opponentScore}.`;
  } else {
    title = `${season} Notre Dame game.`;
  }

  const seasonContent = (
    <Link to={`/${season}/${weekIndex + 1}`}>
      <Season isSeasonOnTop={isSeasonOnTop} isSelected={isSelected}>
        {_.map(String(season), (digit, i) => (
          <span key={`season-header-${season}-${weekIndex}-${i}`}>{digit}</span>
        ))}
      </Season>
    </Link>
  );

  return (
    <HistoricalMatchupWrapper result={result} isSeasonOnTop={isSeasonOnTop}>
      {isSeasonOnTop && seasonContent}
      <FootballScoreWrapper>
        <Link to={`/${season}/${weekIndex + 1}`}>
          <FootballShape
            type={result ? 'past' : 'future'}
            text={text}
            title={title}
            result={result}
            uniqueFillPatternId={`${season}-${weekIndex}`}
            isSelected={isSelected}
            isHomeGame={isHomeGame}
            legs={
              isSeasonOnTop
                ? {
                    left: specialPositions.first ? false : gaps.left ? 'gap' : true,
                    right: specialPositions.last ? false : gaps.right ? 'gap' : true,
                  }
                : undefined
            }
          />
        </Link>
      </FootballScoreWrapper>
      {!isSeasonOnTop && seasonContent}
    </HistoricalMatchupWrapper>
  );
};

HistoricalMatchup.propTypes = {
  gaps: PropTypes.shape({
    left: PropTypes.bool.isRequired,
    right: PropTypes.bool.isRequired,
  }).isRequired,
  score: PropTypes.shape({
    home: PropTypes.number.isRequired,
    away: PropTypes.number.isRequired,
  }),
  result: PropTypes.string,
  season: PropTypes.number.isRequired,
  weekIndex: PropTypes.number.isRequired,
  isHomeGame: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSeasonOnTop: PropTypes.bool.isRequired,
  specialPositions: PropTypes.shape({
    first: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
  }).isRequired,
};
