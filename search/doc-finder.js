/*global PrefixTree, DocFinder: true*/
DocFinder =
(function () {
"use strict";

function DocFinder (avgLengths, documents, searchIndex, weights, bm25Params) {
	this.avgLengths = avgLengths;
	this.documents = documents;
	this.searchIndex = searchIndex;
	this.weights = weights || avgLengths.map(function () {
		return 1;
	});
	this.bm25Params = bm25Params || {};
	this.bm25Params.k = this.bm25Params.k || 1.2;
	this.bm25Params.b = this.bm25Params.b || 0.7;
	this.bm25Params.d = this.bm25Params.d || 0.5;
}

DocFinder.normalizeWord = function (word) {
	return word.toLowerCase().replace(/[^a-z0-9]+/g, '');
};

DocFinder.isStopword = function (word) {
	var stopWords = [
		'all', 'and', 'are', 'but', 'can', 'for', 'from', 'has', 'have', 'his',
		'may', 'more', 'not', 'one', 'that', 'the', 'then', 'there', 'they',
		'this', 'two', 'was', 'when', 'which', 'who', 'will', 'with', 'would', 'you'
	];
	//return !word;
	return word.length <= 2 || stopWords.indexOf(word) > -1;
};

DocFinder.fromJSON = function (data, weights, bm25Params) {
	return new DocFinder(data[0], data[1], PrefixTree.fromJSON(data[2]), weights, bm25Params);
};

DocFinder.getScore = function (data, params) {
	return Math.log((data.totalCount - data.matchCount + 0.5) / (data.matchCount + 0.5) + 1) *
		(params.d + data.freq * (params.k + 1) /
			(data.freq + params.k * (1 - params.b + params.b * data.fieldLength / data.avgFieldLength))
		);
};

function mergeTerms (a, b) {
	Object.keys(b).forEach(function (key) {
		a[key] = a[key] || 0;
		a[key] += b[key];
	});
	return a;
}

DocFinder.combineOr = function (r0, r1) {
	var r = r0.slice(), i, j;
	fori: for (i = 0; i < r1.length; i++) {
		for (j = 0; j < r0.length; j++) {
			if (r0[j].doc === r1[i].doc) {
				r[j].score += r1[i].score;
				mergeTerms(r[j].terms, r1[i].terms);
				continue fori;
			}
		}
		r.push(r1[i]);
	}
	return r;
};

DocFinder.combineAnd = function (r0, r1) {
	var r = [], i, j;
	fori: for (i = 0; i < r0.length; i++) {
		for (j = 0; j < r1.length; j++) {
			if (r0[i].doc === r1[j].doc) {
				r.push({doc: r0[i].doc, score: r0[i].score + r1[j].score, terms: mergeTerms(r0[i].terms, r1[j].terms)});
				continue fori;
			}
		}
	}
	return r;
};

DocFinder.combineNot = function (r0, r1) {
	var r = [], i, j;
	fori: for (i = 0; i < r0.length; i++) {
		for (j = 0; j < r1.length; j++) {
			if (r0[i].doc === r1[j].doc) {
				continue fori;
			}
		}
		r.push(r0[i]);
	}
	return r;
};

DocFinder.prototype.resultsToScore = function (results, term) {
	return results.map(function (entry) {
		var score = 0, i, terms = {};
		for (i = 1; i < entry.length; i++) {
			if (entry[i]) {
				score += DocFinder.getScore({
					totalCount: this.documents.length,
					matchCount: results.length,
					freq: entry[i],
					fieldLength: this.documents[entry[0]][i],
					avgFieldLength: this.avgLengths[i - 1]
				}, this.bm25Params) * this.weights[i - 1];
			}
		}
		terms[term] = score;
		return {doc: entry[0], score: score, terms: terms};
	}.bind(this));
};

DocFinder.prototype.limitToFieldIndex = function (results, fieldIndex) {
	return results.map(function (entry) {
		var count = entry[fieldIndex];
		return count ? entry.map(function (c, i) {
			return i === 0 || i === fieldIndex ? c : 0;
		}) : null;
	}).filter(function (entry) {
		return entry;
	});
};

DocFinder.prototype.findTerm = function (term, fieldIndex) {
	var results = this.searchIndex.get(term) || [];
	if (fieldIndex) {
		results = this.limitToFieldIndex(results, fieldIndex);
	}
	return this.resultsToScore(results, term);
};

DocFinder.prototype.findTermPrefix = function (prefix, fieldIndex, suffix) {
	var allResults = [], prefixLength = prefix.length;
	if (suffix) {
		prefixLength += suffix.length;
	}
	this.searchIndex.forEachPrefix(prefix, function (term, results) {
		if (suffix && (term.length < prefixLength || !term.endsWith(suffix))) {
			return;
		}
		if (fieldIndex) {
			results = this.limitToFieldIndex(results, fieldIndex);
		}
		this.resultsToScore(results, term).forEach(function (result) {
			var i;
			result.score *= term.length / (term.length + 0.3 * (term.length - prefixLength));
			for (i = 0; i < allResults.length; i++) {
				if (allResults[i].doc === result.doc) {
					allResults[i].score += result.score;
					allResults[i].terms[term] = allResults[i].terms[term] || 0;
					allResults[i].terms[term] += result.score;
					return;
				}
			}
			allResults.push(result);
		});
	}.bind(this));
	return allResults;
};

DocFinder.prototype.findTermFuzzy = function (term, fieldIndex, maxRelDist, maxDist) {
	var allResults = [];
	this.searchIndex.findFuzzy(term, Math.min(Math.floor(maxRelDist * term.length), maxDist)).forEach(function (entry) {
		var term = entry[0], results = entry[1];
		if (fieldIndex) {
			results = this.limitToFieldIndex(results, fieldIndex);
		}
		this.resultsToScore(results, term).forEach(function (result) {
			var i;
			result.score *= term.length / (term.length + entry[2]);
			for (i = 0; i < allResults.length; i++) {
				if (allResults[i].doc === result.doc) {
					allResults[i].score += result.score;
					allResults[i].terms[term] = allResults[i].terms[term] || 0;
					allResults[i].terms[term] += result.score;
					return;
				}
			}
			allResults.push(result);
		});
	}.bind(this));
	return allResults;
};

DocFinder.prototype.execSimpleQuery = function (query) {
	if (query.prefix) {
		return this.findTermPrefix(query.term, query.fieldIndex, query.suffix);
	}
	if (query.fuzzy) {
		return this.findTermFuzzy(query.term, query.fieldIndex, query.fuzzy[0], query.fuzzy[1]);
	}
	return this.findTerm(query.term, query.fieldIndex);
};

DocFinder.prototype.execComplexQuery = function (query) {
	if (query.term) {
		return this.execSimpleQuery(query);
	}
	return query.subqueries.map(this.execComplexQuery.bind(this)).reduce(function (total, current, i) {
		switch (query.combine[i - 1]) {
		case 'AND': return DocFinder.combineAnd(total, current);
		case 'OR': return DocFinder.combineOr(total, current);
		case 'NOT': return DocFinder.combineNot(total, current);
		}
	});
};

DocFinder.prototype.parseSimpleQuery = function (query, options, fieldIndex) {
	var mode, ast, suffix;
	ast = query.indexOf('*');
	if (query.charAt(0) === '"' && query.charAt(query.length - 1) === '"') {
		mode = 'exact';
		query = query.slice(1, -1);
	} else if (query.charAt(query.length - 1) === '~') {
		mode = 'fuzzy';
		query = query.slice(0, -1);
	} else if (ast > -1 && ast === query.lastIndexOf('*')) {
		mode = 'prefix';
		suffix = DocFinder.normalizeWord(query.slice(ast + 1));
		query = query.slice(0, ast);
	} else if (options.fuzzy) {
		mode = 'fuzzy';
	} else if (options.prefix) {
		mode = 'prefix';
	} else {
		mode = 'exact';
	}
	query = DocFinder.normalizeWord(query);
	if (mode === 'exact' && DocFinder.isStopword(query)) {
		return null;
	}
	if (!query) {
		return null;
	}
	return {
		term: query,
		fieldIndex: fieldIndex || options.fieldIndex,
		prefix: mode === 'prefix',
		suffix: suffix,
		fuzzy: mode === 'fuzzy' ? [0.3, 3] : false
	};
};

DocFinder.prototype.parseComplexQuery = function (query, options, globalFieldPrefix) {
	var combine, fieldPrefix, result = {subqueries: [], combine: []};

	function findParenthesis (query) {
		var start, open, close, level;
		start = query.indexOf('(');
		if (start === -1) {
			return [-1, -1];
		}
		open = query.indexOf('(', start + 1);
		close = query.indexOf(')', start + 1);
		level = 1;
		while (true) {
			if (close === -1) {
				return [start, -1];
			}
			if (open !== -1 && open < close) {
				level++;
				open = query.indexOf('(', open + 1);
			} else {
				if (level === 1) {
					return [start, close];
				}
				level--;
				close = query.indexOf(')', close + 1);
			}
		}
	}

	function split (query) {
		var parenthesis = findParenthesis(query), result;
		if (parenthesis[0] === -1) {
			return query.split(/\s+/);
		}
		result = query.slice(0, parenthesis[0]).split(/\s+/);
		if (parenthesis[1] === -1) {
			result.push(query.slice(parenthesis[0]) + ')');
		} else {
			result.push(query.slice(parenthesis[0], parenthesis[1] + 1));
			result = result.concat(split(query.slice(parenthesis[1] + 1)));
		}
		return result;
	}

	split(query).forEach(function (term) {
		var pos, field, subquery;
		if (['AND', 'OR', 'NOT'].indexOf(term) > -1) {
			combine = term;
			return;
		}
		if (term.charAt(0) === '-') {
			combine = 'NOT';
			term = term.slice(1);
		}
		if (options.fields) {
			pos = term.indexOf(':');
			if (pos > -1) {
				field = term.slice(0, pos);
				if (options.fields[field]) {
					fieldPrefix = options.fields[field];
					term = term.slice(pos + 1);
				}
			}
		}
		if (!term) {
			return;
		}
		if (term.charAt(0) === '(' && term.charAt(term.length - 1) === ')') {
			subquery = this.parseComplexQuery(term.slice(1, -1), options, fieldPrefix || globalFieldPrefix);
		} else {
			subquery = this.parseSimpleQuery(term, options, fieldPrefix || globalFieldPrefix);
		}
		if (subquery) {
			if (result.subqueries.length) {
				result.combine.push(combine || options.combine || 'AND');
			}
			result.subqueries.push(subquery);
		}
		combine = '';
		fieldPrefix = 0;
	}.bind(this));
	return result.subqueries.length ? result : null;
};

DocFinder.prototype.search = function (query, options) {
	var results;
	query = this.parseComplexQuery(query, options || {});
	if (!query) {
		return [];
	}
	results = this.execComplexQuery(query);

	results.sort(function (a, b) {
		return b.score - a.score;
	});
	return results.map(function (result) {
		var terms = Object.keys(result.terms);
		terms.sort(function (a, b) {
			return result.terms[b] - result.terms[a];
		});
		return {
			data: this.documents[result.doc][0],
			score: result.score,
			terms: terms
		};
	}.bind(this));
};

DocFinder.prototype.suggest = function (query, minLength) {
	var suggestions = [],
		spacePos = query.lastIndexOf(' '),
		prefix = DocFinder.normalizeWord(query.slice(spacePos + 1));
	if (prefix.length <= (minLength || 2)) {
		return [];
	}
	this.searchIndex.forEachPrefix(prefix, function (term, results) {
		suggestions.push([query + term.slice(prefix.length), results.length]);
	});
	suggestions.sort(function (a, b) {
		return b[1] - a[1];
	});
	return suggestions.map(function (suggestion) {
		return suggestion[0];
	});
};

return DocFinder;
})();