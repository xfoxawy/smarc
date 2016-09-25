/**
 * require modules
 */
var FileSystemDelegator = new require("./src/FileSystem");
var Routes = require('./src/interfaces/httpInterface');

/**
 * FileSystem Container
 */
var FileSystem = function(){

    /**
     * must defined this Func to add you plugin to Smarc
     * @param  {Object} Core [main system Core]
     * @return {void}
     */
    this.register = function(Core){
        
        /**
         * Attach File System to the Core
         */
        FileSystemDelegator(Core);

        /**
         * Attach the file system http interface
         */
        Routes(Core);

    };
};

module.exports = new FileSystem;
