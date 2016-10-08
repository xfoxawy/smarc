module.exports = function(Core){
    Core.app.get('/cams', function(req, res){
        // load cams from DB
        var cams = "";
        return res.status(200).json({"cams": "hello world"});
    });
};
