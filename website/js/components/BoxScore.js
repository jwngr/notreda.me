// Libraries
import React from 'react';

const BoxScore = ({ scores, homeTeam, awayTeam }) => {
  const homeTeamColorStyles = {
    color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  // Header row
  const headerRowContent = [
    <p></p>
  ];

  for (let i = 0; i < scores.home.length; i++) {
    let header = i + 1;
    if (header > 4) {
      header = `OT ${header - 4}`;
    }
    headerRowContent.push(<p>{header}</p>);
  }

  headerRowContent.push(<p>T</p>);

  // Away team row
  const awayTeamRowContent = [
    <p style={awayTeamColorStyles}>{awayTeam.abbreviation}</p>
  ];

  let totalAwayScore = 0;
  scores.away.forEach(score => {
    awayTeamRowContent.push(<p>{score}</p>);
    totalAwayScore += score;
  });

  awayTeamRowContent.push(<p style={awayTeamColorStyles}>{totalAwayScore}</p>);

  // Home team row
  const homeTeamRowContent = [
    <p style={homeTeamColorStyles}>{homeTeam.abbreviation}</p>
  ];

  let totalHomeScore = 0;
  scores.home.forEach(score => {
    homeTeamRowContent.push(<p>{score}</p>);
    totalHomeScore += score;
  });

  homeTeamRowContent.push(<p style={homeTeamColorStyles}>{totalHomeScore}</p>);

  return (
    <div className='box-score'>
      <div>{headerRowContent}</div>
      <div className='quarter-scores'>{awayTeamRowContent}</div>
      <div className='quarter-scores'>{homeTeamRowContent}</div>
    </div>
  );
};

// TODO: add propTypes
// BoxScore.propTypes = {
//   game: React.PropTypes.object.isRequired
// };

export default BoxScore;
