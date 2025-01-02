/*global toHtml, define*/
/*global musicData, imageData*/
(function (registerCommand, registerEnvironment) {
"use strict";

function keepAfterPar (result, afterPar) {
	if (afterPar) {
		if (typeof result === 'string') {
			return toHtml.stringWithProps(result, {afterPar: afterPar});
		}
		result.afterPar = afterPar;
		return result;
	}
	return result;
}

registerCommand('=', function () { //we don't use \={char}, but only the command inside tabbing
	return toHtml.stringWithProps('', {separator: 'col'});
});

registerCommand('parbox', function (pos, width, content) {
	var align = {
		t: 'top',
		c: 'middle',
		b: 'bottom'
	};
	if (toHtml.currentEnvironment() === 'tabbing') { //causes more problems than it solves
		return toHtml.stringWithProps(content, {mode: 'block'});
	}
	return toHtml.stringWithProps(
		'<div style="width: ' + define.parseLength(width) + '; ' +
		'vertical-align: ' + align[pos || 'c'] + ';">' + content + '</div>',
		{mode: 'block'}
	);
}, ['optional', 'raw', 'long']);

toHtml.fixup(function (html) {
	//this may lead to invalid HTML, but in most cases it is better just to do it than to be careful
	//only do this once you identified all places where a manual fix is needed, to reduce that number
	//as it may well hide problems that do exist
	return html.replace(/<!--TODO \\(hfill|dotfill|hrulefill)-->(.*?)(<br>|<\/p>|<\/td>)/g, function (all, fill, after, close) {
		if (after.indexOf('<!--TODO') > -1 || after.indexOf('class="after-') > -1) {
			return all;
		}
		return '<span class="after-' + fill + '">' + after + '</span>' + close;
	});
});

//babel
registerCommand('textgreek', function (greek) {
	return '<span lang="grc">' + greek.replace(/((?:&lt;|&gt;|&nbsp;|’|‘|&quot;)*[a-z|])|(&[^;]+;|<[^>]+>)/gi, function (all, l, other) {
		var GREEK = {
			'>': '\u0313',
			'<': '\u0314',
			'~': '\u0342',
			'\'': '\u0301',
			'`': '\u0300',
			'"': '\u0308',
			'|': '\u0345',
			a: 'α', A: 'Α',
			b: 'β', B: 'Β',
			c: 'ς',
			d: 'δ', D: 'Δ',
			e: 'ε', E: 'Ε',
			f: 'φ', F: 'Φ',
			g: 'γ', G: 'Γ',
			h: 'η', H: 'Η',
			i: 'ι', I: 'Ι',
			j: 'ϑ', J: 'Θ',
			k: 'κ', K: 'Κ',
			l: 'λ', L: 'Λ',
			m: 'μ', M: 'Μ',
			n: 'ν', N: 'Ν',
			o: 'ο', O: 'Ο',
			p: 'π', P: 'Π',
			q: 'χ', Q: 'Χ',
			r: 'ρ', R: 'Ρ',
			s: 'σ', S: 'Σ',
			t: 'τ', T: 'Τ',
			u: 'υ', U: 'Υ',
			v: 'v', //sv for isolated sigma
			w: 'ω', W: 'Ω',
			x: 'ξ', X: 'Ξ',
			y: 'ψ', Y: 'Ψ',
			z: 'ζ', Z: 'Ζ'
		};
		if (other) {
			return other;
		}
		l = l.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/g, '~').replace(/’/g, '\'').replace(/‘/g, '`');
		l = l.split('').map(function (c) {
			return GREEK[c];
		});
		l.unshift(l.pop());
		l = l.join('');
		if (l.normalize) {
			l.normalize();
		}
		return l;
	}).replace(/σ([.,;?!:\- ]|$)/g, 'ς$1').replace(/v/g, '') + '</span>';
});

//musixtex
function calcHash (str) {
	/*jshint bitwise: false*/
	//from QUnit
	var hash = 0, i, hex;

	for (i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}

	hex = (0x100000000 + hash).toString(16);
	if (hex.length < 8) {
		hex = '0000000' + hex;
	}

	return hex.slice(-8);
}

registerEnvironment('music', function (content) {
	var hash = calcHash(content);
	if (typeof musicData !== 'undefined' && musicData[hash]) {
		return '<p>\n' + musicData[hash] + '\n</p>';
	}
	return '<!--TODO: ' + hash + ' -->\n<pre>' + content + '</pre>';
}, [[], 'raw']);

//yfonts
registerCommand('textfrak', function (text) {
	return '<span class="textfrak">' + text + '</span>';
});

define.makeChangeFormatCommands({
	frakfamily: ['<span class="textfrak">', '</span>']
});

define.ignoreSimpleCommands([
	//lineno
	'pagewiselinenumbers',
	'runninglinenumbers*',
	'setpagewiselinenumbers',
	//footnote
	'savenotes',
	'spewnotes'
]);

registerCommand('modulolinenumbers', function () {
	return '';
}, ['optional']);

define.copyCommand('label', 'linelabel');

//unimplemented internals
define.ignoreSimpleCommands([
	//not necessary
	'raggedright',
	//needs manual fixing anyway
	'centering',
	'vrule'
]);

//sometimes leaks out of math mode (actually from amstext)
registerCommand('text', function (text) {
	return text;
});

//keep to pass them raw to parseLength
registerCommand('textwidth', function () {
	return '\\textwidth';
});
registerCommand('baselineskip', function () {
	return '\\baselineskip';
});

//own commands
define.ignoreSimpleCommands([
	'hybefore',
	'hyafter',
	'clinesep'
]);

registerCommand('thickcline', function (span) {
	span = span.split('-');
	return toHtml.stringWithProps('', {separator: 'cline', start: span[0], end: span[1], width: 3});
});

define.makeReplaceCommands({
	textopenbullet: '○', //larger than usual
	usProxy: '<sup>US-proxy</sup>',
	_: '<span style="display: inline-block; width: 1em;"></span>',
	stars: toHtml.stringWithProps('<hr class="alice-stars">', {mode: 'block'}),
	starline: toHtml.stringWithProps('<hr class="stars">', {mode: 'block'}),
	italpha: '<i>α</i>',
	itbeta: '<i>β</i>',
	itgamma: '<i>γ</i>',
	itdelta: '<i>δ</i>',
	itepsilon: '<i>ε</i>',
	itzeta: '<i>ζ</i>',
	iteta: '<i>η</i>',
	ittheta: '<i>ϑ</i>',
	itkappa: '<i>κ</i>',
	itlambda: '<i>λ</i>',
	itmu: '<i>μ</i>',
	itxi: '<i>ξ</i>',
	BRC: toHtml.stringWithProps('<span style="font-size: 210%;">}</span>', {separator: 'multirow', rows: 2}),
	puzzleLength: '3'
});

//combine multiple \_ into one element
toHtml.fixup(function (html) {
	var indent = '<span style="display: inline-block; width: 1em;"></span>';
	return html.replace(new RegExp('(' + indent + ')+', 'g'), function (all) {
		return indent.replace('1', all.length / indent.length);
	});
});

registerCommand('otherLang', function (lang, content) {
	return '<span lang="' + lang + '">' + content + '</span>';
});

registerCommand('lanrickField', function (t) {
	return t;
});

registerCommand('largeLBrace', function (l) {
	return '<span style="font-size: ' + define.parseLength(l) + ';">{</span>';
}, ['raw']);

registerCommand('braceThreeLines', function (l) {
	if (l) {
		l = ' left: ' + define.parseLength(l).replace(/em$/, 'rem');
	} else {
		l = '';
	}
	return '<span style="font-size: 350%; line-height: 0; position: relative; top: 0.6em; display: inline-block; transform: scaleX(0.75);' + l + '">}</span>';
}, ['optional']);

registerCommand('rbraceSyllogism', function (l) {
	if (l) {
		l = ' left: ' + define.parseLength(l).replace(/em$/, 'rem');
	} else {
		l = '';
	}
	return '<span style="font-size: 210%; line-height: 0; position: relative; top: 0.4em;' + l + '">}</span>';
}, ['optional']);

registerCommand('rbraceSyllogism', function (l) {
	if (l) {
		l = ' left: ' + define.parseLength(l).replace(/em$/, 'rem');
	} else {
		l = '';
	}
	return '<span style="font-size: 210%; line-height: 0; position: relative; top: 0.4em;' + l + '">}</span>';
}, ['optional']);

registerCommand('rbraceSyllogismText', function (l, text) {
	if (l) {
		l = ' left: ' + define.parseLength(l).replace(/em$/, 'rem');
	} else {
		l = '';
	}
	return '<span style="font-size: 210%; line-height: 0; position: relative; top: 0.4em;' + l + '">}</span><span style="position: relative; top: 0.5em;">' + text + '</span>';
}, ['optional', 'short']);

registerCommand('see', function (ref) {
	return '→ <a href="#' + ref + '">here<!--TODO--></a>'; //TODO
});

toHtml.fixup(function (html) {
	return html.replace(/<li>(.*) \(([^<]*, )?→ (<a [^>]*>)here<!--TODO--><\/a>\)((?:\s*<!--.*-->)?<\/li>)/g, function (all, text, paren, link, end) {
		return '<li>' + link + text + '</a>' + (paren ? ' (' + paren.slice(0, -2) + ')' : '') + end;
	}).replace(/<li>(.*)(, 18\d\d\?? \(.*), → (<a [^>]*>)here<!--TODO--><\/a>([;)])/g, function (all, text, rest, link, end) {
		return '<li>' + link + text + '</a>' + rest + end;
	});
});

registerCommand('parenSee', function (title, ref) {
	return '<a href="#' + ref + '">' + title + '</a>';
});

registerCommand('subtitle', function (title) {
	return keepAfterPar(toHtml.stringWithProps('<p class="subtitle">' + title + '</p>', {mode: 'block'}), title.afterPar);
});

registerCommand('fakeheadline', function (title) {
	return keepAfterPar(toHtml.stringWithProps('<p class="fakeheadline">' + title + '</p>', {mode: 'block'}), title.afterPar);
});

registerCommand('motto', function (motto) {
	return toHtml.stringWithProps('<div class="motto">' + motto + '</div>', {mode: 'block'});
}, ['long']);

registerCommand('signature', function (sig) {
	return toHtml.stringWithProps('<div class="signature">' + sig + '</div>', {mode: 'block'});
}, ['long']);

registerCommand('textHeader', function (content) {
	return toHtml.stringWithProps('<header>' + content + '</header>', {mode: 'block'});
}, ['long']);

registerCommand('textFooter', function (content) {
	return toHtml.stringWithProps('<footer>' + content + '</footer>', {mode: 'block'});
}, ['long']);

registerEnvironment('smallRemark', function (content) {
	return '<div class="small-remark">' + content + '</div>';
});

function unwrapP (par) {
	par = par.trim();
	if (par.lastIndexOf('<p>') === 0 && par.indexOf('</p>') === par.length - 4) {
		return par.slice(3, -4).trim();
	}
	return par;
}

var annotations = 0;
function createAnnotation (text, annotation, cls) {
	var id = 'annotation-' + (++annotations);
	annotation = unwrapP(annotation);
	return toHtml.stringWithProps('<span class="annotated ' + cls + '" data-ref="' + id + '">' + text + '</span>',
		{afterPar: '\n<aside class="toggle ' + cls + (annotation.indexOf('<p>') > -1 ? ' wide' : '') + '" id="' + id + '">' + annotation + '</aside>'});
}
registerCommand('markphrase', function (text) {
	return '<span class="annotated-forced">' + text + '</span>';
});
registerCommand('remark', function (a, b) {
	return createAnnotation(a, b, 'remark');
}, ['short', 'long']);
registerCommand('variant', function (a, b) {
	return createAnnotation(a, b, 'variant');
}, ['short', 'long']);
registerCommand('corrected', function (a, b) {
	return createAnnotation(a, b, 'corrected');
});
registerCommand('omitted', function (a, b) {
	return createAnnotation(a, b, 'omitted');
});
registerCommand('quoted', function (a, b) {
	return createAnnotation(a, '<b>Quoted</b> from ' + b, 'quoted');
});
registerCommand('parody', function (a, b) {
	return createAnnotation(a, '<b>Parody</b> on ' + b, 'parody');
});
registerCommand('remarkSee', function (a, b) {
	return '<a href="#' + b + '">' + a + '</a>';
});
toHtml.atEnd(function () {
	annotations = 0;
	return '';
});
registerCommand('textit', function (text) {
	return keepAfterPar('<i>' + text + '</i>', text.afterPar);
});
toHtml.fixup(function (html) {
	var re = /data-ref="([^"]+)"/g, m, missing = [];
	while ((m = re.exec(html))) {
		if (html.indexOf('id="' + m[1] + '"') === -1) {
			missing.push(m[1]);
		}
	}
	if (missing.length) {
		html += '\n<!--TODO missing annotations: ' + missing.join(', ') + ' -->';
	}
	return html;
});

