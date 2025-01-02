/*global schnarkDiff*/
(function () {
"use strict";

function getInlineDiff (block) {
	var lines, oldText, newText;
	lines = block.split('\n');
	oldText = lines.filter(function (line) {
		var c = line.charAt(0);
		return c === '-' || c === ' ';
	}).map(function (line) {
		return line.slice(1);
	}).join('\n');
	newText = lines.filter(function (line) {
		var c = line.charAt(0);
		return c === '+' || c === ' ';
	}).map(function (line) {
		return line.slice(1);
	}).join('\n');
	return schnarkDiff.htmlDiff(oldText, newText);
}

function init () {
	var input, output;
	document.getElementById('diff-style').textContent = schnarkDiff.getCSS();
	input = document.getElementById('input');
	output = document.getElementById('output');
	input.addEventListener('input', function () {
		output.innerHTML = getInlineDiff(input.value);
	});
}

init();

})();