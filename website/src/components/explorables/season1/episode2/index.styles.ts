import {darken} from 'polished';
import styled from 'styled-components';

import {SliderRange} from '../../../common/SliderRange';

export const Legend = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 14px;
  font-variant: small-caps;

  & > div {
    margin: 2px 0;
    display: flex;
    align-items: center;
  }

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

interface ColorProps {
  readonly $hex: string;
}

export const Color = styled.div<ColorProps>`
  width: 16px;
  height: 16px;
  background: ${({$hex}) => $hex};
  display: inline-block;
  margin-right: 4px;
  border: solid 2px ${({$hex}) => darken(0.2, $hex)};

  @media (max-width: 600px) {
    width: 12px;
    height: 12px;
  }
`;

export const SliderRangeWrapper = styled(SliderRange)`
  position: absolute;
  top: 50px;
  right: 24px;
`;

export const LosslessRecordLineGraphSeasons = styled.p`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  font-variant: small-caps;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;
