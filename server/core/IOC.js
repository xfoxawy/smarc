/**
 * require modules
 */
var Config = require("./Config");
var fs     = require("fs");

var IOC = function(){
    
    var CorePlugins = ['Auth','Logger'];
    
    this.loadPlugins = function(Core){
        IOC = this;
        fs.readdir(Config.pluginsDir, function(err, files){
            if(err) throw err;
            // to remove .DS_STore
            if(files[0] == '.DS_Store') files.splice(0,1);
            files.forEach(function(item, index){
                if (CorePlugins.indexOf(item) == -1) CorePlugins.push(item);
            });
            IOC.load(Core, CorePlugins);
        });
    };

    this.load = function(Core, paths){
        if (typeof paths == 'string') paths = [paths];

        paths.forEach(function(pluginPath) {
            var plugin = require(Config.pluginsDir + pluginPath);
            plugin.register(Core);
        });
    };
};
module.exports = new IOC;
