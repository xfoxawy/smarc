smarc.service('Startup', [
    '$mdDialog',
    '$mdMedia',
    'Miscellaneous',
    function($mdDialog, $mdMedia, Miscellaneous){
        this.showSetConfig = function(cb){
            $mdDialog.show({
                controller: 'firstStartController',
                templateUrl: 'views/firstStart.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: true
            }).then(function(answer) {
                console.log('Done');
                return cb();
            }, function() {
                console.log('Failed');
            });
        };
        
        this.refresh = function(cb){
            // refrence to this function
            var self = this;
            // get all points
            var points = Miscellaneous.allStatus();

            // update points Array
            points.then(function success(data){
                console.log('data retreived');
                return cb(data);
            }, function failed(data){
                // display error message
                console.log('data lost');
                var confirm = $mdDialog.confirm()
                    .title('No Connection')
                    .textContent("we can't retrieve data from internet, please make sure your device is connected and try again.")
                    .ariaLabel('No Connection')
                    .ok('try again')
                    .cancel('close smarc');

                $mdDialog.show(confirm).then(function() {
                    console.log('repeat refresh');
                    // re Run this.refresh
                    self.refresh();
                }, function() {
                    // unComment this line
                    // navigator.app.exitApp();
                });
            });
        };
    }
]);
