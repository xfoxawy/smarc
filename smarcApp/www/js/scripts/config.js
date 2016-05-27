smarc.config([
    '$routeProvider',
    '$httpProvider',
    '$mdThemingProvider',
    function($routeProvider, $httpProvider, $mdThemingProvider){
        // Extend the red theme with a few different colors
        var smarcPallete = $mdThemingProvider.extendPalette('indigo', {
            // '50': 'ffebee',
            // '100': 'ffcdd2',
            // '200': 'ef9a9a',
            // '300': 'e57373',
            // '400': 'ef5350',
            '500': '2B4461',
            // '600': 'e53935',
            // '700': 'd32f2f',
            // '800': 'c62828',
            // '900': 'b71c1c',
            // 'A100': 'ff8a80',
            // 'A200': 'ff5252',
            // 'A400': 'ff1744',
            // 'A700': 'd50000',
            // 'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            // 'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             // '200', '300', '400', 'A100'],
            // 'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('smarcTheme', smarcPallete);
        
        // Use that theme for the primary intentions
        $mdThemingProvider.theme('default')
            .primaryPalette('smarcTheme')

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
        .when('/users', {
            templateUrl: "views/users/index.html",
            controller: "usersIndexController"
        })
        .when('/users/create', {
            templateUrl: "views/users/create.html",
            controller: "usersCreateController"
        })
        .when('/users/:id/edit', {
            templateUrl: "views/users/edit.html",
            controller: "usersEditController"
        })
        .otherwise('/home');
    }
]);
