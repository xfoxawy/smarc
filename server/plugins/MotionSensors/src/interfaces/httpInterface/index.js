var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/motions', function(req, res){
        var motions = Delegator.motions();

        return res.status(200).json(motions);
    });
};
