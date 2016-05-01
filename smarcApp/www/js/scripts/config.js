smarc.config([
    '$routeProvider',
    '$httpProvider',
    function($routeProvider, $httpProvider){

        $httpProvider.interceptors.push([
            '$q',
            '$location',
            function ($q, $location) {
                function getAuth(){
                    return ( window.localStorage.getItem('auth') ) ? window.localStorage.getItem('auth') : {};
                };
                return {
                    'request': function(config) {
                        var auth = getAuth();
                        // config.data = config.data || {};
                        config.headers = config.headers || {};
                        // if (auth) config.data.auth = auth;
                        if (auth) config.headers.auth = auth;
                        return config;
                    }
                    ,'responseError': function (response) {
                        if (response.status === 401 || response.status === 406) {
                            console.log('not authed');
                        //     alert = $mdDialog.alert()
                        //         .title('Error')
                        //         .textContent('You don\'t have premission to do that!!')
                        //         .clickOutsideToClose(true)
                        //         .ok('Back');

                        //     $mdDialog
                        //         .show( alert )
                        //         .finally(function() {
                        //             alert = undefined;
                        //         }
                        //     );
                        };
                        return $q.reject(response);
                    }
                };
            }
        ]);

        $routeProvider
        .when('/home', {
            templateUrl: "views/home.html",
            controller: "homeController"
        })
        .when('/options', {
            templateUrl: "views/options.html",
            controller: "optionsController"
        })
        .when('/room/:id', {
            templateUrl: "views/room.html",
            controller: "roomController"
        })
        .when('/login', {
            templateUrl: "views/login.html",
            controller: "signController"
        })

        .otherwise('/home');
    }
]);
