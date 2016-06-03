smarc.service('userMethods', [
    '$mdToast',
    function($mdToast){
        this.showNameError = function(){
            $mdToast.showSimple("Please Add User Name!!")
        };

        this.showPasswordError = function(){
            $mdToast.showSimple("Password didn't match!!");
        };

        this.transformRoles = function(selectedRoles){
            var roles = [];
            for ( key in selectedRoles ) {
                if (selectedRoles[key] == true) {
                    roles.push(key);
                }
            }
            return roles;
        };
    }
]);
