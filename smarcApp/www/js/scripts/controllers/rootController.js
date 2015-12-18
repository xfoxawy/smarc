smarc.controller('rootController', [
    '$scope',
    '$mdSidenav',
    'Room',
    'IO',
    '$http',
    '$location',
    function($scope, $mdSidenav, Room, IO, $http, $location){
        $scope.homePage = false;
        $scope.incomeReq = "hello";
        $scope.tests = "test";
        $scope.$on('$locationChangeStart', function(event) {
            if ( $location.path() == "/home" ) {
                $scope.homePage = true;
            } else {
                $scope.homePage = false;
            };
        });
        $scope.back = function(){
            history.back();
        };
        $scope.logout = function(){
            $scope.closeSidebar('mainSidebar');
            $location.path("/login");
        };

        $scope.showOptions = function(){
            $location.path("/options");
        };

        /**
         * for test purbose
         */
        IO.on('incomeReq', function(data){
            $scope.incomeReq = data;
        });
        $scope.test = function(){
            $http({
                method: "GET",
                url: "http://localhost:3050/test2"
            }).then(function(data){
                $scope.tests = data.data;
            });
        };
        /*********************************************/

        $scope.rooms = Room.rooms;

        $scope.toggleSideBar = function(id) {
            if( $mdSidenav(id).isOpen() ) $scope.closeSidebar(id);
            else $scope.openSidebar(id);
        };
        $scope.openSidebar = function(id){
            $mdSidenav(id).open();
        };
        $scope.closeSidebar = function(id){
            $mdSidenav(id).close();
        };
    }
]);
