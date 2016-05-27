smarc.controller('signController', [
    '$scope',
    '$location',
    '$mdDialog',
    'Auth',
    function($scope, $location, $mdDialog, Auth){
        $scope.user = {};
        $scope.success = false;
        $scope.login = function(){
            Auth.login({
                name:     $scope.user.name,
                password: $scope.user.password
            }, function(data){
                // if status == 403 then display error message
                if (data.status == 403) {
                    alert = $mdDialog.alert()
                        .title('Error')
                        .textContent('User name or Password incorrect')
                        .clickOutsideToClose(true)
                        .ok('Try Again');

                    $mdDialog
                        .show( alert )
                        .finally(function() {
                            alert = undefined;
                        }
                    );
                }

                // else if status == 200 then redirect to ->
                if (data.status === 200) {
                    // save token
                    window.localStorage.setItem('auth', data.data.token);

                    // save roles
                    window.localStorage.setItem('roles', data.data.roles);

                    // redirect user to home page
                    $location.path('/home');
                }
            });
        };
    }
]);
// window.localStorage.removeItem('key');
