import {darken} from 'polished';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import {GameResult, GameScore} from '../../models';
import {FootballShape} from '../common/FootballShape';

interface HistoricalMatchupWrapperProps {
  readonly $isSeasonOnTop: boolean;
}

const HistoricalMatchupWrapper = styled.div<HistoricalMatchupWrapperProps>`
  text-align: center;
  margin: ${({$isSeasonOnTop}) => ($isSeasonOnTop ? '0 0 0 0' : '120px -20px 0 -20px')};
`;

const FootballScoreWrapper = styled.div`
  position: relative;
  text-align: center;
`;

interface SeasonProps {
  readonly $isSeasonOnTop: boolean;
  readonly $isSelected: boolean;
}

const Season = styled.p<SeasonProps>`
  cursor: pointer;
  color: ${({theme, $isSelected}) =>
    $isSelected ? darken(0.2, theme.colors.gold) : theme.colors.black};
  font-size: 14px;
  font-family: 'Bungee';
  margin: ${({$isSeasonOnTop}) => ($isSeasonOnTop ? '0 0 -2px 1px' : '-6px 0 0 1px')};

  span {
    display: inline-block;

    &:nth-of-type(1) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(-2px, 2px, 0) rotate(-14deg)'
          : 'translate3d(-2px, -2px, 0) rotate(14deg)'};
    }

    &:nth-of-type(2) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(-1px, 0, 0) rotate(-5deg)'
          : 'translate3d(-1px, 0, 0) rotate(5deg)'};
    }

    &:nth-of-type(3) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(0px, 0, 0) rotate(5deg)'
          : 'translate3d(0px, 0, 0) rotate(-5deg)'};
    }

    &:nth-of-type(4) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(1px, 2px, 0) rotate(14deg)'
          : 'translate3d(1px, -2px, 0) rotate(-14deg)'};
    }
  }
`;

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
      <Season $isSeasonOnTop={isSeasonOnTop} $isSelected={isSelected}>
        {String(season)
          .split('')
          .map((digit, i) => (
            <span key={`season-header-${season}-${weekIndex}-${i}`}>{digit}</span>
          ))}
      </Season>
    </Link>
  );

  return (
    <HistoricalMatchupWrapper $isSeasonOnTop={isSeasonOnTop}>
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
