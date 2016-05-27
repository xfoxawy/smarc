smarc.controller('usersCreateController', [
    '$scope',
    '$rootScope',
    'User',
    '$mdToast',
    '$location',
    function($scope, $rootScope, User, $mdToast, $location){
        $rootScope.title = "Create New User";

        $scope.user = {};
        $scope.selectedRoles = {};
        $scope.roles = [
            'add_users',
            'delete_users',
        ];
        $scope.store = function(){
            // check name
            if (!$scope.user.name) {
                showNameError();
                return;
            }

            // check password
            if ($scope.user.password == '' || $scope.user.password != $scope.user.repeat) {
                showPasswordError();
                return;
            }

            // modify roles to send to DB.
            $scope.user.roles = transformRoles();

            // store new user.
            delete $scope.user.repeat;
            User.store($scope.user).then(function(){
                $location.path("/users");
                $mdToast.showSimple("User Added!!")
            });
        };

        $scope.reset = function(){
            $scope.selectedRoles = {};
            $scope.user = {};
        };

        function showNameError(){
            $mdToast.showSimple("Please Add User Name!!")
        };
        function showPasswordError(){
            $mdToast.showSimple("Password didn't match!!");
        };

        function transformRoles(){
            var roles = [];
            for ( key in $scope.selectedRoles ) {
                if ($scope.selectedRoles[key] == true) {
                    roles.push(key);
                }
            }
            return roles;
        };
    }
]);
