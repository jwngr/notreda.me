var myApp = angular.module("notreda.me", ["firebase"]);

function ScheduleController($scope, $firebase) {
    var firebaseRoot = new Firebase("https://notreda-me.firebaseio.com/");

    // Automatically syncs everywhere in realtime
    var games2013 = firebaseRoot.child("/2013/");
    $scope.games = $firebase(games2013);
}