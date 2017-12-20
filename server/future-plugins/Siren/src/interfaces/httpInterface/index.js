var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/sirens', function(req, res){
        var sirens = Delegator.sirens();

        return res.status(200).json(sirens);
    });

    Core.app.get('/sirens/:id', function(req,res){
        Delegator.get(req.params.id);
        res.status(200).json('OK');
    });

    Core.app.get('/sirens/:id/fire', function(req,res){
        Delegator.fire(req.params.id);

        // any feedback will be throw SocketIO
        // here we just finish the request
        res.status(200).json('OK');
    });
};
