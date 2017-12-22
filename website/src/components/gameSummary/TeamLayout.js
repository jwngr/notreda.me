import React from 'react';
import PropTypes from 'prop-types';

import TeamLogo from '../TeamLogo';

import './TeamLayout.css';

const TeamLayout = ({team, ranking, homeOrAway}) => {
  const rankingContent = ranking ? <span className="team-ranking">#{ranking}</span> : null;
  const classes = `team-layout-${homeOrAway}`;

  return (
    <div className={classes}>
      <TeamLogo team={team} />
      <div className="team-name-container">
        <p className="team-name">
          {rankingContent} {team.name}
        </p>
        <p className="team-nickname">{team.nickname}</p>
        <p className="team-record">6-2</p>
      </div>
    </div>
  );
};

TeamLayout.propTypes = {
  team: PropTypes.object.isRequired,
  string: PropTypes.string.isRequired,
  ranking: PropTypes.number,
};

export default TeamLayout;
