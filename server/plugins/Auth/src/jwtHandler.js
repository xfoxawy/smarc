var Config = require('./Config');


function jwtHandler() {
    var handler = {};
    construct();

    function construct(){
        handler = require('./jwtFileRetriever');
    }

    this.check = function(token){
        return handler.check(token);
    };
    this.save = function(token){
        return handler.save(token);
    };
    this.delete = function(token){
        return handler.delete(token);
    }

}
module.exports = new jwtHandler;
