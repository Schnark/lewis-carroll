/*global PrefixTree: true*/
PrefixTree =
(function () {
"use strict";

//polyfill (not complete, optional parameter is missing, but we don't need it)
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (str) {
		return this.slice(0, str.length) === str;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (str) {
		return this.slice(-str.length) === str;
	};
}

function commonPrefix (a, b) {
	var i = 0;
	while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) {
		i++;
	}
	return a.slice(0, i);
}

function PrefixTree () {
	this.data = [];
	this.children = {};
}

PrefixTree.fromJSON = function (data) {
	var node = new PrefixTree();
	if (Array.isArray(data)) {
		node.data = data;
	} else {
		Object.keys(data).forEach(function (key) {
			if (key === '') {
				node.data = data[key];
			} else {
				node.children[key] = PrefixTree.fromJSON(data[key]);
			}
		});
	}
	return node;
};

PrefixTree.prototype.toJSON = function () {
	var children = Object.keys(this.children), result;
	if (children.length === 0) {
		return this.data;
	}
	if (this.data.length) {
		children.push('');
	}
	children.sort();
	result = {};
	children.forEach(function (key) {
		result[key] = key ? this.children[key].toJSON() : this.data;
	}.bind(this));
	return result;
};

PrefixTree.prototype.findNode = function (key) {
	var i, children;
	if (!key) {
		return [this, '', ''];
	}
	children = Object.keys(this.children);
	for (i = 0; i < children.length; i++) {
		if (key.startsWith(children[i])) {
			return this.children[children[i]].findNode(key.slice(children[i].length));
		}
		if (key.charAt(0) === children[i].charAt(0)) {
			return [this, key, children[i]];
		}
	}
	return [this, key, ''];
};

PrefixTree.prototype.forEach = function (callback, prefix) {
	var children = Object.keys(this.children);
	prefix = prefix || '';
	if (this.data.length) {
		callback(prefix, this.data);
	}
	children.sort();
	children.forEach(function (key) {
		this.children[key].forEach(callback, prefix + key);
	}.bind(this));
};

PrefixTree.prototype.forEachPrefix = function (prefix, callback) {
	var start = this.findNode(prefix);
	if (!start[1] && !start[2]) {
		start[0].forEach(callback, prefix);
	} else if (start[2].startsWith(start[1])) {
		start[0].children[start[2]].forEach(callback, prefix.slice(0, -start[1].length) + start[2]);
	}
};

PrefixTree.prototype.get = function (key) {
	var node = this.findNode(key);
	if (!node[1] && !node[2] && node[0].data.length) {
		return node[0].data;
	}
	return null;
};

PrefixTree.prototype.add = function (key, data) {
	var node = this.findNode(key), prefix, old;
	if (!node[1] && !node[2]) {
		node[0].data.push(data);
	} else if (!node[2]) {
		node[0].children[node[1]] = new PrefixTree();
		node[0].children[node[1]].data.push(data);
	} else {
		prefix = commonPrefix(node[1], node[2]);
		old = node[0].children[node[2]];
		delete node[0].children[node[2]];
		node[0].children[prefix] = new PrefixTree();
		node[0].children[prefix].children[node[2].slice(prefix.length)] = old;
		if (node[1] === prefix) {
			node[0].children[prefix].data.push(data);
		} else {
			node[0].children[prefix].children[node[1].slice(prefix.length)] = new PrefixTree();
			node[0].children[prefix].children[node[1].slice(prefix.length)].data.push(data);
		}
	}
};

//the next two methods are taken more or less unchanged from
//MiniSearch by Luca Ongaro (https://github.com/lucaong/minisearch)
PrefixTree.prototype.findFuzzy = function (term, maxDist) {
	var results = [],
		n = term.length + 1,
		m = n + maxDist,
		matrix = [],
		i;
	for (i = 0; i < m * n; i++) {
		if (i < n) {
			matrix[i] = i;
		} else if (i % n === 0) {
			matrix[i] = i / n;
		} else {
			matrix[i] = maxDist + 1;
		}
	}
	this.fuzzyRecurse(term, maxDist, results, matrix, 1, n, '');
	return results;
};

PrefixTree.prototype.fuzzyRecurse = function (term, maxDist, results, matrix, m, n, prefix) {
	var offset = m * n,
		d;
	if (this.data) {
		d = matrix[offset - 1];
		if (d <= maxDist) {
			results.push([prefix, this.data, d]);
		}
	}
	Object.keys(this.children).forEach(function (key) {
		var i = m,
			pos, c, thisRowOffset, prevRowOffset, minDist, j, jMin, jMax, rpl, del, ins, d;
		for (pos = 0; pos < key.length; pos++, i++) {
			c = key.charAt(pos);
			thisRowOffset = n * i;
			prevRowOffset = thisRowOffset - n;
			minDist = matrix[thisRowOffset];
			jMin = Math.max(0, i - maxDist - 1);
			jMax = Math.min(n - 1, i + maxDist);
			for (j = jMin; j < jMax; j++) {
				rpl = matrix[prevRowOffset + j] + (c !== term.charAt(j) ? 1 : 0);
				del = matrix[prevRowOffset + j + 1] + 1;
				ins = matrix[thisRowOffset + j] + 1;
				d = Math.min(rpl, del, ins);
				matrix[thisRowOffset + j + 1] = d;
				if (d < minDist) {
					minDist = d;
				}
			}
			if (minDist > maxDist) {
				return;
			}
		}
		this.children[key].fuzzyRecurse(term, maxDist, results, matrix, i, n, prefix + key);
	}.bind(this));
};

return PrefixTree;
})();