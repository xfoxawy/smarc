smarc.config([
    '$routeProvider',
    '$httpProvider',
    function($routeProvider, $httpProvider){
        // $httpProvider.interceptors.push([function () {
        //     return {
        //         'request': function(config) {
        //             // config.headers = config.headers || {};
        //             config.headers.host = "localhost:6666";
        //             return config;
        //         }
        //     };
        // }]);

        $routeProvider
        .when('/home', {
            templateUrl: "views/home.html",
            controller: "homeController"
        })
        .when('/options', {
            templateUrl: "views/options.html",
            controller: "optionsController"
        })
        .when('/login', {
            templateUrl: "views/login.html",
            controller: "signController"
        })

        .otherwise('/home');
    }
]);
