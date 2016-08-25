smarc.controller('gatesController', [
    '$rootScope',
    '$scope',
    '$http',
    'Server',
    function($rootScope, $scope, $http, Server){
        $rootScope.title = "Gates";
        // get all points and rooms
        Server.getStatus().then(function(response){
            $rootScope.rooms  = response.data.rooms;
            $rootScope.points = response.data.points;
        }, function(response){
            console.log(response);
        });
    }
]);
