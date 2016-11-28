/**
* @file A sample module.
* @author Patrick Clifford
*/

define(['jquery'], function($) {

	/**
	* Module initialization object.
	*
	* @param {object} bedrock - The Bedrock core object.
	* @param {object} [customOptions={}] - Custom options to configure the module.
	*/
	var init = function(bedrock, customOptions) {
		// Ensure customOptions is an object.
		customOptions = typeof customOptions !== 'undefined' ? customOptions : {};


		/**
		* Initiate the module for the passed element.
		*
		* @param {string|object} selector - The selector or element to initialize the module on.
		*/
		function initModule(selector) {
		
			/**
			* Extend the default options.
			*/
			var defaultOptions = {
				'test': 'default'
			},
			options = bedrock.moduleOptions(defaultOptions, customOptions, selector);
			
			
			/**
			* Module logic.
			*/
			console.log('This is an example module from js/_app/modules/example.js');
			console.log('Available module options:');
			console.log(options);
		}


		/**
		* Return the public module object.
		*/
		return {
			init: initModule
		};
	};


	/**
	* Return the module initialization object.
	*/
	return {
		init: init
	};
});