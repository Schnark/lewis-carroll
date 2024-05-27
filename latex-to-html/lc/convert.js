/*global convert: true*/
/*global latexParse, toHtml, SearchIndexBuilder, util, splitLatex, navigation, specialPages*/
convert =
(function () {
"use strict";

function prepareLatex (latex) {
	latex = latex.replace(/\\+[()\[\]]/g, function (delim) {
		if (delim.length % 2 === 1) {
			return delim;
		}
		return delim.slice(0, -2) + {
			'\\(': '$',
			'\\)': '$',
			'\\[': '\\begin{center}', //we use \[...\] actually for centering, and only $$ for block math
			'\\]': '\\end{center}'
		}[delim.slice(-2)];
	}).replace(/\\framebox\(/g, '\\pictureframebox(');
	latex = latex.replace(/\\(begin|end)\{guideTab\}/g, '\\$1{tabbing}');
	latex += '\n\n';
	return latex;
}

function fixRefs (pages) {
	var pageNames = Object.keys(pages), ids = {}, idRe = / id="([^"]+)"/g;
	pageNames.forEach(function (pageName) {
		var html = pages[pageName], match;
		match = /^<h\d id="([^"]+)"/.exec(html);
		if (match) {
			ids[match[1]] = [pageName, true];
			html = html.replace(/ id="[^"]+"/, '');
			pages[pageName] = html;
		}
		while ((match = idRe.exec(html))) {
			ids[match[1]] = [pageName, false];
		}
	});
	pageNames.forEach(function (pageName) {
		var html = pages[pageName], href;
		html = html.replace(/ href="#([^"]+)"/g, function (all, id) {
			if (id.slice(0, 'footnote-'.length) === 'footnote-') {
				return all;
			}
			if (!ids[id]) {
				toHtml.warn('Missing ID: ' + id + ' (in ' + pageName + ')');
				return all;
			}
			href = util.relPath(pageName, ids[id][0]);
			if (!ids[id][1]) {
				href += '#' + id;
			}
			href = href || '#top';
			return ' href="' + href + '"';
		});
		pages[pageName] = html;
	});
}

function unhtml (html) {
	//TODO we should also apply relevant changes from the manual fixes
	//especially:
	//missing spaces in poems/poetry-for-the-million.html
	//maybeThisPage in rectory-umbrella/zoological-papers.html
	//puzzle in sylvie-and-bruno/preface.html
	//chess in ttlg/preface.html
	return html
		.replace(/<header>[\s\S]*?<\/header>/g, '')
		.replace(/<footer>[\s\S]*?<\/footer>/g, '')
		.replace(/<aside [^>]+><b>Other version[\s\S]*?<\/aside>/g, '')
		.replace(/<sup class="footnote">.*?<\/sup>/g, '')
		.replace(/<!--Command \\footnoteref not defined!-->\w+:\w+/g, ' ')
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
		})
		.replace(/\\(begin|end)\{[^}]+\}/g, ' ').replace(/\\[a-zA-Z]+/g, ' '); //unresolved commands
}

