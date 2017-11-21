var Transformer =  function(){

	this.transformPoints = function(data)
	{
		var value = {};
		value.doors = {};
		for(var i = 0; i < data.length; i++)
		{
			value.doors[data[i].p] = {
								s : data[i].s,
								i : data[i].i,
								d : data[i].d,
								node_name : data[i].node_name,
								node_status : data[i].node_status,
								node_ip : data[i].node_ip
						};
		}
		return value.doors;
	};

};

module.exports = new Transformer;
