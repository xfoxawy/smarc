smarc.controller('roomController', [
    '$scope',
    '$routeParams',
    function($scope, $routeParams){
        console.log($scope.$parent);
        $scope.roomPoints = $scope.$parent.points.filter(function(val){
            return val.r == $routeParams.id;
        });

        $scope.togglePoint = function(id){
            console.log(id);
        };
    }
]);
