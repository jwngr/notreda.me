import React from 'react';
import styled from 'styled-components';

import shamrockImage from '../images/shamrock.png';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Bungee', sans-serif;
  font-size: 12px;
  line-height: 1.1;
  white-space: nowrap;
`;

const Logo = styled.img`
  width: 20px;
  height: 20px;
`;

export const ShamrockSeriesBadge: React.FC<{readonly showLabel?: boolean}> = ({
  showLabel = false,
}) => (
  <Badge title="Shamrock Series">
    <Logo src={shamrockImage} alt="Shamrock Series" />
    {showLabel ? <span>Shamrock Series</span> : null}
  </Badge>
);
