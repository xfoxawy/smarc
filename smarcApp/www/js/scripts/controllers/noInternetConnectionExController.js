smarc.controller('noInternetConnectionExController', [
    '$scope',
    '$mdDialog',
    'Loading',
    'Connection',
    function($scope, $mdDialog, Loading, Connection) {
        $scope.close = function(){
            // console.log('closing app');
            navigator.app.exitApp();
        };

        $scope.reload = function(data) {
            // check internet connection
            Connection.check().then(function success(){
                console.log('internet connection found');
            }, function fail(){
                Loading.hide();
                Loading.noInternetConnectionEx();
            });
        }
    }
]);


