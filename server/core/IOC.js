/**
 * require modules
 */
var Config = require("./Config");
var fs     = require("fs");
var path   = require("path");

var IOC = function(){
    // Global vars
    this.globalVars = function(app){
        app.set('root', path.resolve() + "/");
        app.set('pluginDir', app.get('root') + "plugins/" );
    };

    this.loadPlugins = function(Core){
        // console.log(Config.pluginsDir);
        fs.readdir(Config.pluginsDir, function(err, files){
            files.forEach(function(file, index){
                var plugin = require(Config.pluginsDir + file);
                plugin.register(Core);
            });
        });
    };
};
module.exports = new IOC;
