import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router-dom';

import {GameResult, GameScore} from '../../../../models';
import {FootballShape} from '../../../common/FootballShape';
import {FootballScoreWrapper, HistoricalMatchupWrapper, Season} from './index.styles';

export const HistoricalMatchup: React.FC<{
  readonly gaps: {
    readonly left: boolean;
    readonly right: boolean;
  };
  readonly score: GameScore | null;
  readonly result: GameResult | null;
  readonly season: number;
  readonly weekIndex: number;
  readonly isHomeGame: boolean;
  readonly isSelected: boolean;
  readonly isSeasonOnTop: boolean;
  readonly specialPositions: {
    readonly first: boolean;
    readonly last: boolean;
  };
}> = ({
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
  if (result && score) {
    const ndScore = isHomeGame ? score.home : score.away;
    const opponentScore = isHomeGame ? score.away : score.home;

    text = `${ndScore}-${opponentScore}`;

    const winLossOrTie =
      result === GameResult.Win ? 'win' : result === GameResult.Loss ? 'loss' : 'tie';

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
    <HistoricalMatchupWrapper isSeasonOnTop={isSeasonOnTop}>
      {isSeasonOnTop ? seasonContent : null}
      <FootballScoreWrapper>
        <Link to={`/${season}/${weekIndex + 1}`}>
          <FootballShape
            type={result ? 'past' : 'future'}
            text={text}
            title={title}
            gameResult={result}
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
      {!isSeasonOnTop ? seasonContent : null}
    </HistoricalMatchupWrapper>
  );
};