function getMetadata (html, path) {
	var title, desc, img, text, isAbout, extract, space;
	title = /<h2>(.*?)<\/h2>/.exec(html);
	if (title) {
		title = title[1]
			.replace(/<sup class="footnote">.*?<\/sup>/g, '')
			.replace(/<[^<>]+>/g, '');
	} else {
		title = 'TODO';
	}
	if (path.slice(-13) === '/preface.html') {
		title = 'Preface to ' + title;
	}
	isAbout = (path.slice(0, 6) === 'about/');
	text = unhtml('<header>' + html + '</footer>');
	img = /<img [^>]+>/.exec(html);
	img = img && img[0];
	if (!isAbout) {
		desc = 'Read “' + title + '” by Lewis Carroll' +
			(img ? ', including the original images' : '') +
			', together with many other works in the (almost really) Complete Works of Lewis Carroll.';
		if (desc.length < 160) {
			extract = text.slice(0, 160 - desc.length);
			space = extract.lastIndexOf(' ');
			if (space > -1) {
				extract = extract.slice(0, space + 1);
			}
			extract += '…';
			desc = desc.slice(0, -1) + ': ' + extract;
		}
	}
	return {
		title: title,
		//TODO? should we add the site name for all pages?
		//OTOH, many titles are already 30 chars long, some even longer than 40
		addSitename: isAbout,
		text: text,
		//TODO use
		desc: desc,
		img: img
	};
}
/*TODO
getOgMetadata (data) {
	var meta = [], match;
	meta.push('<meta property="og:type" content="website">');
	meta.push('<meta property="og:locale" content="en_UK">');
	meta.push('<meta property="og:title" content="' + data.title + '">');
	meta.push('<meta property="og:site_name" content="The (almost really) Complete Works of Lewis Carroll">');
	if (data.desc) {
		meta.push('<meta property="og:description" content="' + data.desc + '">');
	}
	if (data.img) {
		match = /src="([^"]+)"/.exec(img);
	}
	if (match) {
		meta.push('<meta property="og:image" content="' + match[1] + '">');
		match = /width="(\d+)"/.exec(data.img);
		if (match) {
			meta.push(<meta property="og:image:width" content="' + match[1] + '">');
		}
		match = /height="(\d+)"/.exec(data.img);
		if (match) {
			meta.push(<meta property="og:image:height" content="' + match[1] + '">');
		}
		match = /alt="([^"]*)"/.exec(data.img);
		if (match) {
			meta.push(<meta property="og:image:alt" content="' + match[1] + '">');
		}
	}
	return meta.join('\n');
}
*/

function getHeaderNav (page) {
	function getLink (path, title, icon) {
		var href = util.relPath(page, path);
		return '<li><a href="' + href + '" title="' + title + '" aria-label="' + title + '"><svg><use xlink:href="../../res/icons.svg#' + icon + '" /></svg></a></li>';
	}
	return [
		'<nav class="main"><ul>',
		getLink('index.html', 'Home', 'home'),
		getLink('about/introduction.html', 'Introduction', 'intro'),
		getLink('about/contents-by-source.html', 'Contents by Source', 'book'),
		getLink('about/contents-by-topic.html', 'Contents by Topic', 'list'),
		'</ul></nav>',
		'<search><form action="' + util.relPath(page, 'about/search.html') + '">' +
		'<input aria-label="Search for: " type="search" name="q">' +
		'<button title="Search" aria-label="Search"><svg><use xlink:href="../../res/icons.svg#search" /></svg></button>' +
		'</form></search>'
	].join('\n');
}

function getFooterNav (page) {
	function getLink (path, title) {
		var href = util.relPath(page, path);
		return href ? '<a href="' + href + '">' + title + '</a>' : '<b>' + title + '</b>';
	}
	return [
		'<nav><ul>',
		'<li>' + getLink('index.html', 'Home') + '</li>',
		'<li>' + getLink('about/introduction.html', 'Introduction') + '</li>',
		'<li>' + getLink('about/contents-by-source.html', 'Contents by Source') + '</li>',
		'<li>' + getLink('about/contents-by-topic.html', 'Contents by Topic') + '</li>',
		'<li>' + getLink('about/search.html', 'Search') + '</li>',
		'<li>' + getLink('about/copyright.html', 'Copyright') + '</li>',
		'</ul></nav>'
	].join('\n');
}

