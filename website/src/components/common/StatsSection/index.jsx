import PropTypes from 'prop-types';
import React from 'react';

import {StatsChildrenWrapper, StatsSectionTitle, StatsSectionWrapper} from './index.styles';

export class StatsSection extends React.Component {
  render() {
    const {title, style, children, ...rest} = this.props;
    return (
      <StatsSectionWrapper style={style} {...rest}>
        <StatsSectionTitle>
          <p>{title}</p>
        </StatsSectionTitle>
        <StatsChildrenWrapper>{children}</StatsChildrenWrapper>
      </StatsSectionWrapper>
    );
  }
}

StatsSection.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
