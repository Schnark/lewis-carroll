/*global splitLatex: true*/
/*global util, toHtml*/
splitLatex =
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
			'math/purity-of-election': 'magazines/purity-of-election',
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
			'prefaces/the-principles-of-parliamentary-representation-advertisment': 'magazines/the-principles-of-parliamentary-representation-advertisment',

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
			'math/limits-of-circle-squaring': 'manuscripts-proofs/limits-of-circle-squaring',
			'prefaces/limits-of-circle-squaring': 'manuscripts-proofs/limits-of-circle-squaring-preface',
			'math/rule-for-finding-easter-day-for-any-date-till-textsc-a-d': 'manuscripts-proofs/rule-for-finding-easter-day',
			'texts/logs-of-nos': 'manuscripts-proofs/logs-of-nos',
			'texts/various-memoria-technica-verses': 'manuscripts-proofs/various-memoria-technica-verses',

			'math/a-new-theory-of-parallels-curiosa-mathematica-part-i': 'math/a-new-theory-of-parallels',
			'math/pillow-problems-curiosa-mathematica-part-ii': 'math/pillow-problems',
			'texts/specific-gravities-of-metals-c': 'texts/specific-gravities-of-metals'
		};
	chapter = util.lowerAscii(chapter || 'about');
	chapter = CHAPTER[chapter] || chapter;
	section = util.lowerAscii(section || 'index');
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

return splitLatex;
})();