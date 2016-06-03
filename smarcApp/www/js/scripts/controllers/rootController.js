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
        $rootScope.title   = 'Home';
        $scope.originatorEv;

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };

        $scope.userObject = function(){
            return ( window.localStorage.getItem('user') ) ? JSON.parse( window.localStorage.getItem('user') ) : {};
        };

        if (typeof EventSource !== "undefined") {
            var ip             = ( config().serverIp ) ? config().serverIp : '192.168.1.1',
                port           = ( config().serverPort ) ? config().serverPort : '1234',
                time           = 3 * 1000, // 3 seconds
                keepaliveTimer = null;

            function connect(){
                var source = new EventSource("http://"+ ip +":"+ port +"/notification");
                source.onerror = function(e) {
                    if (source.readyState == 2) {
                        console.log('re connecting ...');
                        if(keepaliveTimer != null)clearTimeout(keepaliveTimer);
                        keepaliveTimer = setTimeout(connect, time);
                    }
                };
                source.addEventListener('message', function(e){
                    // $rootScope.rooms  = data.rooms;
                    $rootScope.points = JSON.parse(e.data);

                    // after updating UI, confirm the changes by ...
                    $rootScope.$apply();
                },false);
            }
            connect();
        } else {
            // Sorry! No server-sent events support..
            alert('SSE not supported by browser.');
        }

        $scope.$on('$locationChangeStart', function(event) {
            $scope.currentPage = $location.path().substr(1);
        });

        $scope.openMenu = function($mdOpenMenu, ev){
            $scope.originatorEv = ev;
            $mdOpenMenu(ev);
        };
        
        $scope.back = function(){
            history.back();
        };
        
        $scope.logout = function(){
            $scope.originatorEv = null;
            Auth.logout(function(data){
                // delete token from local storage
                window.localStorage.removeItem('auth');
                window.localStorage.removeItem('user');

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
            if (env == "production") {
                navigator.splashscreen.hide();
            }

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

        $scope.exit = function(){
            if (env == "production") {
                navigator.app.exitApp();
            }
            if (env == "development") {
                console.log('closing app');
            }
        };
    }
]);
