var Delegator = require("./../../Delegator");

module.exports = function(Core){
    Delegator.instance.init(Core);

    Core.app.get('/heats', function(req, res){
        var heats = Delegator.instance.heats();

        return res.status(200).json(heats);
    });
};