define.copyCommand('footnote', 'footnotetextWithoutNumber'); //we need a link, so we need a mark both in the text and the note

registerCommand('seeother', function (max, label, n) {
	var links = [], i;
	for (i = 0; i <= (max || 1); i++) {
		if (i !== Number(n)) {
			links.push('<a href="#' + label + ':' + i + '">seeother-' + i + '</a>');
		}
	}
	return toHtml.stringWithProps(
		'<aside id="' + label + ':' + n + '"><b>Other version' + (max ? 's' : '') + '</b>: ' + links.join(', ') + '</aside>',
		{mode: 'block'}
	);
}, ['optional', 'raw', 'raw']);

registerCommand('origref', function (orig, adapted) {
	var label;
	label = /\\oneOrTwoPages\{([^}]+)\}\{([^}]+)\}/.exec(adapted);
	if (label) {
		orig = orig.replace(/^(pp\.&nbsp;)(.*)(, )(.*)$/, '$1<a href="#' + label[1] + '">$2</a>$3<a href="#' + label[2] + '">$4</a>');
		if (orig.indexOf('<a ') > -1) {
			return orig;
		}
	}
	label = /\\(?:ref|pageref|maybeThisPage|oneOrTwoPages)\{([^}]+)\}/.exec(adapted);
	label = label ? label[1] : 'TODO';
	return '<a href="#' + label + '">' + orig + '</a>';
}, ['short', 'raw']);

