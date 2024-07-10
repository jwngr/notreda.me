import {darken, lighten} from 'polished';
import Slider from 'rc-slider';
import React, {useState} from 'react';
import styled from 'styled-components';

import theme from '../../resources/theme.json';

import 'rc-slider/assets/index.css';

interface SliderWrapperProps {
  readonly $width: number;
  readonly $widthSm: number;
}

const SliderWrapper = styled.div<SliderWrapperProps>`
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

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

interface SliderRangeProps {
  readonly min: number;
  readonly max: number;
  readonly width?: number;
  readonly widthSm?: number;
  readonly onChange?: (value: number[]) => void;
  readonly className?: string;
  readonly initialValue?: number[];
}

export const SliderRange: React.FC<SliderRangeProps> = ({
  min,
  max,
  width = 200,
  widthSm = 140,
  onChange,
  className,
  initialValue = [min, max],
}) => {
  const [value, setValue] = useState<number[]>(initialValue);

  const handleChange = (value: number[]) => {
    onChange && onChange(value);
    setValue(value);
  };

  return (
    <SliderWrapper className={className} $width={width} $widthSm={widthSm}>
      <Range
        value={value}
        min={min}
        max={max}
        marks={{
          [min]: {
            style: {fontFamily: 'Inter', fontSize: '14px'},
            label: min.toString(),
          },
          [max]: {
            style: {fontFamily: 'Inter', fontSize: '14px'},
            label: max.toString(),
          },
        }}
        onChange={handleChange}
        defaultValue={[min, max]}
        trackStyle={[{backgroundColor: theme.colors.green}]}
        handleStyle={[
          {backgroundColor: theme.colors.green, borderColor: darken(0.2, theme.colors.green)},
        ]}
        railStyle={{backgroundColor: lighten(0.2, theme.colors.gray)}}
        dotStyle={{
          backgroundColor: lighten(0.2, theme.colors.gray),
          borderColor: theme.colors.gray,
        }}
        activeDotStyle={{
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'red',
        }}
      />
    </SliderWrapper>
  );
};
