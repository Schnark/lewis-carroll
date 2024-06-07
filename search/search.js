/*global DocFinder*/
(function () {
"use strict";

var debounce, docFinder, autoExec;

function htmlEscape (str) {
	return str
		.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
		.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function loadIndex (path, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path);
	xhr.responseType = 'text';
	xhr.onload = function () {
		callback(DocFinder.fromJSON(JSON.parse(xhr.response), [1, 1.5]));
	};
	xhr.send();
}

function formatResult (result) {
	return result.map(function (entry) {
		var path = entry.data[0], title = entry.data[1];
		return '<li><a href="../' + path + '">' + title + '</a> <small>(Score: ' +
			Math.round(5 * entry.score) + '; ' + htmlEscape(entry.terms.join(', ')) + ')</small></li>';
	}).join('');
}

function getOptions () {
	return {
		or: document.getElementById('option-or').checked,
		prefix: document.getElementById('option-prefix').checked,
		fuzzy: document.getElementById('option-fuzzy').checked,
		title: document.getElementById('option-title').checked
	};
}

function runSearch (e) {
	var query = document.getElementById('search-input').value,
		options = getOptions(),
		params, result, count;
	if (e) {
		e.preventDefault();
		params = 'q=' + encodeURIComponent(query);
		if (options.or) {
			params += '&combine=OR';
		}
		if (options.prefix) {
			params += '&mode=prefix';
		} else if (options.fuzzy) {
			params += '&mode=fuzzy';
		}
		if (options.title) {
			params += '&titleOnly=1';
		}
		history.pushState({}, '', '?' + params);
	}
	document.title = 'Search: ' + query + ' | The (almost really) Complete Works of Lewis Carroll';
	result = docFinder.search(query, {
		combine: options.or ? 'OR' : 'AND',
		prefix: options.prefix,
		fuzzy: options.fuzzy,
		fieldIndex: options.title ? 2 : undefined,
		fields: {
			text: 1,
			content: 1,
			title: 2
		}
	});
	switch (result.length) {
	case 0:
		count = 'No results';
		break;
	case 1:
		count = '<b>1</b> result';
		break;
	default:
		count = '<b>' + result.length + '</b> results';
	}
	document.getElementById('result-count').innerHTML = count;
	document.getElementById('results').innerHTML = formatResult(result);
}

function showSuggestions () {
	if (debounce) {
		clearTimeout(debounce);
	}
	debounce = setTimeout(reallyShowSuggestions, 50);
	//document.getElementById('suggestions').innerHTML = '';
}

function reallyShowSuggestions () {
	var query = document.getElementById('search-input').value,
		suggestions = docFinder.suggest(query);
	if (suggestions.length > 5) {
		suggestions.length = 5;
	}
	suggestions = suggestions.map(function (suggestion) {
		return '<option value="' + htmlEscape(suggestion + ' ') + '"></option>';
	});
	document.getElementById('suggestions').innerHTML = suggestions.join('');
}

function getUrlParam (name) {
	var params = location.search.slice(1).split('&').filter(function (str) {
		return str.startsWith(name + '=');
	}), param;
	if (!params.length) {
		return '';
	}
	param = params[params.length - 1].slice(name.length + 1);
	try {
		param = decodeURIComponent(param.replace(/\+/g, '%20'));
	} catch (e) {
	}
	return param;
}

function restoreOptions () {
	var mode, titleOnly;
	if (getUrlParam('combine') === 'OR') {
		document.getElementById('option-or').checked = true;
	}
	mode = getUrlParam('mode');
	if (mode === 'prefix') {
		document.getElementById('option-prefix').checked = true;
	} else if (mode === 'fuzzy') {
		document.getElementById('option-fuzzy').checked = true;
	}
	titleOnly = getUrlParam('titleOnly');
	if (titleOnly && titleOnly !== '0') {
		document.getElementById('option-title').checked = true;
	}
}

function init () {
	var search = getUrlParam('q'), input;
	input = document.getElementById('search-input');
	input.value = search;
	restoreOptions();
	if (!search) {
		document.title = 'Search | The (almost really) Complete Works of Lewis Carroll';
		document.getElementById('result-count').innerHTML = '';
		document.getElementById('results').innerHTML = '';
		input.focus();
	} else if (docFinder) {
		runSearch();
	} else {
		document.getElementById('result-count').innerHTML = 'Please wait …';
		autoExec = true;
	}
}

window.addEventListener('popstate', init, false);

init();

loadIndex('../search-index.json', function (result) {
	docFinder = result;
	document.getElementById('search-form').addEventListener('submit', runSearch, false);
	document.getElementById('search-input').addEventListener('input', showSuggestions, false);
	if (autoExec) {
		runSearch();
	}
});

})();