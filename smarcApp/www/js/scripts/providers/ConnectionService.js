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
                var networkState = navigator.connection.type;
                if (env == "production") {
                    if (networkState == 'unknown' || networkState == 'none') {
                        reject();
                    } else {
                        resolve();
                    }
                }
                if (env == "development") {
                    resolve();
                }
            });
        };
    }
]);
