import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import FootballShape from '../../../common/FootballShape';

import {Score, Season, FootballScoreWrapper, HistoricalMatchupWrapper} from './index.styles';

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
  specialPosition,
}) => {
  let title;
  let scoreContent;
  if (result) {
    const ndScore = isHomeGame ? score.home : score.away;
    const opponentScore = isHomeGame ? score.away : score.home;

    const winLossOrTie = result === 'W' ? 'win' : result === 'L' ? 'loss' : 'tie';

    scoreContent = (
      <Score isSelected={isSelected} result={result}>
        {ndScore}-{opponentScore}
      </Score>
    );

    title = `${season} Notre Dame ${winLossOrTie} by a score of ${ndScore} to ${opponentScore}.`;
  } else {
    title = `${season} Notre Dame game.`;
  }

  const seasonContent = (
    <Season isSeasonOnTop={isSeasonOnTop} isSelected={isSelected}>
      {season}
    </Season>
  );

  return (
    <HistoricalMatchupWrapper result={result} isSeasonOnTop={isSeasonOnTop}>
      {isSeasonOnTop && seasonContent}
      <FootballScoreWrapper onClick={() => navigateTo(`/${season}/${weekIndex}`)}>
        <FootballShape
          type={result ? 'past' : 'future'}
          result={result}
          season={season}
          isSelected={isSelected}
          isHomeGame={isHomeGame}
          title={title}
          legs={
            isSeasonOnTop
              ? {
                  left: specialPosition === 'first' ? false : gaps.left ? 'gap' : true,
                  right: specialPosition === 'last' ? false : gaps.right ? 'gap' : true,
                }
              : undefined
          }
        />
        {scoreContent}
      </FootballScoreWrapper>
      {!isSeasonOnTop && seasonContent}
    </HistoricalMatchupWrapper>
  );
};

HistoricalMatchup.propTypes = {
  gaps: PropTypes.shape({
    left: PropTypes.bool,
    right: PropTypes.bool,
  }).isRequired,
  score: PropTypes.shape({
    home: PropTypes.number,
    away: PropTypes.number,
  }),
  result: PropTypes.string,
  season: PropTypes.number.isRequired,
  weekIndex: PropTypes.number.isRequired,
  isHomeGame: PropTypes.bool.isRequired,
  navigateTo: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSeasonOnTop: PropTypes.bool.isRequired,
  specialPosition: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (path) => {
    dispatch(push(path));
  },
});

export default connect(null, mapDispatchToProps)(HistoricalMatchup);
