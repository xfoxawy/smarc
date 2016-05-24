smarc.controller('roomController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    function($rootScope, $scope, $routeParams){
        $scope.id = $routeParams.id;
        // function filter(obj, id) {
        //     var result = {}, key;
        //     // ---------------^---- as noted by @CMS, 
        //     // always declare variables with the "var" keyword
        //     for (key in obj) {
        //         if ( obj.hasOwnProperty(key) && obj[key].r == id ) {
        //             result[key] = obj[key];
        //         }
        //     }
        //     return result;
        // };
    }
]);
