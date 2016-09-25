var Validate = require('./Validate'),
    Bcrypt   = require('bcryptjs'),
    jwt      = require('jsonwebtoken'),
    Config   = require('./Config'),
    ObjectID = require('mongodb').ObjectID,
    Auth     = require("./Middleware/Authintication");

module.exports = function(Core){

    Core.app.post('/signin', function(req,res){
        // retrive data.
        var user = {
            name:     req.body.name     || '',
            password: req.body.password || ''
        };

        // validate object
        methods = {
            name:     ['required'],
            password: ['required']
        };
        Validate.make(user, methods, function(errs){
            if (errs) return res.status(401).end(); // 401 unAuthed

            // search for user in DB.
            Core.db.collection('users').find({name: user.name.toLowerCase}).toArray(function(err, docs) {
                if (err) throw err;

                // User Not Found
                if (!docs.length) return res.status(401).end();

                // User Found
                var dbuser = docs[0];


                // check password.
                Bcrypt.compare(user.password, dbuser.password, function(err, result) {

                    // Password Incorrect
                    if (!result) return res.status(401).end();
               
                    // Password Good
                    // delete it
                    delete dbuser.password;

                    // create new token.
                    var newToken = jwt.sign( dbuser, Config.secret );

                    // send token to browser
                    return res.status(200).json({
                        'token': newToken,
                        'user': dbuser
                    });
                });
            });
        });
    });

    Core.app.use(Auth);

    // store new user
    Core.app.post('/users', function(req, res){
        Bcrypt.hash(req.body.password, 8, function(err, hash) {
            if (err) throw err;

            req.body.password = hash;

            // save user in DB
            Core.db.collection('users').insertOne(req.body).then(function(doc){
                // return
                return res.status(200).end();
            }, function(e){
                throw e;
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
                Core.db.collection('users').updateOne({_id: new ObjectID(req.params.id)}, {$set: {
                    name: req.body.name,
                    password: req.body.password,
                    roles: req.body.roles
                }}, function(err, doc){
                    if (err) throw err;

                    // return
                    return res.status(200).end();
                });
            });
        } else {
            // save user in DB
            console.log(req.body.name);
            console.log(req.body.roles);
            Core.db.collection('users').update({_id: new ObjectID(req.params.id)}, {
                $set: {
                    name: req.body.name,
                    roles: req.body.roles
                }
            }, function(err, doc){
                if (err) throw err;

                // return
                return res.status(200).end();
            });
        }
    });

    // delete user
    Core.app.delete('/users/:id', function(req, res){
        Core.db.collection('users').remove({ _id: new ObjectID(req.params.id) }, function(err, data){
            if (err) throw err;
            return res.status(200).end();
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
