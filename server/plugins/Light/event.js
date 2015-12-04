var EventEmitter = require("events").EventEmitter;

var ee = new EventEmitter;

ee.on('hellos', function(obj){
	console.log('ive been emitted', obj);
});
ee.emit('hellos',{ yes : true});