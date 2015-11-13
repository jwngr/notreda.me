/** @jsx React.DOM */
'use strict';

var GameDetails = React.createClass({
  getInitialState: function() {
    return {
      scores: {
        homeTeam: [7, 10, 10, 11],
        awayTeam: [0, 0, 0, 0]
      },
      stats: {
        homeTeam: {
          firstDowns: 21,
          totalPlays: 58,
          totalYards: 507,
          passingYards: 248,
          rushingYards: 259,
          penalties: 1,
          penaltyYards: 15,
          possession: '35:30',
          turnovers: 0
        },
        awayTeam: {
          firstDowns: 7,
          totalPlays: 42,
          totalYards: 301,
          passingYards: 200,
          rushingYards: 101,
          penalties: 8,
          penaltyYards: 65,
          possession: '24:30',
          turnovers: 3
        }
      }
    };
  },

  getHomeOrAwayClasses: function(isHomeGame) {
    var classes = 'game';
    classes += (this.props.game.isHomeGame) ? ' home' : ' away';
    return classes;
  },

  render: function() {
    var game = this.props.game;

    var notreDame = (this.props.game.isHomeGame) ? game.homeTeam : game.awayTeam;
    var opponent = (this.props.game.isHomeGame) ? game.awayTeam : game.homeTeam;
    var winOrLoss = (notreDame.score > opponent.score) ? 'W' : 'L';

    return (
      <div id='gameDetails'>
        <Scoreboard game={ this.props.game }/>
        <Stats game={ this.props.game }/>
      </div>
    );
  }
});
