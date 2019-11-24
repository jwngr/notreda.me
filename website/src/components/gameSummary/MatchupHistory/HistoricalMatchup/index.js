import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import FootballShape from '../../../common/FootballShape';

import {Season, FootballScoreWrapper, HistoricalMatchupWrapper} from './index.styles';

const HistoricalMatchup = ({
  gaps,
  score,
  season,
  result,
  weekIndex,
  isHomeGame,
  isSelected,
  navigateTo,
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
    <Season
      isSeasonOnTop={isSeasonOnTop}
      isSelected={isSelected}
      onClick={() => navigateTo(`/${season}/${weekIndex + 1}`)}
    >
      {season}
    </Season>
  );

  return (
    <HistoricalMatchupWrapper result={result} isSeasonOnTop={isSeasonOnTop}>
      {isSeasonOnTop && seasonContent}
      <FootballScoreWrapper>
        <FootballShape
          type={result ? 'past' : 'future'}
          text={text}
          title={title}
          result={result}
          isSelected={isSelected}
          isHomeGame={isHomeGame}
          onClick={() => navigateTo(`/${season}/${weekIndex + 1}`)}
          legs={
            isSeasonOnTop
              ? {
                  left: specialPositions.first ? false : gaps.left ? 'gap' : true,
                  right: specialPositions.last ? false : gaps.right ? 'gap' : true,
                }
              : undefined
          }
        />
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
  navigateTo: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSeasonOnTop: PropTypes.bool.isRequired,
  specialPositions: PropTypes.shape({
    first: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (path) => {
    dispatch(push(path));
  },
});

export default connect(null, mapDispatchToProps)(HistoricalMatchup);
