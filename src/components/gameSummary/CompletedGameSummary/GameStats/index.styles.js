import {darken} from 'polished';
import styled from 'styled-components';

export const GameStatsWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  margin-top: 32px;
  border: solid 3px ${(props) => props.theme.colors.black};

  @media (max-width: 950px) {
    max-width: 420px;
    margin-top: 40px;
  }
`;

export const GameStatsHeader = styled.div`
  width: 100%;
  display: flex;
  margin-top: -17px;

  & > p {
    display: flex;
    padding: 4px 0;
    text-align: center;
    align-items: center;
    justify-content: center;
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
    text-shadow: ${(props) => props.theme.colors.black} 1px 1px;
  }

  & > p:first-of-type {
    flex: 1;
  }

  & > p:not(:first-of-type) {
    width: 154px;
    margin-right: 4px;
    font-size: 14px;
    font-family: 'Bungee';
    color: ${(props) => props.theme.colors.white};
    border: solid 3px ${(props) => props.theme.colors.black};
  }

  @media (max-width: 1024px) {
    margin-top: -26px;
    justify-content: space-around;

    & > p:first-of-type {
      order: 1;
      width: 100px;
      flex: initial;
      text-align: center;
      font-weight: normal;
    }

    & > p:not(:first-of-type) {
      width: 112px;
      margin: 0 4px;
    }

    & > p:last-of-type {
      order: 2;
    }
  }
`;

export const StatsUnavailable = styled.p`
  width: 400px;
  margin-top: 32px;
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
  font-family: 'Inter UI', serif;

  a {
    color: ${(props) => props.theme.colors.green};
  }
`;
