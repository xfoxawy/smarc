var Validate   = require('./Validate'),
    Bcrypt     = require('bcryptjs'),
    jwt        = require('jsonwebtoken'),
    Config     = require('./Config'),
    jwtHandler = require('./jwtHandler');

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
            if (errs) return res.status(403).end();

            // search for user in DB.
            Core.db.collection('users').find({name: user.name}).toArray(function(err, docs) {
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
                    // create new token.
                    var newToken = jwt.sign( dbuser._id, Config.secret );
                    
                    // save new token
                    jwtHandler.save(newToken);
                    
                    // send token to browser
                    return res.status(200).json({
                        'token': newToken,
                        'roles': dbuser.roles
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

};
