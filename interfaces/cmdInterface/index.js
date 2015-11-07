// cmd line utility

//example

cmd.input('light turnon ','1', function(){
	core.light(1,turnon, callback(status){
		if(status) cmd.print("ok");
		else cmd.throw("error");
	});
});