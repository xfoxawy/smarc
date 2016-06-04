var fs = require("fs");

var Logger = function(){

	this.register = function(Core){
		var model = Core.Config.logDBModel;
		var file  = Core.Config.logFile;
		var logType = Core.Config.logType;

		function save(string){
			if(logType === 'file')
				logFile(string);
			else if(logType === 'db')
				logDB(string);
			else
				return;
		};

		function logDB(string){
			Core.db.collection(model).insertOne({log : string , time : new Date()}, function(err){
				if(err) throw err;
			});
		}

		function logFile(string){
			var data = 'Error => ' + string + ' ::: Time => ' + new Date() + "; \r\n";
			fs.appendFile(file, data ,function(err){
				if(err) throw err;
			});
		}

		console.log = function(string){
			save(string);
    		process.stdout.write(string + '\n');
		};
	}
}

module.exports = new Logger;