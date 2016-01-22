var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/light/toggle/:id', function(req,res){
        var e = Delegator.toggle(req.params.id);
        //Core.io.emit("light/point/" + req.params.id + "")
        return res.status(200).json("ok");
    });

    Core.app.get('/light/points', function(req, res){
        var e = Delegator.getAllStatus();
        return res.status(200).json(e);
    });

    Core.app.post('/light/new/', function(req,res){
        Delegator.createNewNode(req.body.node);
        return res.status(200).json("ok");
    });
};