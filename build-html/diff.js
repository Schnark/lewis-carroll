(function (global) {
"use strict";
/*
This script implements a diff algorithm able to detect block moves.

Author: Schnark ([https://de.wikipedia.org/wiki/Benutzer:Schnark]) */
var version = 3.5, /*
License: choose any of GFDL, CC-by-sa, GPL
Documentation: [[Benutzer:Schnark/js/diff/core]]

It doesn't depend on any external library, only the function addEvents()
requires jQuery to be loaded. This function isn't called internally and
only serves progressive enhancement.
<nowiki>
*/

config = {
	charDiff: 1, //how often to split up words, 0 to disable
	wordDiffQual: 0.3, //quality of a "word diff": 0 -> always show diff on character level ... 1 -> only for very simple cases
	recursion: 5, //recursion level, 1 to disable
	tooShort: 1, //length of a word to short to be linked on uniqueness
	smallRegion: 9, //length (in words/chars) of a region where such a word is considered as long enough
	minMovedLength: 10, //minimal length for a block to be considered as moved

	indicateMoves: 1, //0: do not show moves, 1: show moved text at new position, 2: show moved text at both positions

	showPar: '¶', //show this sign for deleted/inserted new lines that can't be noticed otherwise
	movedLeft: '^', //or '⧏', show this sign for a block moved left/top
	movedRight: '^', //or '⧐', show this sign for a block moved right/below
	invisible: { //map 'invisible char': 'replacement'
		'\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F': true, //set to <span title="U+xxxx">▯</span>
		'\u0009': '<span title="TAB">\u00A0→\u00A0</span>',
		'\u00A0': '<span title="NBSP">\u00A0</span>',
		'\u00AD': '<span title="SHY">▯</span>',
		'\u034F': '<span title="CGJ">▯</span>',
		'\u061C': '\u061C<span title="ALM">▯</span>\u061C',
		'\u1680': '<span title="OGHAM SPACE MARK">\u1680</span>',
		'\u180E': '<span title="MONGOLIAN VOWEL SEPARATOR">\u180E</span>',
		'\u2000': '<span title="EN QUAD">\u2000</span>',
		'\u2001': '<span title="EM QUAD">\u2001</span>',
		'\u2002': '<span title="EN SPACE">\u2002</span>',
		'\u2003': '<span title="EM SPACE">\u2003</span>',
		'\u2004': '<span title="THREE-PER-EM SPACE">\u2004</span>',
		'\u2005': '<span title="FOUR-PER-EM SPACE">\u2005</span>',
		'\u2006': '<span title="SIX-PER-EM SPACE">\u2006</span>',
		'\u2007': '<span title="FIGURE SPACE">\u2007</span>',
		'\u2008': '<span title="PUNCTUATION SPACE">\u2008</span>',
		'\u2009': '<span title="THIN SPACE">\u2009</span>',
		'\u200A': '<span title="HAIR SPACE">\u200A</span>',
		'\u200B': '<span title="ZWSP">▯</span>',
		'\u200C': '<span title="ZWNJ">▯</span>',
		'\u200D': '<span title="ZWJ">▯</span>',
		'\u200E': '\u200E<span title="LRM">▯</span>\u200E',
		'\u200F': '\u200F<span title="RLM">▯</span>\u200F',
		'\u2010': '<span title="HYPHEN">\u2010</span>',
		'\u2011': '<span title="NON-BREAKING HYPHEN">\u2011</span>',
		'\u2012': '<span title="FIGURE DASH">\u2012</span>',
		'\u2013': '<span title="EN DASH">\u2013</span>',
		'\u2014': '<span title="EM DASH">\u2014</span>',
		'\u2015': '<span title="HORIZONTAL BAR">\u2015</span>',
		'\u2028': '<span title="LINE SEPARATOR">▯</span>',
		'\u2029': '<span title="PARAGRAPH SEPARATOR">▯</span>',
		'\u202A': '\u202A<span title="LRE">▯</span>',
		'\u202B': '\u202B<span title="RLE">▯</span>',
		'\u202C': '<span title="PDF">▯</span>\u202C',
		'\u202D': '\u202D<span title="LRO">▯</span>',
		'\u202E': '\u202E<span title="RLO">▯</span>',
		'\u202F': '<span title="NNBSP">\u202F</span>',
		'\u205F': '<span title="MMSP">\u205F</span>',
		'\u2060': '<span title="WJ">▯</span>',
		'\u2061': '<span title="FUNCTION APPLICATION">▯</span>',
		'\u2062': '<span title="INVISIBLE TIMES">▯</span>',
		'\u2063': '<span title="INVISIBLE SEPARATOR">▯</span>',
		'\u2064': '<span title="INVISIBLE PLUS">▯</span>',
		'\u2066': '\u2066<span title="LRI">▯</span>',
		'\u2067': '\u2067<span title="RLI">▯</span>',
		'\u2068': '\u2068<span title="FSI">▯</span>',
		'\u2069': '<span title="PDI">▯</span>\u2069',
		'\u206A': '<span title="INHIBIT SYMMETRIC SWAPPING">▯</span>',
		'\u206B': '<span title="ACTIVATE SYMMETRIC SWAPPING">▯</span>',
		'\u206C': '<span title="INHIBIT ARABIC FORM SHAPING">▯</span>',
		'\u206D': '<span title="ACTIVATE ARABIC FORM SHAPING">▯</span>',
		'\u206E': '<span title="NATIONAL DIGIT SHAPES">▯</span>',
		'\u206F': '<span title="NOMINAL DIGIT SHAPES">▯</span>',
		'\u2212': '<span title="MINUS SIGN">\u2212</span>',
		'\u3000': '<span title="IDEOGRAPHIC SPACE">\u3000</span>',
		'\uFEFF': '<span title="BOM">▯</span>',
		'\uFFF9': '<span title="IAA">\uFFF9</span>',
		'\uFFFA': '<span title="IAS">\uFFFA</span>',
		'\uFFFB': '<span title="IAT">\uFFFB</span>'
	},
	lengthOmit: 100, //length that an equal block must reach to be considered as too long to be shown entirely
	lengthOmitPar: 20, //minimal number of characters shown before/after a paragraph next to an omited block
	lengthOmitSpace: 40, //same, but for break next to space
	lengthOmitOther: 50, //same, but for break inside a (probably very long) word
	lengthOmitJoin: 20 //minimal number of characters that must be omitted, otherwise blocks are joined again
},

style = {
	equal: '',
	omit: '',
	ins: 'text-decoration: none; color: #fff; background-color: #009933;',
	del: 'text-decoration: none; color: #fff; background-color: #990033;',
	movedDel: 'text-decoration: none; color: #000; background-color: #ff8060;;',
	movedIns: 'text-decoration: none; color: #000; background-color: #a0ff99;;',
	movedFrom: 'color: #000; text-decoration: none; font-weight: bold;',
	movedTo: '#eaecf0', //background-color
	movedHover: 'outline: 1px dashed;',
	movedTarget: 'outline: 1px dashed;',
	blocks: [
		['#000', '#ffff80'], //color, background-color
		['#000', '#c0ffff'],
		['#000', '#ffc0e0'],
		['#000', '#a0ffa0'],
		['#000', '#ffd0a0'],
		['#000', '#ffa0a0'],
		['#000', '#a0a0ff'],
		['#000', '#ffbbbb'],
		['#000', '#c0ffa0'],
		['#000', '#d8ffa0'],
		['#000', '#b0a0d0']
	],
	repeatBlocks: 2, //how often to repeat the above colors
	additional: '' //additional CSS
},
invisibleRe,
wordSepRe,
strengthCache = {},
hasOwn = Object.prototype.hasOwnProperty,
SimpleMap;

function htmlEscape (s) {
	return s.replace(/['"<>&]/g, function escapeCallback (s) {
		switch (s) {
		case '\'': return '&#039;';
		case '"': return '&quot;';
		case '<': return '&lt;';
		case '>': return '&gt;';
		case '&': return '&amp;';
		}
	});
}

/*global mediaWiki, module, define, exports*/
function expose (diff) {
	if (typeof mediaWiki === 'object' && typeof mediaWiki.libs === 'object') {
		mediaWiki.libs.schnarkDiff = diff;
		if (mediaWiki.hook) {
			mediaWiki.hook('userjs.load-script.diff-core').fire(diff);
		}
	} else if (typeof module === 'object') {
		module.exports = diff;
	} else if (typeof define === 'function' && define.amd) {
		define([], function () {
			return diff;
		});
	} else if (typeof exports === 'object') {
		exports.schnarkDiff = diff;
	} else {
		global.schnarkDiff = diff;
	}
}

//implements all aspects of Map we want to use
function SimplePolyfillMap () {
	this.size = 0;
	this.values = {};
}

SimplePolyfillMap.prototype.set = function (key, val) {
	this.size = 1; //just make sure that size !== 0
	this.values[' ' + key] = val; //otherwise things like key === '__proto__' break in Firefox
};

SimplePolyfillMap.prototype.get = function (key) {
	return this.values[' ' + key];
};

SimplePolyfillMap.prototype.has = function (key) {
	return ' ' + key in this.values;
};

SimplePolyfillMap.prototype.forEach = function (callback, thisArg) {
	var key;
	for (key in this.values) {
		if (hasOwn.call(this.values, key)) {
			callback.call(thisArg, this.values[key], key.slice(1), this);
		}
	}
};

SimpleMap = window.Map && window.Map.prototype.forEach ? window.Map : SimplePolyfillMap;

function getCSS () {
	var css, i;
	css = '.enhanced-diff-equal {' + style.equal + '}';
	css += '.enhanced-diff-omit {' + style.omit + '}';
	css += 'ins.enhanced-diff-ins, .insertion-like {' + style.ins + '}';
	css += 'del.enhanced-diff-del, .deletion-like {' + style.del + '}';
	css += 'del.enhanced-diff-moved-del {' + style.movedDel + '}';
	css += 'ins.enhanced-diff-moved-ins {' + style.movedIns + '}';
	css += 'a.enhanced-diff-moved-from, a.enhanced-diff-moved-from:visited, a.enhanced-diff-moved-from:hover {' +
		style.movedFrom + '}';
	css += '.enhanced-diff-moved-to, .enhanced-diff-moved-to .enhanced-diff-equal {background-color:' + style.movedTo + ';}';
	css += '.enhanced-diff-moved-to ins, .enhanced-diff-moved-to del {border: 3px solid ' + style.movedTo + ';' +
		'border-left: none; border-right: none;}';
	css += '.enhanced-diff-moved-hover {' + style.movedHover + '}';
	css += '.enhanced-diff-moved-to:target {' + style.movedTarget + '}';
	for (i = 0; i < style.blocks.length * style.repeatBlocks; i++) {
		css += '.enhanced-diff-block-' + i + ',' +
			'.enhanced-diff-block-' + i + ' .enhanced-diff-equal {color:' + style.blocks[i % style.blocks.length][0] +
				';background-color:' + style.blocks[i % style.blocks.length][1] + ';}';
		css += '.enhanced-diff-block-' + i + ' ins, .enhanced-diff-block-' + i + ' del {' +
			'border-color:' + style.blocks[i % style.blocks.length][1] + ';}';
	}
	css += style.additional;
	return css;
}

//find the longest increasing subsequence, where longest means highest sum of block lengths
function lis (blocks, lengths) {
	if (blocks.length === 0) {
		return [];
	}
	var allSeqs = [], i, j, max, seq;
	for (i = 0; i < blocks.length; i++) {
		max = -1;
		for (j = 0; j < allSeqs.length; j++) {
			if (allSeqs[j][0] < blocks[i]) { //we could add to this seqence
				if (max === -1 || allSeqs[j][1] > allSeqs[max][1]) { //it is longer!
					max = j;
				}
			}
		}
		if (max === -1) {
			allSeqs.push([blocks[i], lengths[i], [blocks[i]]]); //start a new seqence
		} else {
			seq = [].slice.call(allSeqs[max][2]); //copy
			seq.push(blocks[i]);
			allSeqs.push([blocks[i], allSeqs[max][1] + lengths[i], seq]);
		}
	}
	max = 0;
	for (i = 1; i < allSeqs.length; i++) {
		if (allSeqs[i][1] > allSeqs[max][1]) {
			max = i;
		}
	}
	return allSeqs[max][2];
}

//find common prefix/suffix
/*function commonPrefix (one, two) {
	var prefix = '';
	while (one !== '' && two !== '' && one.charAt(0) === two.charAt(0)) {
		prefix += one.charAt(0);
		one = one.slice(1);
		two = two.slice(1);
	}
	return prefix;
}*/
function commonSuffix (one, two) {
	var suffix = '';
	while (one !== '' && two !== '' && one.charAt(one.length - 1) === two.charAt(two.length - 1)) {
		suffix = one.charAt(one.length - 1) + suffix;
		one = one.slice(0, -1);
		two = two.slice(0, -1);
	}
	return suffix;
}

function splitWords (text) {
	return text.split(wordSepRe).filter(function (x) {
		return x !== '';
	});
}

function connect (oldWords, newWords, o2n, n2o, oldStart, oldEnd, newStart, newEnd, recursion) {
	if (recursion === 0) {
		return;
	}
	var smallRegion = (oldEnd - oldStart <= config.smallRegion) && (newEnd - newStart <= config.smallRegion),
		allWords = new SimpleMap(),
		i, j,
		lookForStart = true,
		nextOldStart, nextOldEnd, nextNewStart, nextNewEnd;

	function parseWords (words, from, to, conn, which, allWords) { //FIXME bottleneck
		var i, j, wicca0, wjcca0, text, texts, textlength, data;
		fori: for (i = from; i <= to; i++) {
			if (conn[i] !== -1) { //already connected
				continue;
			}
			wicca0 = words[i].charCodeAt(0);
			if (wicca0 === 32 || wicca0 === 13) { //only whitespace
				continue;
			}
			texts = [words[i]];
			textlength = words[i].length; //textlength = text.length;
			if (!smallRegion) {
				j = i + 1;
				while (textlength <= config.tooShort) {
					if (j > to || conn[j] !== -1) {
						continue fori;
					}
					wjcca0 = words[j].charCodeAt(0);
					if (wjcca0 === 32 || wjcca0 === 13) { //only whitespace
						continue fori;
					}
					texts.push(words[j]);
					textlength += words[j].length;
					j++;
				}
			}
			text = texts.join('');
			if (!allWords.has(text)) {
				if (which === 'new') { //not in old text
					continue;
				}
				allWords.set(text, {oldCount: 1, oldPos: i, newCount: 0, newPos: -1});
			} else {
				data = allWords.get(text);
				if (data[which + 'Count'] === 0) {
					data[which + 'Pos'] = i;
				}
				data[which + 'Count']++;
				allWords.set(text, data);
			}
		}
	}

	parseWords(oldWords, oldStart, oldEnd, o2n, 'old', allWords);
	parseWords(newWords, newStart, newEnd, n2o, 'new', allWords);
	if (allWords.size === 0) {
		return;
	}

	//connect unique words
	allWords.forEach(function (data) {
		if (data.oldCount === 1 && data.newCount === 1) {
			o2n[data.oldPos] = data.newPos;
			n2o[data.newPos] = data.oldPos;
		}
	});

	//connect neighbours
	if (o2n[oldStart] === -1 && n2o[newStart] === -1 && oldWords[oldStart] === newWords[newStart]) {
		o2n[oldStart] = newStart;
		n2o[newStart] = oldStart;
	}
	for (i = oldStart; i < oldEnd; i++) { //connect to right until linebreak
		if (
			o2n[i] !== -1 && //connected
			o2n[i + 1] === -1 && //neighbour not connected
			oldWords[i].indexOf('\n') === -1 && //no newline
			n2o[o2n[i] + 1] === -1 && //not connected
			oldWords[i + 1] === newWords[o2n[i] + 1] //equal words
		) {
			o2n[i + 1] = o2n[i] + 1;
			n2o[o2n[i] + 1] = i + 1;
		}
	}
	if (o2n[oldEnd] === -1 && n2o[newEnd] === -1 && oldWords[oldEnd] === newWords[newEnd]) {
		o2n[oldEnd] = newEnd;
		n2o[newEnd] = oldEnd;
	}
	for (i = oldEnd; i > oldStart; i--) { //connect to left
		if (
			o2n[i] !== -1 && //connected
			o2n[i - 1] === -1 && //neighbour not connected
			n2o[o2n[i] - 1] === -1 && //not connected
			oldWords[i - 1] === newWords[o2n[i] - 1] //equal words
		) {
			o2n[i - 1] = o2n[i] - 1;
			n2o[o2n[i] - 1] = i - 1;
		}
	}
	for (i = oldStart; i < oldEnd; i++) { //connect to right
		if (
			o2n[i] !== -1 && //connected
			o2n[i + 1] === -1 && //neighbour not connected
			n2o[o2n[i] + 1] === -1 && //not connected
			oldWords[i + 1] === newWords[o2n[i] + 1] //equal words
		) {
			o2n[i + 1] = o2n[i] + 1;
			n2o[o2n[i] + 1] = i + 1;
		}
	}

	//resolve islands recursively
	fori: for (i = oldStart; i <= oldEnd; i++) {
		if (lookForStart) {
			if (o2n[i] === -1) { //this could be the next oldStart
				nextOldStart = i;
				lookForStart = false;
			}
		} else {
			if (o2n[i] !== -1) {
				nextOldEnd = i - 1;
				lookForStart = true;
				//now we have an unresolved island from nextOldStart to nextOldEnd
				if (nextOldStart + 2 >= nextOldEnd) { //too short to be resolvable
					continue;
				}
				//get the corresponding island in the new text
				if (nextOldStart === oldStart) {
					nextNewStart = newStart;
				} else {
					nextNewStart = o2n[nextOldStart - 1] + 1;
				}
				if (nextOldEnd === oldEnd) {
					nextNewEnd = newEnd;
				} else {
					nextNewEnd = o2n[nextOldEnd + 1] - 1;
				}
				if (nextNewStart + 2 >= nextNewEnd) {
					continue;
				}
				for (j = nextNewStart; j <= nextNewEnd; j++) {
					if (n2o[j] !== -1) {
						continue fori;
					}
				}
				//now we have a coresponding unresolved island from nextNewStart to nextNewEnd
				connect(oldWords, newWords, o2n, n2o, nextOldStart, nextOldEnd, nextNewStart, nextNewEnd, recursion - 1);
			}
		}
	}
}

function getOldBlocks (o2n) {
	var ret = [],
		last = -1, newBlock = true,
		i;
	for (i = 0; i < o2n.length; i++) {
		if (o2n[i] === -1) {
			newBlock = true;
			ret.push(-1);
		} else {
			if (!newBlock && o2n[i - 1] + 1 !== o2n[i]) {
				newBlock = true;
			}
			if (newBlock) {
				newBlock = false;
				last++;
			}
			ret.push(last);
		}
	}
	return ret;
}
function getNewBlocks (n2o, oldBlocks) {
	var ret = [], i;
	for (i = 0; i < n2o.length; i++) {
		if (n2o[i] === -1) {
			ret.push(-1);
		} else {
			ret.push(oldBlocks[n2o[i]]);
		}
	}
	return ret;
}

function getBlockSequence (newBlocks, newChunks) {
	var seq = [], len = [], i, current = -1, lastLength = 0;
	for (i = 0; i < newBlocks.length; i++) {
		if (newBlocks[i] !== -1) {
			if (newBlocks[i] === current) {
				lastLength += newChunks[i].length;
			} else {
				current = newBlocks[i];
				seq.push(current);
				if (lastLength) {
					len.push(lastLength);
				}
				lastLength = newChunks[i].length;
			}
		}
	}
	if (lastLength) {
		len.push(lastLength);
	}
	return [seq, len];
}

function rawDiff (oldChunks, newChunks, noMoves) {
	var i, o2n = [], n2o = [], oldBlocks, newBlocks, blockSeq,
		ret = [],
		result,
		action = '', text = '',
		iOld = 0, iNew = 0,
		commonBlock;

	for (i = 0; i < oldChunks.length; i++) {
		o2n[i] = -1;
	}
	for (i = 0; i < newChunks.length; i++) {
		n2o[i] = -1;
	}
	//connect old and new chunks
	connect(oldChunks, newChunks, o2n, n2o, 0, oldChunks.length - 1, 0, newChunks.length - 1, config.recursion || 1);
	//get the sequence of blocks in the old and new chunks
	oldBlocks = getOldBlocks(o2n);
	newBlocks = getNewBlocks(n2o, oldBlocks);
	result = getBlockSequence(newBlocks, newChunks);
	//longest increasing subsequence = list of blocks that stayed the same
	blockSeq = lis(result[0], result[1]);

	function out (t, a) {
		if (action !== a) {
			if ((noMoves || text.length < config.minMovedLength) && (action.charAt(0) === '.' || action.charAt(0) === ':')) {
				//too short for a move
				action = (action.charAt(0) === '.') ? '+' : '-';
			}
			if (ret.length > 0 && ret[ret.length - 1][1] === action) {
				ret[ret.length - 1][0] += text;
			} else if (action !== '') {
				ret.push([text, action.charAt(0)]);
			}
			action = a;
			text = t;
		} else {
			text += t;
		}
	}

	while (iOld < oldBlocks.length || iNew < newBlocks.length) {
		if (blockSeq.length === 0) {
			commonBlock = -2;
		} else {
			commonBlock = blockSeq[0];
		}
		while (iOld < oldBlocks.length && oldBlocks[iOld] !== commonBlock) {
			out(oldChunks[iOld], oldBlocks[iOld] === -1 ? '-' : ':' + oldBlocks[iOld]);
			iOld++;
		}
		while (iNew < newBlocks.length && newBlocks[iNew] !== commonBlock) {
			out(newChunks[iNew], newBlocks[iNew] === -1 ? '+' : '.' + newBlocks[iNew]);
			iNew++;
		}
		while (iOld < oldBlocks.length && oldBlocks[iOld] === commonBlock) {
			out(oldChunks[iOld], '=');
			iOld++;
			iNew++;
		}
		if (blockSeq.length > 0) {
			blockSeq.shift();
		}
	}

	out('', '');
	return ret;
}

//add numbers to moved blocks
function moveNumbers (diff) {
	var nextNumber = 0, conn = new SimpleMap(), i, text, action;
	for (i = 0; i < diff.length; i++) {
		text = diff[i][0];
		action = diff[i][1];
		if (action === '.' || action === ':') {
			if (!conn.has(text)) {
				conn.set(text, nextNumber++);
			}
			diff[i] = [text, action, conn.get(text)];
		}
	}
	return diff;
}

function nestedDiff (diff) {
	function getDot (n) {
		var i;
		for (i = 0; i < diff.length; i++) {
			if (diff[i][1] === '.' && diff[i][2] === n) {
				return i;
			}
		}
	}

	var i = 0, j, k, freeNumbers = {}, old,
		beginColon, beginDot, endColon, endDot, foundEnd,
		colons, dots;
	while (i < diff.length) {
		if (diff[i][1] === ':') {
			beginColon = i;
			beginDot = getDot(diff[i][2]);
			endColon = beginColon;
			endDot = beginDot;
			foundEnd = false;
			//find sequence of blocks such that all blocks from beginColon to endColon
			//were moved to beginDot to endDot, possibly with insertions/deletions between them
			while (!foundEnd) {
				j = endColon + 1;
				k = endDot + 1;
				if (j < diff.length && diff[j][1] === '-') {
					j++;
				}
				if (k < diff.length && diff[k][1] === '+') {
					k++;
				}
				if (
					j < diff.length && k < diff.length &&
					diff[j][1] === ':' && diff[k][1] === '.' &&
					diff[j][2] === diff[k][2]
				) {
					endColon = j;
					endDot = k;
				} else {
					foundEnd = true;
				}
			}

			if (endColon > beginColon) {
				colons = diff[beginColon][0];
				for (j = beginColon + 1; j <= endColon; j++) {
					if (diff[j][1] === ':') {
						colons += diff[j][0];
						freeNumbers[diff[j][2]] = true;
					}
				}
				dots = [];
				j = beginColon;
				for (k = beginDot; k < endDot; k++) {
					if (diff[k][1] === '.') {
						dots.push([diff[k][0], '=']);
						j++;
						if (diff[j][1] === '-') {
							dots.push([diff[j][0], '-']);
							j++;
						}
					} else { //if diff[k][1] === '+'
						dots.push([diff[k][0], '+']);
					}
				}
				dots[0][1] = '<';
				dots[0][2] = diff[beginColon][2];
				dots.push([diff[endDot][0], '>']);
				diff.splice(beginColon, endColon - beginColon + 1, [colons, ':', dots[0][2]]);
				if (beginColon < beginDot) {
					beginDot -= endColon - beginColon;
					endDot -= endColon - beginColon;
				}
				dots.unshift(beginDot, endDot - beginDot + 1);
				diff.splice.apply(diff, dots);
				if (beginDot < i) {
					i -= endDot - beginDot;
				}
			}
		}
		i++;
	}

	//after merging moved blocks some move numbers are now unused,
	//adapt all numbers to use these missing numbers instead of bigger ones
	for (i = 0; i < diff.length; i++) {
		if (diff[i][1] === ':' || diff[i][1] === '.' || diff[i][1] === '<') {
			old = diff[i][2];
			for (j in freeNumbers) {
				if (hasOwn.call(freeNumbers, j) && j < old) {
					diff[i][2]--;
				}
			}
		}
	}
	return diff;
}

//how strong a character divedes a text
function getStrengthReal (char) {
	if (char === '') {
		return 10;
	}
	if (char === '\n') {
		return 9;
	}
	if (char === ')') {
		return 8;
	}
	if ('>}]'.indexOf(char) > -1) {
		return 7;
	}
	if (char === ' ') {
		return 6;
	}
	if ('[{|!(,/\\.:;<?¡¿–'.indexOf(char) > -1) {
		return 5;
	}
	if ('"\'«»‘’‚‛“”„‟'.indexOf(char) > -1) {
		return 4;
	}
	if (char.search(/[\u0009\u00A0\u2000-\u200B\u2028\u2029\u202F\u205F-\u2061\u2063\u3000\uFEFF]/) > -1) {
		return 3;
	}
	if ('#&*+-_±'.indexOf(char) > -1) {
		return 2;
	}
	if (
		char.search(
			/[0-9\u0041-\u005A\u0061-\u007A\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u1FFF\u2C00-\uD7FF\uF900-\uFE1F\uFE30-\uFFEF]/
		) > -1
	) {
		return 0;
	}
	return 1;
}
function getStrength (char) {
	if (!hasOwn.call(strengthCache, char)) {
		strengthCache[char] = getStrengthReal(char);
	}
	return strengthCache[char];
}

function cleanBreaks (diff) {
	var movedCount = {}, i, count, otherCount, type;

	function shiftcount (index) { //calculate the characters to shift
		if (
			index === 0 || index === diff.length - 1 ||
			diff[index - 1][1] !== '=' || diff[index + 1][1] !== '=' ||
			'-+.:'.indexOf(diff[index][1]) === -1
		) {
			return 0;
		}

		var equality1 = diff[index - 1][0],
			edit = diff[index][0],
			equality2 = diff[index + 1][0],
			//shift as far left as possible
			suffix = commonSuffix(equality1, edit),
			pos, bestPos, bestScore, char, score;
		if (suffix) {
			equality1 = equality1.slice(0, -suffix.length);
			edit = suffix + edit.slice(0, -suffix.length);
			equality2 = suffix + equality2;
		}

		//go right
		pos = -suffix.length;
		bestPos = pos;
		bestScore = getStrength(equality1.charAt(equality1.length - 1));
		while (edit.charAt(0) === equality2.charAt(0)) {
			char = edit.charAt(0);
			pos++;
			equality1 += char;
			edit = edit.slice(1) + char;
			equality2 = equality2.slice(1);
			score = getStrength(char);
			if (equality2 === '') {
				score = getStrength('');
			}
			if (score >= bestScore) {
				bestScore = score;
				bestPos = pos;
			}
		}
		return bestPos;
	}

	function doshift (index, count) {
		if (count === 0) {
			return;
		}
		var text = diff[index - 1][0] + diff[index][0] + diff[index + 1][0];
		diff[index - 1][0] = text.slice(0, diff[index - 1][0].length + count);
		diff[index][0] = text.slice(diff[index - 1][0].length, diff[index - 1][0].length + diff[index][0].length);
		diff[index + 1][0] = text.slice(text.length - diff[index + 1][0].length + count);
	}

	for (i = 1; i < diff.length - 1; i++) {
		count = shiftcount(i);
		if (count === 0) {
			continue;
		}
		type = diff[i][1];
		if (type === '+' || type === '-') {
			doshift(i, count);
		}
		if (type === '.' || type === ':') {
			if (movedCount[diff[i][2]] !== undefined) {
				otherCount = movedCount[diff[i][2]][1];
				if (otherCount * count > 0) { //same direction
					//jscs:disable disallowYodaConditions
					//yes, I shold just update jscs instad
					if (0 < count && otherCount < count) {
						count = otherCount;
					}
					if (0 > count && otherCount > count) {
						count = otherCount;
					}
					//jscs:enable disallowYodaConditions
					doshift(movedCount[diff[i][2]][0], count);
					doshift(i, count);
				}
			} else {
				movedCount[diff[i][2]] = [i, count];
			}
		}
	}
	return diff;
}

function wordDiffQual (diff) {
	var totalLength = 0, blocks = 0, equalLength = 0, equalBlocks = 0, i;
	for (i = 0; i < diff.length; i++) {
		if (diff[i][0] === '') {
			continue;
		}
		totalLength += diff[i][0].length;
		blocks++;
		if (diff[i][1] === '=') {
			equalLength += diff[i][0].length;
			equalBlocks++;
		}
	}
	return (2 * (equalLength / totalLength) + (equalBlocks / blocks)) / 3;
}

function charDiff (diff) {
	var ret = [], i, j, textDel, textIns, pos, /*common,*/ oldChars, newChars, innerDiff;

	function push (arr) {
		if (ret.length && ret[ret.length - 1][1] === arr[1] && '.:<>'.indexOf(arr[1]) === -1) {
			ret[ret.length - 1][0] += arr[0];
		} else {
			ret.push(arr);
		}
	}

	for (i = 0; i < diff.length - 1; i++) {
		if (diff[i][1] === '-' && diff[i + 1][1] === '+') {
			textDel = diff[i][0];
			textIns = diff[i + 1][0];
			//simple cases
			if (textDel.indexOf(textIns) > -1) {
				pos = textDel.indexOf(textIns);
				if (pos !== 0) {
					push([textDel.slice(0, pos), '-']);
				}
				push([textIns, '=']);
				if (pos + textIns.length !== textDel.length) {
					push([textDel.slice(pos + textIns.length), '-']);
				}
			} else if (textIns.indexOf(textDel) > -1) {
				pos = textIns.indexOf(textDel);
				if (pos !== 0) {
					push([textIns.slice(0, pos), '+']);
				}
				push([textDel, '=']);
				if (pos + textDel.length !== textIns.length) {
					push([textIns.slice(pos + textDel.length), '+']);
				}
/*			} else if (textDel.charAt(0) === textIns.charAt(0)) {
				common = commonPrefix(textDel, textIns);
				push([common, '=']);
				push([textDel.slice(common.length), '-']);
				push([textIns.slice(common.length), '+']);
			} else if (textDel.charAt(textDel.length - 1) === textIns.charAt(textIns.length - 1)) {
				common = commonSuffix(textDel, textIns);
				push([textDel.slice(0, textDel.length - common.length), '-']);
				push([textIns.slice(0, textIns.length - common.length), '+']);
				push([common, '=']);
			} else if (suffix of textDel === prefix of textIns) {
				push([textDel.slice(0, textDel.length - common.length), '-']);
				push([common, '=']);
				push([textIns.slice(common.length), '+']);
			} else if (prefix of textDel === suffix of textIns) {
				push([textIns.slice(0, textIns.length - common.length), '+']);
				push([common, '=']);
				push([textDel.slice(common.length), '-']);*/
			} else {
				//diff on character level
				oldChars = textDel.split('');
				newChars = textIns.split('');
				innerDiff = rawDiff(oldChars, newChars, true);
				if (config.wordDiffQual === 0 || config.wordDiffQual <= wordDiffQual(innerDiff)) {
					//good enough to show it to the user?
					for (j = 0; j < innerDiff.length; j++) {
						push(innerDiff[j]);
					}
				} else {
					push(diff[i]);
					push(diff[i + 1]);
				}
			}
			i++;
		} else {
			push(diff[i]);
		}
	}
	if (i === diff.length - 1) {
		push(diff[diff.length - 1]);
	}
	return ret;
}

function doDiff (o, n, nested) {
	//fix newlines
	o = o.replace(/\r\n?/g, '\n');
	n = n.replace(/\r\n?/g, '\n');

	//trivial changes, we do not cancel common pre/suffixes, this doesn't give clean diffs in some circumstances
	if (o === n) {
		return [[o, '=']];
	}
	if (o === '') {
		return [[n, '+']];
	}
	if (n === '') {
		return [[o, '-']];
	}
	if (n.slice(0, o.length) === o) {
		return [[o, '='], [n.slice(o.length), '+']];
	}
	if (o.slice(0, n.length) === n) {
		return [[n, '='], [o.slice(n.length), '-']];
	}

	//split into words
	var oldWords = splitWords(o),
		newWords = splitWords(n),
		diff = rawDiff(oldWords, newWords),
		i;

	diff = moveNumbers(diff);

	if (nested) {
		diff = nestedDiff(diff);
	}

	//clean up
	for (i = 0; i < config.charDiff; i++) {
		diff = charDiff(diff);
	}
	diff = cleanBreaks(diff);

	return diff;
}

function hex (c) {
	return 'U+' + (c.charCodeAt(0) + 0x10000).toString(16).toUpperCase().slice(1);
}

function toHtml (text, nl, invisible, title) {
	var br = title ? '&#10;' : '<br />';
	if (nl) {
		text = text.replace(/^\n/, config.showPar + '\n')
			.replace(/\n\n$/, '\n' + config.showPar + '\n');
	}
	text = htmlEscape(text);
	if (invisible) {
		text = text.replace(invisible, function (c) {
			return config.invisible[c] || '<span title="' + hex(c) + '">▯</span>';
		});
	}
	return text.replace(/^ /, '&nbsp;').replace(/\n /g, br + '&nbsp;').replace(/ {2}/g, ' &nbsp;').replace(/\n/g, br);
}

function getInvisibleRe () {
	var c;
	if (!invisibleRe) {
		invisibleRe = [];
		//*sigh* jshint thinks ['['] before a for loop is an
		//array comprehension only available in ES6, so we
		//can't use the simple obvious way (and if you don't
		//sigh at the start of such a comment it thinks you
		//want to set an option)
		invisibleRe.push('[');
		for (c in config.invisible) {
			if (hasOwn.call(config.invisible, c)) {
				invisibleRe.push(c);
			}
		}
		invisibleRe.push(']');
		invisibleRe = new RegExp(invisibleRe.join(''), 'g');
	}
	return invisibleRe;
}

function getExtract (text, start, end, html) {
	var first, last;
	if (text.length >= config.lengthOmit) {
		first = text.indexOf('\n', config.lengthOmitPar);
		if (first === -1) {
			first = text.indexOf(' ', config.lengthOmitSpace);
		}
		if (first === -1) {
			first = config.lengthOmitOther;
		}
		last = text.lastIndexOf('\n', text.length - config.lengthOmitPar);
		if (last === -1) {
			last = text.lastIndexOf(' ', text.length - config.lengthOmitSpace);
		}
		if (last === -1) {
			last = text.length - config.lengthOmitOther;
		}
		if (first + config.lengthOmitJoin < last) {
			if (start) {
				first = -1;
			}
			if (end) {
				last = text.length;
			}
			text = html ?
				toHtml(text.slice(0, first + 1)) + '<span class="enhanced-diff-omit">…</span>' + toHtml(text.slice(last)) :
				toHtml(text.slice(0, first + 1) + '…' + text.slice(last), false, false, true);
		} else {
			text = toHtml(text, false, false, !html);
		}
	} else {
		text = toHtml(text, false, false, !html);
	}
	return text;
}

function htmlDiff (o, n, nested) {
	//get diff
	var diff = doDiff(o, n, nested),
		out = [],
		d, i, text, action, block,
		moved = {};

	function makeMovedBlockOpen (block) {
		return '<span class="enhanced-diff-moved-to enhanced-diff-block-' + block + '" id="moved-block-' + block + '">';
	}

	for (i = 0; i < diff.length; i++) {
		d = diff[i];
		text = d[0];
		if (text === '') {
			continue;
		}
		action = d[1];
		block = d[2];

		if (action === ':' && config.indicateMoves === 1) {
			text = getExtract(text);
		} else if (action === '=') {
			text = getExtract(text, i === 0, i === diff.length - 1, true);
		} else {
			text = toHtml(text, true, getInvisibleRe());
		}
		switch (action) {
		case '=':
			out.push('<span class="enhanced-diff-equal">' + text + '</span>');
			break;
		case '+':
			out.push('<ins class="enhanced-diff-ins">' + text + '</ins>');
			break;
		case '-':
			out.push('<del class="enhanced-diff-del">' + text + '</del>');
			break;
		case ':':
			if (config.indicateMoves === 1) {
				out.push('<a class="enhanced-diff-moved-from enhanced-diff-block-' + block + '" ' +
					'href="#moved-block-' + block + '" title="' + text + '">' +
					config[moved[block] ? 'movedLeft' : 'movedRight'] + '</a>');
			} else if (config.indicateMoves === 0) {
				out.push('<del class="enhanced-diff-del">' + text + '</del>');
			} else {
				out.push('<del class="enhanced-diff-moved-del">' + text + '</del>');
			}
			break;
		case '.':
			moved[block] = true;
			if (config.indicateMoves === 1) {
				out.push(makeMovedBlockOpen(block) + text + '</span>');
			} else if (config.indicateMoves === 0) {
				out.push('<ins class="enhanced-diff-ins">' + text + '</ins>');
			} else {
				out.push('<ins class="enhanced-diff-moved-ins">' + text + '</ins>');
			}
			break;
		case '<':
			out.push(makeMovedBlockOpen(block) + text);
			break;
		case '>':
			out.push(text + '</span>');
			break;
		}
	}
	return out.join('');
}

function addEvents ($diff, $) {
	$ = $ || jQuery;

	function getOther ($this) {
		var id = $this.attr('href');
		if (id) {
			return $diff.find(id);
		}
		id = $this.attr('id');
		return $diff.find('a[href="#' + id + '"]');
	}

	$diff.find('.enhanced-diff-moved-from, .enhanced-diff-moved-to')
		.on('mouseenter', function () {
			var $this = $(this);
			getOther($this).add($this).addClass('enhanced-diff-moved-hover');
		}).on('mouseleave', function () {
			$diff.find('.enhanced-diff-moved-hover').removeClass('enhanced-diff-moved-hover');
		});
}

function getSet (o) {
	return {
		get: function (key) {
			var result = {}, i;
			if (key === undefined) {
				for (key in o) {
					if (hasOwn.call(o, key)) {
						result[key] = o[key];
					}
				}
				return result;
			}
			if (Array.isArray(key)) {
				for (i = 0; i < key.length; i++) {
					result[key[i]] = o[key[i]];
				}
				return result;
			}
			return o[key];
		},
		set: function (key, val) {
			var k;
			if (val === undefined) {
				for (k in key) {
					if (hasOwn.call(key, k)) {
						o[k] = key[k];
					}
				}
			} else {
				o[key] = val;
			}
		}
	};
}

function addInvisible (char, display) {
	config.invisible[char] = display;
	invisibleRe = false;
}

function setWordSep (sep) {
	wordSepRe = new RegExp('([' + sep + '])', 'g');
}

setWordSep('\\s!-/:-@[-`{-~¡-¿×÷\u2000-\u206F\u3000-\u303F');

expose({
	version: version,
	lis: lis, //exposed for testing only
	SimplePolyfillMap: SimplePolyfillMap, //exposed for testing only
	SimpleMap: SimpleMap, //exposed for testing only
	getCSS: getCSS,
	diff: doDiff,
	htmlDiff: htmlDiff,
	config: getSet(config),
	style: getSet(style),
	addInvisible: addInvisible,
	setWordSep: setWordSep,
	addEvents: addEvents
});

})(this);
//</nowiki>