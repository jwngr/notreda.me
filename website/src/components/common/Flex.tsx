import styled from 'styled-components';

import {StyleAttributes} from '../../models/styles.models';

type JustifyValue =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type WrapValue = 'nowrap' | 'wrap' | 'wrap-reverse';
type AlignValue = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

interface FlexWrapperProps {
  readonly $gap?: number;
  readonly $justify?: JustifyValue;
  readonly $wrap?: WrapValue;
  readonly $align?: AlignValue;
  // TODO: Add `flex` / `grow` / `shrink` props.
}

interface FlexProps {
  readonly gap?: number;
  readonly justify?: JustifyValue;
  readonly wrap?: WrapValue;
  readonly align?: AlignValue;
  // TODO: Add `flex` / `grow` / `shrink` props.
}

const FlexRowWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: row;
  gap: ${({$gap = 0}) => $gap}px;
  flex-wrap: ${({$wrap = 'nowrap'}) => $wrap};
  align-items: ${({$align = 'center'}) => $align};
  justify-content: ${({$justify = 'flex-start'}) => $justify};
`;

const FlexColumnWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({$gap = 0}) => $gap}px;
  flex-wrap: ${({$wrap = 'nowrap'}) => $wrap};
  align-items: ${({$align = 'stretch'}) => $align};
  justify-content: ${({$justify = 'flex-start'}) => $justify};
`;

interface FlexRowProps extends FlexProps, StyleAttributes {
  readonly children: React.ReactNode;
}

interface FlexColumnProps extends FlexProps, StyleAttributes {
  readonly children: React.ReactNode;
}

export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  align,
  justify,
  gap,
  wrap,
  style,
  className,
}) => {
  return (
    <FlexRowWrapper
      $align={align}
      $justify={justify}
      $gap={gap}
      $wrap={wrap}
      style={style}
      className={className}
    >
      {children}
    </FlexRowWrapper>
  );
};

export const FlexColumn: React.FC<FlexColumnProps> = ({
  children,
  align,
  justify,
  gap,
  wrap,
  style,
  className,
}) => {
  return (
    <FlexColumnWrapper
      $align={align}
      $justify={justify}
      $gap={gap}
      $wrap={wrap}
      style={style}
      className={className}
    >
      {children}
    </FlexColumnWrapper>
  );
};
