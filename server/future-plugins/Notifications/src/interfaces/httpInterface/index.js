module.exports = function(Core){

    Core.app.post('/notifications/save', function(req,res){
        // validate req.body
        // then
        Core.db.collection('devices').insertOne(req.body);
        // return to the sender and NO need to block the stack.
        return res.status(200).json("OK").end();
    });
};
