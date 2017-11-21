var ObjectID   = require('mongodb').ObjectID;

module.exports = function(Core){
    // list all rooms
    Core.app.get('/rooms', function(req,res){
        Core.db.collection('rooms').find({}).toArray(function(err, docs) {
            if (err) throw err;

            return res.json(docs);
        });
    });

    // create new room
    Core.app.post('/rooms', function(req,res){
        // validate req.body
        // then
        Core.db.collection('rooms').insertOne({
            name: req.body.name
        }, function(err, doc){
            if (err) throw err;

            return res.status(200).json(doc).end();
        });
    });

    // get room by id
    Core.app.get('/rooms/:id', function(req,res){
        // we need to get the room with it's lights, sensors, access control and cams
        Core.db.collection('rooms').find({ _id: new ObjectID(req.params.id) }).toArray(function(err, room){
            if (err) throw err;

            return res.status(200).json(rooms).end();
        });
    });

    // update room by id
    Core.app.put('/rooms/:id', function(req,res){
        // validate room object
        // then
        Core.db.collection('rooms').updateOne({_id: new ObjectID(req.params.id)}, {
            $set: {
                name: req.body.name
            }
        }, function(err, doc){
            if (err) throw err;

            return res.status(200).end();
        });
    });

    // delete room by id
    Core.app.delete('/rooms/:id', function(req,res){
        Core.db.collection('rooms').remove({ _id: new ObjectID(req.params.id) }, function(err, data){
            if (err) throw err;

            return res.status(200).end();
        });
    });
};
