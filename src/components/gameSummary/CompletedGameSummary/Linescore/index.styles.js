import {darken} from 'polished';
import styled from 'styled-components';

export const LinescoreWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: row;
  font-family: 'Bungee';
  margin-right: 20px;
  border: solid 3px ${(props) => props.theme.colors.black};

  @media (max-width: 1000px) {
    margin-right: 0;
    margin-bottom: 32px;
  }
`;

const LinescoreColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -17px;

  p {
    font-size: 20px;
    height: 28px;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

export const AbbreviationColumn = styled(LinescoreColumn)`
  flex: 1;
  min-width: 80px;
  max-width: 100px;
  margin-top: -17px;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

export const ScoreColumn = styled(LinescoreColumn)`
  min-width: 40px;
  max-width: 80px;

  p:first-of-type {
    white-space: nowrap;
    font-size: 14px;
    text-align: center;
    padding: 4px 8px 20px 8px;
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
