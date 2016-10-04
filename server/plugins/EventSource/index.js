/**
 * require modules
 */
var Routes  = require("./src/Routes");

/**
 * firstPlugin Container
 */
var EventSource = function(){

    /**
     * must defined this Func to add your plugin to Smarc Global Object
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        /**
         * load Routes
         */
        Routes(Core);
        console.log('EventSource Stopped.');
    };
};

module.exports = new EventSource;
