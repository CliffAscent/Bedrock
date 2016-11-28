/**
* @file The requirejs compiler settings.
* @author Patrick Clifford
*
* A full list of settings can be found at https://github.com/jrburke/r.js/blob/master/build/example.build.js
*/

require.config({

	/**
	* Store paths for easy referencing.
	*/
	paths: {

		/**
		* Custom paths.
		*/
		// 'example':           '_sample-app/modules/example',


		/**
		* Common paths.
		*/
		'almond':           '../vendor/almond/almond',
		'html5':            '../vendor/html5shiv/html5shiv',
		'modernizr':        '../vendor/modernizr/modernizr',
		'requirejs':        '../vendor/requirejs/require',
		'underscore':       '../vendor/underscore/underscore',
		'webfont':          '../vendor/webfontloader-min/webfont',
		
		
		/**
		* Paths used by Bedrock.
		*/
		'jquery':           '../vendor/jquery/jquery',
		'matchmedia':       '../vendor/matchmedia/matchMedia',
		'ready':            '../vendor/requirejs-domready/domready',
		
		
		/**
		* Bedrock paths.
		*/
		'bedrock':          '_bedrock/core',
		'jquery-private':   '_bedrock/utilities/jquery-private',
		
		
		/**
		* Bedrock module paths.
		*/
		'navigation':       '_bedrock/modules/navigation',
	},
	
	// Remove comments in minified files.
	preserveLicenseComments: false
});