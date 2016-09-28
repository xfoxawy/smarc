/**
 * require modules
 */
var Routes  = require("./src/Routes");

/**
 * firstPlugin Container
 */
var Auth = function(){

    /**
     * must defined this Func to add your plugin to Smarc Global Object
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        /**
         * Setup SocketIO namespace
         */
        Core.users_socket = Core.io.of('/users');

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Auth;
