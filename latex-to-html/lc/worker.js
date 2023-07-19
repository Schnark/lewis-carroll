/*global self, importScripts, TextEncoder*/
/*global ZipBuilder, toHtml, convert*/
(function () {
"use strict";

self.window = self; //for TeXZilla

importScripts(
	'../res/lib/polyfill.js',
	'../res/lib/zip-builder.js',
	'../res/lib/TeXZilla-min.js',
	'../res/latex-parse.js',
	'../res/to-html.js',
	'../res/define.js',
	'image-data.js',
	'music-data.js',
	'extra.js',
	'convert.js',
	'../../search/prefix-tree.js',
	'../../search/search-index-builder.js'
);

function onMessage (e) {
	var file = latexToZip(e.data.latex);
	self.postMessage({
		tag: e.data.tag,
		file: file
	}, [file]);
}

function latexToZip (latex) {
	var warnings = [], files, zip = new ZipBuilder({
		compressionLevel: 0 //TODO
	}), encoder = new TextEncoder();
	toHtml.setWarnCallback(function (warning) {
		warnings.push(warning);
	});
	files = convert(latex);
	files['warnings.txt'] = warnings.join('\n');
	Object.keys(files).forEach(function (name) {
		zip.addFile({
			name: name,
			content: encoder.encode(files[name])
		});
	});
	return zip.getBlob();
}

self.addEventListener('message', onMessage);
})();