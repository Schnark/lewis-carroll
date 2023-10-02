/*global SearchIndexBuilder*/
(function () {
"use strict";

var pathPre = 'Documents/Texte/Lewis%20Carroll/html/';

function loadDocument (path, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', pathPre + path);
	xhr.responseType = 'text';
	xhr.onload = function () {
		callback(xhr.response);
	};
	xhr.send();
}

function unhtml (html) {
	return html
		.replace(/<header>[\s\S]*?<\/header>/g, '')
		.replace(/<footer>[\s\S]*?<\/footer>/g, '')
		.replace(/<aside [^>]+><b>Other version[\s\S]*?<\/aside>/g, '')
		.replace(/<sup class="footnote">.*?<\/sup>/g, '')
		.replace(/<[^>]*>/g, function (tag) {
			tag = tag.split(' ')[0].toLowerCase().replace(/[^a-z]+/g, '');
			return ['b', 'i', 'u', 'em', 'strong', 'span', 'sup', 'sub'].indexOf(tag) > -1 ? '' : ' ';
		})
		.replace(/&\w+;/g, function (ent) {
			return {
				'&amp;': '&',
				'&lt;': '<',
				'&gt;': '>',
				'&quot;': '"',
				'&nbsp;': ' ',
				'&thinsp;': ' '
			}[ent] || ent;
		});
}

function addDocument (searchIndexBuilder, path, callback) {
	loadDocument(path, function (html) {
		var title = /<title>(.*)<\/title>/.exec(html)[1],
			article = /<article>([\s\S]*)<\/article>/.exec(html)[1];
		searchIndexBuilder.addDocument({
			path: path,
			title: unhtml(title),
			text: unhtml(article)
		});
		callback();
	});
}

function addDocuments (searchIndexBuilder, paths, callback) {
	var i = 0;
	function next () {
		if (i === paths.length) {
			callback();
		} else {
			addDocument(searchIndexBuilder, paths[i++], next);
		}
	}
	next();
}

function addDocumentsFromSitemap (searchIndexBuilder, callback) {
	loadDocument('sitemap.xml', function (sitemap) {
		var paths = [], re = /<loc>(.*)<\/loc>/g, match, path;
		while ((match = re.exec(sitemap))) {
			path = match[1];
			path = path.slice(path.indexOf('html/') + 5);
			if (!path.startsWith('about/')) {
				paths.push(path);
			}
		}
		addDocuments(searchIndexBuilder, paths, callback);
	});
}

function generateSearchIndex (callback) {
	var searchIndexBuilder = new SearchIndexBuilder(['path', 'title'], ['text', 'title']);
	addDocumentsFromSitemap(searchIndexBuilder, function () {
		callback(searchIndexBuilder);
	});
}

generateSearchIndex(function (searchIndexBuilder) {
	document.getElementById('output').textContent = JSON.stringify(searchIndexBuilder);
	/*var stop = [];
	searchIndexBuilder.searchIndex.forEach(function (key, data) {
		if (data.length >= 220) {
			stop.push(key);
		}
	});
	console.log(stop);*/
});

/*
generateSearchIndex(function (searchIndexBuilder) {
	var oldIndex = JSON.parse(JSON.stringify(searchIndexBuilder));
	loadDocument('search-index.json', function (newIndex) {
		newIndex = JSON.parse(newIndex);
		document.getElementById('output').textContent = JSON.stringify(comparePages(analyzeIndex(oldIndex), analyzeIndex(newIndex)), null, '\t');
	});
});
*/

})();