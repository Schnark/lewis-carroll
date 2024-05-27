/*global util: true*/
util =
(function () {
"use strict";

function lowerAscii (text) {
	return text.toLowerCase()
		.replace(/<[^>]+>/g, '')
		.replace(/textit|textfrak/g, '')
		.replace(/æ/g, 'ae').replace(/[êè]/g, 'e').replace(/ó/g, 'o').replace(/’/g, '')
		.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function relPath (from, to) {
	var i;
	if (from === to) {
		return '';
	}
	from = from.split('/');
	to = to.split('/');
	while (from[0] === to[0]) {
		from.shift();
		to.shift();
	}
	for (i = 0; i < from.length - 1; i++) {
		to.unshift('..');
	}
	return to.join('/');
}

return {
	lowerAscii: lowerAscii,
	relPath: relPath
};
})();