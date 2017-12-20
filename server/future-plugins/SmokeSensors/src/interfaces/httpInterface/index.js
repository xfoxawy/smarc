var Delegator = require("./../../Delegator");

module.exports = function(Core){
    Delegator.instance.init(Core);

    Core.app.get('/smokes', function(req, res){
        var smokes = Delegator.instance.smokes();

        return res.status(200).json(smokes);
    });
};
