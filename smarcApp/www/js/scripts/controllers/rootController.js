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
    'Queue',
    function($rootScope, $scope, $http, $location, $mdSidenav, Auth, Loading, Connection, Server, Queue){
        $scope.currentPage = '';
        $rootScope.rooms   = {};
        $rootScope.points  = [];
        $rootScope.gates   = [];
        $rootScope.title   = 'Home';
        $scope.originatorEv;

        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };

        $scope.userObject = function(){
            return ( window.localStorage.getItem('user') ) ? JSON.parse( window.localStorage.getItem('user') ) : {};
        };
        
        // get all gates
        Server.getGates().then(function(response){
            $rootScope.gates  = response.data;
        }, function(e){
            console.log(e);
        });

        // get all points and rooms
        Server.getStatus().then(function(response){
            $rootScope.rooms  = response.data.rooms;
            $rootScope.points = response.data.points;
        }, function(response){
            console.log(response);
        });

        $scope.toggle = function(id){
            var options = {
                'model': 'Light',
                'method': 'toggle',
                'data': id,
                'success': function(data){
                    console.log(data);
                    $rootScope.points[id] = data;
                },
                'error': function(e){
                    console.log(e);
                }
            };
            // start dequeuing items
            Queue.enqueue(options);
        };


        if (typeof EventSource !== "undefined") {
            var ip             = ( config().serverIp ) ? config().serverIp : '192.168.1.1',
                port           = ( config().serverPort ) ? config().serverPort : '1234',
                time           = 3 * 1000, // 3 seconds
                keepaliveTimer = null;

            function connect(){
                var source = new EventSource("http://"+ ip +":"+ port +"/notification");
                source.onerror = function(e) {
                    // if (e.target.readyState == 1) {
                        console.log('re connecting ...');
                        if(keepaliveTimer != null)clearTimeout(keepaliveTimer);
                        keepaliveTimer = setTimeout(connect, time);
                    // }
                };
                source.onmessage = function(e){
                    // $rootScope.rooms  = data.rooms;
                    $rootScope.points = JSON.parse(e.data);

                    // after updating UI, confirm the changes by ...
                    $rootScope.$apply();
                };
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

        $scope.appReady = function(){
            // hide splash screen;
            if (env == "production") navigator.splashscreen.hide();

            // show loading page
            Loading.show('check internet connection', function(){

                // check internet connection
                Connection.check().then(function success(){
                    Loading.hide();
                    
                    // try to connect with server
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
