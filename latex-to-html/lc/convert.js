/*global convert: true*/
/*global latexParse, toHtml*/
convert =
(function () {
"use strict";

function getPath (chapter, section) {
	var path,
		CHAPTER = {
			'preface': 'about',
			'novels-and-stories': 'novels',
			'short-stories': 'texts',
			'geometrical-texts': 'math',
			'collections-of-formulae': 'math',
			'texts-about-voting': 'math',
			'logical-texts': 'math',
			'alternative-methods-of-computation': 'math',
			'other-mathematical-texts': 'math',
			'games': 'texts',
			'texts-on-religion-and-morality': 'texts',
			'texts-concerning-oxford': 'texts',
			'texts-concerning-vivisection': 'magazines',
			'texts-concerning-theatres': 'magazines', //all but one
			'texts-about-letters-post-etc': 'texts',
			'other-texts': 'texts',
			'prefaces-introductions-and-other-texts-about-books': 'prefaces'
		},
		PATH = {
			'about/ifnum-c-section-0-clearpage': '', //no real section, but from \renewcommand
			'about/index': 'index',
			'novels/index': 'about/contents-by-topic',
			'math/index': 'about/contents-by-topic',
			'images/index': 'about/contents-by-topic',
			'texts/index': 'about/contents-by-topic',
			'magazines/index': 'about/contents-by-topic',
			'poems/index': 'about/contents-by-topic',
			'prefaces/index': 'about/contents-by-topic',

			//TODO split these into chapters?
			'prefaces/alices-adventures-in-wonderland': 'aaiw/preface',
			'novels/alices-adventures-in-wonderland': 'aaiw/content',
			'prefaces/through-the-looking-glass-and-what-alice-found-there': 'ttlg/preface',
			'novels/through-the-looking-glass-and-what-alice-found-there': 'ttlg/content',
			'prefaces/alices-adventures-under-ground': 'aaug/preface',
			'novels/alices-adventures-under-ground': 'aaug/content',
			'prefaces/the-nursery-alice': 'nursery-alice/preface',
			'novels/the-nursery-alice': 'nursery-alice/content',
			'prefaces/sylvie-and-bruno': 'sylvie-and-bruno/preface',
			'novels/sylvie-and-bruno': 'sylvie-and-bruno/content',
			'prefaces/sylvie-and-bruno-concluded': 'sylvie-and-bruno-concluded/preface',
			'novels/sylvie-and-bruno-concluded': 'sylvie-and-bruno-concluded/content',

			'prefaces/euclid-and-his-modern-rivals': 'euclid-and-his-modern-rivals/preface',
			'math/euclid-and-his-modern-rivals': 'euclid-and-his-modern-rivals/content',
			'prefaces/supplement-to-euclid-and-his-modern-rivals': 'euclid-and-his-modern-rivals/preface-supplement',
			'math/supplement-to-euclid-and-his-modern-rivals': 'euclid-and-his-modern-rivals/appendix-vii',
			'prefaces/a-tangled-tale': 'tangled-tale/preface',
			'math/a-tangled-tale': 'tangled-tale/content',
			'prefaces/the-game-of-logic': 'game-of-logic/preface',
			'math/the-game-of-logic': 'game-of-logic/content',
			'prefaces/symbolic-logic': 'symbolic-logic/preface',
			'math/symbolic-logic-part-i-elementary': 'symbolic-logic/content',

			'texts/the-new-method-of-evaluation-as-applied-to-texorpdfstring-pi': 'notes-oxford-chiel/new-method-evaluation',
			'texts/the-dynamics-of-a-parti-cle': 'notes-oxford-chiel/dynamics-particle',
			'texts/the-offer-of-the-clarendon-trustees': 'notes-oxford-chiel/clarendon',
			'texts/the-new-belfry-of-christ-church-oxford': 'notes-oxford-chiel/new-belfry',
			'texts/the-vision-of-the-three-ts-a-threnody': 'notes-oxford-chiel/vision-three-ts',
			'texts/the-blank-cheque-a-fable': 'notes-oxford-chiel/blank-cheque',

			'prefaces/syzygies-and-lanrick': 'syzygies-and-lanrick/preface',
			'texts/syzygies-a-word-puzzle': 'syzygies-and-lanrick/syzygies',
			'texts/lanrick-a-game-for-two-players': 'syzygies-and-lanrick/lanrick',

			'prefaces/introductions-in-the-rectory-magazine': 'rectory-magazine/introductions',
			'texts/sidney-hamilton': 'rectory-magazine/sidney-hamilton',
			'texts/answers-to-correspondents': 'rectory-magazine/answers-to-correspondents',
			'texts/crundle-castle': 'rectory-magazine/crundle-castle',
			'texts/the-village-school': 'rectory-magazine/the-village-school',
			'texts/reviews': 'rectory-magazine/reviews',

			'prefaces/the-rectory-umbrella': 'rectory-umbrella/preface',
			'images/other-images-in-the-rectory-umbrella': 'rectory-umbrella/images',
			'texts/the-walking-stick-of-destiny': 'rectory-umbrella/the-walking-stick-of-destiny',
			'texts/moans-from-the-miserable': 'rectory-umbrella/moans-from-the-miserable',
			'images/the-vernon-gallery': 'rectory-umbrella/the-vernon-gallery',
			'texts/zoological-papers': 'rectory-umbrella/zoological-papers',
			'texts/difficulties': 'rectory-umbrella/difficulties',
			'texts/representative-men': 'rectory-umbrella/representative-men',

			'prefaces/mischmasch': 'mischmasch/preface',
			'images/from-our-own-correspondent': 'mischmasch/from-our-own-correspondent',
			'images/studies-from-english-poets': 'mischmasch/studies-from-english-poets',
			'images/other-images-in-mischmasch': 'mischmasch/images',

			'texts/wilhelm-von-schmitz': 'magazines/wilhelm-von-schmitz',
			'texts/photography-extraordinary': 'magazines/photography-extraordinary',
			'texts/novelty-and-romancement': 'magazines/novelty-and-romancement',
			'texts/a-photographers-day-out': 'magazines/a-photographers-day-out',
			'texts/brunos-revenge': 'magazines/brunos-revenge',
			'math/euclids-theory-of-parallels': 'magazines/euclids-theory-of-parallels',
			'math/the-purity-of-election': 'magazines/the-purity-of-election',
			'math/proportionate-representation': 'magazines/proportionate-representation',
			'math/parliamentary-elections': 'magazines/parliamentary-elections',
			'math/notes': 'magazines/notes-1884',
			'math/redistribution': 'magazines/redistribution',
			'math/election-gains-and-losses': 'magazines/election-gains-and-losses',
			'math/a-logical-paradox': 'magazines/a-logical-paradox',
			'math/questions-for-solution-14122': 'magazines/questions-for-solution-14122',
			'math/what-the-tortoise-said-to-achilles': 'magazines/what-the-tortoise-said-to-achilles',
			'math/the-science-of-betting': 'magazines/the-science-of-betting',
			'math/condensation-of-determinants': 'magazines/condensation-of-determinants',
			'math/practical-hints-on-teaching': 'magazines/practical-hints-on-teaching',
			'math/the-cats-and-rats-again': 'magazines/the-cats-and-rats-again',
			'math/divisibility-by-seven': 'magazines/divisibility-by-seven',
			'math/to-find-the-day-of-the-week-for-any-given-date': 'magazines/to-find-the-day-of-the-week',
			'math/note-on-question-7695': 'magazines/note-on-question-7695',
			'math/infinitesimal-or-zero': 'magazines/infinitesimal-or-zero',
			'math/something-or-nothing': 'magazines/something-or-nothing',
			'math/questions-for-solution-9588': 'magazines/questions-for-solution-9588',
			'math/questions-for-solution-9636': 'magazines/questions-for-solution-9636',
			'math/questions-for-solution-9995': 'magazines/questions-for-solution-9995',
			'math/questions-for-solution-11530': 'magazines/questions-for-solution-11530',
			'math/questions-for-solution-12650': 'magazines/questions-for-solution-12650',
			'math/questions-for-solution-13614': 'magazines/questions-for-solution-13614',
			'math/a-mysterious-number': 'magazines/a-mysterious-number',
			'math/brief-method-of-dividing-a-given-number-by-9-or-11': 'magazines/brief-method-of-dividing',
			'math/abridged-long-division': 'magazines/abridged-long-division',
			'texts/castle-croquet-1866': 'magazines/castle-croquet-1866',
			'texts/doublets-1879-1881': 'magazines/doublets-1879-1881',
			'texts/new-method-of-scoring': 'magazines/new-method-of-scoring',
			'texts/lanrick-dec-1880': 'magazines/lanrick-1880',
			'texts/lanrick-1881': 'magazines/lanrick-1881',
			'texts/mischmasch-1881': 'magazines/mischmasch-1881',
			'texts/mischmasch-1882-monthly-packet': 'magazines/mischmasch-1882',
			'texts/mischmasch-1886': 'magazines/mischmasch-1886',
			'texts/lawn-tennis-tournaments-1882': 'magazines/lawn-tennis-tournaments',
			'texts/the-fallacies-of-lawn-tennis-tournaments': 'magazines/the-fallacies-of-lawn-tennis-tournaments',
			'texts/lawn-tennis-reply-to-cavendish': 'magazines/lawn-tennis-reply-to-cavendish',
			'texts/lawn-tennis': 'magazines/lawn-tennis',
			'texts/syzygies': 'magazines/syzygies',
			'texts/the-priest-in-absolution': 'magazines/the-priest-in-absolution',
			'texts/traitors-in-the-camp': 'magazines/traitors-in-the-camp',
			'texts/whoso-shall-offend-one-of-these-little-ones': 'magazines/whoso-shall-offend-one-of-these-little-ones',
			'texts/an-oxford-scandal': 'magazines/an-oxford-scandal',
			'texts/address-by-the-rev-c-l-dodgson': 'magazines/address-by-the-rev-c-l-dodgson',
			'texts/reform-at-christ-church': 'magazines/reform-at-christ-church',
			'texts/architecture-in-oxford': 'magazines/architecture-in-oxford',
			'texts/natural-science-at-oxford': 'magazines/natural-science-at-oxford',
			'texts/clerical-fellowships': 'magazines/clerical-fellowships',
			'texts/christ-church-oxford': 'magazines/christ-church-oxford',
			'texts/oxford-responsions': 'magazines/oxford-responsions',
			'texts/a-complete-postage-guide': 'magazines/a-complete-postage-guide',
			'texts/what-to-call-a-telephone-message': 'magazines/what-to-call-a-telephone-message',
			'texts/a-postal-problem': 'magazines/a-postal-problem',
			'texts/hints-for-etiquette-or-dining-out-made-easy': 'magazines/hints-for-etiquette',
			'texts/where-does-the-day-begin': 'magazines/where-does-the-day-begin',
			'texts/photograpic-exhibition': 'magazines/photograpic-exhibition',
			'texts/feeding-the-mind': 'magazines/feeding-the-mind',
			'texts/the-organization-of-charity': 'magazines/the-organization-of-charity',
			'texts/woodstock-election': 'magazines/woodstock-election',
			'texts/original-research': 'magazines/original-research',
			'texts/is-it-well-to-have-children-vaccinated': 'magazines/is-it-well-to-have-children-vaccinated',
			'texts/notices-to-correspondents-january-1882': 'magazines/notices-to-correspondents-january-1882',
			'texts/notes': 'magazines/notes-1882',
			'texts/aunt-judys-correspondence': 'magazines/aunt-judys-correspondence',
			'texts/notices-to-correspondents-april-1882': 'magazines/notices-to-correspondents-april-1882',
			'texts/note-about-shakespeare-for-girls': 'magazines/note-about-shakespeare-for-girls',
			'texts/mr-gladstones-new-book': 'magazines/mr-gladstones-new-book',
			'texts/too-many-dogs': 'magazines/too-many-dogs',
			'texts/hydrophobia-curable': 'magazines/hydrophobia-curable',
			'texts/game-of-logic': 'magazines/game-of-logic',
			'texts/tristan-dacunha': 'magazines/tristan-dacunha',
			'texts/authors-of-epigrams-wanted': 'magazines/authors-of-epigrams-wanted',
			'texts/life-on-a-lonely-isle-of-the-sea': 'magazines/life-on-a-lonely-isle-of-the-sea',
			'texts/the-fasting-man': 'magazines/the-fasting-man',
			'texts/eight-hours-movement': 'magazines/eight-hours-movement',
			'texts/the-cab-runner-nuisance': 'magazines/the-cab-runner-nuisance',
			'texts/nyctograph': 'magazines/nyctograph',
			'prefaces/to-the-editor-of-the-nineteenth-century': 'magazines/nineteenth-century',
			'prefaces/through-the-looking-glass-times': 'magazines/through-the-looking-glass',
			'prefaces/to-all-readers-of-alices-adventures-under-ground': 'magazines/to-all-readers',
			'prefaces/for-all-lovers-of-children': 'magazines/for-all-lovers-of-children',
			'prefaces/for-all-writers-of-letters': 'magazines/for-all-writers-of-letters',
			'prefaces/sylvie-and-bruno-st-jamess-gazette': 'magazines/sylvie-and-bruno',

			'magazines/the-guildford-gazette-extraordinary': 'texts/the-guildford-gazette-extraordinary',
			'prefaces/advertisement': 'texts/advertisement',
			'prefaces/a-fascinating-mental-recreation-for-the-young': 'texts/a-fascinating-mental-recreation',
			'prefaces/an-index-to-in-memoriam': 'texts/index-to-in-memoriam',
			'prefaces/cautions-to-readers': 'texts/cautions-to-readers',
			'prefaces/introduction-to-the-lost-plum-cake': 'texts/the-lost-plum-cake',
			'prefaces/notice-re-concordance-to-in-memoriam': 'texts/notice-re-concordance-to-in-memoriam',
			'prefaces/phantasmagoria-and-other-poems': 'texts/phantasmagoria-and-other-poems',
			'prefaces/rhyme-and-reason': 'texts/rhyme-and-reason',
			'prefaces/the-hunting-of-the-snark': 'texts/the-hunting-of-the-snark',
			'prefaces/three-sunsets-and-other-poems': 'texts/three-sunsets-and-other-poems',

			'texts/railway-rules': 'manuscripts-proofs/railway-rules',
			'texts/loves-railway-guide': 'manuscripts-proofs/loves-railway-guide',
			'texts/the-christ-church-commoner': 'manuscripts-proofs/the-christ-church-commoner',
			'texts/the-legend-of-scotland': 'manuscripts-proofs/the-legend-of-scotland',
			'texts/the-wasp-in-a-wig': 'manuscripts-proofs/the-wasp-in-a-wig',
			'texts/isas-visit-to-oxford-1888': 'manuscripts-proofs/isas-visit-to-oxford-1888',
			'math/a-method-of-taking-votes-on-more-than-two-issues': 'manuscripts-proofs/a-method-of-taking-votes',
			'math/a-disputed-point-in-logic-a-concrete-example': 'manuscripts-proofs/a-disputed-point-in-logic-a-concrete-example',
			'math/symbolic-logic-part-ii': 'manuscripts-proofs/symbolic-logic-part-ii',
			'math/an-inconceivable-conversation': 'manuscripts-proofs/an-inconceivable-conversation',
			'math/number-guessing': 'manuscripts-proofs/number-guessing',
			'math/curiosa-mathematica-part-iii': 'manuscripts-proofs/curiosa-mathematica-part-iii',
			'texts/arithmetical-croquet': 'manuscripts-proofs/arithmetical-croquet',
			'texts/marriage-service': 'manuscripts-proofs/marriage-service',
			'texts/eternal-punishment': 'manuscripts-proofs/eternal-punishment',
			'texts/life-of-richard-hakluyt': 'manuscripts-proofs/life-of-richard-hakluyt',
			'prefaces/limits-of-circle-squaring': 'manuscripts-proofs/limits-of-circle-squaring',

			'math/a-new-theory-of-parallels-curiosa-mathematica-part-i': 'math/a-new-theory-of-parallels',
			'math/pillow-problems-curiosa-mathematica-part-ii': 'math/pillow-problems',
			'texts/specific-gravities-of-metals-c': 'texts/specific-gravities-of-metals'
		};
	function lowerAscii (text) {
		return text.toLowerCase()
			.replace(/textit|textfrak/g, '')
			.replace(/æ/g, 'ae').replace(/[êè]/g, 'e').replace(/ó/g, 'o').replace(/’/g, '')
			.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}
	chapter = lowerAscii(chapter || 'about');
	chapter = CHAPTER[chapter] || chapter;
	section = lowerAscii(section || 'index');
	path = chapter + '/' + section;
	if (PATH[path] === '') {
		return '';
	}
	return (PATH[path] || path) + '.html';
}

function splitLatex (latex) {
	var re = /\\(chapter|section)[\{\[](.*?)[\}\]]|\\(begin|end)\{document\}/g,
		match,
		positions = [[0, '']],
		chapter = '',
		parts = {};

	while ((match = re.exec(latex))) {
		if (match[3] === 'begin') {
			chapter = '';
			positions.push([match.index + match[0].length, getPath('', '')]);
		} else if (match[3] === 'end') {
			positions.push([match.index, '']);
		} else if (match[1] === 'chapter') {
			chapter = match[2];
			positions.push([match.index, getPath(chapter, '')]);
		} else {
			positions.push([match.index, getPath(chapter, match[2])]);
		}
	}
	positions.push([latex.length, '']);

	positions.forEach(function (position, i) {
		var start = position[0],
			path = position[1];
		if (!path) {
			return;
		}
		if (!parts[path]) {
			parts[path] = '';
		} else {
			toHtml.warn(path + ' used more than once');
		}
		parts[path] += latex.slice(start, positions[i + 1][0]);
	});

	return parts;
}

function relPath (from, to) {
	var i;
	if (from === to) {
		return '';
	}
	from = from.split('/');
	to = to.split('/');
	while (from[0] === to[0]) {
		from.shift();
		to.shift();
	}
	for (i = 0; i < from.length - 1; i++) {
		to.unshift('..');
	}
	return to.join('/');
}

function fixRefs (pages) {
	var pageNames = Object.keys(pages), ids = {}, idRe = / id="([^"]+)"/g;
	pageNames.forEach(function (pageName) {
		var html = pages[pageName], match;
		match = /^<h\d id="([^"]+)"/.exec(html);
		if (match) {
			ids[match[1]] = [pageName, true];
			html = html.replace(/ id="[^"]+"/, '');
			pages[pageName] = html;
		}
		while ((match = idRe.exec(html))) {
			ids[match[1]] = [pageName, false];
		}
	});
	pageNames.forEach(function (pageName) {
		var html = pages[pageName], href;
		html = html.replace(/ href="#([^"]+)"/g, function (all, id) {
			if (id.slice(0, 'footnote-'.length) === 'footnote-') {
				return all;
			}
			if (!ids[id]) {
				toHtml.warn('Missing ID: ' + id + ' (in ' + pageName + ')');
				return all;
			}
			href = relPath(pageName, ids[id][0]);
			if (!ids[id][1]) {
				href += '#' + id;
			}
			href = href || '#top';
			return ' href="' + href + '"';
		});
		pages[pageName] = html;
	});
}