define.copyCommand('', 'pageref'); //undefine to make sure we don't use it (\ref is used in some cases)

registerEnvironment('flimage', function (w, pos, content) {
	var attr = '';
	if (pos === 'l') {
		attr = ' class="float-left"';
	} else if (pos === 'r') {
		attr = ' class="float-right"';
	}
	if (w) {
		attr += ' style="max-width:' + define.parseLength(w) + ';"';
	}
	return toHtml.stringWithProps('', {afterPar: '<figure' + attr + '>' + content + '</figure>\n'});
}, ['optional', 'raw']);

function getImageData (path) {
	if (typeof imageData === 'undefined') {
		return;
	}
	path = path.replace(/\.[a-z]+$/, '');
	if (!imageData.sizes[path]) {
		return;
	}
	return {
		w: imageData.sizes[path][0],
		h: imageData.sizes[path][1],
		invert: imageData.invert.indexOf(path) > -1
	};
}

registerCommand('includeimage', function (w, src, alt) {
	var attr = [], data;
	data = getImageData(src);
	attr.push('src="../../images/' + src.replace(/\.mps$/, '.svg') + '"');
	if (data) {
		attr.push('width="' + data.w + '"');
		attr.push('height="' + data.h + '"');
		if (data.invert) {
			attr.push('class="invert"');
		}
	}
	if (w) {
		attr.push('style="max-width:' + define.parseLength(w) + ';"');
	}
	attr.push('alt="' + alt + '"');
	return '<img ' + attr.join(' ') + '>';
}, ['optional', 'raw', 'raw']);

