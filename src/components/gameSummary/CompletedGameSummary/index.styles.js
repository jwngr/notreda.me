import styled from 'styled-components';

export const CompletedGameWrapper = styled.div`
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;
