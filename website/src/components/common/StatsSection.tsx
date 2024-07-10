import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

const StatsSectionWrapper = styled.div`
  border: solid 3px ${({theme}) => theme.colors.black};
  width: 100%;
  align-self: stretch;
`;

const StatsSectionTitle = styled.div`
  text-align: center;
  margin: -11px 8px 24px 8px;

  p {
    display: inline;
    padding: 4px 8px;
    font-size: 14px;
    font-family: 'Bungee';
    color: ${({theme}) => theme.colors.white};
    background-color: ${({theme}) => theme.colors.green};
    border: solid 3px ${({theme}) => theme.colors.black};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
    text-shadow: ${({theme}) => theme.colors.black} 1px 1px;
  }
`;

const StatsChildrenWrapper = styled.div`
  width: 100%;
  height: calc(100% - 12px);
  padding: 8px;
  margin-top: -20px;
`;

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
