smarc.controller('usersEditController', [
    '$scope',
    'User',
    '$rootScope',
    '$routeParams',
    '$location',
    '$mdToast',
    'userMethods',
    'roles',
    function($scope, User, $rootScope, $routeParams, $location, $mdToast, userMethods, roles){

        $scope.user = {};
        $scope.selectedRoles = {};
        $scope.roles = roles;


        User.find( $routeParams.id ).then(function(user){
            $rootScope.title = "User " + user.data[0].name;
            transformPreRoles(user.data[0].roles);
            delete user.data[0].roles;
            $scope.user = user.data[0];
        });

        $scope.delete = function(){
            User.delete($routeParams.id).then(function(){
                $location.path("/users");
                $mdToast.showSimple("User Deleted!!")
            });
        };

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

            // modify roles to send to DB.
            $scope.user.roles = userMethods.transformRoles($scope.selectedRoles);

            // store new user.
            delete $scope.user.repeat;
            
            User.update($routeParams.id, $scope.user).then(function(){
                $location.path("/users");
                $mdToast.showSimple("User Added!!")
            });
        };

        function transformPreRoles(roles){
            if (typeof roles == 'object' && roles.length) {
                for (var i = 0; i <roles.length; i++) {
                    $scope.selectedRoles[roles[i]] = true;
                }
            }
        };
    }
]);
