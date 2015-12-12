/**
 * require modules
 */
//var Config     = require("./src/Config");
var Routes     = require("./src/interfaces/httpInterface");
//var Cmd        = require("./src/interfaces/cmdInterface");
//var Telnet = require("./src/Connection");
//var Delegator  = require("./src/Delegator");
//var Driver     = require("./src/Driver");

/**
 * Light Container
 */
var Light = function(){

    /**
     * must defined this Func to add you plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        
        /**
         * load Config
         */
        //Config();

        /**
         * load Routes
         */
        Routes(Core);

        /**
         * load Cmd commands
         */
        //Cmd();

        /**
         * load Driver
         */
        //Driver(Core);
        //require("./src/Driver")(Core);

        /**
         * load Connection
         */
        //Telnet.subscribe(module.exports = Driver);
        /**
         * load Delegator
         */
    };
};

module.exports = new Light;
