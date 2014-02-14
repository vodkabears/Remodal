/*!
 * css-filters-polyfill-parser.js
 *
 * Author: Christian Schepp Schaefer
 * Summary: A polyfill for CSS filter effects
 * License: MIT
 * Version: 0.3.0
 *
 * URL:
 * https://github.com/Schepp/
 *
 */
importScripts('cssParser.js');

var parser = new CSSParser();

self.addEventListener('message', function(e) {
	var sheet = {
		content: parser.parse(e.data.content, false, true),
		media: e.data.media
	}
	self.postMessage(sheet);
}, false);