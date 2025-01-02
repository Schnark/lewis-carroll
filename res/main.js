//Math rendering
(function () {
"use strict";

function hasMath () {
	return !!document.body.getElementsByTagName('math').length ||
		!!document.body.getElementsByTagNameNS('http://www.w3.org/1998/Math/MathML', 'math').length;
}

function supportsMath () {
	var div = document.createElement('div'), box;
	div.setAttribute(
		'style',
		'border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; ' +
			'overflow: hidden; padding: 0; position: absolute; width: 1px;'
	);
	div.innerHTML = '<math><mspace height="23px" width="77px"></mspace></math>';
	document.body.appendChild(div);
	box = div.firstChild.firstChild.getBoundingClientRect();
	document.body.removeChild(div);
	return Math.abs(box.height - 23) <= 1 && Math.abs(box.width - 77) <= 1;
}

function getResPath () {
	var links = document.getElementsByTagName('link'), i;
	for (i = 0; i < links.length; i++) {
		if (links[i].rel === 'stylesheet') {
			return links[i].href.replace(/\/[^\/]+$/, '/');
		}
	}
	return '';
}

function loadCSS (url) {
	var link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.head.appendChild(link);
}

if (hasMath() && !supportsMath()) {
	loadCSS(getResPath() + 'mathml.css');
}
})();

//Annotations
(function () {
"use strict";

var active = document.getElementsByClassName('annotated'),
	i,
	visibleAnnotation,
	visibleAnnotationId;

function hideAnnotation () {
	var id = visibleAnnotationId;
	if (visibleAnnotation) {
		visibleAnnotation.parentNode.removeChild(visibleAnnotation);
		visibleAnnotation = null;
		visibleAnnotationId = '';
	}
	return id;
}

function getOffsetTop (el) {
	var top = 0;
	do {
		top += el.offsetTop;
		el = el.offsetParent;
	} while (el && el.tagName !== 'BODY');
	return top;
}

function showAnnotation (id, rel) {
	var parent;
	visibleAnnotationId = id;
	visibleAnnotation = document.getElementById(id).cloneNode(true);
	visibleAnnotation.removeAttribute('id');
	visibleAnnotation.classList.remove('toggle');
	visibleAnnotation.addEventListener('click', stopPropagation);
	parent = rel;
	while (
		[
			'P',
			'UL', 'OL',
			'TABLE',
			'PRE',
			'DIV',
			'FIGURE',
			'H2', 'H3', 'H4', 'H5', 'H6',
			'BLOCKQUOTE',
			'ARTICLE'
		].indexOf(parent.tagName) === -1
	) {
		parent = parent.parentNode;
	}
	parent.parentNode.insertBefore(visibleAnnotation, parent);
	visibleAnnotation.style.marginTop = (getOffsetTop(rel) - visibleAnnotation.offsetTop + 9) + 'px';
}

function toggleAnnotationFor (el) {
	var id = el.dataset.ref;
	if (hideAnnotation() === id) {
		return;
	}
	showAnnotation(id, el);
}

function onClick (e) {
	/*jshint validthis:true*/
	toggleAnnotationFor(this);
	e.stopPropagation();
}

function onKey (e) {
	/*jshint validthis:true*/
	if (
		e.key === ' ' ||
		e.key === 'Enter' ||
		e.keyCode === 32 ||
		e.keyCode === 13
	) {
		toggleAnnotationFor(this);
		e.preventDefault();
	}
}

function stopPropagation (e) {
	e.stopPropagation();
}

for (i = 0; i < active.length; i++) {
	active[i].tabIndex = 0;
	active[i].addEventListener('click', onClick);
	active[i].addEventListener('keydown', onKey);
}

document.getElementsByTagName('html')[0].addEventListener('click', function () {
	hideAnnotation();
});
document.getElementsByTagName('html')[0].addEventListener('keydown', function (e) {
	if (e.key === 'Escape' || e.keyCode === 27) {
		hideAnnotation();
	}
});

})();

//Footnotes
(function () {
"use strict";

var links = document.getElementsByTagName('a'),
	i, href,
	currentFootnote,
	timeout;

function showFootnote (id, x, y) {
	hideFootnote();
	currentFootnote = document.createElement('div');
	currentFootnote.innerHTML = document.getElementById(id).innerHTML;
	if (x >= 0) {
		currentFootnote.style.left = x + 'px';
	} else {
		currentFootnote.style.right = (-x) + 'px';
	}
	if (y >= 0) {
		currentFootnote.style.top = y + 'px';
	} else {
		currentFootnote.style.bottom = (-y) + 'px';
	}
	currentFootnote.className = 'footnote-popup';
	currentFootnote.addEventListener('mouseenter', cancelHideFootnote);
	currentFootnote.addEventListener('mouseleave', delayedHideFootnote);
	document.body.appendChild(currentFootnote);
}

function delayedHideFootnote () {
	if (timeout) {
		window.clearTimeout(timeout);
	}
	timeout = window.setTimeout(hideFootnote, 300);
}

function cancelHideFootnote () {
	if (timeout) {
		window.clearTimeout(timeout);
		timeout = false;
	}
}

function hideFootnote () {
	cancelHideFootnote();
	if (currentFootnote) {
		currentFootnote.parentNode.removeChild(currentFootnote);
		currentFootnote = null;
	}
}

function onMouseenter (e) {
	var id = e.target.getAttribute('href').slice(1);
	//TODO? placement based on size
	showFootnote(
		id,
		e.clientX <= 0.7 * window.innerWidth ? e.clientX + 5 : -(window.innerWidth - e.clientX),
		e.clientY <= 0.7 * window.innerHeight ? e.clientY + 5 : -(window.innerHeight - e.clientY)
	);
}

for (i = 0; i < links.length; i++) {
	href = links[i].getAttribute('href');
	if (href.slice(0, '#footnote-'.length) === '#footnote-' && href.slice(-('-back'.length)) !== '-back') {
		links[i].addEventListener('mouseenter', onMouseenter); //TODO delay?
		links[i].addEventListener('mouseleave', delayedHideFootnote);
		links[i].addEventListener('click', hideFootnote);
	}
}

})();

//Search form in header
(function () {
"use strict";

var form = document.querySelector('header form');
if (form) {
	form.addEventListener('submit', function (e) {
		if (!form.getElementsByTagName('input')[0].value) {
			location.href = form.action;
			e.preventDefault();
		}
	});
}
})();

//Top link
(function () {
"use strict";

var toTop = document.getElementById('to-top'),
	visible = true,
	lastScroll = window.scrollY;

function showHide (show) {
	if (show !== visible) {
		toTop.style.display = show ? '' : 'none';
		visible = show;
	}
}

if (toTop) {
	showHide(false);
	toTop.addEventListener('click', function (e) {
		e.preventDefault();
		window.scrollTo(0, 0);
		lastScroll = 0;
		showHide(false);
	});
	window.addEventListener('scroll', function () {
		var scroll = window.scrollY;
		showHide(scroll < lastScroll && scroll !== 0);
		lastScroll = scroll;
	});
}
})();