function finalizeHtml (html, page, searchIndexBuilder) {
	var meta, nav, res = '../../res/';

	if (navigation.TOC.indexOf(page) > -1) {
		html = navigation.addToc(html);
	}
	if (html.indexOf('<header>') > -1) {
		html = html.replace('<header>', '');
	} else {
		html = '</header>\n' + html;
	}
	if (html.match(/<\/footer>\s*$/)) {
		html = html.replace(/<\/footer>(\s*)$/, '$1');
		html = html.replace(/<footer>[\s\S]*/, function (all) {
			return all.replace(/(<div class="verse">[\s\S]*?<\/div>|<ol>[\s\S]*?<\/ol>)/g, '<div>$1</div>'); //wrap to keep margin
		});
	} else {
		html += '\n<footer>';
	}
	html = html.replace('</header>', '</header>\n<article>');
	html = html.replace(/([\s\S]*)<footer>/, '$1</article>\n<footer>');
	nav = navigation.getNav(page);
	if (nav) {
		nav = '<nav>' + nav + '</nav>';
		html = html.replace('</header>', nav + '\n</header>');
		html += '\n' + nav;
	}

	meta = getMetadata(html, page);

	if (searchIndexBuilder) {
		searchIndexBuilder.addDocument({
			path: page,
			title: unhtml(meta.title),
			text: meta.text
		});
	}

	return [
		'<!DOCTYPE html>',
		'<html lang="en"><head>',
		'<meta charset="utf-8">',
		'<title>' + meta.title + (meta.addSitename ? ' | The (almost really) Complete Works of Lewis Carroll' : '') + '</title>',
		'<meta name="viewport" content="width=device-width, initial-scale=1">', //TODO can we drop initial-scale?
		'<meta name="theme-color" content="#a04">',
		//as long as there are browsers that allow full path for cross-origin
		html.indexOf('<a href="https://') > -1 ? '<meta name="referrer" content="no-referrer-when-downgrade">' : '',
		'<link rel="icon" href="' + res + 'favicon-32.png" sizes="32x32" type="image/png">',
		'<link rel="icon" href="' + res + 'favicon.svg" sizes="any" type="image/svg+xml">',
		'<link rel="stylesheet" href="' + res + 'main.css">',
		'<script src="' + res + 'main.js" defer></script>',
		'</head><body>',
		'<header>',
		'<h1>The <span class="ar"><span>(almost</span> really)</span> Complete Works of Lewis Carroll</h1>',
		getHeaderNav(page),
		html,
		getFooterNav(page),
		'<a id="to-top" href="#top" title="Back to top">↑</a>',
		'</footer>',
		'</body></html>'
	].filter(function (line) {
		return line;
	}).join('\n');
}

function convert (latex) {
	var parts, pageNames, copyright, searchIndexBuilder;

	searchIndexBuilder = new SearchIndexBuilder(['path', 'title'], ['text', 'title']);

	parts = splitLatex(latex);
	pageNames = Object.keys(parts);
	navigation.checkBooks(pageNames, navigation.getNav());
	pageNames.forEach(function (path) {
		parts[path] = toHtml(latexParse(prepareLatex(parts[path]))).trim();
	});
	fixRefs(parts);
	pageNames.forEach(function (path) {
		if (path !== 'about/contents-by-topic.html') {
			parts[path] = finalizeHtml(
				parts[path],
				path,
				path !== 'index.html' && path.slice(0, 6) !== 'about/' ? searchIndexBuilder : null
			);
		}
	});

	parts['about/contents-by-topic.html'] += [
		'<h2>Contents by Topic</h2>',
		'<ul>',
		pageNames.filter(function (name) {
			return name !== 'about/contents-by-topic.html';
		}).map(function (name) {
			var title = /<title>([^<]*)<\/title>/.exec(parts[name])[1];
			return '<li><a href="../' + name + '">' + title + '</a></li>';
		}).join('\n'),
		'</ul>'
	].join('\n');
	parts['about/contents-by-topic.html'] = finalizeHtml(
		parts['about/contents-by-topic.html'],
		'about/contents-by-topic.html'
	);

	copyright = specialPages.extractCopyright(parts['about/introduction.html']);
	parts['about/introduction.html'] = copyright[0];
	parts['about/copyright.html'] = finalizeHtml(
		copyright[1].replace('<h3>', '<h2>').replace('</h3>', '</h2>'),
		'about/copyright.html'
	);
	pageNames.push('about/copyright.html');

	//parts['about/maintenance.html'] = finalizeHtml(specialPages.generateMaintenance(pageNames.sort()), 'about/maintenance.html');

	parts['about/search.html'] = finalizeHtml(specialPages.searchPage, 'about/search.html').replace('</head>', specialPages.searchMeta + '\n</head>');
	parts['search-index.json'] = JSON.stringify(searchIndexBuilder);
	pageNames.push('about/search.html');
	/*var stop = [];
	searchIndexBuilder.searchIndex.forEach(function (key, data) {
		if (data.length >= 220) {
			stop.push(key);
		}
	});
	console.log(stop);*/

	parts['sitemap.xml'] = specialPages.generateSitemap(pageNames);

	return parts;
}

return convert;
})();