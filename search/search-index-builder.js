/*global PrefixTree, SearchIndexBuilder: true*/
SearchIndexBuilder =
(function () {
"use strict";

function getZeroArray (n) {
	var a = [], i;
	for (i = 0; i < n; i++) {
		a.push(0);
	}
	return a;
}

function SearchIndexBuilder (storeFields, searchFields) {
	this.storeFields = storeFields;
	this.searchFields = searchFields;
	this.totalLengths = getZeroArray(searchFields.length);
	this.documents = [];
	this.searchIndex = new PrefixTree();
}

SearchIndexBuilder.split = function (text) {
	return text.replace(/—/g, ' ').split(/\s+/);
};

SearchIndexBuilder.normalizeWord = function (word) {
	return word.toLowerCase().replace(/[^a-z0-9]+/g, '');
};

SearchIndexBuilder.isStopword = function (word) {
	var stopWords = [
		'all', 'and', 'are', 'but', 'can', 'for', 'from', 'has', 'have', 'his',
		'may', 'more', 'not', 'one', 'that', 'the', 'then', 'there', 'they',
		'this', 'two', 'was', 'when', 'which', 'who', 'will', 'with', 'would', 'you'
	];
	//return !word;
	return word.length <= 2 || stopWords.indexOf(word) > -1;
};

SearchIndexBuilder.prototype.toJSON = function () {
	var c = this.documents.length;
	return [
		this.totalLengths.map(function (n) {
			return n / c;
		}),
		this.documents,
		this.searchIndex
	];
};

SearchIndexBuilder.prototype.addDocument = function (doc) {
	var searchFields = this.searchFields.map(function (name) {
		return SearchIndexBuilder.split(doc[name])
			.map(SearchIndexBuilder.normalizeWord)
			.filter(function (word) {
				return !SearchIndexBuilder.isStopword(word);
			});
	}), searchFieldsLenghts = searchFields.map(function (terms) {
		return terms.length;
	}), storeFields = this.storeFields.map(function (name) {
		return doc[name];
	}), i, docNumber, allTerms = {};
	for (i = 0; i < searchFieldsLenghts.length; i++) {
		this.totalLengths[i] += searchFieldsLenghts[i];
	}
	docNumber = this.documents.length;
	searchFieldsLenghts.unshift(storeFields);
	this.documents.push(searchFieldsLenghts);
	searchFields.forEach(function (terms, i) {
		terms.forEach(function (term) {
			if (!(term in allTerms)) {
				allTerms[term] = getZeroArray(searchFields.length);
			}
			allTerms[term][i]++;
		});
	});
	Object.keys(allTerms).forEach(function (term) {
		var data = allTerms[term];
		data.unshift(docNumber);
		while (data[data.length - 1] === 0) {
			data.pop();
		}
		this.searchIndex.add(term, data);
	}.bind(this));
};

return SearchIndexBuilder;
})();