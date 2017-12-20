var Config = require('./src/Config');
var Routes = require("./src/interfaces/httpInterface");

/**
 * Siren Container
 */
var Siren = function(){

    /**
     * must defined this Func to add you plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        // var e = require('./src/drivers/' + Config.driver + 'DriverTest');
        // new e(Core);

        /**
         * load Routes
         */
        Routes(Core);
    };
};

module.exports = new Siren;
