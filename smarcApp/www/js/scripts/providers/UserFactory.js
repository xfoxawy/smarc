smarc.factory('User', ['$http', '$location', function($http, $location){

    function config(){
        return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
    };
    return {
        all: function(){
            return $http.get('http://'+ config().serverIp +':'+ config().serverPort +'/users');
        },
        find: function(id){
            return $http.get('http://'+ config().serverIp +':'+ config().serverPort +'/users/' + id);
        },
        store: function(data){
            return $http.post('http://'+ config().serverIp +':'+ config().serverPort +'/users', data);
        },
        update: function(id, data){
            return $http.put('http://'+ config().serverIp +':'+ config().serverPort +'/users/' + id, data);
        },
        delete: function(id){
            return $http.delete('http://'+ config().serverIp +':'+ config().serverPort +'/users/' + id);
        },
        logout: function(cb){
            $http.post('http://'+ config().serverIp +':'+ config().serverPort +'/signout').then(function(successData){
                return cb(successData);
            }, function(errorData){
                return cb(errorData);
            });
        }
    }
}]);
