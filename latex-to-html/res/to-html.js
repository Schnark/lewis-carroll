/*global toHtml: true*/
/*global TeXZilla, console*/
toHtml =
(function () {
"use strict";

var registeredCommands = {},
	registeredEnvironments = {},
	ligatures = {},
	ligaturesRe,
	environments = [''],
	mathFixCallbacks = [],
	atEndCallbacks = [],
	fixupCallbacks = [],
	showWarning = function (warning) {
		console.warn(warning);
	};

function warn (warning) {
	showWarning(warning);
}

function registerCommand (name, callback) {
	registeredCommands[name] = callback;
}

function registerEnvironment (name, callback) {
	registeredEnvironments[name] = callback;
}

function copyCommand (name0, name1) {
	registeredCommands[name1] = registeredCommands[name0];
}

function copyEnvironment (name0, name1) {
	registeredEnvironments[name1] = registeredEnvironments[name0];
}

function escapeRe (str) {
	return str.replace(/([\\{}()|.?*+\-\^$\[\]])/g, '\\$1');
}

function escapeHtml (str) {
	return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
		.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getLigaturesRe () {
	var from;
	if (!ligaturesRe) {
		from = Object.keys(ligatures);
		from.sort(function (a, b) {
			return b.length - a.length;
		});
		ligaturesRe = new RegExp(from.map(escapeRe).join('|'), 'g');
	}
	return ligaturesRe;
}

function addLigature (from, to) {
	ligatures[escapeHtml(from)] = to;
	ligaturesRe = false;
}

function textToHtml (text) {
	return text.replace(getLigaturesRe(), function (from) {
		return ligatures[from];
	});
}

function commandToHtml (name, parameters, whitespace, ignoreMissing) {
	if (!registeredCommands[name]) {
		if (ignoreMissing) {
			return '';
		}
		warn('Command \\' + name + ' not defined!');
		return '<!--Command \\' + name + ' not defined!-->';
	}
	if (parameters.length === 0) {
		parameters = [whitespace || ''];
	}
	return registeredCommands[name].apply(null, parameters);
}

function environmentToHtml (name, parameters, content) {
	var result;
	if (!registeredEnvironments[name]) { //should not happen
		warn('Environment ' + name + ' not defined!');
		if (Array.isArray(content)) {
			content = content.join('');
		}
		result = '\n<!--Environment ' + name + ' not defined!-->' + content;
	} else {
		if (Array.isArray(content) && !registeredEnvironments[name].separated) {
			content = content.join('');
		}
		parameters.push(content);
		result = registeredEnvironments[name].apply(null, parameters);
	}
	if (typeof result === 'string') {
		result = stringWithProps(result, {mode: 'block-cont'});
	}
	return result;
}

function mathToHtml (math, mode) {
	mathFixCallbacks.forEach(function (callback) {
		math = callback(math, mode);
	});
	math = math.replace(/\\not>/g, '≯').replace(/\\not</g, '≮');
	if (mode !== 'math' && ['.', ',', ';'].indexOf(math.slice(-1)) > -1) {
		math = math.slice(0, -1) + '\\text{' + math.slice(-1) + '}';
	}
	if (['align', 'align*'].indexOf(mode) > -1) {
		math = '\\begin{array}{rl}' + math + '\\end{array}';
	}
	math = math.replace(/\\text\{[^{}]+\}/g, function (text) {
		return text.replace(/\\ /g, ' ').replace(/\\,/g, '&thinsp;');
	});
	try {
		math = TeXZilla.toMathMLString(math, mode !== 'math', false, true);
		math = math.replace(/&amp;thinsp;/g, '&thinsp;');
		math = math.replace(/<undefined\/>/g, ''); //happens for \left. etc.
		math = math.replace(/<annotation encoding="TeX">[\s\S]*<\/annotation>/, '').replace(/<\/?semantics>/g, '');
		math = math.replace(' xmlns="http://www.w3.org/1998/Math/MathML"', '');
		math = math.replace(/<math><mo>([^<]+)<\/mo><\/math>/, '$1'); //just a single operator
		math = math.replace(/<math>(?:<mrow>)?(?:<mo>([+−])<\/mo>)?<mn>([^<]+)<\/mn>(?:<\/mrow>)?<\/math>/, '$1$2'); //just a number
		math = math.replace(/<math><mi>(.)<\/mi><\/math>/, '<var>$1</var>'); //just a single one-letter variable
		return math;
	} catch (e) {
		return '<math' + (mode !== 'math' ? ' display="block"' : '') + '>' +
			'<merror><mtext>' + escapeHtml(math) + '</mtext></merror></math>';
	}
/*
	if (mode === 'math') {
		return '<code>' + escapeHtml(math) + '</code>';
	}
	return stringWithProps('<pre>' + escapeHtml(math) + '</pre>', {mode: 'block-cont'});
*/
}

function commentToHtml (comment) {
	comment = comment.replace(/\n$/, '').replace(/--/g, '- -');
	return stringWithProps('<!--' + comment + '-->', {mode: 'any', indent: 'any'});
}

function arrayToSeparatedParagraphs (array) {
	var current = [], result = [];
	array.forEach(function (el) {
		if (el.separator) {
			if (current.length) {
				result.push(arrayToParagraphs(current));
				current = [];
			}
			result.push(el);
		} else {
			current.push(el);
		}
	});
	if (current.length) {
		result.push(arrayToParagraphs(current));
	}
	return result;
}

function arrayToParagraphs (array) {
	var par = false, indent = 0, continuePar = false, afterPar = [], opening = [''], closing = [''];
	return array.map(function (el) {
		var str = String(el),
			mode = el.mode || (!str.trim() ? 'any' : 'inline'),
			pre = '';

		switch (el.group) {
		case 'open':
			opening.push('');
			closing.unshift('');
			return '';
		case 'close':
			opening.pop();
			pre = closing.shift();
			return par ? pre : '';
		case 'add':
			opening[opening.length - 1] += el.open;
			closing[0] = el.close + closing[0];
			return par ? el.open : '';
		}

		if (el.afterPar) {
			if (par || str) {
				afterPar.push(el.afterPar);
			} else {
				str = el.afterPar;
				mode = 'block';
			}
		}

		if ((mode === 'block' || mode === 'block-cont') && par) {
			pre = closing.join('') + '</p>' + afterPar.join('');
			afterPar = [];
			par = false;
			if (mode === 'block-cont') {
				str = '<div class="continue">' + str + '</div>';
			}
		} else if (mode === 'inline' && !par) {
			pre = continuePar ? '<p class="continue">' : ['<p>', '<p class="noindent">', '<p class="indent">'][indent];
			if (str.charAt(0) === '\n') {
				pre = '\n' + pre;
				str = str.slice(1);
			}
			pre += opening.join('');
			par = true;
		}

		if (!par && afterPar.length) {
			str += afterPar.join('');
			afterPar = [];
		}

		if (el.indent === 'yes') {
			indent = 2;
		} else if (el.indent === 'no') {
			indent = 1;
		} else if (el.indent !== 'any') {
			indent = 0;
		}
		if (mode === 'block-cont') {
			continuePar = true;
		} else {
			continuePar = false;
		}
		return pre + str;
	}).join('') + (par ? closing.join('') + '</p>' + afterPar.join('') : '');
}

function stringWithProps (str, props) {
	props.toString = function () {
		return str;
	};
	return props;
}

function nodesToHtml (nodes) {
	var result = [];
	nodes.forEach(function (node) {
		var html = nodeToHtml(node);
		if (Array.isArray(html)) {
			result = result.concat(html);
		} else {
			result.push(html);
		}
	});
	return result;
}

function join (array) {
	var afterPar = array.map(function (str) {
		return str.afterPar;
	}).filter(function (afterPar) {
		return afterPar;
	}).join(''),
	text = array.join('');
	if (afterPar) {
		text = stringWithProps(text, {afterPar: afterPar});
	}
	return text;
}

function nodeToHtml (node) {
	var html;
	switch (node.type) {
	case 'text':
		return textToHtml(escapeHtml(node.value));
	case 'separator':
		return stringWithProps('', {separator: 'col'});
	case 'command':
		return [nodesToHtml(node.comments).join(''), commandToHtml(node.name, nodesToHtml(node.parameters), node.whitespace)];
	case 'comment':
		return commentToHtml(node.value);
	case 'environment-raw':
		return [
			nodesToHtml(node.comments).join(''),
			environmentToHtml(node.name, nodesToHtml(node.parameters), escapeHtml(node.content))
		];
	case 'environment-math':
		return [
			nodesToHtml(node.comments).join(''),
			mathToHtml(node.content, node.name, nodesToHtml(node.parameters))
		];
	case 'environment':
		environments.unshift(node.name);
		html = environmentToHtml(
			node.name, nodesToHtml(node.parameters),
			arrayToSeparatedParagraphs(nodesToHtml(node.content))
		);
		environments.shift();
		return [nodesToHtml(node.comments).join(''), html];
	case 'environment-begin':
		return [commandToHtml('begingroup', [], ''), commandToHtml(node.name, nodesToHtml(node.parameters), '')];
	case 'environment-end':
		return [commandToHtml('end' + node.name, [], '', true), commandToHtml('endgroup', [], '')];
	case 'star':
		return node.present;
	case 'optional-parameter':
		return node.content && join(nodesToHtml(node.content));
	case 'raw-parameter':
		return escapeHtml(node.content);
	case 'short':
		return join(nodesToHtml(node.content));
	case 'coords':
		return node;
	case 'document':
		html = arrayToParagraphs(nodesToHtml(node.content));
		html += atEndCallbacks.map(function (callback) {
			return callback();
		}).join('');
		fixupCallbacks.forEach(function (callback) {
			html = callback(html);
		});
		return html;
	case 'long':
		return arrayToParagraphs(nodesToHtml(node.content));
	case 'math':
		return mathToHtml(node.content, node.mode);
	}
}

nodeToHtml.warn = warn;
nodeToHtml.registerCommand = registerCommand;
nodeToHtml.registerEnvironment = registerEnvironment;
nodeToHtml.copyCommand = copyCommand;
nodeToHtml.copyEnvironment = copyEnvironment;
nodeToHtml.addLigature = addLigature;
nodeToHtml.stringWithProps = stringWithProps;
nodeToHtml.currentEnvironment = function () {
	return environments[0];
};
nodeToHtml.fixMath = function (callback) {
	mathFixCallbacks.push(callback);
};
nodeToHtml.atEnd = function (callback) {
	atEndCallbacks.push(callback);
};
nodeToHtml.fixup = function (callback) {
	fixupCallbacks.push(callback);
};
nodeToHtml.setWarnCallback = function (callback) {
	showWarning = callback;
};

return nodeToHtml;
})();