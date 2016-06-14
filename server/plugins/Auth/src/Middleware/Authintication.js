'use strict';

var jwtHandler  = require('../jwtHandler');
var jwt         = require('jsonwebtoken');
var Config      = require('../Config');

/**
 * Creates Authticated User Object with the required data
 * @param  confi{Http Request}    req   
 * @param  {Http Response}   res    
 * @param  {function}        next           
 * @return                          [Call Next Route]
 */
module.exports = function(req, res, next){

    var token = req.body.auth || null;

    // if ( !jwtHandler.check(token) ) return res.status(401).json('Unauthorized');
    console.log(token);
    // if (token) {
    //     var secret = Config.secret;
    //     try {
    //         var id = jwt.verify(token, secret);
    //     } catch(err) {
    //         return res.status(406).send("invalid token " + err);
    //     }
    //     next();
    // } else {
    //     return res.status(401).end();
    // }
}
