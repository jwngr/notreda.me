import React from 'react';
import styled from 'styled-components';

const NoteWrapper = styled.div`
  width: 600px;
  margin: 0 auto 20px auto;
  border: solid 3px #302205;
  font-size: 16px;
  line-height: 24px;
  font-family: 'Inter', serif;
  text-align: justify;
`;

const NoteHeaderContainer = styled.div`
  margin-top: -14px;
  text-align: center;
`;

const NoteHeader = styled.p`
  color: #efefef;
  font-size: 20px;
  font-family: 'Bungee';
  display: inline;
`;

const NoteText = styled.p`
  padding: 8px 12px;
`;

export const Note: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
  return (
    <NoteWrapper>
      <NoteHeaderContainer>
        <NoteHeader>Note</NoteHeader>
      </NoteHeaderContainer>
      <NoteText>{children}</NoteText>
    </NoteWrapper>
  );
};
