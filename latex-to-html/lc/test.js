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
	});
	latex += '\n\n';
	ast = latexParse(latex);
	//console.log(ast);
	return toHtml(ast);
}

document.getElementById('result').innerHTML = latexToHtml([
	'\\section{Extra Math}',
	'$$\\SIN^2 x + \\COS^2 x = \\oldFactorial{1} = \\frac{\\COS x}{\\SIN x}\\ldotp\\TAN x = \\TAN\\ldotp\\COT = \\COS\\ldotp\\SEC = \\SIN\\ldotp\\CSC = \\SIN+\\VSIN$$',
	'\\section{Diagrams}',
	'\\monoliteralDiagram{}{a}{y}',
	'',
	'\\begin{biliteralDiagram}',
	'\\xy{1}\\Xy{2}\\xY{3}\\XY{4}',
	'\\x{x}',
	'\\end{biliteralDiagram}',
	'',
	'\\begin{triliteralDiagram}',
	'\\xyM{1}\\xYM{2}',
	'\\xym{3}\\xYm{4}',
	'\\Xym{5}\\XYm{6}',
	'\\XyM{7}\\XYM{8}',
	'\\xM{x}\\XM{x\'}',
	'\\yM{y}\\YM{y\'}',
	'\\end{triliteralDiagram}'
].join('\n'));

})();