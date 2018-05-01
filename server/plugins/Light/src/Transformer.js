var Transformer =  function(){

	this.transformPoints = function(data) {
		var points = {};
		for(var i = 0; i < data.length; i++)
		{
			points[data[i].id] = this.transformPoint( data[i] );
		}
		return points;
	};

	this.transformPoint = function(point) {
		return {
			i:           point.i,
			s:           point.s,
			p:           point.p,
			r:           point.r,
			id:          point.id,
			node_status: point.node_status,
			node_id:     point.node_id
		};
	};

	this.transformRooms = function(data) {
		var value = {};

		for(var i =0; i < data.length; i++)
		{
			value[data[i]._id] = data[i].name;
		}
		return value;
	};
};

module.exports = new Transformer;
