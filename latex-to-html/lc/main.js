/*global URL*/
(function () {
"use strict";

var worker = new Worker('lc/worker.js'),
	count = 0,
	input = document.getElementById('input'),
	output = document.getElementById('output');

function readFile (file, callback) {
	var reader = new FileReader();
	reader.onload = function () {
		callback(reader.result);
	};
	reader.readAsText(file);
}

function addFile (name, file) {
	var a = document.createElement('a');
	a.textContent = name;
	a.download = name + '.zip';
	a.target = '_blank';
	a.href = URL.createObjectURL(file);
	output.appendChild(a);
}

function onMessage (e) {
	addFile(e.data.tag, e.data.file);
}

worker.addEventListener('message', onMessage);

function convertFile (file) {
	var tag = 'latex-' + (count++);
	readFile(file, function (latex) {
		worker.postMessage({
			tag: tag,
			latex: latex
		});
	});
}

input.addEventListener('change', function () {
	convertFile(input.files[0]);
});

})();