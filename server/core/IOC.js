/**
 * require modules
 */
var Config = require("./Config");
var fs     = require("fs");
var path   = require("path");

var IOC = function(){
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
