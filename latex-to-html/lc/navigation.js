/*global navigation: true*/
/*global util, toHtml*/
navigation =
(function () {
"use strict";

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
			'texts/logs-of-nos.html': 'Logs of Nos.',
			'texts/various-memoria-technica-verses.html': 'Various Verses',
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
				'<li class="prev"><a href="' + util.relPath(page, pages[i - 1]) + '">' +
				books[book][pages[i - 1]] + '</a></li>'
			);
		}
		nav.push('<li>' + book + '</li>');
		if (i < pages.length - 1) {
			nav.push(
				'<li class="next"><a href="' + util.relPath(page, pages[i + 1]) + '">' +
				books[book][pages[i + 1]] + '</a></li>'
			);
		}
		nav.push('</ol>');
		return nav.join('\n');
	}).filter(function (nav) {
		return nav;
	}).join('\n');
}

var TOC = [ //TODO more?
	'about/contents-by-source.html',
	//'about/contents-by-topic.html',
	'about/introduction.html',

	'aaiw/content.html',
	'ttlg/content.html',
	'aaug/content.html',
	'nursery-alice/content.html',
	'sylvie-and-bruno/content.html',
	'sylvie-and-bruno-concluded/content.html',

	'poems/phantasmagoria.html',
	'poems/the-hunting-of-the-snark.html',

	'math/the-formulae-of-plane-trigonometry.html',
	'math/a-guide-to-the-mathematical-student.html',
	'math/an-elementary-treatis-on-determinants.html',
	'math/a-discussion-of-the-various-methods-of-elections.html',
	'euclid-and-his-modern-rivals/content.html',
	'math/the-principals-of-parliamentary-representation.html',
	'tangled-tale/content.html',
	'game-of-logic/content.html',
	'math/a-new-theory-of-parallels.html',
	'math/pillow-problems.html',
	'symbolic-logic/content.html',

	'texts/doublets-a-word-puzzle.html',
	'texts/lawn-tennis-tournaments-1883.html',
	'texts/twelve-months-in-a-curatorship.html',
	'texts/three-years-in-a-curatorship.html',
	'texts/eight-or-nine-wise-words-about-letter-writing.html',
	'texts/curiosissima-curatoria.html',

	'manuscripts-proofs/a-method-of-taking-votes.html',
	'manuscripts-proofs/symbolic-logic-part-ii.html',
	'manuscripts-proofs/curiosa-mathematica-part-iii.html',
	'poems/la-guida-di-bragia.html'
];

function addToc (html) {
	var toc = [];
	html = html.replace(/<h3([^>]*)>(.*?)<\/h3>/g, function (all, attr, heading) {
		var id;
		if (heading === 'Copyright') {
			return all;
		}
		id = /id="([^"]+)"/.exec(attr);
		if (id) {
			id = id[1];
		} else {
			id = util.lowerAscii(heading);
			attr += ' id="' + id + '"';
		}
		toc.push('<a href="#' + id + '">' + heading.replace(/<\/?a[^>]*>/g, '') + '</a>');
		return '<h3' + attr + '>' + heading + '</h3>';
	});
	if (html.indexOf('</header>') === -1) {
		html = html.replace(/(<h2>.*?<\/h2>)/, '<header>\n$1\n</header>');
	}
	toc = '<p class="toc">Contents: ' + toc.join('&nbsp;• ') + '</p>';
	html = html.replace(/<\/header>/, toc + '\n</header>');
	return html;
}

return {
	checkBooks: checkBooks,
	getNav: getNav,
	TOC: TOC,
	addToc: addToc
};
})();
