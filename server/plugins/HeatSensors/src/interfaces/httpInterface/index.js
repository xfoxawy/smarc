var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/heats', function(req, res){
        var heats = Delegator.heats();

        // var heats = {
        //      heatID: {
        //          "data1": "value1",
        //          "data2": "value2"
        //      }
        // }
        return res.status(200).json(heats);
    });
};
