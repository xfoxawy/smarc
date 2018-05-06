var delegator = require("./../../Delegator");

module.exports = function(Core){
    var Delegator = new delegator(Core);

    Core.app.get('/light/toggle/:id', function(req,res){
        Delegator.toggle(req.params.id);
        return res.status(200).json('OK');
    });

    Core.app.get('/light/points', function(req, res){
        Delegator.points(function(points){
            return res.status(200).json({'points' : points});
        });
    });

    Core.app.post('/light/scene', function(req, res){
        Delegator.scene(req.body);
        return res.status(200).json('OK');
    });
};
