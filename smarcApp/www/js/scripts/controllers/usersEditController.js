smarc.controller('usersEditController', [
    '$scope',
    'User',
    '$rootScope',
    '$routeParams',
    '$location',
    '$mdToast',
    function($scope, User, $rootScope, $routeParams, $location, $mdToast){

        $scope.user = {};
        $scope.selectedRoles = {};
        $scope.roles = [
            'add_users',
            'delete_users',
        ];

        User.find($routeParams.id).then(function(user){
            $rootScope.title = "User " + user.data[0].name;
            transformPreRoles(user.data[0].roles);
            delete user.data[0].roles;
            $scope.user = user.data[0];
        });

        $scope.delete = function(id){
            User.delete(id).then(function(){
                $location.path("/users");
                $mdToast.showSimple("User Deleted!!")
            });
        };

        $scope.update = function(){
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
            console.log($scope.selectedRoles);
            console.log($scope.user);
            // store new user.
            // delete $scope.user.repeat;
            // User.update($routeParams.id, $scope.user).then(function(){
            //     $location.path("/users");
            //     $mdToast.showSimple("User Added!!")
            // });
        };

        function transformPreRoles(roles){
            if (typeof roles == 'object' && roles.length) {
                for (var i = 0; i <roles.length; i++) {
                    $scope.selectedRoles[roles[i]] = true;
                }
            }
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
