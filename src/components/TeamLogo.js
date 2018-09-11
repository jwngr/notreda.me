import React from 'react';

// TODO: remove once all teams have a logo URL
const DEFAULT_TEAM_LOGO_URL =
  'http://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football-college.png&h=80&w=80&scale=crop&cquality=40';

const TeamLogo = ({team, className}) => (
  <img
    className={className}
    src={team.logoUrl || DEFAULT_TEAM_LOGO_URL}
    alt={`${team.name} logo`}
  />
);

export default TeamLogo;