registerCommand('transcription', function (top, left, text) {
	return toHtml.stringWithProps('<div class="transcription" style="top: ' + Math.round(100 * top) + '%; left: ' + Math.round(100 * left) + '%;"><p>' + text + '</p></div>', {mode: 'block'});
}, ['raw', 'raw', 'short']);

toHtml.fixup(function (html) {
	return html.replace(/<figure([^>]*)>([\s\S]*?)<\/figure>/g, function (all, attr, figure) {
		figure = figure.replace(/<p>(\s*<img ([^>]+)>\s*)<\/p>/, '$1');
		figure = figure.replace(/<p>(\s*<svg[\s\S]*?<\/svg>\s*)<\/p>/, '$1');
		figure = figure.replace(/<p>([\s\S]*?)<\/p>\s*$/, '<figcaption>$1</figcaption>');
		figure = figure.replace(/^\s*<figcaption>([\s\S]*)<\/figcaption>$/, '$1');
		return '<figure' + attr + '>' + figure + '</figure>';
	});
});

registerCommand('formula', function (l, r) {
	return '<tr><td>' + l + '</td><td>' + r + '</td></tr>\n';
});
registerCommand('longFormula', function (l, r) {
	return '<tr><td>' + l + '</td><td>' + r + '</td></tr>\n';
});
registerEnvironment('twoColFormulae', function (w, content) {
	return '<table class="formulae">' + content.replace(/<\/?p>/g, '') + '</table>';
});

function resizeSVG (svg, size) {
	var f;
	if (!size) {
		return svg;
	}
	if (size.slice(-2) !== 'em') {
		return '<!--TODO-->' + svg;
	}
	f = size.slice(0, -2) / 1.5;
	return svg.replace(/([0-9.]+)em/g, function (all, s) {
		return (s * f) + 'em';
	});
}

registerCommand('monoliteralDiagram', function (size, a, b, c) {
	return resizeSVG('<svg width="3.2em" height="1.7em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="3em" height="1.5em" fill="none" />' +
		(a ? '<text x="0.85em" y="1.1em" text-anchor="middle">' + a + '</text>' : '') +
		(b ? '<text x="1.6em" y="1.1em" text-anchor="middle">' + b + '</text><line x1="1.6em" y1="0.1em" x2="1.6em" y2="0.35em" /><line x1="1.6em" y1="1.35em" x2="1.6em" y2="1.6em" />' : '<line x1="1.6em" y1="0.1em" x2="1.6em" y2="1.6em" />') +
		(c ? '<text x="2.35em" y="1.1em" text-anchor="middle">' + c + '</text>' : '') +
		'</svg>', size);
}, ['optional', 'short', 'short', 'short']);

