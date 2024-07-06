import _ from 'lodash';
import {connect} from 'react-redux';

import {GameSummary} from '../components/gameSummary/GameSummary';
import schedule from '../resources/schedule';
import teams from '../resources/teams';

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

export const GameSummaryContainer = connect(mapStateToProps)(GameSummary);
