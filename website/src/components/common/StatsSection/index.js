import React from 'react';
import PropTypes from 'prop-types';

import {StatsSectionTitle, StatsSectionWrapper, StatsChildrenWrapper} from './index.styles';

const StatsSection = ({title, style, children}) => {
  return (
    <StatsSectionWrapper style={style}>
      <StatsSectionTitle>
        <p>{title}</p>
      </StatsSectionTitle>
      <StatsChildrenWrapper>{children}</StatsChildrenWrapper>
    </StatsSectionWrapper>
  );
};

StatsSection.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default StatsSection;
