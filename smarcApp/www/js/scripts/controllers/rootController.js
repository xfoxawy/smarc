smarc.controller('rootController', [
    '$scope',
    '$http',
    '$location',
    '$mdSidenav',
    'Room',
    'IO',
    'Auth',
    function($scope, $http, $location, $mdSidenav, Room, IO, Auth){
        // server iIP that will use in all requests to backend API.
        $scope.serverIp = ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ).serverIp : '';

        /**
         * for test purbose
         */
        IO.on('overallStatus', function(data){
            console.log(data);
            // $scope.overallStatus = data;
        });

        // $scope.test = function(){
        //     $http({
        //         method: "GET",
        //         url: "http://localhost:3050/test2"
        //     }).then(function(data){
        //         $scope.tests = data.data;
        //     });
        // };
        /*********************************************/

        $scope.currentPage = '';
        $scope.rooms = Room.rooms;
        
        $scope.$on('$locationChangeStart', function(event) {
            $scope.currentPage = $location.path().substr(1);
        });
        
        $scope.back = function(){
            history.back();
        };
        
        $scope.logout = function(){
            Auth.logout(function(data){
                // delete token from local storage
                window.localStorage.removeItem('auth');

                // make sure sidebar is closed
                $scope.closeSidebar('mainSidebar');

                // redirect to login page
                $location.path("/login");
            });
        };

        $scope.showOptions = function(){
            $location.path("/options");
        };

        $scope.toggleSideBar = function(id) {
            if ($scope.currentPage != 'login') {
                if( $mdSidenav(id).isOpen() ) $scope.closeSidebar(id);
                else $scope.openSidebar(id);
            }
        };
        $scope.openSidebar = function(id){
            if ($scope.currentPage != 'login') $mdSidenav(id).open();
        };
        $scope.closeSidebar = function(id){
            if ($scope.currentPage != 'login') $mdSidenav(id).close();
        };

        /**
         * After all things Done Hide splash Screen
         */
        $scope.appReady = function(){
            // get auth from local storage
            var auth = window.localStorage.getItem('auth');

            // if present then
            if (auth) {
                // redirect to home page
                $location.path("/home");

                // hide loading screen
                // navigator.splashscreen.hide();
            } else {
                // redirect to login page
                $location.path("/login");
            }

        };
    }
]);
