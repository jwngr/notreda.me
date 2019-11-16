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

export const CoverageLocationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > div:first-of-type {
    margin-right: 6px;
  }

  & > div:last-of-type {
    margin-left: 6px;
  }
`;
