import {darken} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const TooltipWrapper = styled.div`
  position: absolute;
  z-index: 100;
  opacity: 1;
  padding: 4px;
  margin: 8px 8px 0 0;
  font-size: 16px;
  font-family: 'Inter UI';
  background-image: url(${backgroundImage});
  background-color: ${(props) => props.theme.colors.lightGray}40;
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
  color: ${(props) => props.theme.colors.green};
`;
