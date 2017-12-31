var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/motors', function(req, res){
        return res.status(200).json(Delegator.motors());
    });

    Core.app.get('/motors/:id/:status', function(req,res){
        // Delegator.up(id)
        // Delegator.down(id)
        // Delegator.stop(id)
        Delegator[req.params.status](req.params.id);

        // any feedback will be throw SocketIO
        // here we just finish the request
        res.status(200).json('OK');
    });
};
