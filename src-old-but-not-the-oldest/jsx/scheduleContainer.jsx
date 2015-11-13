/** @jsx React.DOM */
'use strict';

var ScheduleContainer = React.createClass({
  getInitialState: function() {
    return {
      year: 2012,
      games: []
    };
  },

  componentWillMount: function() {
    this.getCurrentYearGames();
  },

  getCurrentYearGames: function() {
    var rootRef = new Firebase('https://notreda-me.firebaseio.com/');
    rootRef.child(this.state.year).once('value', function(snapshot) {
      var games = [];
      snapshot.forEach(function(gameSnapshot) {
        games.push(gameSnapshot.val());
      });

      this.setState({
        games: games
      });
    }.bind(this));
  },

  didNotreDameWin: function(game) {
    // TODO: what about ties?
    if (game.isHomeGame) {
      return game.homeTeam.score > game.awayTeam.score;
    } else {
      return game.awayTeam.score > game.homeTeam.score;
    }
  },

  render: function() {
    var _this = this;

    // Create the JSX for each game overview
    var games = this.state.games.map(function(game) {
      return <GameOverview game={ game } />;
    }.bind(this));

    // Calculate Notre Dame's record
    var numWins = 0;
    var numLosses = 0;
    this.state.games.forEach(function(game) {
      var didNotreDameWin = _this.didNotreDameWin(game);
      numWins += didNotreDameWin ? 1 : 0;
      numLosses += didNotreDameWin ? 0 : 1;
    });

    var gameDetails = '';
    if (this.state.games[0]) {
      gameDetails = <GameDetails game={ this.state.games[0] } />;
    } else {
      gameDetails = <div id='gameDetails'></div>;
    }

    return (
      <div id='mainFlexContainer'>
        <div id='header'>
          <p id='title'>Notre Dame Football { this.state.year }</p>
          <p id='record'>{ numWins } - { numLosses }</p>
        </div>

        { gameDetails }

        <div id='schedule'>
          { games }
        </div>
      </div>
    );
  }
});

React.render(<ScheduleContainer />, document.body);
