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

        // for each Plugin, send to it it's points to run
        // for(var x in points){
        //     var model = x.charAt(0).toUpperCase() + x.slice(1);
        //     console.dir(Core.plugins);
        //     // Core.plugins[model].scene(points[x]);
        // }
        Core.plugins.Light.scene(points.light);
        Core.plugins.Motors.scene(points.motor);

        return res.status(200).json("OK").end();
    });
};
