// Libraries
import React from 'react';


const GameSummary = ({ game }) => {
  return (
    <div style={{ width: '20%', display: 'inline-block' }}>
      <p>{ game.opponent.school } { game.opponent.nickname }</p>
    </div>
  );
};

GameSummary.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default GameSummary;
