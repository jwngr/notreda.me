import styled from 'styled-components';

export const CompletedGameWrapper = styled.div`
  flex: 1;
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 8px;
    padding-bottom: 20px;
  }
`;

const coverageLocationWrapperSmallerStyles = `
  flex-direction: column;
  align-items: initial;
  justify-content: initial;

  & > div {
    flex: 1;
    max-width: 100%;
  }

  & > div:first-of-type {
    margin-right: 0;
    margin-bottom: 32px;
  }

  & > div:last-of-type {
    margin-left: 0;
  }
`;

export const CoverageLocationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > div {
    flex: 1;
    max-width: calc(50% - 6px);
  }

  & > div:first-of-type {
    margin-right: 6px;
    margin-bottom: 0;
  }

  & > div:last-of-type {
    margin-left: 6px;
  }

  @media (max-width: 1200px) and (min-width: 950px) {
    ${coverageLocationWrapperSmallerStyles}
  }

  @media (max-width: 600px) {
    ${coverageLocationWrapperSmallerStyles}
  }
`;
