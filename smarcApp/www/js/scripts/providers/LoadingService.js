smarc.service('Loading', [
    '$location',
    '$mdDialog',
    'Server',
    'Auth',
    function($location, $mdDialog, Server, Auth){
        this.show = function(content, completeShowing) {
            $mdDialog.show({
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                onComplete: completeShowing,
                templateUrl: 'views/showLoading.html',
                locals: {
                    content: content
                }
            });
        };

        this.noInternetConnectionEx = function(){
            $mdDialog.show({
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                controller:  'noInternetConnectionExController',
                templateUrl: 'views/noInternetConnectionEx.html'
            })
        };

        this.hide = function() {
            $mdDialog.hide();
        };

        this.isFirstStartup = function(){
            var firstStart = window.localStorage.getItem('notFirstStart');
            if (!firstStart) return true;
            return false;
        };

        this.finishStartup = function(){
            // set notFirstStart to any value not false
            window.localStorage.setItem( 'notFirstStart', '1' );
        };

        this.configPage = function(){
            var self = this;
            $mdDialog.show({
                parent: angular.element(document.body),
                controller: 'firstStartController',
                templateUrl: 'views/firstStart.html',
                clickOutsideToClose:false,
                fullscreen: true
            }).then(function(answer) {
                console.log('Done');
                // show loading
                self.show('trying to connect to the server', function completeShowing(){
                    // connection to server
                    Server.connectToServer().then(function(){
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
                });
            }, function() {
                console.log('Failed');
            });
        };

    }
]);
