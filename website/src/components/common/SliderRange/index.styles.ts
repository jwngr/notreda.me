import {darken} from 'polished';
import styled from 'styled-components';

interface SliderWrapperProps {
  readonly $width: number;
  readonly $widthSm: number;
}

export const SliderWrapper = styled.div<SliderWrapperProps>`
  width: ${({$width}) => `${$width}px`};

  @media (max-width: 600px) {
    max-width: ${({$widthSm}) => `${$widthSm}px`};
  }

  .slider {
    -webkit-appearance: none;
    height: 15px;
    border-radius: 5px;
    background: ${({theme}) => darken(0.2, theme.colors.lightGray)};
    outline: none;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: ${({theme}) => theme.colors.green};
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: ${({theme}) => theme.colors.green};
    cursor: pointer;
  }
`;
