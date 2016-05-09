smarc.controller('rootController', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$mdSidenav',
    'IO',
    'Auth',
    'Loading',
    'Connection',
    'Server',
    function($rootScope, $scope, $http, $location, $mdSidenav, IO, Auth, Loading, Connection, Server){
        $scope.currentPage = '';
        $rootScope.rooms   = {};
        $rootScope.points  = [];
        
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

        $scope.appReady = function(){
            // hide splash screen;
            // navigator.splashscreen.hide();

            // show loading page
            Loading.show('checking internet connection', function completeShowing(){

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
                            Server.connectToServer().then(function(){
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

        /**
         * After all things Done Hide splash Screen
         */
        // $scope.appReady = function(){
            // window.localStorage.removeItem('notFirstStart');
            
            // var notFirstStart = window.localStorage.getItem('notFirstStart');
            
            // get auth from local storage
            // var auth          = window.localStorage.getItem('auth');

            // if (notFirstStart) {
                // if present then
                // if (auth) {
                    // redirect to home page
                    // $location.path("/home");

                    // init application
                    // refresh();

                    // hide loading screen
                    // navigator.splashscreen.hide();
                // } else {
                    // redirect to login page
                    // $location.path("/login");
                // };
            // } else {
                // show page for typing config
                // Startup.showSetConfig(function(){
                    // reload the app
                    // console.log('refresh app');
                    // refresh();
                // });
            // };
        // };

        // function refresh(){
        //     console.log('refreshing app');
        //     Startup.refresh(function(status){
        //         console.log('app refreshed');
        //         // update app status
        //         $scope.rooms  = status.rooms;
        //         $scope.points = status.points;
        //     });
        // };


        /**
         * for test purbose
         */
        // IO.on('overallStatus', function(data){
            // console.log(data);
            // $scope.overallStatus = data;
        // });

        // $scope.test = function(){
        //     $http({
        //         method: "GET",
        //         url: "http://localhost:3050/test2"
        //     }).then(function(data){
        //         $scope.tests = data.data;
        //     });
        // };
        /*********************************************/
    }
]);
