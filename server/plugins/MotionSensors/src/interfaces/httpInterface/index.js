var Delegator = require("./../../Delegator");

module.exports = function(Core){
    Delegator.instance.init(Core);

    Core.app.get('/motions', function(req, res){
        var motions = Delegator.instance.motions();

        return res.status(200).json(motions);
    });
};
