smarc.controller('profileController', [
    '$rootScope',
    '$scope',
    '$mdToast',
    'User',
    'userMethods',
    '$location',
    function($rootScope, $scope, $mdToast, User, userMethods, $location){
        $rootScope.title     = "My Profile";
        $scope.user          = ( window.localStorage.getItem('user') ) ? JSON.parse( window.localStorage.getItem('user') ) : {};
        $scope.selectedRoles = {};

        $scope.update = function(){
            // check name
            if (!$scope.user.name) {
                userMethods.showNameError();
                return;
            }

            // check password
            if ($scope.user.password == '' || $scope.user.password != $scope.user.repeat) {
                userMethods.showPasswordError();
                return;
            }

            // store new user.
            delete $scope.user.repeat;

            User.update($scope.user._id, $scope.user).then(function(){
                delete $scope.user.password;

                window.localStorage.setItem('user', JSON.stringify($scope.user) );
                $location.path('/users');
                $mdToast.showSimple("User Updated!!");
            });
        };
    }
]);
