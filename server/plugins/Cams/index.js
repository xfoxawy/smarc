/**
 * require modules
 */
var Routes     = require("./src/interfaces/httpInterface");

/**
 * firstPlugin Container
 */
var Cams = function(){
    this.register = function(Core){

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Cams;
