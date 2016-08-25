smarc.factory('Gate', [
    '$http',
    '$q',
    function($http, $q){
        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {
            open: function(id){
                if (env == "production") {
                    return $http({
                        method: "GET",
                        url: "http://" + config().serverIp + ":" + config().serverPort + "/doors/open/" + id
                    });
                }
                if (env == "development") {
                    return $q(function(resolve, reject) {
                        resolve({});
                    });
                }
            },
        }
    }
]);
