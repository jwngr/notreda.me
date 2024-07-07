import styled from 'styled-components';

export const MatchupHistoryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Records = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > p:first-of-type {
      font-size: 16px;
      font-family: 'Inter UI', serif;
    }

    & > p:last-of-type {
      font-size: 20px;
      font-family: 'Bungee';
    }
  }
`;

interface RecentMatchupsProps {
  readonly matchupsCount: number;
}

export const RecentMatchups = styled.div<RecentMatchupsProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: ${({matchupsCount}) => (matchupsCount > 1 ? '-60px' : 0)};
`;
