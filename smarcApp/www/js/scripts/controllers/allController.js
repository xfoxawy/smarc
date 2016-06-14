smarc.controller('allController', [
    '$rootScope',
    '$scope',
    '$mdToast',
    'User',
    'userMethods',
    '$location',
    function($rootScope, $scope, $mdToast, User, userMethods, $location){
        $rootScope.title = "All Points";
    }
]);
