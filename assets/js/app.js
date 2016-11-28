/**
* @file The application script that will be compiled and output.
* @author Patrick Clifford
*/

require(['jquery-private', 'bedrock', 'navigation'],
function($, bedrock, navigation) {

	/**
	* Initialize the bedrock core.
	*
	* @param {object} - The custom Bedrock options.
	*
	* @returns {object} - The Bedrock core object.
	*/
	bedrock = bedrock.init({
		// Core options.
		namespace: '',
		namespaceData: false,

		// Initialize modules.
		modules: {
			navigation: {
				activateSubmenu: 'li',
				animation: 'slide',
				animationSpeed: 'fast',
				controlClass: 'menu-control',
				hasSubClass: 'has-sub-menu',
				jqSlide: true,
				openClass: 'open',
				/**
				* The module will automatically initialize on elements with
				* the proper data-module attribute if no selector is provided.
				* Setting the selector to false will disable automatic initialization.
				*/
				// selector: false,
			},
		},
	});


	/**
	* App logic.
	*/
	console.log('Available bedrock options:');
	console.log(bedrock);
});