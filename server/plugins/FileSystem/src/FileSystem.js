	path 	= require('path'),
	format 	= require('util').format,
	dir   	= require('node-dir'),
	http    = require("http");

/**
 * General FileSystem Delegator 
 * @param {Object} Core 
 */
var FileSystem = function(Core)
{
	var self = this;
	this.driversDirectory = __dirname + "/drivers/";
	this.config = Core.Config.filesystem;
	this.drivers = [];
	this.defaultDriver = null;


	(function(config){
		config.forEach(function(conf){
			if(conf.default && checkDriverExistance(conf.driver)){
				loadDriver(conf.driver, conf.settings);
			}
			else if(checkDriverExistance(conf.driver))
			{
				self.drivers.push([conf.driver, conf.settings]);
			}
		});
	})(this.config);

	/**
	 * checks if provided driver in configuration exists and valid driver
	 * @param  {String} driverName 
	 * @return {Boolean}           
	 */
	function checkDriverExistance(driverName)
	{
		return true;
	}

	/**
	 * initiate driver and ties new instance in the protoype chain
	 * @param  {String} driverName 
	 * @return {Object}            
	 */
	function loadDriver(driverName, settings)
	{	
		self.defaultDriver = require(self.driversDirectory + driverName)(settings);

		
	}

};

FileSystem.prototype.get = function(filepath)
{
	return this.defaultDriver;
};

FileSystem.prototype.put = function(fileObjects)
{

};

FileSystem.prototype.move = function(filepath, newFilepath)
{

};

FileSystem.prototype.copy = function(filepath, copypath)
{

};

FileSystem.prototype.visibilty = function(filepath, visibilty)
{

};

FileSystem.prototype.delete = function(filepath)
{

};

FileSystem.prototype.rename = function(filepath, newName)
{

};

FileSystem.prototype.files = function(directory)
{

};

FileSystem.prototype.allFiles = function()
{

};

FileSystem.prototype.directories = function(ptah, recersively)
{

};

FileSystem.prototype.deleteDirectory = function(path)
{

};

FileSystem.prototype.renameDirectory = function(path, newName)
{

};

FileSystem.prototype.makeDirectory = function(path)
{

};

module.exports = FileSystem;