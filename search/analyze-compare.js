/*global analyzeCompare: true*/
/*global PrefixTree*/
analyzeCompare =
(function () {
"use strict";

function analyzeIndex (index) {
	var data = [], result = {}, tree;
	data = index[1].map(function (entry) {
		return {
			path: entry[0][0],
			title: entry[0][1],
			wordCount: entry[1], titleCount: entry[2],
			words: [], titleWords: []
		};
	});
	tree = PrefixTree.fromJSON(index[2]);
	tree.forEach(function (word) {
		tree.get(word).forEach(function (entry) {
			if (entry[1]) {
				data[entry[0]].words.push(word);
			}
			if (entry[2]) {
				data[entry[0]].titleWords.push(word);
			}
		});
	});
	data.forEach(function (entry) {
		result[entry.path] = entry;
		delete result[entry.path].path;
	});
	return result;
}

function compareArrays (oldArray, newArray) {
	var removed = [], added = [];
	oldArray.forEach(function (entry) {
		if (newArray.indexOf(entry) === -1) {
			removed.push(entry);
		}
	});
	newArray.forEach(function (entry) {
		if (oldArray.indexOf(entry) === -1) {
			added.push(entry);
		}
	});
	if (removed.length || added.length) {
		return {removed: removed, added: added};
	}
}

function comparePage (oldPage, newPage) {
	var title, wordCount, titleCount, words, titleWords, diff = {}, hasDiff;
	if (oldPage.title !== newPage.title) {
		title = 'Title changed from "' + oldPage.title + '" to "' + newPage.title + '"';
	}
	wordCount = newPage.wordCount - oldPage.wordCount;
	titleCount = newPage.titleCount - oldPage.titleCount;
	words = compareArrays(oldPage.words, newPage.words);
	titleWords = compareArrays(oldPage.titleWords, newPage.titleWords);
	if (title) {
		diff.title = title;
		hasDiff = true;
	}
	if (wordCount) {
		diff.wordCount = wordCount;
		hasDiff = true;
	}
	if (titleCount) {
		diff.titleCount = titleCount;
		hasDiff = true;
	}
	if (words) {
		diff.words = words;
		hasDiff = true;
	}
	if (titleWords) {
		diff.titleWords = titleWords;
		hasDiff = true;
	}
	if (hasDiff) {
		return diff;
	}
}

function comparePages (oldPages, newPages) {
	var result = {};
	Object.keys(oldPages).forEach(function (path) {
		var oldPage = oldPages[path],
			newPage = newPages[path],
			diff;
		if (!newPage) {
			result[path] = 'removed';
			return;
		}
		diff = comparePage(oldPage, newPage);
		if (diff) {
			result[path] = diff;
		}
	});
	Object.keys(newPages).forEach(function (path) {
		if (!oldPages[path]) {
			result[path] = 'added';
		}
	});
	return result;
}

return {
	analyzeIndex: analyzeIndex,
	comparePages: comparePages
};
})();