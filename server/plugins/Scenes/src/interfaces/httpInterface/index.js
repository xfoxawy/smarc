module.exports = function(Core){
    Core.app.post('/scene', function(req,res){
        var points = {
            light: {},
            motor: {},
        };

        // prepare points and transform it to be like this
        // { "id": "status" }
        for (var i in req.body) {
            points[req.body[i].type][req.body[i].id] = req.body[i].status;
        }

        Core.plugins.Light.scene(points.light);
        Core.plugins.Motors.scene(points.motor);

        return res.status(200).json("OK").end();
    });
};
