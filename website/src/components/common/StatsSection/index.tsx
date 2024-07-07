import React from 'react';

import {StatsChildrenWrapper, StatsSectionTitle, StatsSectionWrapper} from './index.styles';

export const StatsSection: React.FC<{
  readonly title: string;
  // TODO: Replace with `Spacer` component.
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({title, style, children}) => {
  return (
    <StatsSectionWrapper style={style}>
      <StatsSectionTitle>
        <p>{title}</p>
      </StatsSectionTitle>
      <StatsChildrenWrapper>{children}</StatsChildrenWrapper>
    </StatsSectionWrapper>
  );
};
