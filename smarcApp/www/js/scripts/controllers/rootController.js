smarc.controller('rootController', [
    '$scope',
    '$mdSidenav',
    function($scope, $mdSidenav){
        $scope.rooms = [
            { name: "Room One" },
            { name: "Room Two" },
            { name: "Room Three" }
        ];

        $scope.toggleSideBar = function(id) {
            $mdSidenav(id).toggle();
        };
    }
]);
