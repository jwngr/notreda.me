import React from 'react';

import {TooltipWrapper} from './index.styles';

export default ({x, y, children}) => {
  return <TooltipWrapper style={{top: y, left: x}}>{children}</TooltipWrapper>;
};
