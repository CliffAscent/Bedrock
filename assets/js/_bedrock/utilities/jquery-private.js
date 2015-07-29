/**
*	@file Initialize jQuery in no-conflict mode to keep the global namespace clean.
* @author Patrick Clifford
*/

define(['jquery'], function ($) {
	return $.noConflict(true);
});