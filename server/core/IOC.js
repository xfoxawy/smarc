/**
 * require modules
 */
var Config = require("./Config");
var fs     = require("fs");

var IOC = function(){
    this.loadPlugins = function(Core){
        if (typeof Config.plugins == 'string') Config.plugins = [Config.plugins];
        Config.plugins.forEach(function(pluginPath) {
            fs.stat(Config.pluginsDir + pluginPath, function(err, stat){
                if( err ) throw err;
                var plugin = require(Config.pluginsDir + pluginPath);
                plugin.register(Core);
            })
        });
    };
};
module.exports = new IOC;