function prepareLatex (latex) {
	latex = latex.replace(/\\+[()\[\]]/g, function (delim) {
		if (delim.length % 2 === 1) {
			return delim;
		}
		return delim.slice(0, -2) + {
			'\\(': '$',
			'\\)': '$',
			'\\[': '\\begin{center}', //we use \[...\] actually for centering, and only $$ for block math
			'\\]': '\\end{center}'
		}[delim.slice(-2)];
	}).replace(/\\framebox\(/g, '\\pictureframebox(');
	latex = latex.replace(/\\(begin|end)\{guideTab\}/g, '\\$1{tabbing}');
	latex += '\n\n';
	return latex;
}

function checkBooks (allTitles, allBooks) {
	Object.keys(allBooks).forEach(function (book) {
		Object.keys(allBooks[book]).forEach(function (path) {
			if (allTitles.indexOf(path) === -1) {
				toHtml.warn(path + ' does not exist!');
			}
		});
	});
}

function getNav (page) {
	var books = { //TODO more?
		'Alice’s Adventures in Wonderland': {
			'aaiw/preface.html': 'Preface',
			'poems/all-in-the-golden-afternoon.html': 'All in the Golden Afternoon',
			'poems/christmas-greetings.html': 'Christmas-Greetings',
			'aaiw/content.html': 'Content'
		},
		'Through the Looking-Glass': {
			'ttlg/preface.html': 'Preface',
			'poems/child-of-the-pure-unclouded-brow.html': 'Child of the Pure Unclouded Brow',
			'ttlg/content.html': 'Content',
			'poems/a-boat-beneath-a-sunny-sky.html': 'A Boat Beneath a Sunny Sky',
			'poems/christmas-greetings.html': 'Christmas-Greetings'
		},
		'Alice’s Adventures under Ground': {
			'aaug/preface.html': 'Preface',
			'aaug/content.html': 'Content',
			'texts/an-easter-greeting.html': 'An Easter Greeting',
			'poems/christmas-greetings.html': 'Christmas-Greetings'
		},
		'The Nursery “Alice”': {
			'nursery-alice/preface.html': 'Preface',
			'poems/a-nursery-darling.html': 'A Nursery Darling',
			'nursery-alice/content.html': 'Content',
			'texts/an-easter-greeting.html': 'An Easter Greeting',
			'poems/christmas-greetings.html': 'Christmas-Greetings'
			//'texts/cautions-to-readers.html': 'Cautions to Readers'
		},
		'Sylvie and Bruno': {
			'poems/is-all-our-life.html': 'Is All Our Life',
			'sylvie-and-bruno/preface.html': 'Preface',
			'sylvie-and-bruno/content.html': 'Content'
		},
		'Sylvie and Bruno Concluded': {
			'poems/dreams-that-elude-the-wakers-frenzied-grasp.html': 'Dreams that Elude the Waker’s Frenzied Grasp',
			'sylvie-and-bruno-concluded/preface.html': 'Preface',
			'sylvie-and-bruno-concluded/content.html': 'Content'
			//'texts/cautions-to-readers.html': 'Cautions to Readers',
			//'texts/advertisement.html': 'Advertisement'
		},
		'Phantasmagoria': {
			'texts/phantasmagoria-and-other-poems.html': 'Preface',
			'poems/phantasmagoria.html': 'Phantasmagoria',
			'poems/a-valentine.html': 'A Valentine',
			'poems/a-sea-dirge.html': 'A Sea Dirge',
			'poems/ye-carpette-knyghte.html': 'Ye Carpette Knyghte',
			'poems/hiawathas-photographing-early-version.html': 'Hiawatha’s Photographing',
			'poems/the-lang-coortin.html': 'The Lang Coortin’',
			'poems/melancholetta.html': 'Melancholetta',
			'poems/the-three-voices-early-version.html': 'The Three Voices',
			'poems/four-riddles-no-i.html': 'A Double Acrostic',
			'poems/size-and-tears.html': 'Size and Tears',
			'poems/poeta-fit-non-nascitur.html': 'Poeta Fit, Non Nascitur',
			'poems/atalanta-in-camden-town.html': 'Atalanta in Camden-Town',
			'poems/the-elections-to-the-hebdomadal-council.html': 'The Elections to the Hebdomadal Council',
			'poems/the-valley-of-the-shadow-of-death.html': 'The Valley of the Shadow of Death',
			'poems/beatrice.html': 'Beatrice',
			'poems/lines.html': 'Lines',
			'poems/the-path-of-roses.html': 'The Path of Roses',
			'poems/the-sailors-wife.html': 'The Sailor’s Wife',
			'poems/stolen-waters.html': 'Stolen Waters',
			'poems/the-willow-tree.html': 'Stanzas for Music',
			'poems/solitude.html': 'Solitude',
			'poems/only-a-womans-hair.html': 'Only a Woman’s Hair',
			'poems/three-sunsets.html': 'Three Sunsets',
			'poems/christmas-greetings.html': 'Christmas Greetings',
			'poems/after-three-days.html': 'After Three Days',
			'poems/faces-in-the-fire.html': 'Faces in the Fire'
		},
		'The Hunting of the Snark': {
			'poems/girt-with-a-boyish-garb.html': 'Girt with a Boyish Garb',
			'texts/the-hunting-of-the-snark.html': 'Preface',
			'poems/the-hunting-of-the-snark.html': 'The Hunting of the Snark'
		},
		'Rhyme? and Reason?': {
			'poems/girt-with-a-boyish-garb.html': 'Girt with a Boyish Garb',
			'texts/rhyme-and-reason.html': 'Preface',
			'poems/phantasmagoria.html': 'Phantasmagoria',
			'poems/echoes.html': 'Echoes',
			'poems/a-sea-dirge.html': 'A Sea Dirge',
			'poems/ye-carpette-knyghte.html': 'Ye Carpette Knyghte',
			'poems/hiawathas-photographing-later-version.html': 'Hiawatha’s Photographing',
			'poems/melancholetta.html': 'Melancholetta',
			'poems/a-valentine.html': 'A Valentine',
			'poems/the-three-voices-later-version.html': 'The Three Voices',
			'poems/tema-con-variazioni.html': 'Tèma Con Variazióni',
			'poems/a-game-of-fives.html': 'A Game of Fives',
			'poems/poeta-fit-non-nascitur.html': 'Poeta Fit, Non Nascitur',
			'texts/the-hunting-of-the-snark.html': 'The Hunting of the Snark. Preface',
			'poems/the-hunting-of-the-snark.html': 'The Hunting of the Snark',
			'poems/size-and-tears.html': 'Size and Tears',
			'poems/atalanta-in-camden-town.html': 'Atalanta in Camden-Town',
			'poems/the-lang-coortin.html': 'The Lang Coortin’',
			'poems/four-riddles-no-i.html': 'Four Riddles. No. I',
			'poems/four-riddles-no-ii.html': 'Four Riddles. No. II',
			'poems/four-riddles-no-iii.html': 'Four Riddles. No. III',
			'poems/four-riddles-no-iv.html': 'Four Riddles. No. IV',
			'poems/fames-penny-trumpet.html': 'Fame’s Penny-Trumpet'
			//'poems/christmas-greetings.html': 'Christmas-Greetings'
		},
		'Three Sunsets': {
			'texts/three-sunsets-and-other-poems.html': 'Preface',
			'poems/three-sunsets.html': 'Three Sunsets',
			'poems/the-path-of-roses.html': 'The Path of Roses',
			'poems/the-valley-of-the-shadow-of-death.html': 'The Valley of the Shadow of Death',
			'poems/solitude.html': 'Solitude',
			'poems/far-away.html': 'Far Away',
			'poems/beatrice.html': 'Beatrice',
			'poems/stolen-waters.html': 'Stolen Waters',
			'poems/the-willow-tree.html': 'The Willow-Tree',
			'poems/only-a-womans-hair.html': 'Only a Woman’s Hair',
			'poems/the-sailors-wife.html': 'The Sailor’s Wife',
			'poems/after-three-days.html': 'After Three Days',
			'poems/faces-in-the-fire.html': 'Faces in the Fire',
			'poems/a-lesson-in-latin.html': 'A Lesson in Latin',
			'poems/puck-lost-and-found.html': 'Puck Lost and Found',
			'poems/a-song-of-love.html': 'A Song of Love'
		},
		'Euclid and his Modern Rivals': {
			'euclid-and-his-modern-rivals/preface.html': 'Preface',
			'euclid-and-his-modern-rivals/content.html': 'Content',
			'euclid-and-his-modern-rivals/preface-supplement.html': 'Preface to Supplement',
			'euclid-and-his-modern-rivals/appendix-vii.html': 'Appendix VII'
		},
		'A Tangled Tale': {
			'poems/to-my-pupil.html': 'To My Pupil',
			'tangled-tale/preface.html': 'Preface',
			'tangled-tale/content.html': 'Content'
		},
		'The Game of Logic': {
			'poems/to-my-child-friend.html': 'To My Child-Friend',
			'game-of-logic/preface.html': 'Preface',
			'game-of-logic/content.html': 'Content'
		},
		'Symbolic Logic. Part I': {
			'texts/a-fascinating-mental-recreation.html': 'Advertisement',
			'symbolic-logic/preface.html': 'Preface',
			'symbolic-logic/content.html': 'Content'
		},
		'Notes by an Oxford Chiel': {
			'notes-oxford-chiel/new-method-evaluation.html': 'The New Method of Evaluation',
			'notes-oxford-chiel/dynamics-particle.html': 'The Dynamics of a Parti-cle',
			'poems/the-elections-to-the-hebdomadal-council.html': 'The Elections of the Hebdomadal Council',
			'notes-oxford-chiel/clarendon.html': 'The Offer of the Clarendon Trustees',
			'poems/the-deserted-parks.html': 'The Deserted Parks',
			'notes-oxford-chiel/new-belfry.html': 'The New Belfry',
			'notes-oxford-chiel/vision-three-ts.html': 'The Vision of the Three T’s',
			'notes-oxford-chiel/blank-cheque.html': 'The Blank Cheque'
		},
		'Syzygies and Lanrick': {
			'syzygies-and-lanrick/preface.html': 'Preface',
			'syzygies-and-lanrick/syzygies.html': 'Syzygies',
			'syzygies-and-lanrick/lanrick.html': 'Lanrick'
		},
		'Useful and Instructive Poetry': {
			'poems/my-fairy.html': 'My Fairy',
			'poems/the-headstrong-man.html': 'The Headstrong Man',
			'poems/punctuality.html': 'Punctuality',
			'poems/charity.html': 'Charity',
			'poems/melodies.html': 'Melodies',
			'poems/a-tale-of-a-tail.html': 'A Tale of a Tail',
			'poems/a-quotation-from-shakespeare-with-slight-improvements.html': 'A quotation from Shakespeare',
			'poems/brother-and-sister.html': 'Brother and Sister',
			'poems/the-trial-of-a-traitor.html': 'The Trial of a Traitor',
			'poems/the-juvenile-jenkins.html': 'The Juvenile Jenkins',
			'poems/facts.html': 'Facts',
			'poems/the-anglers-adventure.html': 'The Angler’s Adventure',
			'poems/a-fable.html': 'A Fable',
			'poems/rules-and-regulations.html': 'Rules and Regulations',
			'poems/clara.html': 'Clara',
			'poems/a-visitor.html': 'A Visitor'
		},
		'Rectory Magazine': {
			'rectory-magazine/introductions.html': 'Introductions',
			'rectory-magazine/sidney-hamilton.html': 'Sidney Hamilton',
			'rectory-magazine/crundle-castle.html': 'Crundle Castle',
			'rectory-magazine/answers-to-correspondents.html': 'Answers to Correspondents',
			'rectory-magazine/the-village-school.html': 'The Village School',
			'rectory-magazine/reviews.html': 'Reviews',
			'poems/horrors.html': 'Horrors',
			'poems/tears.html': 'Tears',
			'poems/as-it-fell-upon-a-day.html': 'As It Fell upon a Day',
			'poems/terrors.html': 'Terrors',
			'poems/woes.html': 'Woes',
			'poems/yang-ki-ling.html': 'Yang-ki-ling',
			'poems/misunderstandings.html': 'Misunderstandings',
			'poems/screams.html': 'Screams',
			'poems/thrillings.html': 'Thrillings'
		},
		'Rectory Umbrella': {
			'rectory-umbrella/images.html': 'Frontispice',
			'rectory-umbrella/preface.html': 'Preface',
			'rectory-umbrella/the-walking-stick-of-destiny.html': 'The Walking-Stick of Destiny',
			'poems/ye-fatalle-cheyse.html': 'Ye Fatalle Cheyse',
			'rectory-umbrella/the-vernon-gallery.html': 'The Vernon Gallery',
			'rectory-umbrella/moans-from-the-miserable.html': 'Moans from the Miserable',
			'rectory-umbrella/zoological-papers.html': 'Zoological Papers',
			'poems/the-storm.html': 'The Storm',
			'rectory-umbrella/difficulties.html': 'Difficulties',
			'poems/lays-of-sorrow-no-1.html': 'Lays of Sorrow. No. 1',
			'rectory-umbrella/representative-men.html': 'Representative Men',
			'poems/lays-of-sorrow-no-2.html': 'Lays of Sorrow. No. 2',
			'poems/the-poets-farewell.html': 'The Poet’s Farewell'
		},
		'Mischmasch': {
			'mischmasch/preface.html': 'Preface',
			'mischmasch/studies-from-english-poets.html': 'Studies from English Poets',
			'poems/the-two-brothers.html': 'The Two Brothers',
			'poems/poetry-for-the-million.html': 'Poetry for the Million',
			'mischmasch/from-our-own-correspondent.html': 'From Our Own Correspondent',
			'poems/shes-all-my-fancy-painted-him.html': 'She’s All My Fancy Painted Him',
			'magazines/photography-extraordinary.html': 'Photography Extraordinary',
			'magazines/hints-for-etiquette.html': 'Hints for Etiquette',
			'magazines/wilhelm-von-schmitz.html': 'Wilhelm von Schmitz',
			'poems/the-lady-of-the-ladle.html': 'The Lady of the Ladle',
			'poems/the-palace-of-humbug.html': 'The Palace of Humbug',
			'poems/stanza-of-anglo-saxon-poetry.html': 'Stanza of Anglo-Saxon Poetry',
			'mischmasch/images.html': 'Images',
			'poems/the-three-voices-early-version.html': 'The Three Voices',
			'poems/tommys-dead.html': 'Tommy’s Dead',
			'poems/ode-to-damon.html': 'Ode to Damon',
			'poems/a-monument.html': 'A Monument',
			'poems/melancholetta.html': 'Melancholetta',
			'poems/the-willow-tree.html': 'The Willow Tree',
			'poems/faces-in-the-fire.html': 'Faces in the Fire',
			'magazines/photograpic-exhibition.html': 'Review',
			'poems/a-valentine.html': 'Lines',
			'poems/size-and-tears.html': 'Bloggs’ Woe'
		},
		'Proportionate Representation (St. James’s Gazette)': {
			'magazines/proportionate-representation.html': 'Proportionate Representation',
			'magazines/parliamentary-elections.html': 'Parliamentary Elections',
			'magazines/redistribution.html': 'Redistribution'
		},
		'Papers on Logic': {
			'math/first-paper-on-logic.html': 'First Paper',
			'math/fourth-paper-on-logic.html': 'Fourth Paper',
			'math/questions-in-logic.html': 'Questions in Logic',
			'math/fifth-paper-on-logic.html': 'Fifth Paper',
			'math/sixth-paper-on-logic.html': 'Sixth Paper',
			'math/eighth-paper-on-logic.html': 'Eighth Paper',
			'math/ninth-paper-on-logic.html': 'Ninth Paper',
			'math/eighth-and-ninth-paper-on-logic-notes.html': 'Notes on Eighth and Ninth Paper',
			'math/symbolic-logic-questions-i.html': 'Symbolic Logic. Questions. I',
			'math/symbolic-logic-questions-ii.html': 'Symbolic Logic. Questions. II',
			'math/symbolic-logic-specimen-syllogisms-premisses.html': 'Symbolic Logic. Premisses',
			'math/symbolic-logic-specimen-syllogisms-2nd-ed-conclusions.html': 'Symbolic Logic. Conclusions'
		},
		'Paradox on Hypotheticals': {
			'math/a-disputed-point-in-logic-april-1894.html': 'A Disputed Point in Logic',
			'manuscripts-proofs/a-disputed-point-in-logic-a-concrete-example.html': 'A Concrete Example',
			'math/a-disputed-point-in-logic-may-1894.html': 'A Disputed Point in Logic',
			'math/a-theorem-in-logic.html': 'A Theorem in Logic',
			'magazines/a-logical-paradox.html': 'A Logical Paradox',
			'math/a-logical-puzzle.html': 'A Logical Puzzle',
			'magazines/questions-for-solution-14122.html': 'Question 14122'
		},
		'Controversy on Infinitesimals': {
			'magazines/note-on-question-7695.html': 'Note on Question 7695',
			'magazines/infinitesimal-or-zero.html': 'Infinitesimal or Zero?',
			'magazines/something-or-nothing.html': '“Something or Nothing?”',
			'magazines/questions-for-solution-9588.html': 'Question 9588'
		},
		'Abridged Division': {
			'magazines/divisibility-by-seven.html': 'Divisibility by Seven',
			'magazines/brief-method-of-dividing.html': 'Brief Method of Dividing',
			'magazines/abridged-long-division.html': 'Abridged Long Division'
		},
		'Court Circular': {
			'texts/rules-for-court-circular-1860.html': '1860',
			'texts/rules-for-court-circular-1862.html': '1862'
		},
		'Croquet Castles': {
			'texts/croquet-castles.html': 'Croquêt Castles, 1863',
			'texts/castle-croquet-1863.html': 'Castle Croquet, 1863?',
			'magazines/castle-croquet-1866.html': 'Castle Croquet, 1866'
		},
		'Doublets': {
			'texts/word-links-cyclostyled.html': 'Word-Links (cyclostyled)',
			'texts/word-links-printed.html': 'Word-Links (printed)',
			'texts/doublets-a-word-puzzle.html': 'Doublets (1879)',
			'magazines/doublets-1879-1881.html': 'Doublets (1879–1881)',
			'magazines/new-method-of-scoring.html': 'New Method of Scoring'
		},
		'Lanrick': {
			'texts/lanrick-jan-1879.html': 'Jan. 1879',
			'texts/lanrick-feb-mar-1879.html': 'Feb./Mar. 1879',
			'texts/lanrick-oct-1880.html': 'Oct. 1880',
			'magazines/lanrick-1880.html': 'Dec. 1880',
			'magazines/lanrick-1881.html': '1881',
			'syzygies-and-lanrick/lanrick.html': '1893'
		},
		'Mischmasch ': { //space to make it different from 'Mischmasch' above
			'magazines/mischmasch-1881.html': '1881',
			'magazines/mischmasch-1882.html': '1882',
			'texts/mischmasch-1882.html': '1882',
			'magazines/mischmasch-1886.html': '1886'
		},
		'Lawn Tennis': {
			'magazines/lawn-tennis-tournaments.html': 'Lawn Tennis Tournaments',
			'magazines/the-fallacies-of-lawn-tennis-tournaments.html': 'The Fallacies of Lawn Tennis Tournaments',
			'magazines/lawn-tennis-reply-to-cavendish.html': 'Reply to “Cavendish”',
			'magazines/lawn-tennis.html': 'Lawn Tennis',
			'texts/lawn-tennis-tournaments-1883.html': 'Lawn Tennis Tournaments'
		},
		'Circular Billiards': {
			'texts/circular-billiards-variant-a.html': 'Variant A',
			'texts/circular-billiards-variant-b.html': 'Variant B'
		},
		'Architecture in Oxford': {
			'notes-oxford-chiel/new-belfry.html': 'The New Belfry',
			'notes-oxford-chiel/vision-three-ts.html': 'The Vision of the Three T’s',
			'texts/objections-submitted-to-the-governing-body.html': 'Objections, Submitted to the Governing Body',
			'notes-oxford-chiel/blank-cheque.html': 'The Blank Cheque',
			'magazines/architecture-in-oxford.html': 'Architecture in Oxford'
		},
		'Responsions': {
			'texts/responsions-hilary-term-1877.html': 'Responsions, Hilary Term, 1877',
			'magazines/oxford-responsions.html': 'Oxford Responsions',
			'texts/an-analysis-of-responsions-lists.html': 'An Analysis of Responsions List'
		},
		'Proctorial Cycle': {
			'texts/the-proposed-procuratorial-cycle.html': 'The Proposed Procuratorial Cycle',
			'texts/the-proctorial-cycle.html': 'The Proctorial Cycle',
			'texts/suggestions-as-to-election-of-proctors.html': 'Suggestions as to Election of Proctors',
			'texts/suggestions-as-to-the-election-of-proctors.html': 'Suggestions as to the Election of Proctors'
		},
		'Curatorship': {
			'texts/twelve-months-in-a-curatorship.html': 'Twelve Months in a Curatorship',
			'texts/three-years-in-a-curatorship.html': 'Three Years in a Curatorship',
			'texts/curiosissima-curatoria.html': 'Curiosissima Curatoria'
		},
		'Vivisection': {
			'magazines/vivisection-as-a-sign-of-the-times.html': 'Vivisection as a Sign of the Times',
			'magazines/vivisection.html': 'Vivisection',
			'magazines/some-popular-fallacies-about-vivisection.html': 'Some Popular Fallacies',
			'magazines/vivisection-vivisected.html': 'Vivisection Vivisected'
		},
		'Stage Children': {
			'magazines/children-in-theatres.html': 'Children in Theatres',
			'magazines/mrs-fawcett-and-the-stage-children.html': 'Mrs.&nbsp;and the Stage Children',
			'magazines/stage-children.html': 'Stage Children'
		},
		'Memoria Technica': {
			'texts/memoria-technica-1877.html': '1877',
			'texts/specific-gravities-of-metals.html': 'Specific Gravities of Metals, &amp;c.',
			'texts/memoria-technica-1888.html': '1888'
		},
		'Shakespeare for Girls': {
			'magazines/aunt-judys-correspondence.html': 'Aunt Judy’s Magazine',
			'magazines/notices-to-correspondents-april-1882.html': 'The Monthly Packet, April 1882',
			'magazines/note-about-shakespeare-for-girls.html': 'The Monthly Packet, June 1882'
		}
	};
	if (!page) {
		return books;
	}
	return Object.keys(books).map(function (book) {
		var pages = Object.keys(books[book]),
			i = pages.indexOf(page),
			nav = [];
		if (i === -1) {
			return '';
		}
		nav.push('<ol>');
		if (i > 0) {
			nav.push(
				'<li class="prev"><a href="' + relPath(page, pages[i - 1]) + '">' +
				books[book][pages[i - 1]] + '</a></li>'
			);
		}
		nav.push('<li>' + book + '</li>');
		if (i < pages.length - 1) {
			nav.push(
				'<li class="next"><a href="' + relPath(page, pages[i + 1]) + '">' +
				books[book][pages[i + 1]] + '</a></li>'
			);
		}
		nav.push('</ol>');
		return nav.join('\n');
	}).filter(function (nav) {
		return nav;
	}).join('\n');
}

function getFooterNav (page) {
	function getLink (path, title) {
		var href = relPath(page, path);
		return href ? '<a href="' + href + '">' + title + '</a>' : '<b>' + title + '</b>';
	}
	return [
		'<nav><ul>',
		'<li>' + getLink('index.html', 'Home') + '</li>',
		'<li>' + getLink('about/introduction.html', 'Introduction') + '</li>',
		'<li>' + getLink('about/contents-by-source.html', 'Contents by Source') + '</li>',
		'<li>' + getLink('about/contents-by-topic.html', 'Contents by Topic') + '</li>',
		'<li>' + getLink('about/copyright.html', 'Copyright') + '</li>',
		'</ul></nav>'
	].join('\n');
}

function finalizeHtml (html, page) {
	var title, nav, res = '../../res/';
	title = /<h2>(.*?)<\/h2>/.exec(html);
	if (title) {
		title = title[1]
			.replace(/<sup class="footnote">.*?<\/sup>/g, '')
			.replace(/<[^<>]+>/g, '');
	} else {
		title = 'TODO';
	}
	if (html.indexOf('<header>') > -1) {
		html = html.replace('<header>', '');
	} else {
		html = '</header>\n' + html;
	}
	if (html.match(/<\/footer>\s*$/)) {
		html = html.replace(/<\/footer>(\s*)$/, '$1');
		html = html.replace(/<footer>[\s\S]*/, function (all) {
			return all.replace(/(<div class="verse">[\s\S]*?<\/div>|<ol>[\s\S]*?<\/ol>)/g, '<div>$1</div>'); //wrap to keep margin
		});
	} else {
		html += '\n<footer>';
	}
	html = html.replace('</header>', '</header>\n<article>');
	html = html.replace(/([\s\S]*)<footer>/, '$1</article>\n<footer>');
	nav = getNav(page);
	if (nav) {
		nav = '<nav>' + nav + '</nav>';
		html = html.replace('</header>', nav + '\n</header>');
		html += '\n' + nav;
	}
	return [
		'<!DOCTYPE html>',
		'<html lang="en"><head>',
		'<meta charset="utf-8">',
		'<title>' + title + '</title>',
		'<meta name="viewport" content="width=device-width, initial-scale=1">', //TODO can we drop initial-scale?
		//TODO
		//'<meta name="color-scheme" content="light dark">',
		'<meta name="theme-color" content="#a04">',
		'<link rel="icon" href="' + res + 'favicon-32.png" sizes="32x32" type="image/png">',
		'<link rel="icon" href="' + res + 'favicon.svg" sizes="any" type="image/svg+xml">',
		'<link rel="stylesheet" href="' + res + 'main.css">',
		'<script src="' + res + 'main.js" defer></script>',
		'</head><body>',
		'<header>',
		'<h1>The <span class="ar"><span>(almost</span> really)</span> Complete Works of Lewis Carroll</h1>',
		html,
		getFooterNav(page),
		'</footer>',
		'</body></html>'
	].join('\n');
}

function convert (latex) {
	var parts, pageNames, copyright;

	function extractCopyright (html) {
		var start = html.indexOf('<h3>Copyright</h3>'), end = html.indexOf('<h3>', start + 1);
		return [
			html.slice(0, start) + html.slice(end),
			html.slice(start, end)
		];
	}
	/*function generateMaintenance (pages) {
		return [
			'<header>',
			'<h2>Maintenance</h2>',
			'</header>',
			'<dl>',
			'<dt><b>T</b>ext</dt> <dd>Text carefully compared with scan of source</dd>',
			'<dt><b>F</b>ormat</dt> <dd>Properly formatted both in PDF and HTML (esp. tables, images)</dd>',
			'<dt><b>A</b>nnotations</dt> <dd>Annotations and introduction exist (esp. quotes, other variants)</dd>',
			'<dt><b>C</b>ode</dt> <dd>HTML code looks sane (including alt text for images)</dd>',
			'</dl>',
			'<!-- ✓ -->',
			'<table class="b">',
			'<tr><th>Path</th><th>T</ht><th>F</th><th>A</th><th>C</th><th>Remarks</th></tr>',
			pages.map(function (page) {
				return '<tr><td><a href="../' + page + '">' + page + '</a></td><td></td><td></td><td></td><td></td><td></td></tr>';
			}).join('\n'),
			'</table>'
		].join('\n');
	}*/
	function generateSitemap (pages) {
		return [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			pages.sort().map(function (url) {
				return '<url><loc>https://schnark.github.io/lewis-carroll/html/' + url + '</loc></url>';
			}).join('\n'),
			'</urlset>'
		].join('\n');
	}

	parts = splitLatex(latex);
	pageNames = Object.keys(parts);
	checkBooks(pageNames, getNav());
	pageNames.forEach(function (path) {
		parts[path] = toHtml(latexParse(prepareLatex(parts[path]))).trim();
	});
	fixRefs(parts);
	pageNames.forEach(function (path) {
		if (path !== 'about/contents-by-topic.html') {
			parts[path] = finalizeHtml(parts[path], path);
		}
	});
	parts['about/contents-by-topic.html'] += [
		'<h2>Contents by Topic</h2>',
		'<ul>',
		pageNames.filter(function (name) {
			return name !== 'about/contents-by-topic.html';
		}).map(function (name) {
			var title = /<title>([^<]*)<\/title>/.exec(parts[name])[1];
			return '<li><a href="../' + name + '">' + title + '</a></li>';
		}).join('\n'),
		'</ul>'
	].join('\n');
	parts['about/contents-by-topic.html'] = finalizeHtml(
		parts['about/contents-by-topic.html'],
		'about/contents-by-topic.html'
	);

	copyright = extractCopyright(parts['about/introduction.html']);
	parts['about/introduction.html'] = copyright[0];
	parts['about/copyright.html'] = finalizeHtml(
		copyright[1].replace('<h3>', '<h2>').replace('</h3>', '</h2>'),
		'about/copyright.html'
	);
	pageNames.push('about/copyright.html');

	//parts['about/maintenance.html'] = finalizeHtml(generateMaintenance(pageNames.sort()), 'about/maintenance.html');
	parts['sitemap.xml'] = generateSitemap(pageNames);

	return parts;
}

convert.prepareLatex = prepareLatex;

return convert;
})();