import React from 'react';
import styled from 'styled-components';

import {StyleAttributes} from '../../models/styles.models';

type SpacerAxis = 'vertical' | 'horizontal';

interface SpacerWrapperProps {
  readonly $axis: SpacerAxis;
  readonly $size: number;
}

const SpacerWrapper = styled.div<SpacerWrapperProps>`
  flex-shrink: 0;
  width: ${({$axis, $size}) => ($axis === 'horizontal' ? `${$size}px` : '1px')};
  height: ${({$axis, $size}) => ($axis === 'vertical' ? `${$size}px` : '1px')};
`;

interface SpacerProps extends StyleAttributes {
  readonly size: number;
  readonly axis: SpacerAxis;
}

export const Spacer: React.FC<SpacerProps> = ({size, axis, style, className}) => {
  return <SpacerWrapper $axis={axis} $size={size} style={style} className={className} />;
};
