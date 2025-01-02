/*global define: true*/
/*global latexParse, toHtml*/
define =
(function () {
"use strict";

var footnotes, marginparcount,
	putFunctions, pictureSize;

function registerCommand (name, callback, parameters) {
	var i;
	if (!parameters) {
		parameters = [];
		for (i = 0; i < callback.length; i++) {
			parameters.push('short');
		}
	}
	latexParse.registerCommand(name, parameters);
	toHtml.registerCommand(name, callback);
}

function registerEnvironment (name, callback, parameters, separated) {
	var i;
	if (!parameters) {
		parameters = [];
		for (i = 0; i < callback.length - 1; i++) {
			parameters.push('short');
		}
	}
	if (!Array.isArray(parameters[0])) {
		parameters = [parameters, 'long'];
	}
	latexParse.registerEnvironment(name, parameters);
	if (separated) {
		callback.separated = true;
	}
	toHtml.registerEnvironment(name, callback);
}

function copyCommand (name0, name1) {
	latexParse.copyCommand(name0, name1);
	toHtml.copyCommand(name0, name1);
}

function copyEnvironment (name0, name1) {
	latexParse.copyEnvironment(name0, name1);
	toHtml.copyEnvironment(name0, name1);
}

toHtml.addLigature('--', '–');
toHtml.addLigature('---', '—');
toHtml.addLigature('~', '&nbsp;');
toHtml.addLigature('\'', '’');
toHtml.addLigature('\'\'', '”');
toHtml.addLigature('`', '‘');
toHtml.addLigature('``', '“');
toHtml.addLigature('"`', '„'); //german
toHtml.addLigature('"\'', '“'); //german
toHtml.addLigature('!´', '¡');
toHtml.addLigature('?´', '¿');
toHtml.addLigature('>>', '»');
toHtml.addLigature('<<', '«');
//ff, ffi, ffl, fi, fl excluded on purpose

function ignoreSimpleCommands (commands) {
	commands.forEach(function (command) {
		registerCommand(command, function () {
			return '';
		});
	});
}

function ignoreOneParamCommands (commands) {
	commands.forEach(function (command) {
		registerCommand(command, function () {
			return '';
		}, ['short']);
	});
}

function ignoreOptionalParamCommands (commands) {
	commands.forEach(function (command) {
		registerCommand(command, function () {
			return '';
		}, ['optional']);
	});
}

registerCommand('begingroup', function () {
	return toHtml.stringWithProps('', {group: 'open'});
});

registerCommand('endgroup', function () {
	return toHtml.stringWithProps('', {group: 'close'});
});

function makeReplaceCommands (replacements) {
	Object.keys(replacements).forEach(function (from) {
		registerCommand(from, function () {
			return replacements[from];
		});
	});
}

makeReplaceCommands({
	' ': ' ',
	'%': '%',
	'$': '$',
	'{': '{',
	'}': '}',
	'#': '#',
	'_': '_',
	'textunderscore': '_',
	'&': '&amp;',
	'@': '',
	'/': '&zwnj;',
	'-': '&shy;',
	',': '&thinsp;',
	'quad': '<span style="display: inline-block; width: 1em"> </span>',
	'aa': 'å',
	'AA': 'Å',
	'ae': 'æ',
	'AE': 'Æ',
	'dh': 'ð',
	'DH': 'Ð',
	'dj': 'đ',
	'DJ': 'Đ',
	'i': 'ı',
	'ij': 'ĳ',
	'IJ': 'Ĳ',
	'j': 'ȷ',
	'l': 'ł',
	'L': 'Ł',
	'ng': 'ŋ',
	'NG': 'Ŋ',
	'o': 'ø',
	'O': 'Ø',
	'oe': 'œ',
	'OE': 'Œ',
	'ss': 'ß',
	'SS': 'ẞ',
	'th': 'þ',
	'TH': 'Þ',
	'ldots': '…',
	'dots': '…',
	'copyright': '©',
	'textcopyright': '©',
	'texttrademark': '™',
	'pounds': '£',
	'dag': '†',
	'textdagger': '†',
	'ddag': '‡',
	'textdaggerdbl': '‡',
	'textordfeminine': 'ª',
	'textordmasculine': 'º',
	'textparagraph': '¶',
	'P': '¶',
	'textsection': '§',
	'S': '§',
	'TeX': 'TeX',
	'LaTeX': 'LaTeX',
	'textasciicircum': '^',
	'textasciitilde': '~',
	'textasteriskcentered': '*',
	'textbackslash': '\\',
	'textbar': '|',
	'texteuro': '€',
	'euro': '€',
	'textcent': '¢',
	'textnumero': '№',
	'textcelsius': '°C',
	'textmu': 'µ',
	'textohm': 'Ω',
	'textthreequarters': '¾',
	'texttimes': '×',
	'textperiodcentered': '·',
	'textopenbullet': '◦'
});

function makeAccentCommands (accents) {
	function normalize (str) {
		return str.normalize ? str.normalize() : str;
	}

	Object.keys(accents).forEach(function (accent) {
		registerCommand(accent, function (letter) {
			return letter ? normalize(letter + accents[accent][0]) : accents[accent][1];
		});
	});
}

makeAccentCommands({
	'`': ['\u0300', '`'],
	'\'': ['\u0301', '´'],
	'^': ['\u0302', '^'],
	'~': ['\u0303', '~'],
	'=': ['\u0304', '¯'],
	'u': ['\u0306', '˘'],
	'.': ['\u0307', '˙'],
	'"': ['\u0308', '¨'],
	'r': ['\u030a', '˚'],
	'H': ['\u030b', '˝'],
	'v': ['\u030c', 'ˇ'],
	'd': ['\u0323', ' \u0323'],
	'c': ['\u0327', '¸'],
	'k': ['\u0328', '˛'],
	'b': ['\u0332', '_'],
	't': ['\u0361', ' \u0361']
});

registerCommand('textbf', function (text) {
	return '<b>' + text + '</b>';
});

registerCommand('textit', function (text) {
	return '<i>' + text + '</i>';
});

registerCommand('textmd', function (text) {
	return '<span style="font-weight: normal;">' + text + '</span>';
});

registerCommand('textrm', function (text) {
	return '<span class="textrm">' + text + '</span>';
});

registerCommand('textsc', function (text) {
	return '<span style="font-variant: small-caps;">' + text + '</span>';
});

registerCommand('textsf', function (text) {
	return '<span class="textsf">' + text + '</span>';
});

registerCommand('textsl', function (text) {
	return '<span style="font-style: oblique;">' + text + '</span>';
});

registerCommand('texttt', function (text) { //assume it is always used for code
	return '<code>' + text + '</code>';
});

registerCommand('textup', function (text) {
	return '<span style="font-style: normal;">' + text + '</span>';
});

registerCommand('emph', function (text) {
	return '<em>' + text + '</em>';
});

registerCommand('underline', function (text) {
	return '<u>' + text + '</u>';
});

function makeChangeFormatCommands (commands) {
	Object.keys(commands).forEach(function (command) {
		registerCommand(command, function () {
			return toHtml.stringWithProps('', {group: 'add', open: commands[command][0], close: commands[command][1]});
		});
	});
}

makeChangeFormatCommands({
	tiny: ['<small class="tiny">', '</small>'],
	scriptsize: ['<small class="scriptsize">', '</small>'],
	footnotesize: ['<small class="footnotesize">', '</small>'],
	small: ['<small>', '</small>'],
	normalsize: ['<span class="normalsize">', '</span>'],
	large: ['<span class="large">', '</span>'],
	Large: ['<span class="Large">', '</span>'],
	LARGE: ['<span class="LARGE">', '</span>'],
	huge: ['<span class="huge">', '</span>'],
	Huge: ['<span class="Huge">', '</span>'],

	bfseries: ['<span style="font-weight: bold;">', '</span>'],
	mdseries: ['<span style="font-weight: normal;">', '</span>'],
	itshape: ['<span style="font-style: italic;">', '</span>'],
	slshape: ['<span style="font-style: oblique;">', '</span>'],
	upshape: ['<span style="font-style: normal;">', '</span>'],
	scshape: ['<span style="font-variant: small-caps;">', '</span>'],
	rmfamily: ['<span class="textrm">', '</span>'],
	sffamily: ['<span class="textsf">', '</span>'],
	ttfamily: ['<span class="texttt">', '</span>'],
	em: ['<em>', '</em>']
});

registerCommand('textsubscript', function (text) {
	return '<sub>' + text + '</sub>';
});

registerCommand('textsuperscript', function (text) {
	return '<sup>' + text + '</sup>';
});

registerCommand('par', function (ws) {
	return toHtml.stringWithProps(ws, {mode: 'block'});
});

registerCommand('noindent', function () {
	return toHtml.stringWithProps('', {indent: 'no'});
});

registerCommand('indent', function () {
	return toHtml.stringWithProps('', {indent: 'yes'});
});

registerCommand('item', function (term) {
	return toHtml.stringWithProps('', {separator: 'item', itemTerm: term});
}, ['optional']);

registerCommand('\\', function () {
	return ['tabular', 'tabbing'].indexOf(toHtml.currentEnvironment()) > -1 ?
		toHtml.stringWithProps('', {separator: 'row'}) : '<br>';
}, ['star', 'optional']);

registerCommand('newline', function () {
	return '<br>';
});

registerCommand('smallskip', function () {
	return toHtml.stringWithProps('<hr class="smallskip">', {mode: 'block'});
});

registerCommand('medskip', function () {
	return toHtml.stringWithProps('<hr class="medskip">', {mode: 'block'});
});

registerCommand('bigskip', function () {
	return toHtml.stringWithProps('<hr class="bigskip">', {mode: 'block'});
});

registerCommand('verb', function (star, content) {
	if (star) {
		content = content.replace(/ /g, '␣');
	}
	return '<code>' + content + '</code>';
}, ['star', 'verb']);

marginparcount = 0;
registerCommand('marginpar', function (left, right) {
	var id = 'marginpar-' + (++marginparcount);
	return toHtml.stringWithProps(
		'<span data-for="' + id + '" class="marginpar-anchor"></span>',
		{afterPar: '\n<aside id="' + id + '" class="marginpar">' + right + '</aside>'}
	);
}, ['optional', 'long']);
toHtml.atEnd(function () {
	marginparcount = 0;
	return '';
});

footnotes = [];
registerCommand('footnote', function (fn) {
	var id = 'footnote-' + (footnotes.length + 1),
		idBack = id + '-back';
	footnotes.push('<li id="' + id + '">' + unwrapP(fn) + ' <a href="#' + idBack + '" class="footnote-back">↩</a></li>');
	return '<sup id="' + idBack + '" class="footnote"><a href="#' + id + '">' + footnotes.length + '</a></sup>';
}, ['long']);
toHtml.atEnd(function () {
	var result;
	if (!footnotes.length) {
		return '';
	}
	result = '\n<div class="footnotes"><ol>\n' + footnotes.join('\n') + '\n</ol></div>';
	footnotes = [];
	return result;
});

function makeHeadlineCommands (headers) {
	Object.keys(headers).forEach(function (header) {
		registerCommand(header, function (star, short, title) {
			var h = headers[header];
			return toHtml.stringWithProps(
				'<' + h + (star ? ' class="nonumber"' : '') + '>' + title + '</' + h + '>',
				{mode: 'block'}
			);
		}, ['star', 'optional', 'short']);
	});
}

makeHeadlineCommands({
	chapter: 'h1',
	section: 'h2',
	subsection: 'h3',
	subsubsection: 'h4',
	paragraph: 'h5',
	subparagraph: 'h6'
});

registerCommand('caption', function (short, caption) {
	return '<figcaption>' + caption + '</figcaption>';
}, ['optional', 'short']);

registerCommand('today', function () {
	var now = new Date(),
		months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
	return months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
});

function parseLength (length) {
	var parts = /^([\-+]?\d*(?:\.\d+)?)(em|ex|px|pt|cm|\\textwidth|\\baselineskip)$/.exec(length);
	if (!parts) {
		toHtml.warn('Unrecognized length: ' + length);
		return '0';
	}
	if (parts[2] === '\\textwidth') {
		return (100 * (parts[1] || 1)) + '%';
	}
	if (parts[2] === '\\baselineskip') {
		return (1.5 * (parts[1] || 1)) + 'em'; //FIXME
	}
	return length;
}

registerCommand('hfill', function () {
	return '<x-hfill>';
});
registerCommand('dotfill', function () {
	return '<x-dotfill>';
});
registerCommand('hrulefill', function () {
	return '<x-hrulefill>';
});
toHtml.fixup(function (html) {
	return html.replace(/<x-(hfill|dotfill|hrulefill)>((?:[^<>]+|(?:<i>[^<>]+<\/i>)|(?:<b>[^<>]+<\/b>)|(?:<span style="[^<>"]+">[^<>]+<\/span>))*)(<br>|(?:<\/small>)?<\/p>|<\/td>)/g, function (all, fill, after, close) {
		return '<span class="after-' + fill + '">' + after + '</span>' + close;
	}).replace(/<x-(hfill|dotfill|hrulefill)>/g, '<!--TODO \\$1-->');
});

registerCommand('hspace', function (star, length) {
	return '<span style="display: inline-block; width: ' + parseLength(length) + ';"></span>';
}, ['star', 'raw']);

registerCommand('vspace', function (star, length) {
	return toHtml.stringWithProps('<div style="height: ' + parseLength(length) + ';"></div>', {mode: 'block'});
}, ['star', 'raw']);

registerCommand('phantom', function (text) {
	return '<span style="visibility: hidden;">' + text + '</span>';
});

registerCommand('mbox', function (text) {
	return '<span style="white-space: nowrap;">' + text + '</span>';
});

registerCommand('fbox', function (text) {
	return '<span style="white-space: nowrap; border: solid thin;">' + text + '</span>';
});

registerCommand('parbox', function (pos, width, content) {
	var align = {
		t: 'top',
		c: 'middle',
		b: 'bottom'
	};
	return toHtml.stringWithProps(
		'<div style="width: ' + parseLength(width) + '; ' +
		'vertical-align: ' + align[pos || 'c'] + ';">' + content + '</div>',
		{mode: 'block'}
	);
}, ['optional', 'raw', 'long']);

registerCommand('makebox', function (width, pos, text) {
	var style = '';
	if (width) {
		style += 'display: inline-block; width: ' + parseLength(width) + ';';
	}
	if (pos === 'r') {
		style += 'text-align: right;';
	}
	return '<span' + (style ? ' style="' + style + '"' : '') + '>' + text + '</span>';
}, ['optional', 'optional', 'short']);

registerCommand('framebox', function (width, pos, text) {
	var style = 'border: solid thin;';
	if (width) {
		style += 'display: inline-block; width: ' + parseLength(width) + ';';
	}
	if (pos === 'r') {
		style += 'text-align: right;';
	}
	return '<span' + (style ? ' style="' + style + '"' : '') + '>' + text + '</span>';
}, ['optional', 'optional', 'short']);

registerCommand('raisebox', function (dist, above, below, text) {
	return '<span style="position: relative; bottom:' + parseLength(dist) + ';">' + text + '</span>';
}, ['raw', 'optional', 'optional', 'short']);

registerCommand('rule', function (w, h) {
	var style = 'display: inline-block; background-color: currentColor;';
	style += ' width: ' + parseLength(w) + ';';
	style += ' height: ' + parseLength(h) + ';';
	return '<span style="' + style + '"></span>';
});

registerCommand('includegraphics', function (options, file) {
	return '<img src="' + file + '">';
}, ['optional', 'short']);

registerCommand('rotatebox', function (options, angle, text) {
	return ('<span style="white-space: nowrap; display: inline-block; transform: rotate(-' + angle + 'deg);">').replace('--', '') + text + '</span>';
}, ['optional', 'short', 'short']);

registerCommand('scalebox', function (h, v, text) {
	return '<span style="white-space: nowrap; display: inline-block; transform: scale(' + h + (v ? ', ' + v : '') + ');">' + text + '</span>';
}, ['short', 'optional', 'short']);

registerCommand('reflectbox', function (text) {
	return '<span style="white-space: nowrap; display: inline-block; transform: scale(-1, 1);">' + text + '</span>';
});

registerCommand('href', function (url, text) {
	return '<a href="' + url + '">' + text + '</a>';
}, ['raw', 'short']);

registerCommand('url', function (url) {
	return '<a href="' + url + '">' + url + '</a>';
}, ['raw']);

registerCommand('texorpdfstring', function (tex, string) {
	return tex;
});

//environments
registerEnvironment('verbatim', function (content) {
	return '<pre>' + content + '</pre>';
}, [[], 'raw']);

registerEnvironment('verbatim*', function (content) {
	return '<pre>' + content.replace(/ /g, '␣') + '</pre>';
}, [[], 'raw']);

registerEnvironment('quote', function (content) {
	return '<blockquote class="quote">' + content + '</blockquote>';
});

registerEnvironment('quotation', function (content) {
	return '<blockquote class="quotation">' + content + '</blockquote>';
});

registerEnvironment('verse', function (content) {
	return '<div class="verse">' + content + '</div>';
});

registerEnvironment('abstract', function (content) {
	return '<div class="abstract">\n<h2 class="nonumber">Abstract</h2>\n' + content + '</div>';
});

registerEnvironment('flushleft', function (content) {
	return '<div class="flushleft">' + content + '</div>';
});

registerEnvironment('flushright', function (content) {
	return '<div class="flushright">' + content + '</div>';
});

registerEnvironment('center', function (content) {
	return '<div class="center">' + content + '</div>';
});

registerEnvironment('table', function (pos, content) {
	return toHtml.stringWithProps('', {afterPar: '\n<figure>' + content + '</figure>'});
}, ['optional']);

registerEnvironment('figure', function (pos, content) {
	return toHtml.stringWithProps('', {afterPar: '\n<figure>' + content + '</figure>'});
}, ['optional']);

registerEnvironment('minipage', function (width, content) {
	return '<div style="display: inline-block; width: ' + parseLength(width) + ';">' + content + '</div>';
}, ['raw']);

registerEnvironment('math', null, [[], 'math']);
registerEnvironment('displaymath', null, [[], 'math']);
registerEnvironment('align', null, [[], 'math']);
registerEnvironment('align*', null, [[], 'math']);

function unwrapP (par) {
	var p, cont;
	par = par.trim();
	p = par.lastIndexOf('<p>');
	if (p === 0 && par.indexOf('</p>') === par.length - 4) {
		return par.slice(3, -4).trim();
	}
	cont = par.indexOf('</p><div class="continue">');
	//nested lists
	if (p === 0 && cont > -1 && par.indexOf('</div>') === par.length - 6) {
		return (par.slice(3, cont) + par.slice(cont + 26, -6)).trim();
	}
	return par;
}

function getListItems (content) {
	var item = false, pre = '', term = '', items = [];
	function addItem (html) {
		items.push({
			pre: pre,
			term: term,
			html: html
		});
		pre = '';
		term = '';
	}
	content.forEach(function (el) {
		if (el.separator) {
			if (item) {
				addItem('');
			}
			item = true;
			term = el.itemTerm || '';
		} else {
			if (item) {
				addItem(unwrapP(el));
			} else {
				pre = unwrapP(el);
			}
			item = false;
		}
	});
	if (item) {
		addItem('');
	}
	return items;
}

registerEnvironment('itemize', function (content) {
	return '<ul>\n' + getListItems(content).map(function (item) {
		return item.pre + '<li>' + item.html + '</li>';
	}).join('\n') + '\n</ul>';
}, null, true);

registerEnvironment('enumerate', function (content) {
	return '<ol>\n' + getListItems(content).map(function (item) {
		return item.pre + '<li>' + item.html + '</li>';
	}).join('\n') + '\n</ol>';
}, null, true);

registerEnvironment('description', function (content) {
	return '<dl>\n' + getListItems(content).map(function (item) {
		return item.pre + '<dt>' + item.term + '</dt>\n<dd>' + item.html + '</dd>';
	}).join('\n') + '\n</dl>';
}, null, true);

registerCommand('multicolumn', function (cols, pos, content) {
	return toHtml.stringWithProps(String(content), {separator: 'multicol', cols: cols, pos: pos});
});

registerCommand('multirow', function (rows, pos, content) {
	return toHtml.stringWithProps(String(content), {separator: 'multirow', rows: rows});
});

registerCommand('hline', function () {
	return toHtml.stringWithProps('', {separator: 'hline'});
});

registerCommand('cline', function (span) {
	span = span.split('-');
	return toHtml.stringWithProps('', {separator: 'cline', start: span[0], end: span[1]});
});

//TODO
function columnsToClass (columns) {
	var cls = [];
	columns.split(/([lcr])/).forEach(function (type, i) {
		switch (type) {
		case '|':
			cls.push('b' + (i / 2));
			break;
		case '||':
			cls.push('d' + (i / 2));
			break;
		case 'c':
			cls.push('c' + ((i + 1) / 2));
			break;
		case 'r':
			cls.push('r' + ((i + 1) / 2));
		}
	});
	if (
		/[^lcr|]/.test(columns) ||
		(cls.length && (Number(cls[cls.length - 1].slice(1)) > 10))
	) {
		cls.push('TODO');
	}
	return cls.join(' ');
}

registerEnvironment('tabular', function (pos, columns, content) {
	var table = [], hlines = [], col = 0, row = 0;
	function addToTable (content, params) {
		while (!table[row]) {
			table.push([]);
		}
		while (table[row].length < col) {
			table[row].push(undefined); //to make .map work
		}
		table[row][col] = {content: content, params: params || {}};
	}
	function makeTD (el) {
		var attr = '';
		if (!el) {
			return '<td></td>';
		}
		if (el.params.ignore) {
			return '';
		}
		if (el.params.attr) {
			attr = ' ' + el.params.attr;
		}
		if (el.params.cline) {
			attr += ' style="border-bottom: ';
			switch (el.params.cline) {
			case 1: attr += 'solid thin'; break;
			case 2: attr += 'double medium'; break;
			default: attr += 'solid medium';
			}
			attr += ';"';
		}
		return '<td' + attr + '>' + (el.content || '').trim() + '</td>';
	}
	content.forEach(function (el) {
		var i;
		if (el.separator) {
			switch (el.separator) {
			case 'row':
				col = 0;
				row++;
				break;
			case 'col':
				col++;
				break;
			case 'multicol':
				addToTable(unwrapP(String(el)), {attr: 'colspan="' + el.cols + '"'});
				for (i = 1; i < el.cols; i++) {
					col++;
					addToTable('', {ignore: true});
				}
				break;
			case 'multirow':
				addToTable(unwrapP(String(el)), {attr: 'rowspan="' + el.rows + '"'});
				//FIXME add ignore to all cells below
				break;
			case 'hline':
				hlines[row] = (hlines[row] || 0) + 1;
				break;
			case 'cline':
				for (i = el.start; i <= el.end; i++) {
					try {
						table[row - 1][i - 1].params.cline = (table[row - 1][i - 1].params.cline || 0) + (el.width || 1);
					} catch (e) {
						//FIXME
					}
				}
			}
		} else {
			el = unwrapP(el);
			if (el) {
				addToTable(el);
			}
		}
	});
	table = '<table class="' + columnsToClass(columns) + '">\n' + table.map(function (row, i) {
		var style = '';
		if (hlines[i]) {
			style += 'border-top: ' + (hlines[i] === 1 ? 'solid thin' : 'double medium') + ';';
		}
		if (hlines[i + 1]) {
			style += 'border-bottom: ' + (hlines[i + 1] === 1 ? 'solid thin' : 'double medium') + ';';
		}
		if (style) {
			style = ' style="' + style + '"';
		}
		return '<tr' + style + '>' + row.map(makeTD).join('') + '</tr>';
	}).join('\n') + '\n</table>';
	if (table.indexOf('span="') > -1) { //rowspan or colspan
		table = '<!--TODO manual fixing probably needed-->\n' + table;
	}
	return table;
}, ['optional', 'short'], true);

//TODO
registerCommand('>', function () {
	return toHtml.stringWithProps('', {separator: 'col'});
});
registerCommand('kill', function () {
	return toHtml.stringWithProps('', {separator: 'row'});
});
ignoreSimpleCommands(['pushtabs', 'poptabs']);
registerEnvironment('tabbing', function (content) {
	var table = [], col = 0, row = 0;
	content.forEach(function (el) {
		if (el.separator) {
			switch (el.separator) {
			case 'row':
				col = 0;
				row++;
				break;
			case 'col':
				col++;
			}
		} else {
			while (!table[row]) {
				table.push([]);
			}
			table[row][col] = unwrapP(el);
		}
	});
	return '<!--TODO manual fixing probably needed-->\n<table>\n' + table.map(function (row) {
		return '<tr>' + row.map(function (el) {
			return '<td>' + (el || '').trim() + '</td>';
		}).join('') + '</tr>';
	}).join('\n') + '\n</table>';
}, null, true);

//TODO
putFunctions = {};
pictureSize = 16;

function avoidForeignObject (pos, content) {
	if (/^<math><mrow>(?:<mi>.<\/mi>|<msup><mi>.<\/mi><mo>′<\/mo><\/msup>)+<\/mrow><\/math>$/.test(content)) {
		content = content.replace(/<msup><mi>(.)<\/mi><mo>′<\/mo><\/msup>/g, '$1’');
		content = content.replace(/<mi>(.)<\/mi>/g, '$1');
		content = content.replace(/<math><mrow>/, '').replace(/<\/mrow><\/math>/, '');
	} else if (/^<var>.<\/var>$/.test(content)) {
		content = content.replace(/<var>(.)<\/var>/, '$1');
	}
	return content.indexOf('<') > -1 ?
		'<foreignObject ' + pos + '>' + content + '</foreignObject>' :
		'<text ' + pos + ' style="font-style: italic;">' + content + '</text>';
}

function putPictureContent (x, y, content) {
	var pos;
	if (putFunctions[content]) {
		return putFunctions[content](x, y);
	}
	pos = 'x="' + x + '" y="' + y + '"';
	return content.indexOf('<') > -1 ?
		avoidForeignObject(pos, content) :
		'<text ' + pos + '>' + content + '</text>';
}

registerCommand('put', function (pos, content) {
	var x = pos.x * pictureSize, y = pos.y * pictureSize;
	return putPictureContent(x, y, content);
}, ['coords', 'short']);

registerCommand('multiput', function (pos, d, n, content) {
	var x = pos.x * pictureSize, y = pos.y * pictureSize,
		dx = d.x * pictureSize, dy = d.y * pictureSize,
		i, result = '';
	for (i = 0; i < n; i++) {
		result += putPictureContent(x + i * dx, y + i * dy, content);
	}
	return result;
}, ['coords', 'coords', 'short', 'short']);

registerCommand('line', function (d, l) {
	var code = '\\line(' + d.x + ',' + d.y + '){' + l + '}';
	l *= pictureSize;
	if (d.x !== 0) {
		l /= Math.abs(d.x);
	}
	putFunctions[code] = function (x, y) {
		return '<line x1="' + x + '" y1="' + y + '" x2="' + (x + d.x * l) + '" y2="' + (y + d.y * l) + '" />';
	};
	return code;
}, ['coords', 'short']);

registerCommand('circle', function (full, d) {
	var code = '\\circle' + (full ? '*' : '') + '{' + d + '}';
	d *= pictureSize;
	putFunctions[code] = function (x, y) {
		return '<circle ' + (full ? 'fill="currentColor" ' : 'fill="none" ') +
			'cx="' + x + '" cy="' + y + '" r="' + (d / 2) + '" />';
	};
	return code;
}, ['star', 'short']);

registerCommand('oval', function (s, part) { //TODO
	var code = '\\oval(' + s.x + ',' + s.y + ')' + (part ? '[' + part + ']' : ''),
		W = s.x * pictureSize, H = s.y * pictureSize;
	putFunctions[code] = function (x, y) {
		var a = [x - W / 2, y],
			b = [x - W / 2, y - H / 2],
			c = [x, y - H / 2],
			d = [x + W / 2, y - H / 2],
			e = [x + W / 2, y],
			f = [x + W / 2, y + H / 2],
			g = [x, y + H / 2],
			h = [x - W / 2, y + H / 2],
			path = '';
		function addCurve (start, corner, end) {
			path += (path ? 'L' : 'M') + start[0] + ',' + start[1];
			path += 'Q' + corner[0] + ',' + corner[1] + ' ' + end[0] + ',' + end[1];
		}
		if (!part || part === 'bl' || part === 'b') {
			addCurve(a, b, c);
		}
		if (!part || part === 'b' || part === 'br' || part === 'r') {
			addCurve(c, d, e);
		}
		if (!part || part === 'r' || part === 'tr' || part === 't') {
			addCurve(e, f, g);
		}
		if (!part || part === 't' || part === 'tl' || part === 'l') {
			addCurve(g, h, a);
		}
		if (part === 'l') {
			addCurve(a, b, c);
		}
		return '<path d="' + path + '" fill="none" />';
	};
	return code;
}, ['coords', 'optional']);

registerCommand('pictureframebox', function (s, content) {
	var code = '\\framebox(' + s.x + ',' + s.y + '){' + content + '}',
		W = s.x * pictureSize, H = s.y * pictureSize;
	putFunctions[code] = function (x, y) {
		return '<rect x="' + x + '" y="' + (y + H) + '" width="' + W + '" height="' + H + '" fill="none" />' +
			(content ? putPictureContent(x, y, content) : '');
	};
	return code;
}, ['coords', 'short']);

registerEnvironment('picture', function (size, content) {
	var w = size.x * pictureSize, h = size.y * pictureSize;
	content = content.replace(/<\/?p>/g, '');
	content = content.replace(/( c?y\d?)="([0-9.]+)"/g, function (all, pre, y) { //TODO no nested svg
		return pre + '="' + (Math.round(10 * (h - y)) / 10) + '"';
	}).replace(/ d="([^"]+)"/g, function (all, d) {
		return ' d="' + d.replace(/,(\d+)/g, function (all, y) {
			return ',' + (Math.round(10 * (h - y)) / 10);
		}) + '"';
	});
	return '<svg stroke="currentColor" width="' + w + '" height="' + h + '">' + content + '</svg>';
}, ['coords']);

