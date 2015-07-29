/**
*	@file The core of the Bedrock application.
* @author Patrick Clifford
*/

define(['jquery', 'matchmedia'], function($) {

	/**
	* Core initialization object.
	*
	* @param {object} [customOptions={}] - Custom Bedrock options.
	*
	* @property {object} settings - The private core settings.
	* @property {object} config - The public core settings extended by customOptions.
	* @property {object} core - The final core Bedrock object being built.
	*
	* @returns {object} - The core Bedrock object.
	*/
	var init = function(customOptions) {
		customOptions = typeof customOptions !== 'undefined' ? customOptions : {};

		/**
		* Define the private settings.
		*/
		var settings = {
			breakpoints: [
				'xsmall',
				'small',
				'medium',
				'large',
				'xlarge',
				'full'
			],
			m: {},
			modules: [],
			ranges: {},
			rawRange: '',
			rtl: /rtl/i.test($('html').attr('dir')),
			styleSheet: $('<style></style>').appendTo('head')[0].sheet,
			version: '0.8.0'
		};


		/**
		* Extend the default options.
		*/
		var config = $.extend({
			modules: {},
			namespace: '',
			namespaceData: false
		}, customOptions);


		/**
		* Remove the no-js class.
		*/
		$('html').removeClass('no-js');


		/**
		* Retrieve the defined namespace.
		*
		* If a namespace was not defined in the JS settings, check the meta tag for one defined in the SCSS settings.
		*/
		if (!config.namespace) {
			if ($('meta.bedrock-namespace').length) {
				config.namespace = $('meta.bedrock-namespace').css('font-family');
			}
			else {
				$('head').append('<meta class="bedrock-namespace">');
				config.namespace = $('meta.bedrock-namespace').css('font-family');
			}
		}


		/**
		* Register the existing breakpoints and their range data.
		*/
		$.each(settings.breakpoints, function(index, value) {
			$('head').append('<meta class="' + space('breakpoint-' + value) + '">');
			settings.rawRange = $('meta.' + space('breakpoint-' + value)).css('font-family');
			settings.ranges[value] = settings.rawRange.substring(1, settings.rawRange.length - 1);
		});


		/**
		* Build the settings object for a module element.
		*
		* The settings object is built using the following priority; element data-options > defaultOptions > customOptions
		*
		* @param {object} [defaultOptions={}] - The default options for the module.
		* @param {object} [customOptions={}] - The custom options for the module.
		* @param {object|string|boolean} [element=false] - The element object or selector string that we're getting the options for.
		*
		* @returns {object} The final settings object 'newOptions'.
		*/
		function moduleOptions(defaultOptions, customOptions, element) {
			var elementOptions = {},
				newOptions = {};

			defaultOptions = typeof defaultOptions !== 'undefined' ? defaultOptions : {};
			customOptions = typeof customOptions !== 'undefined' ? customOptions : {};
			element = typeof element !== 'undefined' ? element : false;
			
			// Build the options with the following priority;
			// data-{option} > data-options > custom options > default options
			if (element) {
				var $element = $(element),
					option = false;
					
				elementOptions = $element.data(core.space('options', true));
				newOptions = $.extend({}, defaultOptions, customOptions, elementOptions);
				
				for (var key in newOptions) {
					option = $element.data(key);
					if (option) {
						newOptions[key] = $element.data(key);
					}
				}
			}
			else {
				newOptions = $.extend({}, defaultOptions, customOptions);
			}
			
			return newOptions;
		}


		/**
		* Load a module with it's custom options.
		*
		* @param {string} moduleName - The name of the module to initialize.
		* @param {object} [customOptions={}] - The custom options for the module.
		*
		* @returns {object} The return object from 'module.init()'.
		*/
		function initModule(moduleName, customOptions) {
			customOptions = typeof customOptions !== 'undefined' ? customOptions : {};

			// Do not initiate modules that aren't already loaded.
			if (!require.defined(moduleName)) {
				console.log('Module "' + moduleName + '" is not loaded. Add the module to the app dependency list or use require([moduleName], function(module) { /* Use module here. */ });');
				return false;
			}
			
			// Require the module.
			var module = require(moduleName);

			// Ensure a path is no longer in the name.
			moduleName = moduleName.substr(moduleName.lastIndexOf('/') + 1);

			// Add the modules return to the core object.
			settings.m[moduleName] = module.init(core, customOptions);

			// Add to the loaded modules if not already present.
			if (settings.modules.indexOf(moduleName) < 0) {
				settings.modules.push(moduleName);
			}

			// Return the modules return.
			return settings.m[moduleName];
		}


		/**
		* Namespace a string or data attribute.
		*
		* @param {string} string - The string to namespace.
		* @param [boolean] isData - Is the string for a data attribute.
		*
		* @returns {string} The namespaced string.
		*/
		function space(string, isData) {
			isData = typeof isData !== 'undefined' ? isData : false;

			var out = string;
			
			if (config.namespace) {
				// Special handling for data-[attribute] strings.
				if (string.substring(0, 5) === 'data-' || isData) {
					if (config.namespaceData) {
						out = 'data-' + config.namespace + '-' + string.substring(5, string.length);
					}
				}
				else {
					out = config.namespace + '-' + string;
				}
			}
			
			return out;
		}


		/**
		* Register a breakpoint and it's range data.
		*
		* Creates a meta element with the breakpoint in the class name. It will then read the elements font-family to pull out the breakpoint data that was assigned in the SCSS and add it to settings.ranges[breakpoint].
		*
		* @param {string} breakpoint - The name of the breakpoint in meta.breakpoint-[the-breakpoint] which has it's breakpoint data assigned to the font-family value.
		*/
		function registerBreakpoint(breakpoint) {
			if (settings.breakpoints.indexOf(breakpoint) < 0) {
				// Add the breakpoint to the config.
				settings.breakpoints.push(breakpoint);

				// Add a meta element for the breakpoint.
				$('head').append('<meta class="' + space('breakpoint-' + breakpoint) + '">');

				// Retrieve the breakpoint data from CSS and add it to the config.
				settings.rawRange = $('meta.' + space('breakpoint-' + breakpoint)).css('font-family');
				settings.ranges[breakpoint] = settings.rawRange.substring(1, settings.rawRange.length - 1);
			}
		}


		/**
		* Add CSS, optionally into a media query.
		*
		* @param {string} rule - The CSS to inject into the page.
		* @param {string|boolean} [breakpoint=false] - Optional breakpoint to put the CSS into a media query.
		*/
		function addCss(rule, breakpoint) {
			breakpoint = typeof breakpoint !== 'undefined' ? breakpoint : false;

			if (breakpoint !== false) {
				var range = settings.ranges[breakpoint];

				// Ensure the breakpoint is valid before adding the rule.
				if (range !== 'undefined') {
					settings.styleSheet.insertRule('@media ' + settings.ranges[breakpoint] + '{ ' + rule + ' }', settings.styleSheet.cssRules.length);
				}
			}
			else {
				settings.styleSheet.insertRule(rule, settings.styleSheet.cssRules.length);
			}
		}


		/**
		* Build the public core object.
		*/
		var core = {
			// Properties.
			breakpoints: settings.breakpoints,
			m: settings.m,
			modules: settings.modules,
			namespace: config.namespace,
			namespaceData: config.namespaceData,
			ranges: settings.ranges,
			version: settings.version,

			// Methods.
			addCss: addCss,
			initModule: initModule,
			moduleOptions: moduleOptions,
			registerBreakpoint: registerBreakpoint,
			space: space
		};


		/**
		* Load the modules defined during the core init.
		*/
		$.each(config.modules, function(index, value) {
			initModule(index, value, core);
		});


		/**
		* Return the public core object.
		*/
		return core;
	};


	/**
	* Return the initialization object.
	*/
	return {
		init: init
	};
});