/** @jsx React.DOM */
'use strict';

var GameOverview = React.createClass({
  getInitialState: function() {
    return {};
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
      <div className={ this.getHomeOrAwayClasses() }>
        <p className='opponentName'>{ opponent.name }</p>
        { /* <div className='helmet'>
          <img src='http://www.nationalchamps.net/Helmet_Project/Notre_Dame.gif' />
        </div> */ }
        <p className='result'>{ winOrLoss },{ notreDame.score }-{ opponent.score }</p>
        <p className='date'>{ game.date }</p>
      </div>
    );
  }
});
