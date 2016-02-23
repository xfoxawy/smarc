smarc.factory('Auth', ['$http', '$location', function($http, $location){
    // var link = $location.protocol() +"://"+ $location.host() +":"+ $location.port();
    return {
        login: function(data, cb){
            $http.post('http://localhost:3050/signin', {
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
            $http.post('http://localhost:3050/signout').then(function(successData){
                return cb(successData);
            }, function(errorData){
                return cb(errorData);
            });
        }
    }
}]);
