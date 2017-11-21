var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/heats', function(req, res){
        var heats = Delegator.heats();

        return res.status(200).json(heats);
    });
};
