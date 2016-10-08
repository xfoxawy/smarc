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
	this.dirs = [];
	var rootDirectory = settings.directory;
	this.fstree = {};

	// read root directory
	// read all  files in that directory and its subdirectories
	// improve this 
	(function scanroot(){
		var rootpath = rootDirectory.split('/');
		var rootdir = rootpath[rootpath.length -1];
		fstree[rootdir] = {};
		dir.paths(rootDirectory, function(err , paths){
					
					paths.dirs.forEach(function(path){
						var path = path.split('/');
						var pathstack = path.slice(path.indexOf(rootdir) +1, path.length);
						// create the folders tree
						console.dir(pathstack);
					});

					paths.files.forEach(function(file, index){
						var path = file.split('/');
						var relativepath = (path.slice(path.indexOf(rootdir) , path.length));
						// console.dir(relativepath);
					});


					// self.files.push(paths.files);
					// self.dirs.push(path.dirs);


		});
		
	}());


	// watch directory changes and updates files list
	// needs to be implemented
	// watch files in subfolders 
	// update files array when changes happen


	// file reading need to be cached and more improved for errors


	return {

		get : function(filepath, cb)
		{
			// console.dir(self.files);
			// dir.paths(rootDirectory, function(err , paths){
			// 	return cb(paths);
			// });
			// fs.readFile(filepath, function(err, data){
			// 	return cb(err, data);
			// });
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
		files : function(directory, cb)
		{
			var directory = directory || '';
			console.log(directory);
			visit = rootDirectory + '/' + directory;


			dir.files(visit, function(err, files){
				return cb(err, files);
			});	

		},

		/**
		 * [allFiles description]
		 * @return {[type]} [description]
		 */
		allFiles : function(cb)
		{
			dir.files(rootDirectory, function(err, files){
				if(err) throw err;
				return cb(files);
			})
		},

		/**
		 * [directories description]
		 */
		directories : function(cb)
		{
			dir.subdirs(rootDirectory, function(err, subdirs){
				if(err) throw err;
				return cb(subdirs);
			});
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