var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/smokes', function(req, res){
        var smokes = Delegator.smokes();

        // var smokes = {
        //      smokeID: {
        //          "data1": "value1",
        //          "data2": "value2"
        //      }
        // }
        return res.status(200).json(smokes);
    });
};
