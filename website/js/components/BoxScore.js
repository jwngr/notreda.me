// Libraries
import React from 'react';

const BoxScore = ({ scores, homeTeam, awayTeam }) => {
  const homeTeamColorStyles = {
    color: homeTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  const awayTeamColorStyles = {
    color: awayTeam.color || 'blue' // TODO: remove || once all teams have a color
  };

  let totalHomeScore = 0;
  let totalAwayScore = 0;
  const scoresContent = scores.map((score, index) => {
    let header = index + 1;
    if (header > 4) {
      header = `OT ${header - 4}`;
    }

    totalHomeScore += score.home;
    totalAwayScore += score.away;

    return (
      <div>
        <p>{header}</p>
        <p>{score.away}</p>
        <p>{score.home}</p>
      </div>
    );
  });

  scoresContent.append(
    <div>
      <p></p>
      <p style={awayTeamColorStyles}>{awayTeam.abbreviation}</p>
      <p style={homeTeamColorStyles}>{homeTeam.abbreviation}</p>
    </div>
  );

  scoresContent.append(
    <div>
      <p></p>
      <p style={awayTeamColorStyles}>{totalAwayScore}</p>
      <p style={homeTeamColorStyles}>{totalHomeScore}</p>
    </div>
  );

  return (
    <div className='box-score'>
      {scoresContent}
    </div>
  );
};

// TODO
BoxScore.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default BoxScore;
