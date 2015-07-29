/**
*	@file The main Gruntfile that manages the Bedrock tasks.
* @author Patrick Clifford
*/

module.exports = function(grunt) {

	/**
	* Build the config object.
	*
	* @property {object} env - Custom environment settings object inside of 'config/env/[settings.env].json'.
	* @property {object} custom - Custom settings object inside of 'config/settings.json'.
	* @property {object} defaults - Default settings object.
	* @property {object} settings - The output settings object.
	* @property {object} settings.non_amd_paths - Paths that will not be ran through requirejs.
	*
	* @returns {object} The output settings object 'settings'.
	*/
	var config = function() {
		var env = {},
			custom = grunt.file.readJSON('config/settings.json'),
			defaults = {
				"bower_dir":           "vendor",
				"copy_files":          [],
				"copy_files_dest":     "www",
				"css_path":            "www/css",
				"css_output":          "full",
				"env":                 "dev",
				"js_copy_dirs":        [],
				"js_output":           "full",
				"js_path":             "www/js",
				"js_source_path":      "js",
				"jshint_enabled":      true,
				"less_path":           "assets/less",
				"scss_path":           "assets/scss",
				"tasks_dirs":          ["tasks"],
				"version":             "0.8.0"
			},
			settings = {};


		/**
		* Assign the settings based on the following priority;
		*
		* grunt option (command line example: grunt css --env=live) >
		* 	custom setting declared in config/settings.json >
		* 	the default setting declared above
		*/
		for (var item in defaults) {
			if (grunt.option(item)) {
				settings[item] = grunt.option(item);
			}
			else if (custom.hasOwnProperty(item)) {
				settings[item] = custom[item];
			}
			else {
				settings[item] = defaults[item];
			}
		}

		// Pull in the proper environment settings.
		env = grunt.file.readJSON('config/env/' + settings.env + '.json');

		// Assign the environment settings to the settings object.
		for (item in env) {
			settings[item] = env[item];
		}
		
		// Build an array of paths to compile JavaScript using uglify instead of requirejs.
		settings.non_amd_paths = [];
		if (typeof settings.js_copy_dirs === 'string') {
			if (settings.js_copy_dirs === '') {
				// Set up the paths for everything not starting with an _ to run through uglify.
				settings.non_amd_paths.push('**/*.js');
				settings.non_amd_paths.push('!_*.js');
				settings.non_amd_paths.push('!_*/**');
			}
			else {
				// Set up the specified paths, minus files starting with an _
				settings.non_amd_paths.push(settings.js_copy_dirs + '/**/*.js');
				settings.non_amd_paths.push('!' + settings.js_copy_dirs + '/_*.js');
			}
		}
		else {
			for (var i = 0; i < settings.js_copy_dirs.length; i++) {
				if (settings.js_copy_dirs[i] === '') {
					// Set up the paths for everything not starting with an _ to run through uglify.
					settings.non_amd_paths.push('**/*.js');
					settings.non_amd_paths.push('!_*.js');
					settings.non_amd_paths.push('!_*/**');
				}
				else {
					// Set up the specified paths, minus files starting with an _
					settings.non_amd_paths.push(settings.js_copy_dirs[i] + '/**/*.js');
					settings.non_amd_paths.push('!' + settings.js_copy_dirs[i] + '/_*.js');
				}
			}
		}

		return settings;
	}();

	
	/**
	* Initiate Grunt.
	*/
	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),

		
		/**
		*	Download the dependencies declared in bower.json
		*/
		bower: {
			install: {
				options: {
					cleanBowerDir: true,
					cleanTargetDir: true,
					targetDir: config.bower_dir
				}
			}
		},
		
		
		/**
		*	Copy files without modification.
		*/
		copy: {
			files: {
				files: [
					{
						expand: true,
						cwd: '',
						src: config.copy_files,
						dest: config.copy_files_dest + '/'
					}
				]
			},
			js: {
				files: [
					{
						expand: true,
						cwd: config.js_source_path + '/',
						src: config.non_amd_paths,
						dest: config.js_path + '/'
					},
					// Always move over requirejs.
					{
						src: config.bower_dir + '/requirejs/require.js',
						dest: config.js_path + '/require.js'
					}
				]
			}
		},


		/**
		*	Run all JavaScript through the jshint validator.
		*/
		jshint: {
			grunt: ['bower.json', 'Gruntfile.js', 'package.json', 'config/**/*.json'],
			js: [config.js_source_path + '/**/*.js']
		},

		
		/**
		* Compile LESS into CSS.
		*/
		less: {
			build: {
				options: {
					compress: (config.css_output == 'full') ? false : true
				},
				files: [{
					expand: true,
					cwd: config.less_path,
					src: ['**/*.less', '!_**/**'],
					dest: config.css_path,
					ext: '.css'
				}]
			}
		},


		/**
		* Add the necessary CSS vendor prefixes.
		*/
		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer-core')({
						browsers: ['last 3 versions']
					})
				]
			},
			app: {
				src: config.css_path + '/*.css'
			}
		},
		
		
		/**
		* Search and replace strings.
		*/
		replace: {
			// Clean up the mess added by SASS.
			css: {
				options: {
					patterns: [
						// Remove extra blank lines.
						{
							match: /\r?\n{3,}/g,
							replacement: '\r\n\r\n'
						},
						// Remove empty media queries.
						{
							match: /@media[^{]*\{(\}|\s\})/g,
							replacement: ''
						}
					],
					usePrefix: false
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [config.css_path + '/**/*.css'],
						dest: config.css_path + '/'
					}
				]
			}
		},

		
		/**
		* Process JavaScript using requirejs.
		*/
		requirejs: function() {
			var build = {};

			// Loop through the files located in the config.js_source_path directory
			// and create the requirejs config for them to be compiled.
			grunt.file.recurse(config.js_source_path, callback);
			function callback(abspath, rootdir, subdir, filename) {
				var subdirs = [],
					subdir_go = true;
					
				// Make sure the subdir is valid for requirejs output.
				if (subdir) {
					subdirs = subdir.split('/');
					
					for (var i = 0; i < subdirs.length; i++) {
						if (config.js_copy_dirs === subdirs[i] || config.js_copy_dirs.indexOf(subdirs[i]) !== -1 || subdirs[i].substring(0, 1) === '_') {
							subdir_go = false;
						}
					}
				}
				else {
					subdir = '';
				}
				
				if (subdir_go && filename.substring(0, 1) !== '_') {
					if (subdir !== '') {
						subdir = subdir + '/';
					}
					
					// Remove the file extension.
					filename = filename.replace(/\.[^/.]+$/, '');

					build[subdir + filename] = {
						options: {
							mainConfigFile: config.js_source_path + '/_settings.js',
							baseUrl: config.js_source_path,
							name: subdir + filename,
							out: config.js_path + '/' + subdir + filename + '.js',
							optimize: (config.js_output == 'full') ? 'none' : 'uglify'
						}
					};
				}
			}

			return build;
		}(),

		
		/**
		* Compile SASS into CSS.
		*/
		sass: {
			build: {
				options: {
					outputStyle: (config.css_output == 'full') ? 'nested' : 'compressed'
				},
				files: [{
					expand: true,
					cwd: config.scss_path,
					src: ['**/*.scss', '!_**/**'],
					dest: config.css_path,
					ext: '.css'
				}]
			}
		},
		
		
		/**
		* Process JavaScript located in 'js_copy_dirs' directories.
		*/
		uglify: {
			js: {
				files: [
					{
						expand: true,
						cwd: config.js_source_path + '/',
						src: config.non_amd_paths,
						dest: config.js_path + '/'
					},
					// Always move over requirejs.
					{
						src: config.bower_dir + '/requirejs/require.js',
						dest: config.js_path + '/require.js'
					}
				]
			}
		},

		
		/**
		* Watch files and execute tasks when there is a change.
		*/
		watch: {
			grunt: {
				files: ['bower.json', 'Gruntfile.js', 'package.json', 'config/**/*.json'],
				options: {
					reload: true
				},
				tasks: ['jshint:grunt']
			},
			js: {
				files: config.js_source_path + '/**/*.js',
				tasks: ['js']
			},
			less: {
				files: config.less_path + '/**/*.less',
				tasks: ['css']
			},
			scss: {
				files: config.scss_path + '/**/*.scss',
				tasks: ['css']
			}
		}
	});
	
	
	/**
	* Display the execution time after a task runs.
	*/
	require('time-grunt')(grunt);

	
	/**
	* Load the common NPM dependencies.
	*/
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-sass');

	
	/**
	* Register the Grunt tasks.
	*/
	
	// Load and run the bower task to download the dependencies defined in bower.json
	// The bower NPM task is only loaded when called, because it has a considerable load time.
	grunt.registerTask('bower', [], function() {
		grunt.loadNpmTasks('grunt-bower');
		grunt.loadNpmTasks('grunt-bower-task');
		
		grunt.task.run('bower');
	});
	
	grunt.registerTask('build', [
		'bower',
		'css',
		'js',
		'copy:files'
	]);
	
	grunt.registerTask('css', [
		'less',
		'sass',
		'replace:css',
		'postcss:app'
	]);
	
	grunt.registerTask('compile', [
		'css',
		'js',
		'copy:files'
	]);
	
	grunt.registerTask('default', [
		'css',
		'js',
		'copy:files',
		'watch'
	]);
	
	grunt.registerTask('js', [], function() {
		// Run jshint if enabled.
		if (config.jshint_enabled === true) {
			grunt.task.run('jshint:js');
		}

		grunt.task.run('requirejs');
		
		// Copy, not compress, the uglify files if config.js_output if set to full.
		if (config.js_output === 'full') {
			grunt.task.run('copy:js');
		}
		else {
			grunt.task.run('uglify:js');
		}
	});
	
	grunt.registerTask('run', ['compile']);
	
	grunt.registerTask('setup', ['build']);


	/**
	* Load the custom tasks.
	*/
	for (i = 0; i < config.tasks_dirs.length; i++) {
		grunt.loadTasks(config.tasks_dirs[i]);
	}
};