smarc.controller('rootController', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$mdSidenav',
    'Auth',
    'Loading',
    'Connection',
    'Server',
    'Light',
    function($rootScope, $scope, $http, $location, $mdSidenav, Auth, Loading, Connection, Server, Light){
        $scope.currentPage = '';
        $rootScope.rooms   = {};
        $rootScope.points  = [];

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        if (typeof EventSource !== "undefined") {
            // Yes! Server-sent events support!
            var source = new EventSource("http://"+ config().serverIp +":"+ config().serverPort +"/notification");

            source.onmessage = function(e) {
                console.log(e.data);
                // update UI
                // console.log(JSON.parse(e.data));
                // after updating UI, confirm the changes by ...
                // $scope.$apply();
            };
        } else {
            // Sorry! No server-sent events support..
            alert('SSE not supported by browser.');
        }

        
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

        $scope.openRoom = function(id){
            // show just room points;
        };

        $scope.toggle = function(id){
            console.log(id);
            Light.toggle(id).then(function(response){
                $rootScope.points[id] = response;
            }, function(){});
        };

        $scope.appReady = function(){
            // hide splash screen;
            // navigator.splashscreen.hide();

            // show loading page
            Loading.show('check internet connection', function(){

                // check internet connection
                Connection.check().then(function success(){
                    // check first startup
                    Loading.hide();
                    Loading.show('checking first Startup', function completeShowing(){
                        if ( Loading.isFirstStartup() ) {
                            Loading.hide();

                            // show config page
                            Loading.configPage();
                        } else {
                            Loading.hide();
                            Server.connectToServer().then(function(data){
                                // check Auth
                                if ( Auth.isLogin() ) {
                                    // get all points and rooms
                                    Server.getStatus().then(function(response){
                                        $rootScope.rooms  = response.data.rooms;
                                        $rootScope.points = response.data.points;
                                    }, function(response){
                                        console.log(response);
                                    });
                                } else {
                                    $location.path("/login");
                                };
                            }, function(){
                                Loading.configPage();
                            });
                        }
                    });
                }, function fail(){
                    Loading.hide();
                    Loading.noInternetConnectionEx();
                });
            });
        };
    }
]);
