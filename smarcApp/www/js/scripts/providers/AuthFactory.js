smarc.factory('Auth', ['$http', function($http){

    function config(){
        return ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
    };
    return {
        isLogin: function(){
            return window.localStorage.getItem('auth');
        },
        login: function(data, cb){
            $http.post('http://'+ config().serverIp +':'+ config().serverPort +'/signin', {
                name:     data.name,
                password: data.password
            }).then(function(successData){
                return cb(successData);
            }, function(errorData){
                console.log(errorData);
                return cb(errorData);
            });
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
