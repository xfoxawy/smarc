var d = require("./Driver");

var Delegator = function(Core){

    var Driver = new d(Core);

    this.stream = function(data, socket){
        Driver.stream(data, socket);
    };

    this.quit = function(socket){
        Driver.quit(socket);
    };

};
module.exports = Delegator;
