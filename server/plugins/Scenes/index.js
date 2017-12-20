/**
 * require modules
 */
var Routes = require("./src/interfaces/httpInterface");

/**
 * Scene Container
 */
var Scene = function(){
    /**
     * must defined this Func to add you plugin to Smarc
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

module.exports = new Scene;
