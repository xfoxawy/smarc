smarc.controller('roomController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    function($rootScope, $scope, $routeParams){
        $rootScope.title = "Room " + $rootScope.rooms[$routeParams.id];
        $scope.points = {};
        
        function updateRoom(){
            for (key in $rootScope.points) {
                if ($rootScope.points[key].r == $routeParams.id) {
                    $scope.points[key] = $rootScope.points[key];
                }
            }
        }
        updateRoom();

        $rootScope.$watch('points', updateRoom, true);
    }
]);
