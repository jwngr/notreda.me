import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

import {getColorForResult} from '../../lib/utils';
import {GameResult} from '../../models/games.models';

interface FootballShapePathProps {
  readonly $type: string;
  readonly $gameResult: GameResult | null;
  readonly $isSelected: boolean;
}

const FootballShapePath = styled.path<FootballShapePathProps>`
  cursor: pointer;
  stroke-width: 2px;
  stroke: ${({theme, $type, $gameResult, $isSelected}) => {
    let color;
    if ($isSelected) {
      color = theme.colors.gold;
    } else if ($type === 'past') {
      color = $gameResult ? getColorForResult($gameResult) : 'black';
    } else {
      color = theme.colors.black;
    }

    return darken(0.2, color);
  }};
  stroke-dasharray: ${({$type}) => ($type === 'future' ? '4px' : 0)};
  stroke-dashoffset: 3px;
`;

interface FootballLacesPathProps {
  readonly $isSelected: boolean;
}

const FootballLacesPath = styled.g<FootballLacesPathProps>`
  cursor: pointer;
  stroke-width: 2px;
  stroke-linecap: round;

  line {
    stroke: ${({theme, $isSelected}) => {
      const color = $isSelected ? theme.colors.gold : theme.colors.black;
      return darken(0.2, color);
    }};
  }
`;

interface FootballPatternProps {
  readonly $type: string;
  readonly $gameResult: GameResult | null;
  readonly $isHomeGame: boolean;
}

const FootballPattern = styled.pattern<FootballPatternProps>`
  rect {
    fill: ${({$type, $gameResult}) => {
      if ($type === 'past') {
        return $gameResult ? getColorForResult($gameResult) : 'black';
      } else {
        return 'transparent';
      }
    }};
  }

  line {
    stroke: ${({theme, $gameResult, $isHomeGame}) => {
      if ($isHomeGame) {
        return 'transparent';
      }

      return $gameResult
        ? darken(0.2, getColorForResult($gameResult))
        : darken(0.3, theme.colors.lightGray);
    }};
    stroke-width: 2px;
  }
`;

interface TextProps {
  readonly $gameResult: GameResult | null;
  readonly $isSelected: boolean;
}

const Text = styled.p<TextProps>`
  cursor: pointer;
  position: absolute;
  top: calc(50% - 10px);
  color: ${({theme, $gameResult, $isSelected}) => {
    if ($isSelected) {
      return $gameResult === GameResult.Tie ? darken(0.2, theme.colors.gold) : theme.colors.gold;
    } else {
      return theme.colors.white;
    }
  }};
  font-size: 14px;
  font-family: 'Inter', serif;
  width: 100%;
`;

interface LegProps {
  readonly $type: 'left' | 'right';
}

const Leg = styled.div<LegProps>`
  height: 0;
  width: 24px;
  border-bottom: solid 2px ${({theme}) => theme.colors.black};
  position: absolute;
  bottom: -1;
  left: ${({$type}) => ($type === 'left' ? 0 : 'initial')};
  right: ${({$type}) => ($type === 'right' ? 0 : 'initial')};
  transform: rotate(${({$type}) => ($type === 'right' ? 52 : -52)}deg);

  & > div {
    margin-top: -4px;
    margin-left: 8px;
    width: 6px;
    height: 10px;
    border-left: solid 2px ${({theme}) => theme.colors.black};
    border-right: solid 2px ${({theme}) => theme.colors.black};
  }
`;

export const FootballShape: React.FC<{
  readonly type: 'past' | 'future';
  readonly text?: string;
  readonly title: string;
  readonly gameResult: GameResult | null;
  readonly legs?: {
    readonly left?: string | boolean;
    readonly right?: string | boolean;
  };
  readonly isHomeGame: boolean;
  readonly isSelected: boolean;
  readonly uniqueFillPatternId: string;
}> = ({type, text, title, gameResult, legs = {}, isHomeGame, isSelected, uniqueFillPatternId}) => {
  let leftLeg: React.ReactNode = null;
  if (legs.left) {
    leftLeg = <Leg $type="left">{legs.left === 'gap' ? <div>&nbsp;</div> : <>&nbsp;</>}</Leg>;
  }

  let rightLeg: React.ReactNode = null;
  if (legs.right) {
    rightLeg = <Leg $type="right">{legs.right === 'gap' ? <div>&nbsp;</div> : <>&nbsp;</>}</Leg>;
  }

  return (
    <>
      <svg width="60" height="40" viewBox="-1 -1 55 32">
        <title>{title}</title>

        {/* Football shape. */}
        <FootballShapePath
          fill={`url(#fill-pattern-${uniqueFillPatternId})`}
          d="M24.3585167,0.063430208 C35.1119935,-0.6284714 46.6072293,4.36977614 52.597914,13.6040857 C54.7297115,16.8900946 47.7985071,22.2410883 45.5381744,23.9389606 C40.8288076,27.476048 35.0715102,29.4979341 29.2104611,29.9219608 C18.5877272,30.6905583 5.76969773,25.7610451 0.275655548,16.0523187 C-1.54345102,12.8377005 6.1544002,7.27463607 8.34504921,5.68440188 C13.0321845,2.281693 18.5929238,0.434412586 24.3585166,0.0634300975"
          $type={type}
          $gameResult={gameResult}
          $isSelected={isSelected}
        ></FootballShapePath>

        {/* Laces. */}
        {type === 'future' ? (
          <FootballLacesPath $isSelected={isSelected} transform="translate(14, 11)">
            <line x1="-6.9388939e-16" y1="4" x2="26" y2="4"></line>
            <line x1="3" y1="8" x2="3" y2="4.4408921e-16"></line>
            <line x1="8" y1="8" x2="8" y2="4.4408921e-16"></line>
            <line x1="13" y1="8" x2="13" y2="4.4408921e-16"></line>
            <line x1="18" y1="8" x2="18" y2="4.4408921e-16"></line>
            <line x1="23" y1="8" x2="23" y2="4.4408921e-16"></line>
          </FootballLacesPath>
        ) : null}

        {/* Fill pattern. */}
        <defs>
          <FootballPattern
            id={`fill-pattern-${uniqueFillPatternId}`}
            $type={type}
            $gameResult={gameResult}
            $isHomeGame={isHomeGame}
            width="3"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45 50 50)"
          >
            <rect width="10" height="10" />
            <line y2="10" />
          </FootballPattern>
        </defs>
      </svg>

      {/* Game result text. */}
      {text ? (
        <Text $gameResult={gameResult} $isSelected={isSelected}>
          {text}
        </Text>
      ) : null}

      {/* Next / previous matchup lines. */}
      {leftLeg}
      {rightLeg}
    </>
  );
};
