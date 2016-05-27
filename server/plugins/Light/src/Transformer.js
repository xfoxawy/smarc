var Transformer =  function(){

	this.transformPoints = function(data)
	{
		var value= {}; value.points = {};
		for(var i = 0; i < data.length; i++)
		{
			value.points[data[i].p] = {
								s : data[i].s,
								i : data[i].i,
								r : data[i].r,
								node_name : data[i].node_name,
								node_status : data[i].node_status,
								node_ip : data[i].node_ip
						};
		}
		return value.points;
	};

	this.transformRooms = function(data){
		var value = {};

		for(var i =0; i < data.length; i++)
		{
			value[data[i]._id] = data[i].name;
		}
		return value;
	};
};

module.exports = new Transformer;