/*global latexParse, toHtml*/
(function () {
"use strict";

function latexToHtml (latex) {
	var ast;
	latex = latex.replace(/\\+[()\[\]]/g, function (delim) {
		if (delim.length % 2 === 1) { //e.g. \\(
			return delim;
		}
		return delim.slice(0, -2) + {
			'\\(': '$',
			'\\)': '$',
			'\\[': '$$',
			'\\]': '$$'
		}[delim.slice(-2)];
	}).replace(/\\framebox\(/g, '\\pictureframebox(');
	latex += '\n\n';
	ast = latexParse(latex);
	//console.log(ast);
	return toHtml(ast);
}

var input = document.getElementById('latex'),
	html = document.getElementById('html'),
	result = document.getElementById('result');

input.addEventListener('input', function () {
	var code;
	try {
		code = latexToHtml(input.value).trim();
		html.textContent = code;
		result.innerHTML = code;
	} catch (e) {
		html.textContent = String(e);
		result.innerHTML = '';
	}
});

})();