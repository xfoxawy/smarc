
module.exports = function(Core){
    Core.app.get('/test1', function(req, res){
        // Core.fp.emit('message', 'test one route notification.');
        return res.json("test1");
    });

    Core.app.get('/test2', function(req, res){
        return res.json({
            message: "request success!!"
        });
    });
};
