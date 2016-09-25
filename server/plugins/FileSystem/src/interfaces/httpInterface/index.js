var FileSystem = require("../../FileSystem");

module.exports = function(Core){
    var fs =  new FileSystem(Core);
    Core.app.get('/fs/test', function(req,res){
        
        res.status(200).json(fs.get());
    });

};