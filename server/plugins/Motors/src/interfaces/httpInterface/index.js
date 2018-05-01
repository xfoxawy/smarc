var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/motors', function(req, res){
        Delegator.motors(function(motors){
            return res.status(200).json({'motors' : motors});
        });
    });

    Core.app.get('/motors/:id/:status', function(req,res){
        // Delegator.[status](id)
        // Delegator.up(id)
        // Delegator.down(id)
        // Delegator.stop(id)
        Delegator[req.params.status](req.params.id);
        res.status(200).json('OK');
    });
};
