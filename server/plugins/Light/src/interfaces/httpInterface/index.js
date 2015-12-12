var delegator = require("./../../Delegator");

module.exports = function(Core){
    // app.get('/light/turnOn/1', function(req, res){
    // 	core.light(1,turnon, callback(status){
    // 		if(status) res.json("ok");
    // 		else res.json("error");
    // 	});
    // });
    var Delegator = new delegator(Core);
    Core.app.get('/light/allNodes', function(req,res){
        var nodes = Delegator.getNodes();
        return res.json(nodes);
    });

    Core.app.get('/light/on/:id', function(req,res){
        var e = Delegator.turnOn(req.params.id);
        res.status(200).json("ok");
    });

    Core.app.get('/light/off/:id', function(req,res){
        var e = Delegator.turnOff(req.params.id);
        res.status(200).json("ok");
    });

    Core.app.post('/light/new/', function(req,res){
        Delegator.createNewNode(req.body.node);
        res.status(200).json("ok");
    });

};