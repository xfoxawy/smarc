var fs   	= require('fs'),
	path 	= require('path'),
	format 	= require('util').format,
	dir   	= require('node-dir'),
	http    = require("http");

var localstorage = function(settings)
{
	var self = this;
	var _ = {}; // private methods and props
	this.files = [];
	var rootDirectory = settings.directory;

	// read root directory
	// read all  files in that directory and its subdirectories
	// improve this 
	// self.files = (function(rootDir){
	// 	var filesArray = [];
	// 	dir.files(rootDir, function(err,files){
	// 		if(err) throw err;
	// 		files.forEach(function(filepath){
	// 			var name = filepath.split('/')[filepath.split('/').length - 1];
	// 			filesArray[name] = filepath;
	// 		});
	// 	});
	// 	return filesArray;
	// })(rootDirectory);


	// watch directory changes and updates files list
	// needs to be implemented
	// watch files in subfolders 
	// update files array when changes happen


	// file reading need to be cached and more improved for errors


	return {

		get : function(filepath, cb)
		{
			console.dir(arguments);
		},

		put : function(fileObjects, cb)
		{

		},		

		move : function(filepath, newFilepath)
		{
			localstorage.copy(filepath, newFilepath, function(status){
				localstorage.unlink(filepath);
			});
		},

		/**
		 * [copy description]
		 * @param  {[type]}   filepath [description]
		 * @param  {[type]}   copypath [description]
		 * @param  {Function} cb       [description]
		 * @return {[type]}            [description]
		 */
		copy : function(filepath, copypath, cb)
		{
			var rd = fs.createReadStream(filepath);
			
			rd.on("error", function(err){
				if(err) throw err;
			}); 
			
			var wr = fs.createWriteStream(copypath); 

			wr.on("error", function(err){
				if(err) throw err;
			});

			if(cb && typeof(cb) === "function")
			{
				wr.on('end',function(){
					return (cb(true));
				});
			}

			rd.pipe(wr);
		},

		/**
		 * [visibilty description]
		 * @param  {[type]} filepath  [description]
		 * @param  {[type]} visibilty [description]
		 * @return {[type]}           [description]
		 */
		visibilty : function(filepath, visibilty)
		{
			fs.chmod(filepath, visibilty, function(err){
				if(err) throw err;
			});
		},

		/**
		 * [delete description]
		 * @param  {[type]} filepath [description]
		 * @return {[type]}          [description]
		 */
		delete : function(filepath)
		{
			fs.unlink(filepath, function(err){
				if(err) throw err;
			});
		},

		/**
		 * [rename description]
		 * @param  {[type]} filepath [description]
		 * @param  {[type]} newName  [description]
		 * @return {[type]}          [description]
		 */
		rename : function(filepath, newName)
		{
			fs.rename(filepath, newName , function(err){
				if(err) throw err;
			});
		},

		/**
		 * [files description]
		 * @param  {[type]} directory [description]
		 * @return {[type]}           [description]
		 */
		files : function(cb, directory)
		{
			var dir = directory || '';

		},

		/**
		 * [allFiles description]
		 * @return {[type]} [description]
		 */
		allFiles : function()
		{

		},

		/**
		 * [directories description]
		 * @param  {[type]} ptah        [description]
		 * @param  {[type]} recersively [description]
		 * @return {[type]}             [description]
		 */
		directories : function(ptah, recersively)
		{

		},

		/**
		 * [deleteDirectory description]
		 * @param  {[type]} path [description]
		 * @return {[type]}      [description]
		 */
		deleteDirectory : function(path)
		{
			fs.unlink(path, function(err){
				if(err) throw err;
			});
		},

		/**
		 * [renameDirectory description]
		 * @param  {[type]} path    [description]
		 * @param  {[type]} newName [description]
		 * @return {[type]}         [description]
		 */
		renameDirectory : function(path, newName)
		{
			fs.rename(path, newName, function(err){
				if(err) throw err;
			});
		},

		/**
		 * [makeDirectory description]
		 * @param  {[type]} foldername [description]
		 * @return {[type]}            [description]
		 */
		makeDirectory : function(foldername)
		{
			fs.mkdir(foldername, 0o775, function(err){
				if(err) throw err;
			});
		}
	}
}

module.exports = localstorage;