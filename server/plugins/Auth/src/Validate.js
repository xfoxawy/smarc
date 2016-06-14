/**
	Validate like Laravel
	(c) 2014 Ibrahim Saqr
	validate-alpha may be freely distributed under the MIT license.
*/
// var db = require('DB.Modules/Database');

(function (name, definition) {
	if (typeof module !== 'undefined') {
		module.exports = definition();
	} else if (typeof define === 'function' && typeof define.amd === 'object') {
		define(definition);
	} else {
		this[name] = definition();
	}
})('validate', function (){
	// global targets
	var targets = {},

	// global errors object // contain all errors found by script
	errors 	= {},

	// gloabl object contain all registered roles
	roles 	= {},

	// private methods
	_ = { // small set of underscore
		each: function(collection, fn) {
			if (_.isArray(collection)) {
				for(var i=0; i < collection.length; i++) fn(collection[i], i);
				return;
			}
			for(var name in collection) fn(collection[name], name);
		},
		isArray: function(a) {
			return Object.prototype.toString.call(a) === "[object Array]" || Object.prototype.toString.call(a) === "[object HTMLCollection]";
		}
	};

	/**
	 * Validator Factory
	 * @return object
	 */
	var Validator = {
		make: function(target, expObj, cb){
			// set global targets
			targets = target,
			// reset errors
			errors = {},
			end = 0,
			count = 0,

			// get names of each target & expArray
			expName = Object.keys(expObj);

			for (var x=0; x < expName.length; x++) end += expObj[expName[x]].length;

			// loop to check if all targets exist before matching
			for(var x=0; x < expName.length; x++){
				var name = expName[x];
				if(!(name in targets))
				{
					expName.splice(x,1); // delete it from this array
					delete expObj[name];  // delete its rules array
					count++; 
					if(name in errors)
						errors[name].push(name + " parameter does not exist.");
					else
						errors[name] = [name + " parameter does not exist."];
				}
			}
			// loop for check every target
			for (var i=0; i < expName.length; i++) {
					var name = expName[i];
					if ( _.isArray(expObj[name]) ) {
						for (var z=0; z < expObj[name].length; z++) {
							var str = expObj[name][z].split(":");
							if ( typeof roles[str[0]] === "function" ) {
								var data = str.length > 0 ? str[1] : '';
								roles[str[0]](targets[name], data, function(errMessage){
									if(typeof errMessage !== "undefined") {
										errMessage = errMessage.replace("$s", name);
										if( name in errors ) errors[name].push(errMessage);
										else errors[name] = [errMessage];
									}
									count++;
									if (count == end) {
										if (Object.keys(errors).length) {
											return cb(errors);
										} else {
											return cb(null);
										}
									}
								});
							} else {
								throw expObj[expName[i]][z] +" doesn't exist in defined roles read the docs for How to register custom role";
								return cb();
							};
						}
					} else {
						throw "validateInput(name, value, expArray) : the third parameter MUST be array "+ typeof expObj[name] +" is given";
						return cb();
					};
			};
		},
		register: function (name, cb){
			roles[name] = cb;
		}
	};

	// Validator.register('unique', function(value, data, cb){
	// 	data = data.split(',');
	// 	if (data.length == 1) {
	// 		var startSql = "SELECT COLUMN_NAME AS column_names FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'node_webkit_mysql' AND TABLE_NAME = "+ db.db().escape(data[0]) +"";
	// 		db.db().query(startSql, function(err, rows, fields){
	// 			if (err) throw err;
	// 			var sql = "SELECT COUNT(id) AS count FROM "+ data[0] +" WHERE deleted IS NULL AND (";
	// 			for (var i=0; i<rows.length; i++) {
	// 				sql += " " + rows[i].column_names + " = "+ db.db().escape(value) +" OR";
	// 			};
	// 			sql = sql.slice(0, -3) + ")";
	// 			db.db().query(sql, function(err, rows, fields){
	// 				if (err) throw err;
	// 				if ( Number(rows[0].count) > 0 ) return cb("$s is already taken, please choose another one.");
	// 				else return cb();
	// 			});
	// 		});
	// 	} else {
	// 		if (data.length == 2) var sql = "SELECT COUNT(id) AS count  FROM "+ data[0] +" WHERE deleted IS NULL AND "+ data[1] +" = "+ db.db().escape(value);
	// 		if (data.length == 3) var sql = "SELECT COUNT(id) AS count  FROM "+ data[0] +" WHERE deleted IS NULL AND "+ data[1] +" = "+ db.db().escape(value) +" AND id != " + db.db().escape(data[2]);
	// 		db.db().query(sql, function(err, rows, v){
	// 			if (err) throw err;
	// 			if ( Number(rows[0].count) > 0 ) return cb("$s is already taken, please choose another one.");
	// 			else return cb();
	// 		});
	// 	};
	// });

	// register roles
	Validator.register('required', function(value, data, cb){
		if (value.length == 0 || Object.prototype.toString(value).length == 0) return cb("$s is required");
		else return cb();
	});
	Validator.register("timestamp", function(value , data , cb){
		if(!value.match(/^[0-9]+$/i)) return cb("$s must be a valid unix timestamp");
		else return cb();
	});
	Validator.register('numeric', function(value, data, cb){
		if ( !value.match(/^-?[0-9]+$/i) ) return cb("$s must be a number");
		else return cb();
	});
	Validator.register('float', function(value, data, cb){
		if ( !value.match(/^-?[0-9].+$/i) ) return cb("$s must be a number");
		else return cb();
	});
	Validator.register('alpha', function(value, data, cb){
		if ( !value.match(/^[a-z\s]+$/i) ) return cb("$s must contain Letters Only [a-z]");
		else cb();
	});
	Validator.register('alphanum', function(value, data, cb){
		if ( !value.match(/^[a-z0-9\s]+$/i) ) return cb("$s must contain Letters and Numbers Only [a-z][0-9]");
		else return cb();
	});
	Validator.register('min', function(value, data, cb){
		roles.numeric(value, '', function(error){
			if (error) {
				if ( value.length < Number(data) ) return cb("$s must be "+ data +" characters at least");
				else return cb();
			} else {
				if ( Number(value) < Number(data) ) return cb("$s must be at least " + data);
				else return cb();
			};
		});
	});
	Validator.register('max', function(value, data, cb){
		roles.numeric(value, '', function(error){
			if (error) {
				if ( value.length > Number(data) ) return cb("$s must be "+ data +" characters at most");
				else return cb();
			} else {
				if ( Number(value) > Number(data) ) return cb("$s must be at most " + data);
				else return cb();
			}
		});
	});
	Validator.register('array', function(value, data, cb){
		if ( !Array.isArray(value) ) return cb("$s must be an array");
		else return cb();
	});
	Validator.register('between', function(value, data, cb){
		var data = data.split(',');
		if ( value >= data[0] && value <= data[1] ) return cb();
		else return cb("$s must be between '"+ data[0] +"' and '"+ data[1] +"'");
	});
	Validator.register('confirmed', function(value, data, cb){
		if ( value !== targets[data] ) return cb("$s must be same as '"+ data + "'");
		else return cb();
	});
	Validator.register('length', function(value, data, cb){
		if ( typeof value === "object" ) {
			if ( Array.isArray(value) ) {
				if ( value.length < data ) return cb("$s must be at least " + data);
				else return cb();
			} else {
				if ( !Object.keys(value).length < data ) return cb("$s must be at least " + data);
				else return cb();
			}
		} else return cb("$s must be an array or object with length at least " + data );
	});
	Validator.register('time', function(value, data, cb){ // 00:00 or 00:00:00
		if ( !value.match(/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i) ) return cb("$s must be a valid time (00:00) or (00:00:00)");
		else cb();
	});
	Validator.register('timesql', function(value, data, cb){ // must be 00:00:00
		if ( !value.match(/(([0-1][0-9])|([2][0-3])):([0-5][0-9]):([0-5][0-9])/i) ) return cb("$s must be a valid time (00:00:00)");
		else cb();
	});
	Validator.register('date', function(value, data, cb){
		if ( !value.match(/([2][0-9][0-9][0-9])-([0-1][0-9])-([0-3][0-9])/i) || !value instanceof Date) return cb("$s must be a valid date (0000-00-00)");
		else cb();
	});

	Validator.register('boolean',function(value , data, cb){
		if(!/(true)|(false)/.test(value)) return cb("$s must be a valid boolean or stringfied boolean");
		else cb();
	});

	Validator.register('equals',function(value , data, cb){
		if(value != data ) return cb("$s must equal " + data);
		else cb();
	});
	
	// at last return all above
	return Validator;
});

// useage ...
// var v = require('validate-alpha'),
// validateObj = {
// 	name 	: getElementById('name'),
// 	age 	: getElementById('age')
// },
// methods = {
// 	name 	: ['required', 'min:3', 'max:12'],
// 	age 	: ['required', 'numeric']
// },
// v.make(validateObj, methods, function(dfsfsdf){
// 	if (Object.keys(errors).length) {
// 		console.log(errors);
// 	} else {
// 		console.log('Done');
// 	};
// });


// var errors = {
// 	name 	: ['error-one', 'error-two', 'error-three'],
// 	age 	: ['error-one', 'error-two']
// }

// ROLES
// required .................................DONE
// min:3 ....................................DONE
// max:12 ...................................DONE
// alpha ....................................DONE
// alpha_num ................................DONE
// numeric ..................................DONE
// array ....................................DONE
// between ..................................DONE
// length ...................................DONE
// confirmed:feild_name .....................DONE   // password match password_again
// unique:table,column,excludeId ............DONE
// not_in:1,2,3,4
// boolean...................................DONE
// timestamp.................................DONE
// equals:example............................DONE
