import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

import backgroundImage from '../../images/background.png';
import {getWindowDimensions} from '../../lib/utils';

export const TooltipWrapper = styled.div`
  position: absolute;
  z-index: 100;
  opacity: 1;
  padding: 4px;
  margin: 8px 8px 0 0;
  font-size: 16px;
  font-family: 'Inter UI';
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.lightGray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  color: ${({theme}) => theme.colors.green};
`;

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
