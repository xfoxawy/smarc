smarc.controller('signController', [
    '$scope',
    '$location',
    function($scope, $location){
        $scope.login = function(){
            // some Logic then
            $location.path('/home');
        };
    }
])
