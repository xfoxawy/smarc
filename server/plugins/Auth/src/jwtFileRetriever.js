var fs = require('fs');

function jwtFileRetriever(token){
    var savedJwt = "savedJwt";
    this.check = function(token){
        
        if (token) {
            var savedJwt = fs.readFileSync(__dirname + '/savedJwt', 'utf8');
            savedJwt = savedJwt.split(";");
            if (savedJwt.indexOf(token) === -1) return false;
            else return true;
        }

        return false;
    }

    this.save = function(token){
        var file = fs.readFileSync(__dirname + '/savedJwt','utf8');
        var newData = file + ";" + token;
        fs.writeFileSync(__dirname + '/savedJwt', newData, { encoding: "utf8" });
        return true;
    }

    this.delete = function(token){
        var file, index, data;
        file = fs.readFileSync(__dirname + '/savedJwt', 'utf8');
        file = file.split(";");
        index = file.indexOf(token);
        file.splice(index, 1);
        data = file.join(";");
        fs.writeFileSync(__dirname + '/savedJwt', data);
        return true;
    };
}
module.exports = new jwtFileRetriever;
