smarc.config([
    '$routeProvider',
    function($routeProvider){
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
