/**
 * require modules
 */
var Routes = require("./src/interfaces/httpInterface");
var IO     = require("./src/IO");

/**
 * Motor Container
 */
var Motor = function(){

    /**
     * must defined this Func to add you plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){

        /**
         * load socketIO for Motors
         */
        IO(Core);

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Motor;
