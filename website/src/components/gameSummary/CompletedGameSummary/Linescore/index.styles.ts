import {darken} from 'polished';
import styled, {css} from 'styled-components';

export const LinescoreWrapper = styled.div`
  width: 100%;
  display: flex;
  padding-right: 8px;
  margin-top: 32px;
  text-align: center;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  font-family: 'Bungee';
  border: solid 3px ${({theme}) => theme.colors.black};
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

  @media (max-width: 950px) {
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

  @media (max-width: 950px) {
    font-size: 20px;
    flex: initial;
    max-width: 80px;
    min-width: initial;
  }
`;

interface ScoreColumnProps {
  readonly $isOvertimePeriod: boolean;
  readonly $isThirdOrLaterOvertimePeriod: boolean;
}

export const ScoreColumn = styled(LinescoreColumn)<ScoreColumnProps>`
  width: 40px;

  p:first-of-type {
    white-space: nowrap;
    font-size: 16px;
    text-align: center;
    padding: 0 8px;
    background-color: ${({theme}) => theme.colors.green};
    border: solid 3px ${({theme}) => theme.colors.black};
    color: ${({theme}) => theme.colors.white};
    -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
    -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
    text-shadow: ${({theme}) => theme.colors.black} 1px 1px;

    ${({$isOvertimePeriod}) =>
      $isOvertimePeriod
        ? css`
            font-size: 14px;
            padding: 0 2px;
          `
        : null}
  }

  @media (max-width: 600px) {
    p:first-of-type {
      ${({$isThirdOrLaterOvertimePeriod}) =>
        $isThirdOrLaterOvertimePeriod
          ? css`
              font-size: 12px;
              padding: 0;
            `
          : null}
    }
  }
`;
