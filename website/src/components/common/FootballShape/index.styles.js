import _ from 'lodash';
import styled from 'styled-components';
import {darken} from 'polished';

import {getColorForResult} from '../../../utils';

const _isGameCompeleted = (result) => _.includes(['W', 'L', 'T'], result);

export const FootballShapeSvg = styled.svg`
  .football {
    cursor: pointer;
    stroke-width: 2px;
    stroke: ${({type, theme, result, isSelected}) => {
      let color;
      if (isSelected) {
        color = theme.colors.gold;
      } else if (type === 'past') {
        color = _isGameCompeleted(result) ? getColorForResult(result) : 'black';
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
      fill: ${({type, theme, result}) => {
        if (type === 'past') {
          return _isGameCompeleted(result) ? getColorForResult(result) : 'black';
        } else {
          return 'transparent';
        }
      }};
    }

    line {
      stroke: ${({type, theme, result, isHomeGame}) => {
        if (isHomeGame) {
          return 'transparent';
        }

        return _isGameCompeleted(result)
          ? darken(0.2, getColorForResult(result))
          : darken(0.3, theme.colors.lightGray);
      }};
      stroke-width: 2px;
    }
  }
`;

export const Text = styled.p`
  cursor: pointer;
  position: absolute;
  top: calc(50% - 10px);
  color: ${({type, theme, result, isSelected}) => {
    if (isSelected) {
      return result === 'T' ? darken(0.2, theme.colors.gold) : theme.colors.gold;
    } else {
      return theme.colors.white;
    }
  }};
  font-size: 14px;
  font-family: 'Inter UI', serif;
  width: 100%;
`;

export const Leg = styled.div`
  height: 0;
  width: 21px;
  border-bottom: solid 2px ${({theme}) => theme.colors.black};
  position: absolute;
  bottom: 0;
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
