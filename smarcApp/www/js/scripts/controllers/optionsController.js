smarc.controller('optionsController', [
    '$scope',
    '$mdToast',
    function($scope, $mdToast){
        
        $scope.options = ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};

        $scope.reset = function(){
            $scope.options = ( window.localStorage.getItem('options') ) ? JSON.parse( window.localStorage.getItem('options') ) : {};
            $mdToast.showSimple("Back to Defaults!!")
        };

        $scope.save = function(){
            window.localStorage.setItem( 'options', JSON.stringify($scope.options) );

            // show success message.
            $mdToast.showSimple("Options Saved!!")
            // $mdToast.show(
            //     $mdToast.simple()
            //         .textContent('Options Saved!!')
            //         .position('top left')
            //         .hideDelay(3000)
            // );
        };

    }
]);
