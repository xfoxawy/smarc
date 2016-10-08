var FileSystem = require("../../FileSystem");

module.exports = function(Core){
    var fs =  new FileSystem(Core);

    Core.app.get('/fs/get/:filepath', function(req, res){
    	fs.get(req.params['filepath'], function(err, data){
    		if(err)
    			return res.status(404).json(err);
    		else
    			return res.status(200).send(data);
    	});

    });
    
    Core.app.get('/fs/list', function(req, res){

    	fs.allFiles(function(files){
    		return res.json(files);
    	});
    });

    Core.app.get('/fs/dirs', function(req, res){
    	fs.directories(function(dirs){
    		return res.json(dirs);
    	});
    });

    Core.app.get('/fs/scan/:dir([a-zA-Z0-9]+)?*', function(req, res){
    	var dir = ((req.params['dir'] != undefined) ?  req.params['dir'] : '' ) + ((req.params[0] != undefined) ? req.params[0] : '/');
    	fs.files(dir, function(err,files){
    		if(err)
    			return res.status(404).json(err);
    		else
    			return res.status(200).json(files);
    	});
    });
};