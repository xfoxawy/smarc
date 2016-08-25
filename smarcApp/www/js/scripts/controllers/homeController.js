smarc.controller('homeController', [
	'$rootScope',
    '$scope',
    '$location',
	function($rootScope, $scope, $location){
        $rootScope.title = "Home";

        $scope.goTo = function(path){
            $location.path(path);
        };
	}
]);
