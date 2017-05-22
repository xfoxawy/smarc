var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/motors', function(req, res){
        var motors = Delegator.motors();

        // var motors = {
        //      motorID: {
        //          "data1": "value1",
        //          "data2": "value2"
        //      }
        // }
        return res.status(200).json(motors);

    });

    Core.app.post('/motors/:id', function(req,res){
        var status = req.body.status; // up, down

        // Delegator.up()
        // Delegator.down()
        Delegator[status](req.params.id);

        // any feedback will be throw SocketIO
        // here we just finish the request
        res.status(200).json('OK');
    });
};
