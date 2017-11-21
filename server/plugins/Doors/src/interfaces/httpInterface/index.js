var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/doors/:id', function(req,res){
        Delegator.open(req.params.id);
        res.status(200).json('OK');
    });

    Core.app.get('/doors', function(req, res){
        var e = Delegator.getAllStatus();
        return res.status(200).json({'points' : e});
    });
};
