import React from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';

import {SliderWrapper} from './index.styles';

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
    const {value} = this.state;
    const {min, max, className} = this.props;

    return (
      <SliderWrapper className={className}>
        <p>
          Seasons: {value[0]} - {value[1]}
        </p>
        <Range
          min={min}
          max={max}
          marks={{
            [min]: min,
            [max]: max,
          }}
          onChange={this.handleChange}
          defaultValue={[min, max]}
        />
      </SliderWrapper>
    );
  }
}

SliderRange.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  initialValue: PropTypes.array,
};

export default SliderRange;
