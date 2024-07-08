import React from 'react';

import {getWindowDimensions} from '../../../lib/utils';
import {TooltipWrapper} from './index.styles';

export const Tooltip: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
}> = ({x, y, children}) => {
  const windowDimensions = getWindowDimensions();

  const tooltipStyles: React.CSSProperties = {};
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
