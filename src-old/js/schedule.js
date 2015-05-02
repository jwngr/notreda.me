var app = angular.module("schedule", ["firebase"]);
app.controller("scheduleController", ["$scope", "$firebase", function($scope, $firebase) {
  // Get a reference to the root of the Firebase
  $scope.rootRef = new Firebase("https://notreda-me.firebaseio.com/");

  $scope.scheduleYear = "2012";

  $scope.wins = 0;
  $scope.losses = 0;

  $firebase($scope.rootRef.child($scope.scheduleYear)).$bind($scope, "games").then(function() {
    for (var key in $scope.games) {
      if (key[0] !== "$") {
        var game = $scope.games[key];
        if (game.isHomeGame) {
          if (game.homeTeam.score > game.awayTeam.score) {
            $scope.wins++;
          }
          else {
            $scope.losses++;
          }
        }
        else {
          if (game.homeTeam.score > game.awayTeam.score) {
            $scope.losses++;
          }
          else {
            $scope.wins++;
          }
        }
      }
    }
  });

  /* Returns the name of the home team for the inputted game */
  $scope.getHomeTeamName = function(game) {
    if (game.isHomeGame) {
      return "Notre Dame Fighting Irish";
    }
    else {
      return game.opponent.school + game.opponent.mascot;
    }
  };

  /* Returns the name of the away team for the inputted game */
  $scope.getAwayTeamName = function(game) {
    if (game.isHomeGame) {
      return game.opponent.school + game.opponent.mascot;
    }
    else {
      return "Notre Dame Fighting Irish";
    }
  };

  /* Returns the result (W or L) for Notre Dame for the inputted game */
  $scope.getResult = function(game) {
    return ($scope.getNotreDameScore(game) > $scope.getOpponentScore(game) ? "W" : "L");
  };

  /* Returns the name of Notre Dame's opponent for the inputted game */
  $scope.getOpponentName = function(game) {
    return (game.isHomeGame ? game.awayTeam.name : game.homeTeam.name);
  };

  /* Returns the score of Notre Dame's opponent for the inputted game */
  $scope.getOpponentScore = function(game) {
    return (game.isHomeGame ? game.awayTeam.score : game.homeTeam.score);
  };

  /* Returns the score for Notre Dame for the inputted game */
  $scope.getNotreDameScore = function(game) {
    return (game.isHomeGame ? game.homeTeam.score : game.awayTeam.score);
  };

  $scope.getHomeOrAwayGameClass = function(game) {
    console.log(game);
    return (game.isHomeGame ? "homeGame" : "awayGame");
  };
}]);