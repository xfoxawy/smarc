smarc.factory('Light', [
    '$http',
    '$q',
    function($http, $q){
        function config(){
            return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
        };
        return {
            toggle: function(id){
                // return $http({
                //     method: "GET",
                //     url: "http://" + config().serverIp + ":" + config().serverPort + "/light/toggle/" + id
                // });
                return $q(function(resolve, reject) {
                    var data = {
                        's': true,
                        'r': 1,
                    };
                    resolve(data);
                });
            },
        }
    }
]);
