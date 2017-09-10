// Libraries
import _ from 'lodash';
import { connect } from 'react-redux';

// Presentational components
import GameSummary from '../components/GameSummary';

// Resources
import teams from '../../resources/teams';
import schedule from '../../resources/schedule';

const mapStateToProps = (state) => {
  const games = schedule[state.selectedYear];
  const game = _.clone(games[state.selectedGameIndex]);

  game.opponent = {
    name: teams[game.opponent].name,
    nickname: teams[game.opponent].nickname,
    logoUrl: teams[game.opponent].logoUrl,
    color: teams[game.opponent].color,
    abbreviation: game.opponent
  };

  return {
    game
  };
};

const GameSummaryContainer = connect(
  mapStateToProps
)(GameSummary);

export default GameSummaryContainer;
