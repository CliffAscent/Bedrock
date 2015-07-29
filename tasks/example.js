module.exports = function(grunt) {
	var config = grunt.config.data.config;
	
	grunt.registerTask('example', function() {
		
		/**
		* Task logic.
		*/
		console.log('Available task options:');
		console.log(config);
	});
};