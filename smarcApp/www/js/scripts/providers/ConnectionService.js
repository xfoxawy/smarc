smarc.service('Connection', [
    '$rootScope',
    '$q',
    '$http',
    'Loading',
    'Server',
    function($rootScope, $q, $http, Loading, Server){
        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };

        this.check = function(content) {
            return $q(function(resolve, reject) {
                if (env == "production") {
                    if (navigator.connection.type == Connection.NONE) reject();
                    else resolve();
                }
                if (env == "development") resolve();
            });
        };
    }
]);
