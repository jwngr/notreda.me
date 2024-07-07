import {darken} from 'polished';
import styled from 'styled-components';

import {getColorForResult} from '../../../lib/utils';
import {GameResult} from '../../../models';

interface FootballShapeSvgProps {
  readonly type: string;
  readonly gameResult: GameResult | null;
  readonly isSelected: boolean;
  readonly isHomeGame: boolean;
}

export const FootballShapeSvg = styled.svg<FootballShapeSvgProps>`
  .football {
    cursor: pointer;
    stroke-width: 2px;
    stroke: ${({type, theme, gameResult, isSelected}) => {
      let color;
      if (isSelected) {
        color = theme.colors.gold;
      } else if (type === 'past') {
        color = gameResult ? getColorForResult(gameResult) : 'black';
      } else {
        color = theme.colors.black;
      }

      return darken(0.2, color);
    }};
    stroke-dasharray: ${({type}) => (type === 'future' ? '4px' : 0)};
    stroke-dashoffset: 3px;
  }

  .laces {
    cursor: pointer;
    stroke-width: 2px;
    stroke-linecap: round;

    line {
      stroke: ${({theme, isSelected}) => {
        const color = isSelected ? theme.colors.gold : theme.colors.black;
        return darken(0.2, color);
      }};
    }
  }

  .pattern {
    rect {
      fill: ${({type, gameResult}) => {
        if (type === 'past') {
          return gameResult ? getColorForResult(gameResult) : 'black';
        } else {
          return 'transparent';
        }
      }};
    }

    line {
      stroke: ${({theme, gameResult, isHomeGame}) => {
        if (isHomeGame) {
          return 'transparent';
        }

        return gameResult
          ? darken(0.2, getColorForResult(gameResult))
          : darken(0.3, theme.colors.lightGray);
      }};
      stroke-width: 2px;
    }
  }
`;

interface TextProps {
  readonly gameResult: GameResult | null;
  readonly isSelected: boolean;
}

export const Text = styled.p<TextProps>`
  cursor: pointer;
  position: absolute;
  top: calc(50% - 10px);
  color: ${({theme, gameResult, isSelected}) => {
    if (isSelected) {
      return gameResult === GameResult.Tie ? darken(0.2, theme.colors.gold) : theme.colors.gold;
    } else {
      return theme.colors.white;
    }
  }};
  font-size: 14px;
  font-family: 'Inter UI', serif;
  width: 100%;
`;

interface LegProps {
  readonly type: 'left' | 'right';
}

export const Leg = styled.div<LegProps>`
  height: 0;
  width: 24px;
  border-bottom: solid 2px ${({theme}) => theme.colors.black};
  position: absolute;
  bottom: -1;
  left: ${({type}) => (type === 'left' ? 0 : 'initial')};
  right: ${({type}) => (type === 'right' ? 0 : 'initial')};
  transform: rotate(${({type}) => (type === 'right' ? 52 : -52)}deg);

  & > div {
    margin-top: -4px;
    margin-left: 8px;
    width: 6px;
    height: 10px;
    border-left: solid 2px ${({theme}) => theme.colors.black};
    border-right: solid 2px ${({theme}) => theme.colors.black};
  }
`;
