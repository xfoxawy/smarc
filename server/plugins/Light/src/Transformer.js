var Transformer =  function(){

	this.transform = function(data)
	{
		var value= {}; value.points = {};
		console.log(data.length);
		for(var i = 0; i < data.length; i++)
		{
			value.points[data[i].p] = {
								s : data[i].s,
								i : data[i].i,
								r : data[i].r,
								node_name : data[i].node_name,
								node_status : data[i].node_status,
								node_ip : data[1].node_ip
						};
		}
		return value.points;
	};
};

module.exports = new Transformer;