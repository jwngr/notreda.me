var app = angular.module("schedule", ["firebase"]);
app.controller("scheduleController", ["$scope", "$firebase",
  function($scope, $firebase) {
    // Get a reference to the root of the Firebase
    $scope.rootRef = new Firebase("https://notreda-me.firebaseio.com/");

    $scope.scheduleYear = "2015";

    $firebase($scope.rootRef.child($scope.scheduleYear)).$bind($scope, "games");
  }
]);