registerCommand('monoliteralVerticalDiagram', function (size, a, b, c) {
	return resizeSVG('<svg width="1.7em" height="3.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="1.5em" height="3em" fill="none" />' +
		(a ? '<text x="0.85em" y="1.1em" text-anchor="middle">' + a + '</text>' : '') +
		(b ? '<text x="0.85em" y="2.1em" text-anchor="middle">' + b + '</text><line x1="0.1em" y1="1.6em" x2="0.35em" y2="1.6em" /><line x1="1.35em" y1="1.6em" x2="1.6em" y2="1.6em" />' : '<line x1="0.1em" y1="1.6em" x2="1.6em" y2="1.6em" />') +
		(c ? '<text x="0.85em" y="2.6em" text-anchor="middle">' + c + '</text>' : '') +
		'</svg>', size);
}, ['optional', 'short', 'short', 'short']);

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

function svgText (x, y, t) {
	var pos = 'x="' + (x + 0.1) + 'em" y="' + (y + 0.1) + 'em"';
	return t.indexOf('<') > -1 ?
		avoidForeignObject(pos, t) :
		'<text ' + pos + '>' + t + '</text>';
}

function svgLine (x, y, l, down, broken) {
	var x2, y2;
	x += 0.1;
	y += 0.1;
	x2 = down ? x : x + l;
	y2 = down ? y + l : y;
	if (broken) {
		return '<line x1="' + x + 'em" y1="' + y + 'em" x2="' + ((3 * x + x2) / 4)  + 'em" y2="' + ((3 * y + y2) / 4) + 'em" />' +
			'<line x1="' + ((x + 3 * x2) / 4) + 'em" y1="' + ((y + 3 * y2) / 4) + 'em" x2="' + x2 + 'em" y2="' + y2 + 'em" />';
	}
	return '<line x1="' + x + 'em" y1="' + y + 'em" x2="' + x2 + 'em" y2="' + y2 + 'em" />';
}

function makeLogicDiagramCellCommands (commands) {
	Object.keys(commands).forEach(function (name) {
		registerCommand(name, function (t) {
			return svgText(commands[name][0], commands[name][1], t);
		});
	});
}

function makeLogicDiagramFenceCommands (commands) {
	Object.keys(commands).forEach(function (name) {
		registerCommand(name, function (t) {
			return svgText(commands[name][0], commands[name][1], t) + '<!--' + name + '-->';
		});
	});
}

makeLogicDiagramCellCommands({
	xy: [0.25, 1],
	Xy: [0.25, 2.5],
	xY: [2, 1],
	XY: [2, 2.5],

	xyM: [0.25, 1],
	XyM: [0.25, 5.5],
	xym: [1.75, 2.5],
	Xym: [1.75, 4],
	xYm: [3.25, 2.5],
	XYm: [3.25, 4],
	xYM: [4.75, 1],
	XYM: [4.75, 5.5]
});

makeLogicDiagramFenceCommands({
	x: [1.25, 1],
	X: [1.25, 2.5],
	y: [0.5, 1.75],
	Y: [2, 1.75],

	xM: [2.75, 1],
	xm: [2.75, 2.5],
	Xm: [2.75, 4],
	XM: [2.75, 5.5],
	yM: [0.5, 3.25],
	ym: [2, 3.25],
	Ym: [3.5, 3.25],
	YM: [5, 3.25]
});

function addLine (content, name, x, y, l, down) {
	var c = '<!--' + name + '-->';
	if (content.indexOf(c) > -1) {
		return content.replace(c, '') + svgLine(x, y, l, down, true);
	}
	return content + svgLine(x, y, l, down, false);
}

function addLines (content, lines) {
	Object.keys(lines).forEach(function (name) {
		var line = lines[name];
		content = addLine(content, name, line[0], line[1], line[2], line[3]);
	});
	return content;
}

registerEnvironment('biliteralDiagram', function (size, content) {
	content = content.replace(/<\/?p>/g, '');
	content = addLines(content, {
		x: [1.5, 0, 1.5, true],
		X: [1.5, 1.5, 1.5, true],
		y: [0, 1.5, 1.5, false],
		Y: [1.5, 1.5, 1.5, false]
	});
	return toHtml.stringWithProps(
		resizeSVG('<svg width="3.2em" height="3.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="3em" height="3em" fill="none" />' + content + '</svg>', size),
		{mode: 'inline'}
	);
}, ['optional']);

registerEnvironment('triliteralDiagram', function (size, content) {
	content = content.replace(/<\/?p>/g, '');
	content = addLines(content, {
		xM: [3, 0, 1.5, true],
		xm: [3, 1.5, 1.5, true],
		Xm: [3, 3, 1.5, true],
		XM: [3, 4.5, 1.5, true],
		yM: [0, 3, 1.5, false],
		ym: [1.5, 3, 1.5, false],
		Ym: [3, 3, 1.5, false],
		YM: [4.5, 3, 1.5, false]
	});
	return toHtml.stringWithProps(
		resizeSVG('<svg width="6.2em" height="6.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="6em" height="6em" fill="none" /><rect x="1.6em" y="1.6em" width="3em" height="3em" fill="none" />' + content + '</svg>', size),
		{mode: 'inline'}
	);
}, ['optional']);

