import React from 'react';
import PropTypes from 'prop-types';

import './LineScore.css';


const LineScore = ({ lineScores, homeTeam, awayTeam }) => {
  // TODO: remove once all games have line scores
  if (lineScores.home.length === 0) {
    lineScores = {
      home: [10, 7, 0, 13, 7, 3, 8, 8],
      away: [0, 7, 10, 3, 7, 3, 8, 0],
    };
  }

  const homeTeamColorStyles = {
    color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  // Header row
  const headerRowContent = [
    <p key='abbreviation'></p>
  ];

  for (let i = 0; i < lineScores.home.length; i++) {
    let header = i + 1;
    if (header > 4) {
      header = `OT ${header - 4}`;
    }
    headerRowContent.push(<p key={header}>{header}</p>);
  }

  headerRowContent.push(<p key='total'>T</p>);

  // Away team row
  const awayTeamRowContent = [
    <p style={awayTeamColorStyles} key='abbreviation'>{awayTeam.abbreviation}</p>
  ];

  let totalAwayScore = 0;
  lineScores.away.forEach((score, i) => {
    awayTeamRowContent.push(<p key={i}>{score}</p>);
    totalAwayScore += score;
  });

  awayTeamRowContent.push(<p style={awayTeamColorStyles} key='total'>{totalAwayScore}</p>);

  // Home team row
  const homeTeamRowContent = [
    <p style={homeTeamColorStyles} key='abbreviation'>{homeTeam.abbreviation}</p>
  ];

  let totalHomeScore = 0;
  lineScores.home.forEach((score, i) => {
    homeTeamRowContent.push(<p key={i}>{score}</p>);
    totalHomeScore += score;
  });

  homeTeamRowContent.push(<p style={homeTeamColorStyles} key='total'>{totalHomeScore}</p>);

  return (
    <div className='line-score'>
      <div>{headerRowContent}</div>
      <div className='quarter-scores'>{awayTeamRowContent}</div>
      <div className='quarter-scores'>{homeTeamRowContent}</div>
    </div>
  );
};

LineScore.propTypes = {
  lineScores: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default LineScore;
