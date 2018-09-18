import {darken} from 'polished';
import styled from 'styled-components';

export const LinescoreWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  font-family: 'Bungee';
  margin-right: 20px;
  border: solid 3px ${(props) => props.theme.colors.black};

  @media (max-width: 1000px) {
    margin-right: 0;
    margin-bottom: 32px;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const LinescoreColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -17px;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 28px;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    p:not(:first-of-type) {
      height: 40px;
    }
  }
`;

export const AbbreviationColumn = styled(LinescoreColumn)`
  flex: 1;
  min-width: 80px;
  max-width: 100px;
  margin-top: -17px;

  @media (max-width: 600px) {
    font-size: 20px;
    flex: initial;
    max-width: 80px;
    min-width: initial;
  }
`;

export const ScoreColumn = styled(LinescoreColumn)`
  width: 40px;

  p:first-of-type {
    white-space: nowrap;
    font-size: 16px;
    text-align: center;
    padding: 0 8px;
    background-color: ${(props) => props.theme.colors.green};
    border: solid 3px ${(props) => props.theme.colors.black};
    color: ${(props) => props.theme.colors.white};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
    text-shadow: ${(props) => props.theme.colors.black} 1px 1px;
  }

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;