registerEnvironment('triliteralUpperDiagram', function (size, content) {
	content = content.replace(/<\/?p>/g, '');
	content = addLines(content, {
		xM: [3, 0, 1.5, true],
		xm: [3, 1.5, 1.5, true]
	});
	return toHtml.stringWithProps(
		resizeSVG('<svg width="6.2em" height="3.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="6em" height="3em" fill="none" /><rect x="1.6em" y="1.6em" width="3em" height="1.5em" fill="none" />' + content + '</svg>', size),
		{mode: 'inline'}
	);
}, ['optional']);
registerEnvironment('triliteralLowerDiagram', function (size, content) {
	content = content.replace(/<\/?p>/g, '');
	content = addLines(content, {
		Xm: [3, 3, 1.5, true],
		XM: [3, 4.5, 1.5, true]
	});
	content = content.replace(/(y\d?=")([0-9.]+)em"/g, function (all, pre, pos) {
		return pre + (pos - 3) + 'em"';
	});
	return toHtml.stringWithProps(
		resizeSVG('<svg width="6.2em" height="3.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="6em" height="3em" fill="none" /><rect x="1.6em" y="0.1em" width="3em" height="1.5em" fill="none" />' + content + '</svg>', size),
		{mode: 'inline'}
	);
}, ['optional']);
registerEnvironment('triliteralRightDiagram', function (size, content) {
	content = content.replace(/<\/?p>/g, '');
	content = addLines(content, {
		Ym: [3, 3, 1.5, false],
		YM: [4.5, 3, 1.5, false]
	});
	content = content.replace(/(x\d?=")([0-9.]+)em"/g, function (all, pre, pos) {
		return pre + (pos - 3) + 'em"';
	});
	return toHtml.stringWithProps(
		resizeSVG('<svg width="3.2em" height="6.2em" stroke="currentColor"><rect x="0.1em" y="0.1em" width="3em" height="6em" fill="none" /><rect x="0.1em" y="1.6em" width="1.5em" height="3em" fill="none" />' + content + '</svg>', size),
		{mode: 'inline'}
	);
}, ['optional']);

registerCommand('monoliteralLabeledDiagram', function (size) {
	return resizeSVG('<svg style="vertical-align: -0.5em;" width="3.2em" height="2.2em" stroke="currentColor">' +
		'<line x1="0.1em" y1="0.1em" x2="3.1em" y2="0.1em" />' +
		'<line x1="0.1em" y1="0.1em" x2="0.1em" y2="1.6em" /><line x1="3.1em" y1="0.1em" x2="3.1em" y2="1.6em" />' +
		'<line x1="0.1em" y1="1.6em" x2="0.35em" y2="1.6em" /><text x="0.9em" y="1.6em" text-anchor="middle" style="font-style: italic;">y</text>' +
		'<line x1="1.35em" y1="1.6em" x2="1.85em" y2="1.6em" /><text x="2.4em" y="1.6em" text-anchor="middle" style="font-style: italic;">y’</text>' +
		'<line x1="2.85em" y1="1.6em" x2="3.1em" y2="1.6em" />' +
		'<text x="1.6em" y="1.1em" text-anchor="middle" style="font-style: italic;">x</text><line x1="1.6em" y1="0.1em" x2="1.6em" y2="0.35em" /><line x1="1.6em" y1="1.35em" x2="1.6em" y2="1.6em" />' +
		'</svg>', size);
}, ['optional']);
registerCommand('monoliteralVerticalLabeledDiagram', function (size) {
	return resizeSVG('<svg width="2.2em" height="3.2em" stroke="currentColor">' +
		'<line x1="0.1em" y1="0.1em" x2="1.6em" y2="0.1em" />' +
		'<line x1="0.1em" y1="0.1em" x2="0.1em" y2="3.1em" />' +
		'<line x1="0.1em" y1="3.1em" x2="1.6em" y2="3.1em" />' +
		'<line x1="1.6em" y1="0.1em" x2="1.6em" y2="0.6em" />' +
		'<line x1="1.6em" y1="1.1em" x2="1.6em" y2="2.1em" />' +
		'<line x1="1.6em" y1="2.6em" x2="1.6em" y2="3.1em" />' +
		'<line x1="0.1em" y1="1.6em" x2="0.6em" y2="1.6em" />' +
		'<line x1="1.1em" y1="1.6em" x2="1.6em" y2="1.6em" />' +
		'<text x="1.6em" y="1.0em" text-anchor="middle" style="font-style: italic;">x</text>' +
		'<text x="1.6em" y="2.5em" text-anchor="middle" style="font-style: italic;">x’</text>' +
		'<text x="0.85em" y="1.8em" text-anchor="middle" style="font-style: italic;">y</text>' +
		'</svg>', size);
}, ['optional']);
registerCommand('monoliteralVerticalRightLabeledDiagram', function (size) {
	return resizeSVG('<svg width="2.2em" height="3.2em" stroke="currentColor">' +
		'<line x1="0.6em" y1="0.1em" x2="2.1em" y2="0.1em" />' +
		'<line x1="2.1em" y1="0.1em" x2="2.1em" y2="3.1em" />' +
		'<line x1="0.6em" y1="3.1em" x2="2.1em" y2="3.1em" />' +
		'<line x1="0.6em" y1="0.1em" x2="0.6em" y2="0.6em" />' +
		'<line x1="0.6em" y1="1.1em" x2="0.6em" y2="2.1em" />' +
		'<line x1="0.6em" y1="2.6em" x2="0.6em" y2="3.1em" />' +
		'<line x1="0.6em" y1="1.6em" x2="1.1em" y2="1.6em" />' +
		'<line x1="1.6em" y1="1.6em" x2="2.1em" y2="1.6em" />' +
		'<text x="0.6em" y="1.0em" text-anchor="middle" style="font-style: italic;">x</text>' +
		'<text x="0.6em" y="2.5em" text-anchor="middle" style="font-style: italic;">x’</text>' +
		'<text x="1.35em" y="1.8em" text-anchor="middle" style="font-style: italic;">y’</text>' +
		'</svg>', size);
}, ['optional']);
registerCommand('biliteralLabeledDiagram', function (size) {
	return resizeSVG('<svg width="3.2em" height="3.2em" stroke="currentColor">' +
		'<rect x="0.1em" y="0.1em" width="3em" height="3em" fill="none" />' +
		'<text x="1.35em" y="1.1em" style="font-variant: italic;">x</text><text x="1.35em" y="2.6em" style="font-variant: italic;">x’</text>' +
		'<text x="0.6em" y="1.85em" style="font-variant: italic;">y</text><text x="2.1em" y="1.85em" style="font-variant: italic;">y’</text>' +
		'<line x1="1.6em" y1="0.1em" x2="1.6em" y2="0.475em" /><line x1="1.6em" y1="1.225em" x2="1.6em" y2="1.6em" />' +
		'<line x1="1.6em" y1="1.6em" x2="1.6em" y2="1.975em" /><line x1="1.6em" y1="2.725em" x2="1.6em" y2="3.1em" />' +
		'<line x1="0.1em" y1="1.6em" x2="0.475em" y2="1.6em" /><line x1="1.225em" y1="1.6em" x2="1.6em" y2="1.6em" />' +
		'<line x1="1.6em" y1="1.6em" x2="1.975em" y2="1.6em" /><line x1="2.725em" y1="1.6em" x2="3.1em" y2="1.6em" />' +
		'</svg>', size);
}, ['optional']);
registerCommand('triliteralLabeledDiagram', function (size) {
	return resizeSVG('<svg width="6.2em" height="6.2em" stroke="currentColor">' +
		'<rect x="0.1em" y="0.1em" width="6em" height="6em" fill="none" />' +
		'<text x="2.95em" y="1.85em" style="font-variant: italic;">x</text>' +
		'<text x="2.95em" y="4.85em" style="font-variant: italic;">x’</text>' +
		'<text x="1.35em" y="3.35em" style="font-variant: italic;">y</text>' +
		'<text x="4.35em" y="3.35em" style="font-variant: italic;">y’</text>' +
		'<text x="2.75em" y="3.35em" style="font-variant: italic;">m</text>' +
		'<line x1="0.1em" y1="3.1em" x2="1.3em" y2="3.1em" /><line x1="1.8em" y1="3.1em" x2="2.7em" y2="3.1em" />' +
		'<line x1="3.6em" y1="3.1em" x2="4.3em" y2="3.1em" /><line x1="4.8em" y1="3.1em" x2="6.1em" y2="3.1em" />' +
		'<line x1="3.1em" y1="0.1em" x2="3.1em" y2="1.2em" /><line x1="3.1em" y1="2.0em" x2="3.1em" y2="2.7em" />' +
		'<line x1="3.1em" y1="3.5em" x2="3.1em" y2="4.2em" /><line x1="3.1em" y1="5.0em" x2="3.1em" y2="6.1em" />' +
		'<line x1="1.6em" y1="1.6em" x2="1.6em" y2="2.8em" /><line x1="1.6em" y1="1.6em" x2="2.9em" y2="1.6em" />' +
		'<line x1="4.6em" y1="1.6em" x2="4.6em" y2="2.8em" /><line x1="4.6em" y1="1.6em" x2="3.4em" y2="1.6em" />' +
		'<line x1="1.6em" y1="4.6em" x2="1.6em" y2="3.7em" /><line x1="1.6em" y1="4.6em" x2="2.9em" y2="4.6em" />' +
		'<line x1="4.6em" y1="4.6em" x2="4.6em" y2="3.7em" /><line x1="4.6em" y1="4.6em" x2="3.4em" y2="4.6em" />' +
		'</svg>', size);
}, ['optional']);

define.ignoreSimpleCommands([':', ';']);
//define.copyEnvironment('tabbing', 'guideTab'); done in convert.js to make \\ work

toHtml.fixMath(function (latex) {
	return latex.replace(/\\ldotp/g, '\\mo{.}')
		.replace(/\\llcorner/g, '\\mo{∟}')
		.replace(/\\carrollAnd/g, '\\mo{†}')
		.replace(/\\carrollOr/g, '\\mo{§}')
		.replace(/\\carrollImplies/g, '\\mo{⁋}')
		.replace(/(\d*)\{\\cdot\}(\d+)/g, '\\mn{$1⋅$2}')
		.replace(/\\oldFactorial/g, '\\ms') //we don't use <ms> elements, so we use them temporarily to mark \oldFactorial
		.replace(/\\element/g, '\\binom') //and \binom for \element
		.replace(/\\SIN/g, '\\mo{carrollSIN}')
		.replace(/\\COS/g, '\\mo{carrollCOS}')
		.replace(/\\TAN/g, '\\mo{carrollTAN}')
		.replace(/\\COT/g, '\\mo{carrollCOT}')
		.replace(/\\SEC/g, '\\mo{carrollSEC}')
		.replace(/\\CSC/g, '\\mo{carrollCSC}')
		.replace(/\\VSIN/g, '\\mo{carrollVSIN}');
});
toHtml.fixup(function (html) {
	var SVG = {
		SIN: '<svg width="1em" height="0.5em" viewbox="0 0 20 10"><path d="M2,10 A8,8 0 0 1 18,10 M10,10 V2" fill="none" stroke="currentColor" /></svg>',
		COS: '<svg width="1em" height="0.5em" viewbox="0 0 20 10"><path d="M2,10 A8,8 0 0 1 18,10 M0,10 H20" fill="none" stroke="currentColor" /></svg>',
		TAN: '<svg width="1em" height="0.5em" viewbox="0 0 20 10"><path d="M2,10 A8,8 0 0 1 18,10 M0,0.5 H20" fill="none" stroke="currentColor" /></svg>',
		COT: '<svg width="1em" height="0.5em" viewbox="0 0 20 10"><path d="M2,0 A8,8 0 0 0 18,0 M0,9.5 H20" fill="none" stroke="currentColor" /></svg>',
		SEC: '<svg width="1em" height="0.5em" viewbox="0 0 20 12"><path d="M2,10 A8,8 0 0 1 18,10 M8,12 L20,0" fill="none" stroke="currentColor" /></svg>',
		CSC: '<svg width="1em" height="0.5em" viewbox="0 0 20 12"><path d="M2,10 A8,8 0 0 1 18,10 M12,12 L0,0" fill="none" stroke="currentColor" /></svg>',
		VSIN: '<svg width="1em" height="0.5em" viewbox="0 0 20 10"><path d="M2,10 A8,8 0 0 1 18,10 M0,0 L10,10 L20,0" fill="none" stroke="currentColor" /></svg>'
	};
	return html.replace(/<ms>/g, '<mrow style="border-left: solid thin; border-bottom: solid thin; border-top: transparent solid thick;"><mspace width="2px"/>').replace(/<\/ms>/g, '</mrow>')
		.replace(/<mo>\(<\/mo><mfrac linethickness="0px">(.*?)<\/mfrac><mo>\)<\/mo>/g, function (all, el) {
			var tag1 = /([a-z]+)/.exec(el)[1],
				tag2 = /.*[^a-z]([a-z]+)/.exec(el)[1],
				middle = el.indexOf('</' + tag1 + '><' + tag2) + ('</' + tag1 + '>').length;
			tag1 = el.slice(0, middle);
			tag2 = el.slice(middle);
			return [
				'<mrow style="border-top-left-radius: 50%; border-top: solid thin; border-right: solid thin;">',
				'<mspace width="0.25em"/>',
				tag1,
				'</mrow>',
				'<mo>&#x2063;</mo>', //invisible comma
				'<mrow style="border-bottom-right-radius: 50%; border-bottom: solid thin;">',
				tag2,
				'<mspace width="0.25em"/>',
				'</mrow>'
			].join('');
		})
		.replace(/carroll(SIN|COS|TAN|COT|SEC|CSC|VSIN)/g, function (all, f) {
			return SVG[f];
		});
});

//fix linebreaks (most come from flimage)
toHtml.fixup(function (html) {
	return html.replace(/\n\n\n+/g, '\n\n');
});

//remove class nonumber, we don't need it
toHtml.fixup(function (html) {
	return html.replace(/ class="nonumber"/g, '');
});

})(define.registerCommand, define.registerEnvironment);