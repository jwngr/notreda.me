import React from 'react';
import styled from 'styled-components';

import shamrockImage from '../images/shamrock.png';

interface BadgeProps {
  readonly $showLabel: boolean;
  readonly $mobileOnly: boolean;
  readonly $desktopOnly: boolean;
}

const Badge = styled.span<BadgeProps>`
  display: ${({$mobileOnly}) => ($mobileOnly ? 'none' : 'inline-flex')};
  align-items: center;
  gap: 4px;
  margin-left: ${({$showLabel}) => ($showLabel ? 0 : '4px')};
  margin-top: ${({$showLabel}) => ($showLabel ? '4px' : 0)};
  font-family: 'Bungee', sans-serif;
  font-size: 12px;
  line-height: 1.1;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: ${({$desktopOnly}) => ($desktopOnly ? 'none' : 'inline-flex')};
  }
`;

const Logo = styled.img`
  width: 20px;
  height: 20px;
`;

export const ShamrockSeriesBadge: React.FC<{
  readonly showLabel?: boolean;
  readonly mobileOnly?: boolean;
  readonly desktopOnly?: boolean;
}> = ({showLabel = false, mobileOnly = false, desktopOnly = false}) => (
  <Badge
    $showLabel={showLabel}
    $mobileOnly={mobileOnly}
    $desktopOnly={desktopOnly}
    title="Shamrock Series"
  >
    <Logo src={shamrockImage} alt="Shamrock Series" />
    {showLabel ? <span>Shamrock Series</span> : null}
  </Badge>
);
