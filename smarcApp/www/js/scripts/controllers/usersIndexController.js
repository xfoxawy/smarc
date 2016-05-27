smarc.controller('usersIndexController', [
    '$location',
    '$scope',
    'User',
    '$rootScope',
    '$mdToast',
    function($location, $scope, User, $rootScope, $mdToast){
        $rootScope.title = 'Users';
        $scope.users = [];
        User.all().then(function(users){
            $scope.users = users.data;
        });

        $scope.edit = function(id){
            $location.path("/users/"+ id +"/edit");
        };

        $scope.create = function(){
            $location.path("/users/create");
        };
    }
]);