ignoreSimpleCommands([
	'leavevmode',
	'newpage',
	'clearpage',
	'cleardoublepage',
	'sloppy',
	'fussy',
	'protect',
	'maketitle', //titles contain more style than semantics, so we ignore them
	'tableofcontents', //TODO collect all headlines and create the TOC?
	'listoffigures', //TODO as above with captions
	'listoftables' //TODO as above
]);

ignoreOneParamCommands([
	'pagestyle',
	'thispagestyle',
	'hyphenation',
	'title', //since we ignore \maketitle
	'author',
	'date'
]);

ignoreOptionalParamCommands([
	'linebreak', //even with 4 this is more layout than semantics
	'nolinebreak',
	'pagebreak',
	'nopagebreak'
]);

//TODO
registerCommand('label', function (label) {
	return toHtml.stringWithProps('<span id="' + label + '"></span>', {mode: 'any'});
}, ['raw']);

registerCommand('ref', function (label) {
	return '<a href="#' + label + '">?</a>';
}, ['raw']);

registerCommand('pageref', function (label) {
	return '<a href="#' + label + '">?</a>';
}, ['raw']);

//merge ids into headlines
toHtml.fixup(function (html) {
	return html.replace(/<h([1-6])([^>]*)>(.*)<\/h\1><span id="([^"]+)"><\/span>/g, function (all, level, attr, content, id) {
		return '<h' + level + ' id="' + id + '"' + attr + '>' + content + '</h' + level + '>';
	});
});

return {
	registerCommand: registerCommand,
	registerEnvironment: registerEnvironment,
	copyCommand: copyCommand,
	copyEnvironment: copyEnvironment,
	parseLength: parseLength,
	makeReplaceCommands: makeReplaceCommands,
	makeChangeFormatCommands: makeChangeFormatCommands,
	ignoreSimpleCommands: ignoreSimpleCommands
};
})();