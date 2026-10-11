import React from 'react';
import styled from 'styled-components';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Bungee', sans-serif;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
`;

const Icon = styled.svg`
  width: 20px;
  height: 20px;
  flex: none;
  color: ${({theme}) => theme.colors.black};
`;

export const CollegeGameDayBadge: React.FC<{readonly showLabel?: boolean}> = ({
  showLabel = false,
}) => (
  <Badge title="ESPN College GameDay" aria-label="ESPN College GameDay">
    <Icon viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m8 4 4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="11" r="1.5" fill="#c62828" />
      <path d="M6 16h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
    {showLabel ? <span>College GameDay</span> : null}
  </Badge>
);
