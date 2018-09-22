import styled from 'styled-components';

export const FutureGameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

export const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin-bottom: 20px;
`;

export const TeamWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 80px;
    width: 80px;
    margin: 0 40px;
  }

  &:first-of-type img {
    margin-left: 8px;
    margin-right: 20px;
  }

  &:last-of-type img {
    margin-left: 20px;
    margin-right: 8px;
  }
`;

export const Ranking = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.colors.gray};
`;

export const AtOrVersus = styled.p`
  font-size: 32px;
`;

export const MetadataWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
