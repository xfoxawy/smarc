'use strict';

var jwt    = require('jsonwebtoken');
var Config = require('../Config');

/**
 * Creates Authticated User Object with the required data
 * @param  {Http Request}  req   
 * @param  {Http Response} res    
 * @param  {function}      next           
 * @return                      [Call Next Route]
 */
module.exports = function(req, res, next){

    /**
     * check if token is valid
     * @param  {String}   token       [the token from the client]
     * @param  {String}   secret      [the secret key to campare token with]
     * @param  {String}   err         [if the token not valid return this err]
     * @param  {AnyThing} decodedData [the data that token containes]
     * @return {Function}             [call the next route]
     */
    next();
    // jwt.verify(req.headers.authorization, Config.secret, function(err, decodedData){
    //     if (err) return res.status(401).send("invalid token " + err).end();
    //     req.user = decodedData;
    //     next();
    // });
};
