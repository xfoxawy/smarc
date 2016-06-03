smarc.controller('usersIndexController', [
    '$location',
    '$scope',
    'User',
    '$rootScope',
    '$mdToast',
    function($location, $scope, User, $rootScope, $mdToast){
        $rootScope.title  = 'Users';
        $scope.users      = [];
        $scope.userObject = ( window.localStorage.getItem('user') ) ? JSON.parse( window.localStorage.getItem('user') ) : {};

        User.all().then(function(users){
            for (var i = 0; i < users.data.length; i++) {
                if( users.data[i]._id != $scope.userObject._id) {
                    $scope.users.push(users.data[i]);
                }
            }
        });

        $scope.edit = function(id){
            $location.path("/users/"+ id +"/edit");
        };

        $scope.create = function(){
            $location.path("/users/create");
        };
    }
]);
