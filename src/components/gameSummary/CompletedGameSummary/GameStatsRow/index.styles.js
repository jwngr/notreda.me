import styled from 'styled-components';

export const GameStatsRowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:nth-of-type(2n + 1) {
    background-color: ${(props) => props.theme.colors.gray}2b;
  }

  &.game-stats-header-row p:first-of-type {
    font-weight: bold;
  }

  &:not(.game-stats-header-row) p:first-of-type {
    padding-left: 20px;
  }

  @media (max-width: 1024px) {
    justify-content: space-around;

    &:not(.game-stats-header-row) p:first-of-type {
      padding-left: 0;
    }
  }
`;

const StatCell = styled.p`
  padding: 6px 0;
  color: ${(props) => props.theme.colors.black};
  font-size: 14px;
  font-family: 'Merriweather';
  white-space: nowrap;
`;

export const StatName = styled(StatCell)`
  flex: 1;
  padding-left: 8px;

  @media (max-width: 1024px) {
    flex: initial;
    order: 1;
    width: 100px;
    padding-left: 0;
    text-align: center;
    font-weight: bold;
  }
`;

export const StatValue = styled(StatCell)`
  width: 160px;
  text-align: center;

  @media (max-width: 1024px) {
    width: 120px;

    &:last-of-type {
      order: 2;
    }
  }
`;
