/**
 * require modules
 */
var Routes = require("./src/interfaces/httpInterface");

/**
 * Rooms Container
 */
var Rooms = function(){

    /**
     * must defined this Func to add your plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Rooms;
