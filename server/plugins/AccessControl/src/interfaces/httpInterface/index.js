var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/access_controls', function(req, res){
        var access_controls = Delegator.access_controls();

        return res.status(200).json(access_controls);
    });

    Core.app.get('/access_controls/:id', function(req,res){
        Delegator.open(req.params.id);

        // any feedback will be throw SocketIO
        // here we just finish the request
        res.status(200).json('OK');
    });
};
