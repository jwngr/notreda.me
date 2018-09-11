import {darken} from 'polished';
import styled from 'styled-components';

export const GameStatsWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 520px;
  align-items: center;
  flex-direction: column;
  border: solid 3px ${(props) => props.theme.colors.black};

  & > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & > p:first-of-type {
      flex: 1;
      min-width: 200px;
      padding-left: 8px;
    }

    & > p:not(:first-of-type) {
      width: 150px;
      text-align: center;
      margin-right: 4px;
    }

    & > p:nth-of-type(2) {
      margin-right: 8px;
    }
  }

  @media (max-width: 1000px) {
    & > div {
      & > p:first-of-type {
        min-width: 100px;
      }
      
      & > p:not(:first-of-type) {
        width: 100px;
      }
  }
`;

export const GameStatsHeader = styled.div`
  margin-top: -17px;

  p {
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
    text-shadow: ${(props) => props.theme.colors.black} 1px 1px;
  }

  & > p:not(:first-of-type) {
    padding: 4px;
    font-size: 14px;
    font-family: 'Bungee';
    color: ${(props) => props.theme.colors.white};
    border: solid 3px ${(props) => props.theme.colors.black};
  }
`;

export const StatsUnavailable = styled.p`
  width: 400px;
  line-height: 20px;
  text-align: center;
}
`;
