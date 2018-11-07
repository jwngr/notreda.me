import React from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';
import {darken, lighten} from 'polished';

import {SliderWrapper} from './index.styles';

import theme from '../../../resources/theme.json';

import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class SliderRange extends React.Component {
  constructor(props) {
    super(props);

    const {min, max, initialValue} = props;

    this.state = {
      value: initialValue || [min, max],
    };
  }

  handleChange = (value) => {
    const {onChange} = this.props;

    onChange && onChange(value);

    this.setState({
      value,
    });
  };

  render() {
    const {min, max, width = 200, widthSm = 140, className} = this.props;

    return (
      <SliderWrapper className={className} width={width} widthSm={widthSm}>
        <Range
          min={min}
          max={max}
          marks={{
            [min]: {
              style: {fontFamily: 'Inter UI', fontSize: '14px'},
              label: min,
            },
            [max]: {
              style: {fontFamily: 'Inter UI', fontSize: '14px'},
              label: min,
            },
          }}
          onChange={this.handleChange}
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
  }
}

SliderRange.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  width: PropTypes.number,
  widthSm: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
  initialValue: PropTypes.array,
};

export default SliderRange;
