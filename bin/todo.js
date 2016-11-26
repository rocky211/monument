'use strict';

const Promise = require('bluebird')
	, fs = Promise.promisifyAll(require('fs'))
	, path = require('path')
	, glob = require('glob')
	, async = require('async')
	, checkToDo = (file) => {
	  	return new Promise((resolve, reject) => {
	  		fs.readFile(path.resolve(process.cwd()+'/'+file), (err, content) => {
	  			if(err) {
	  				reject(err);
	  			}
	  			else {
	  				let lines = content.toString().split('\n');
	  				
	  				let temp = lines.filter((line) => {
	  					return line.indexOf('TODO') > -1;
	  				});
	  				
	  				resolve(temp);
	  			}
	  		});
	  	});
	  }

	//filter out files with TODO in them
	fs.readdirAsync(process.cwd())
	  .then((data) => {
	  		return new Promise((resolve,reject) => {
	  			glob("**/*.*", (err, files) => {
	  				if(err){
	  					reject(err);
	  				}
	  				else{
	  					resolve(files);
	  				}
	  			});
	  		});
	  })
	  .filter((file) => {
	  		return file.indexOf('node_modules') === -1;
	  })
	  .then((files) => {
	  	return Promise.all(files.map(checkToDo));
	  })
	  .filter((file) => {
	  	return file.length > 0;
	  })
	  .then((files) => {console.log(files)})
	  .catch((err) => {
	  	console.log('Err: '+err);
	  })
