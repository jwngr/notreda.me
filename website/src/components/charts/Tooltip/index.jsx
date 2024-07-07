import React from 'react';

import {getWindowDimensions} from '../../../lib/utils';
import {TooltipWrapper} from './index.styles';

export const Tooltip = ({x, y, children}) => {
  const tooltipStyles = {};

  const windowDimensions = getWindowDimensions();

  if (y - window.scrollY < 100) {
    tooltipStyles.top = y;
  } else {
    tooltipStyles.bottom = windowDimensions.height - y;
  }

  if (windowDimensions.width - x < 150) {
    tooltipStyles.right = windowDimensions.width - x;
  } else {
    tooltipStyles.left = x;
  }

  return <TooltipWrapper style={tooltipStyles}>{children}</TooltipWrapper>;
};
