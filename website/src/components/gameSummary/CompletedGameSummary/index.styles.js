import styled from 'styled-components';

export const CompletedGameWrapper = styled.div`
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 768px) {
    padding-bottom: 20px;
  }
`;

export const VideoHighlights = styled.iframe`
  width: 100%;
  height: 294px;
  max-width: 520px;
  margin-top: 20px;
  border: solid 3px ${(props) => props.theme.colors.black};

  @media (max-width: 950px) {
    max-width: 420px;
    height: 240px;
  }
`;
