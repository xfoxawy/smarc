smarc.controller('firstStartController', [
    '$scope',
    '$mdDialog',
    function($scope, $mdDialog){
        $scope.options = {};

        $scope.saveConfig = function(){
            // save options
            window.localStorage.setItem( 'options', JSON.stringify($scope.options) );

            // save flag notFirstStart to local storage
            window.localStorage.setItem( 'notFirstStart', '1' );

            // hide Dialog
            $mdDialog.hide();
        };

        $scope.closeApp = function(){
            console.log("closing");
            // navigator.app.exitApp();
        };

    }
]);
