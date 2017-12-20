var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/light/toggle/:id', function(req,res){
        Delegator.toggle(req.params.id);
        res.status(200).json('OK');
    });

    Core.app.get('/light/points', function(req, res){
        var e = Delegator.getAllStatus();
        return res.status(200).json({'points' : e});
    });

    Core.app.post('/light/new/', function(req,res){
        Delegator.createNewNode(req.body.node);
        return res.status(200).json("ok");
    });

    // Daprecated
    Core.app.get('/light/rooms', function(req,res){
        var rooms = Delegator.getRooms();
        res.status(200).json(rooms);
    });

    // Daprecated
    Core.app.post('/light/scene', function(req,res){
        Delegator.scene(req.body);
        res.status(200).json("OK");
    });
};
