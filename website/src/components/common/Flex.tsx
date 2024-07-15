import styled from 'styled-components';

import {StyleAttributes} from '../../models';

interface FlexWrapperProps {
  readonly gap?: number;
  readonly justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  readonly wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  readonly align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  // TODO: Add `flex` / `grow` / `shrink` props.
}

const FlexRowWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${({wrap = 'nowrap'}) => wrap};
  align-items: ${({align = 'center'}) => align};
  justify-content: ${({justify = 'flex-start'}) => justify};
`;

const FlexColumnWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: ${({wrap = 'nowrap'}) => wrap};
  align-items: ${({align = 'stretch'}) => align};
  justify-content: ${({justify = 'flex-start'}) => justify};
`;

interface FlexRowProps extends FlexWrapperProps, StyleAttributes {
  readonly children: React.ReactNode;
}

interface FlexColumnProps extends FlexWrapperProps, StyleAttributes {
  readonly children: React.ReactNode;
}

export const FlexRow: React.FC<FlexRowProps> = ({children, justify, align, style, className}) => {
  return (
    <FlexRowWrapper justify={justify} align={align} style={style} className={className}>
      {children}
    </FlexRowWrapper>
  );
};

export const FlexColumn: React.FC<FlexColumnProps> = ({
  children,
  justify,
  align,
  style,
  className,
}) => {
  return (
    <FlexColumnWrapper justify={justify} align={align} style={style} className={className}>
      {children}
    </FlexColumnWrapper>
  );
};
