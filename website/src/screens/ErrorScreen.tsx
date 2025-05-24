import React from 'react';
import styled from 'styled-components';

// TODO: Redesign error screen.
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const ErrorTitle = styled.h1`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.5;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  padding: 0.5rem;

  &:hover {
    color: #212529;
  }
`;

const ErrorStack = styled.pre`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RefreshButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ErrorScreen: React.FC<{readonly error: Error}> = ({error}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <ErrorContainer>
      <ErrorTitle>Something went wrong</ErrorTitle>
      <ErrorMessage>An unexpected error has occurred. Please try refreshing the page.</ErrorMessage>

      <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>

      <ErrorDetails>
        <ErrorSummary>Error Details</ErrorSummary>
        <div>
          <strong>Message:</strong>
          <p>{error.message}</p>
          {error.stack && (
            <>
              <strong>Stack:</strong>
              <ErrorStack>{error.stack}</ErrorStack>
            </>
          )}
        </div>
      </ErrorDetails>
    </ErrorContainer>
  );
};
