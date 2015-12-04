var Subject = (function(window , undefined){

	function Subject(){
		this._list = [];
	};

	Subject.prototype.observe = function(obj){
		console.log('added new observer');
		this._list.push(obj);
	};

	Subject.prototype.unobserve = function(obj){
		for (var i = 0; i <= this._list.length; i++) 
		{
			if(this._list[i] === obj)
			{
				this._list.splice(i, 1);
				console.log('remvoing listed observer');
				return true;
			}
		};
		return false;
	};

	Subject.prototype.notify = function(){
		var args = Array.prototype.slice.call(arguments,0);
		
		for (var i = 0; i < this._list.length ; i++) 
		{
			this._list[i].update.apply(null ,args);
		};
	};
	return Subject;
})(this);


function StockGrabber(){
	var subject = new Subject();

	this.addObserver = function(observer){
		subject.observe(observer);
	};

	this.removeObserver = function(observer){
		subject.unobserve(observer);
	};

	this.fetchStocks = function(){
		var stocks = {
			aapl : 167.00,
			goog : 243.5,
			msft : 99.36
		};

		subject.notify(stocks);
	};
}

// define a couple of different observers
var StockUpdaterComponent = {
	update : function() {
		console.log( "update called on StockUpdater with: " , arguments );
	}
};
var StockChartsComponent = {
	update : function() {
		console.log( 'update called on StockCharts with: ', arguments );
	}
};

var stockApp = new StockGrabber();
stockApp.addObserver( StockUpdaterComponent );
stockApp.addObserver( StockChartsComponent );
stockApp.fetchStocks(); 