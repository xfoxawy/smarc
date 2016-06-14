/**
 * require modules
 */
var Config     = require("./src/Config");
var Routes     = require("./src/interfaces/httpInterface");
var Cmd        = require("./src/interfaces/cmdInterface");
var Connection = require("./src/Connection");
var Driver     = require("./src/Driver");
var Delegator  = require("./src/Delegator");

/**
 * firstPlugin Container
 */
var firstPlugin = function(){

    /**
     * must defined this Func to add you plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        
        /**
         * load Config
         */
        Config();

        /**
         * load Routes
         */
        Routes(Core);
        /**
         * load Cmd commands
         */
        Cmd();

        /**
         * load Driver
         */
        Driver();

        /**
         * load Connection
         */
        Connection();

        /**
         * load Delegator
         */
        Delegator();
    };
};

module.exports = new firstPlugin;
