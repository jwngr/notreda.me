import _ from 'lodash';
import {connect} from 'react-redux';

import GameSummary from '../components/gameSummary/GameSummary';

import teams from '../resources/teams';
import schedule from '../resources/schedule';

const mapStateToProps = ({selectedYear, selectedGameIndex}) => {
  const games = schedule[selectedYear];
  const game = _.clone(games[selectedGameIndex]);

  game.season = Number(selectedYear);

  game.weekIndex = Number(selectedGameIndex);

  game.opponent = teams[game.opponentId];
  game.opponent.abbreviation = game.opponentId;

  return {
    game,
  };
};

const GameSummaryContainer = connect(mapStateToProps)(GameSummary);

export default GameSummaryContainer;
