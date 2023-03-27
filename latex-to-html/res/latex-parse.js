/*global latexParse: true*/
latexParse =
(function () {
"use strict";

var registeredCommands = {},
	registeredEnvironments = {};

function registerCommand (name, parameters) {
	registeredCommands[name] = parameters;
}

function registerEnvironment (name, parameters) {
	registeredEnvironments[name] = parameters;
}

function copyCommand (name0, name1) {
	registeredCommands[name1] = registeredCommands[name0];
}

function copyEnvironment (name0, name1) {
	registeredEnvironments[name1] = registeredEnvironments[name0];
}

function parse (text) {
//virtual indent

var currentPos = 0,
	indexOfCache = {},
	getParameterNode = {};

function throwError (msg) {
	throw new Error(msg + ' Context: ' + text.slice(Math.max(0, currentPos - 100), currentPos + 100));
}

function indexOf (str) {
	var absPos;
	if (!str) {
		return text.length - currentPos;
	}
	absPos = indexOfCache[str];
	if (absPos === undefined || (absPos > -1 && absPos < currentPos)) {
		absPos = text.indexOf(str, currentPos);
		indexOfCache[str] = absPos;
	}
	return absPos === -1 ? -1 : absPos - currentPos;
}

function getSmallestIndex (strs) {
	var min = Infinity, str, i, pos;
	for (i = 0; i < strs.length; i++) {
		pos = indexOf(strs[i]);
		if (pos !== -1 && pos < min) {
			min = pos;
			str = strs[i];
		}
	}
	if (min === Infinity) {
		return indexOf('');
	}
	return min;
}

function getChar (relPos) {
	return text.charAt(currentPos + (relPos || 0));
}

function advance (rel) {
	currentPos += (rel || 1);
}

function read (rel) {
	var str = text.slice(currentPos, currentPos + (rel || 1));
	advance(rel);
	return str;
}

function getEnvironmentParameterTypes (environment) {
	return registeredEnvironments[environment];
}

function getParameterTypes (command) {
	if (command === 'end') {
		return ['raw'];
	}
	if (['par', 'begingroup', 'endgroup'].indexOf(command) > -1) {
		return [];
	}
	return registeredCommands[command] || [];
}

function findParbreak () {
	var end = 1, c, isBreak = false;
	c = getChar(end);
	while ([' ', '\t', '\n'].indexOf(c) !== -1) {
		if (c === '\n') {
			isBreak = true;
		}
		end++;
		c = getChar(end);
	}
	if (!isBreak) {
		return;
	}
	return end;
}

function getCommentNode () {
	var end;
	if (getChar() !== '%') {
		return;
	}
	advance();
	end = indexOf('\n');
	if (end === -1) {
		end = indexOf('');
	} else {
		end++;
		//the spaces on the next line don't really belong to the comment
		//but this makes things easier
		while ([' ', '\t'].indexOf(getChar(end)) > -1) {
			end++;
		}
		if (getChar(end) === '\n') {
			end = indexOf('\n'); //revert, the whitespace forms a parbreak
		}
	}
	return {
		type: 'comment',
		value: read(end)
	};
}

function getAmpSepNode () {
	if (getChar() !== '&') {
		return;
	}
	advance();
	return {
		type: 'separator'
	};
}

function getParCommandNode () {
	var end;
	if (getChar() !== '\n') {
		return;
	}
	end = findParbreak();
	if (!end) {
		return;
	}
	return {
		type: 'command',
		name: 'par',
		parameters: [],
		comments: [],
		whitespace: read(end)
	};
}

function getGroupCommandNode () {
	if (getChar() === '{') {
		advance();
		return {
			type: 'command',
			name: 'begingroup',
			parameters: [],
			comments: [],
			whitespace: ''
		};
	}
	if (getChar() === '}') {
		advance();
		return {
			type: 'command',
			name: 'endgroup',
			parameters: [],
			comments: [],
			whitespace: ''
		};
	}
}

function getMathNode () {
	var mode = '$', math, end = 0, level = 0;
	if (getChar() !== '$') {
		return;
	}
	advance();
	if (getChar() === '$') {
		mode = '$$';
		advance();
	}
	loop: while (true) {
		switch (getChar(end)) {
		case '':
			throwError('Unclosed math');
			break;
		case '\\':
			end++;
			break;
		case '{':
			level++;
			break;
		case '}':
			level--;
			if (level < 0) {
				throwError('Unbalanced brackets');
			}
			break;
		case '%':
			while (['\n', ''].indexOf(getChar(end)) === -1) {
				end++;
			}
			break;
		case '$':
			if (level === 0) {
				break loop;
			}
		}
		end++;
	}
	math = read(end);
	advance();
	if (mode === '$$') {
		if (getChar() !== '$') {
			throwError('Unclosed math');
		}
		advance();
	}
	return {
		type: 'math',
		mode: mode === '$' ? 'math' : 'displaymath',
		content: math
	};
}

getParameterNode.star = function () {
	var hasStar = false;
	if (getChar() === '*') {
		advance();
		hasStar = true;
	}
	return {
		type: 'star',
		present: hasStar
	};
};

getParameterNode.optional = function () {
	var nodes;
	if (getChar() !== '[') {
		return {
			type: 'optional-parameter'
		};
	}
	advance();
	nodes = getNodes(']');
	if (getChar() !== ']') {
		throwError('Unclosed optional parameter');
	}
	advance();
	return {
		type: 'optional-parameter',
		content: nodes
	};
};

getParameterNode.verb = function () {
	var delim = getChar(), end, content;
	if (delim === '{') {
		return getParameterNode.raw();
	}
	advance();
	end = indexOf(delim);
	if (end === -1) {
		throwError('Unclosed parameter');
	}
	content = end ? read(end) : '';
	advance();
	return {
		type: 'raw-parameter',
		content: content
	};
};

getParameterNode.raw = function () {
	var end = 0, level = 0, content;
	if (getChar() !== '{') {
		throwError('Missing parameter');
	}
	advance();
	loop: while (true) {
		switch (getChar(end)) {
		case '':
			throwError('Unclosed parameter');
			break;
		case '{':
			level++;
			break;
		case '}':
			level--;
			if (level < 0) {
				break loop;
			}
		}
		end++;
	}
	content = end ? read(end) : '';
	advance();
	return {
		type: 'raw-parameter',
		content: content
	};
};

getParameterNode.short = function () {
	var token, content = [], level = 0;
	if (getChar() !== '{') {
		token = getTokenNode();
		if (!token) {
			token = {type: 'text', value: read(1)};
		}
		return {
			type: 'short',
			content: [token]
		};
	}
	advance();
	while (level >= 0) {
		token = getNode('');
		if (!token) {
			throwError('Unclosed parameter');
		}
		if (token.type === 'command') {
			if (token.name === 'begingroup') {
				level++;
			} else if (token.name === 'endgroup') {
				level--;
			}
		}
		content.push(token);
	}
	content.pop();
	return {
		type: 'short',
		content: content
	};
};

getParameterNode.long = function () {
	var node = getParameterNode.short();
	node.type = 'long';
	return node;
};

getParameterNode.coords = function () {
	var end, coords;
	if (getChar() !== '(') {
		throwError('Missing parameter');
	}
	advance();
	end = indexOf(')');
	if (end === -1) {
		throwError('Unclosed parameter');
	}
	coords = read(end);
	coords = coords.split(',');
	if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
		throwError('Coords in wrong format');
	}
	advance();
	return {
		type: 'coords',
		x: Number(coords[0]),
		y: Number(coords[1])
	};
};

function getParameterNodes (types) {
	var comments = [], parameters;
	parameters = types.map(function (type) {
		var comment;
		while ((comment = getCommentNode())) { //TODO ignore whitespace, too
			comments.push(comment);
		}
		return getParameterNode[type]();
	});
	return {
		comments: comments,
		parameters: parameters
	};
}

function getEnvironmentNode () {
	var nameAndComments, name, types, parametersAndComments, endcommand, end, content, node, type = 'environment';

	nameAndComments = getParameterNodes(['raw']);
	name = nameAndComments.parameters[0].content;
	types = getEnvironmentParameterTypes(name);
	if (!types) {
		types = getParameterTypes(name);
		parametersAndComments = getParameterNodes(types);
		return {
			type: 'environment-begin',
			name: name,
			parameters: parametersAndComments.parameters,
			comments: nameAndComments.comments.concat(parametersAndComments.comments)
		};
	}
	parametersAndComments = getParameterNodes(types[0]);
	if (types[1] === 'raw' || types[1] === 'math') {
		endcommand = '\\end{' + name + '}';
		end = indexOf(endcommand);
		if (end === -1) {
			throwError('Unclosed environment');
		}
		content = read(end);
		advance(endcommand.length);
		type = 'environment-' + types[1];
	} else {
		content = [];
		while (true) {
			node = getNode('');
			if (!node) {
				throwError('Unclosed environment');
			}
			if (node.type === 'environment-end' && node.name === name) {
				break;
			}
			content.push(node);
		}
	}
	return {
		type: type,
		name: name,
		parameters: parametersAndComments.parameters,
		comments: nameAndComments.comments.concat(parametersAndComments.comments),
		content: content
	};
}

function getCommandNode () {
	function isLetter (c) {
		return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
	}

	var firstChar, end, name, parametersAndComments, whitespace = '';
	if (getChar() !== '\\') {
		return;
	}
	advance();
	firstChar = getChar();
	end = 1;
	if (isLetter(firstChar)) {
		while (isLetter(getChar(end))) {
			end++;
		}
	}
	name = read(end);
	if (name === 'begin') {
		return getEnvironmentNode();
	}
	parametersAndComments = getParameterNodes(getParameterTypes(name));
	if (
		isLetter(firstChar) &&
		parametersAndComments.parameters.filter(function (param) {
			return 'content' in param;
		}).length === 0
	) {
		end = 0;
		while ([' ', '\t'].indexOf(getChar(end)) > -1) {
			end++;
		}
		if (end) {
			whitespace = read(end);
		}
		if (getChar() === '\n' && !findParbreak()) {
			end = 1;
			while ([' ', '\t'].indexOf(getChar(end)) > -1) {
				end++;
			}
			whitespace += read(end);
		}
	}
	if (name === 'end') {
		return {
			type: 'environment-end',
			name: parametersAndComments.parameters[0].content,
			comments: parametersAndComments.comments
		};
	}
	return {
		type: 'command',
		name: name,
		parameters: parametersAndComments.parameters,
		comments: parametersAndComments.comments,
		whitespace: whitespace
	};
}

function getTextNode (until) {
	var end, text = '';
	if (!getChar()) {
		return;
	}
	do {
		end = getSmallestIndex(['%', '&', '\n', '{', '}', '$', '\\', until]);
		if (end === 0) { //this must be '\n', but not a parbreak
			text += read(1);
			end = getSmallestIndex(['%', '&', '\n', '{', '}', '$', '\\', until]);
		}
		if (end !== 0) {
			text += read(end);
		}
	} while (getChar() === '\n' && !findParbreak());
	return {
		type: 'text',
		value: text
	};
}

function getTokenNode () {
	return getAmpSepNode() || getParCommandNode() || getGroupCommandNode() || getMathNode() || getCommandNode();
}

function getNode (until) {
	return getCommentNode() || getTokenNode() || getTextNode(until);
}

function getNodes (until) {
	var nodes = [], node;
	while (getChar() !== until) {
		node = getNode(until);
		if (node) {
			nodes.push(node);
		} else {
			return nodes;
		}
	}
	return nodes;
}

function getDocumentNode () {
	return {
		type: 'document',
		content: getNodes('')
	};
}

return getDocumentNode();

//virtual outdent
}

parse.registerCommand = registerCommand;
parse.registerEnvironment = registerEnvironment;
parse.copyCommand = copyCommand;
parse.copyEnvironment = copyEnvironment;

return parse;
})();