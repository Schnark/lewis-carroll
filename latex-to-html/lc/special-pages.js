/*global specialPages: true*/
specialPages =
(function () {
"use strict";

function extractCopyright (html) {
	var start = html.indexOf('<h3>Copyright</h3>'), end = html.indexOf('<h3', start + 1);
	return [
		html.slice(0, start) + html.slice(end),
		html.slice(start, end)
	];
}

function generateContentsByTopicList (headlines, pageNames, parts) {
	var startPages = [ //TODO retrive from latex instead of duplicating it here
		'rectory-magazine/sidney-hamilton.html',
		'math/a-syllabus-of-plane-algebraical-geometry.html',
		'math/a-discussion-of-the-various-methods-of-elections.html',
		'math/first-paper-on-logic.html',
		'magazines/condensation-of-determinants.html',
		'math/algebraical-formulae.html',
		'math/notes-on-the-first-part-of-algebra.html',
		'texts/rules-for-court-circular-1860.html',
		'texts/to-all-child-readers-of-alices-adventures-in-wonderland.html',
		'texts/endowment-of-the-greek-professorship.html',
		'magazines/vivisection-as-a-sign-of-the-times.html',
		'texts/the-guildford-gazette-extraordinary.html',
		'texts/the-telegraph-cipher.html',
		'manuscripts-proofs/railway-rules.html',
		'rectory-umbrella/the-vernon-gallery.html',
		'poems/a-boat-beneath-a-sunny-sky.html',
		'aaiw/preface.html'
	];
	headlines = headlines.replace(/<(\/?)h1>/g, '<$1h3>').split('<h3>');
	return headlines[0] + '<h3>' + headlines[1] + '<ul>\n' + pageNames.filter(function (name) {
		return name !== 'index.html' && name.slice(0, 6) !== 'about/';
	}).map(function (name) {
		var headline, title, incipit = '', start = '';
		headline = startPages.indexOf(name);
		if (headline > -1) {
			start = '</ul>\n<h3>' + headlines[headline + 2].trim().replace('chapter', 'list') + '\n<ul>\n';
		}
		title = /<title>([^<]*)<\/title>/.exec(parts[name])[1];
		if (name.slice(0, 6) === 'poems/') {
			incipit = /<div class="verse">\s*<p>\s*(.*?)<br>/.exec(parts[name].replace(/<figure[\s\S]*?<\/figure>/g, ''));
			if (incipit) {
				incipit = incipit[1].replace(/<[^>]+>/g, '') //tags
					.replace('1', '') //footnote
					.trim();
				if (incipit.indexOf('”') === -1) {
					incipit = incipit.replace('“', ''); //unclosed quotes
				}
				if (incipit.indexOf('’') === -1) {
					incipit = incipit.replace('‘', '');
				}
				if (incipit.indexOf('“') === 0 && incipit.indexOf('”') === incipit.length - 1) {
					incipit = incipit.slice(1, -1);
				}
				incipit = incipit.replace(/[.,:;—]$/, ''); //trailing punctuation
			}
			if (
				incipit &&
				incipit.slice(0, title.length).toLowerCase() !== title.toLowerCase() &&
				incipit.slice(1, title.length + 1).toLowerCase() !== title.toLowerCase()
			) {
				incipit = incipit + ': ';
			} else {
				incipit = '';
			}
		}
		return start + '<li>' + incipit + '<a href="../' + name + '">' + title + '</a></li>';
	}).join('\n') + '\n</ul>';
}

/*
function generateMaintenance (pages) {
	return [
		'<header>',
		'<h2>Maintenance</h2>',
		'</header>',
		'<dl>',
		'<dt><b>T</b>ext</dt> <dd>Text carefully compared with scan of source</dd>',
		'<dt><b>F</b>ormat</dt> <dd>Properly formatted both in PDF and HTML (esp. tables, images)</dd>',
		'<dt><b>A</b>nnotations</dt> <dd>Annotations and introduction exist (esp. quotes, other variants)</dd>',
		'<dt><b>C</b>ode</dt> <dd>HTML code looks sane (including alt text for images)</dd>',
		'</dl>',
		'<!-- ✓ -->',
		'<table class="b">',
		'<tr><th>Path</th><th>T</ht><th>F</th><th>A</th><th>C</th><th>Remarks</th></tr>',
		pages.map(function (page) {
			return '<tr><td><a href="../' + page + '">' + page + '</a></td><td></td><td></td><td></td><td></td><td></td></tr>';
		}).join('\n'),
		'</table>'
	].join('\n');
}
*/

var searchMeta = [
	'<!--',
	'<script src="../../search/prefix-tree.js" defer></script>',
	'<script src="../../search/doc-finder.js" defer></script>',
	'<script src="../../search/search.js" defer></script>',
	'-->',
	'<script src="../../res/search.js" defer></script>',
	'<style>',
	'#search-area {',
	'	display: -moz-box;',
	'	display: flex;',
	'	width: 100%;',
	'}',
	'#search-input {',
	'	-moz-box-flex: 1;',
	'	flex-grow: 1;',
	'	padding: 0.2em;',
	'}',
	'fieldset {',
	'	display: inline-block;',
	'	border: solid thin;',
	'	padding: 0.2em 0.7em 0.2em 0.5em;',
	'	margin: 0 1em 0.5em 0;',
	'}',
	'</style>'
].join('\n'),

searchPage = [
		'<header>',
		'<h2>Search</h2>',
		'</header>',
		'<form id="search-form" action="search.html">',
		'<p id="search-area"><input aria-label="Search for: " id="search-input" type="search" list="suggestions" name="q"> <button id="search-button">Search</button></p>',
		'<fieldset>',
		'<label><input name="mode" type="radio" value="exact" checked> Exact</label>',
		'<label><input id="option-prefix" name="mode" type="radio" value="prefix"> Prefix</label>',
		'<label><input id="option-fuzzy" name="mode" type="radio" value="fuzzy"> Fuzzy</label>',
		'</fieldset>',
		'<fieldset>',
		'<label><input name="combine" type="radio" value="AND" checked> AND</label>',
		'<label><input id="option-or" name="combine" type="radio" value="OR"> OR</label>',
		'</fieldset>',
		'<fieldset>',
		'<label><input name="titleOnly" type="radio" value="0" checked> All</label>',
		'<label><input id="option-title" name="titleOnly" type="radio" value="1"> Title only</label>',
		'</fieldset>',
		'<datalist id="suggestions"></datalist>',
		'</form>',
		'<noscript><p>Please <b>enable JavaScript</b> to use the search.</p></noscript>',
		'<div aria-live="polite">',
		'<p id="result-count"></p>',
		'<ul id="results"></ul>',
		'</div>',
		'<footer>',
		'<dl>',
		'<dt>Prefix search</dt>',
		'<dd>To find pages with a term starting with the query select the “prefix” option, or append an asterisk (<code>*</code>) to your query. You can also use an asterisk inside a word.</dd>',
		'<dt>Fuzzy search</dt>',
		'<dd>For a fuzzy search select that option, or append a tilde (<code>~</code>) to a word.</dd>',
		'<dt>Phrase search</dt>',
		'<dd>Unfortunately, it is not possible to search for exact phrases of two or more words. But you can enclose a word into quotation marks (<code>&quot;</code>) to enforce an exact search if your default option is different.</dd>',
		'<dt>Combining queries</dt>',
		'<dd>Select in the options whether all terms must be found or not. You can also use <code>AND</code>, <code>OR</code>, and <code>NOT</code> between terms in your query. Instead of <code>NOT</code> you can also prefix a word with a minus sign (<code>-</code>). Use parenthesis to group complex queries.</dd>',
		'<dt>Title search</dt>',
		'<dd>With that option you can limit the search to the title. You can also prefix a word with <code>title:</code> to do so, or use <code>text:</code> to limit the search to the text.</dd>',
		'<dt>Alternative search</dt>',
		'<dd>Alternatively you can <a href="https://github.com/search?q=repo%3ASchnark%2Flewis-carroll%20&type=code">search all files on GitHub</a>.</dd>',
		'</dl>',
		'</footer>'
].join('\n');

function generateSitemap (pages) {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		pages.sort().map(function (url) {
			return '<url><loc>https://schnark.github.io/lewis-carroll/html/' + url + '</loc></url>';
		}).join('\n'),
		'</urlset>'
	].join('\n');
}

return {
	extractCopyright: extractCopyright,
	generateContentsByTopicList: generateContentsByTopicList,
	//generateMaintenance: generateMaintenance,
	searchMeta: searchMeta,
	searchPage: searchPage,
	generateSitemap: generateSitemap
};
})();