var Validate   = require('./Validate'),
    Bcrypt     = require('bcryptjs'),
    jwt        = require('jsonwebtoken'),
    Config     = require('./Config'),
    jwtHandler = require('./jwtHandler'),
    ObjectID   = require('mongodb').ObjectID;

module.exports = function(Core){

    Core.app.post('/auth/token', function(req,res){
        // retrive data.
        var user = {
            username: req.body.username || '',
            password: req.body.password || ''
        };
        // validate object
        methods = {
            username: ['required'],
            password: ['required']
        };
        Validate.make(user, methods, function(errs){
            if (errs) return res.status(403).end();

            // search for user in DB.
            Core.db.collection('users').find({name: user.username}).toArray(function(err, docs) {
                if (err) throw err;

                // User Not Found
                if (!docs.length) return res.status(403).end();

                // User Found
                var dbuser = docs[0];

                // check password.
                Bcrypt.compare(user.password, dbuser.password, function(err, result) {

                    // Password Incorrect
                    if (!result) return res.status(403).end();

                    // Password Good
                    // delete it
                    delete dbuser.password;

                    // create new token.
                    var newToken = jwt.sign( dbuser._id, Config.secret );

                    // save new token
                    jwtHandler.save(newToken);

                    // send token to browser
                    return res.status(200).json({
                        'token': newToken,
                        'user': dbuser
                    });
                });
            });
        });
    });

    Core.app.post('/signout', function(req,res){
        // get token
        var token = req.headers.auth;

        // remove token from savedJWT
        jwtHandler.delete(token);

        return res.status(200).end();
    });

    // store new user
    Core.app.post('/users', function(req, res){
        Bcrypt.hash(req.body.password, 8, function(err, hash) {
            if (err) throw err;

            req.body.password = hash;

            // save user in DB
            Core.db.collection('users').insertOne(req.body, function(err, doc){
                if (err) throw err;

                // return
                return res.status(200).json(doc).end();
            });
        });
    });

    // get spacific user
    Core.app.get('/users/:id', function(req, res){
        Core.db.collection('users').find({ _id: new ObjectID(req.params.id) }, {password: 0}).toArray(function(err, user){
            if (err) throw err;
            return res.json(user);
        });
    });

    // update user
    Core.app.put('/users/:id', function(req, res){
        if (req.body.password) {
            Bcrypt.hash(req.body.password, 8, function(err, hash) {
                if (err) throw err;

                req.body.password = hash;

                // save user in DB
                // updateOne(where, {$set: obj},function(){});
                Core.db.collection('users').findOneAndUpdate({_id: new ObjectID(req.params.id)}, {
                    $set: {
                        name: req.body.name,
                        password: req.body.password,
                        roles: req.body.roles
                    }
                }, {
                    returnOriginal: false
                }, function(err, doc){
                    if (err) throw err;

                    // return
                    return res.status(200).json(doc).end();
                });
            });
        } else {
            // save user in DB
            Core.db.collection('users').findOneAndUpdate({_id: new ObjectID(req.params.id)}, {
                $set: {
                    name: req.body.name,
                    roles: req.body.roles
                }
            }, {
                returnOriginal: false
            }, function(err, doc){
                if (err) throw err;

                // return
                return res.status(200).json(doc).end();
            });
        }
    });

    // delete user
    Core.app.delete('/users/:id', function(req, res){
        Core.db.collection('users').remove({ _id: new ObjectID(req.params.id) }, function(err, data){
            if (err) throw err;
            return res.status(200).json(data).end();
        });
    });

    // all users
    Core.app.get('/users', function(req, res){
        Core.db.collection('users').find({}, {password: 0}).toArray(function(err, docs) {
            if (err) throw err;
            return res.json(docs);
        });
    });
};
