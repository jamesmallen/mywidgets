
var currentWidth = 246;


var extenderBG = new KImage({src: 'Resources/ExtenderBG*.png', colorize:'#000', opacity:122, mask: 'Resources/SearchBarBG<.png', maskHeight:44}, main_window);
var extender = new KImage({src: 'Resources/Extender*.png', mask: 'Resources/SearchBarBG<.png', maskHeight:44}, main_window);

/*
var resultsBox = new TextArea();
resultsBox.editable = false;
resultsBox.hOffset = 15;
resultsBox.vOffset = 44;
resultsBox.width = currentWidth - 30;
resultsBox.height = 180;
resultsBox.style.fontFamily = "'Lucida Grande', 'Lucida Sans', 'Lucida Sans Unicode', sans-serif";
resultsBox.style.fontSize = '11px';
resultsBox.style.color = '#000';

main_window.appendChild(resultsBox);
*/

resultsBox = new JHTML({hOffset: 16, vOffset: 44, width: currentWidth - 32 - 20, height: 180}, main_window);
resultsBox.vScrollBar = new ScrollBar();
resultsBox.vScrollBar.hOffset = currentWidth - 34;
resultsBox.vScrollBar.vOffset = 44;
resultsBox.vScrollBar.height = 180;
resultsBox.vScrollBar.opacity = 127;
main_window.appendChild(resultsBox.vScrollBar);




var searchBarBG = new KImage({src: 'Resources/SearchBarBG<.png', colorize:'#000', opacity:122}, main_window);

var searchBar = new KImage({src: 'Resources/SearchBar<.png'}, main_window);



var searchBarIcon = new Image();
searchBarIcon.hOffset = 61;
searchBarIcon.vOffset = 11;
searchBarIcon.src = 'Resources/MagnifyIcon.png';
main_window.appendChild(searchBarIcon);


var searchBarGlow = new KImage({src: 'Resources/SearchBarGlow<.png', visible: false}, main_window);


var searchBarInput = new TextArea();
searchBarInput.style.fontFamily = "'Lucida Grande', 'Lucida Sans', 'Lucida Sans Unicode', sans-serif";
searchBarInput.style.fontSize = '12px';
searchBarInput.style.color = '#999';
searchBarInput.data = 'Dictionary';
searchBarInput.hOffset = 74;
searchBarInput.vOffset = 12;
searchBarInput.width = 138;
searchBarInput.lines = 1;
searchBarInput.spellcheck = false;

searchBarInput.onGainFocus = function() {
	searchBarGlow.visible = true;
	if (this.style.color == '#999') {
		this.data = '';
		this.style.color = '#000';
	}
}

searchBarInput.onLoseFocus = function() {
	searchBarGlow.visible = false;
	if (!this.data) {
		this.data = 'Dictionary';
		this.style.color = '#999';
	}
}

searchBarInput.onKeyPress = function() {
	switch (system.event.keyString) {
		case 'Return':
		case 'Enter':
			lookup(this.data);
			break;
		case 'Tab':
			this.rejectKeyPress();
			break;
		default:
			break;
	}
}

widget.onKeyDown = function() {
	log("keyDown - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
}

widget.onKeyUp = function() {
	log("keyUp - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
}

widget.onKeyPress = function() {
	log("keyPress - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
}


var keyCodes = {
	enter:  13,
	escape: 27,
	tab:     9
}


function lookup(word) {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://word.sc/' + escape(word));
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			switch (this.status) {
				case 200:
					try {
						resultsBox.data = parsers.wordsc(this.responseText);
					} catch (e) {
						if (e instanceof DictionaryParseError) {
							log('Parse error');
							pdump(e);
						} else if (e instanceof DictionaryWordNotFoundError) {
							resultsBox.data = '<h1>' + word + '</h1><p>Sorry, but the word ' + word + ' was not found.</p>';
						}
					}
					break;
				default:
					resultsBox.data = this.status + ' ' + this.statusText;
					break;
			}
		}
	}
	request.send();
}


parsers = {
	wordsc: function(text) {
		var ret = '';
		
		// Shorten up the HTML to speed things up and make debugging simpler
		var res = text.match(/<div class="contentwrapper">\s*<div id="contentcolumn">\s*<div id="maincontent">([\s\S]*)<\/div>\s*<\/div>\s*<\/div>\s*<div id="rightcolumn"\s*>/);
		
		if (!res) {
			throw new DictionaryParseError('Unable to find maincontent div.');
		} else {
			text = res[1];
		}
		
		// remove extraneous markup
		text = text.replace(/\s*(onmouseover|onmouseout)\=('([^']+|\\')*'|"([^"]+|\\")*")/g, '');
		
		// add helpful formatting markup
		// text = text.replace(/<small>/g, '<div style="padding-top: 15px;"><small>').replace(/<\/small>/g, '</small></div>');
		
		// Find title
		var res = text.match(/<font face="Arial" style="font-size: 17pt"><b>\s*([^<]*)<\/b>/);
		if (!res) {
			throw new DictionaryParseError('Unable to find word title.');
		} else {
			
			ret += '<h1>' + deEnt(res[1]) + "</h1>\n";
		}
		
		
		// Look for error
		var res = text.match(/was not found in our dictionary./);
		if (res) {
			throw new DictionaryWordNotFoundError();
		}
		
		
		// Find word type groupings
		RegExp.lastIndex = 0;
		
		// var test = 
		
		while (res = /<a name="_([^"]+)"><\/a><div id="\1">([^<]|<[^b]|<b[^>])*<b>([^<]*)<\/b>([^<]|<[^o]|<o[^l]|<ol[^>])*<ol>(([^<]|<[^\/]|<\/[^o]|<\/o[^l]|<\/ol[^>])*)<\/ol>/g.exec(text)) {
			ret += '<h2>' + deEnt(res[3]) + "</h2>\n";
			
			ret += '<ol>' + deEnt(res[5]) + "</ol>\n";
		}
		
		return ret;
	}
}


main_window.appendChild(searchBarInput);


updatePreferences();

widget.onPreferencesChanged = updatePreferences;


function updatePreferences()
{
	extenderBG.opacity = searchBarBG.opacity = preferences.bgOpacity.value;
	extenderBG.colorize = searchBarBG.colorize = preferences.bgColor.value;
}


/*
var k = new KImage({src: 'Resources/ExtenderBG*.png', width: 100, height: 200, hRegistrationPoint:50, vRegistrationPoint:100, rotation: 0, hOffset:200, vOffset:200}, main_window);

var anm1 = new KRotateAnimation(k, 360, 4000, animator.kEaseInOut);

var anm2 = new KResizeAnimation(k, 200, 100, 4000, animator.kEaseInOut, null, true);

animator.start([anm1, anm2]);
*/

function deEnt( s, entities )
{
	if (entities) {
		var oldEntities = currentEntities;
		currentEntities = entities;
	}
	s = s.replace( /&([^;]{1,8});/g, doReplace );
	if (entities) {
		currentEntities = oldEntities;
	}
	return s;
}

function doReplace( str, p1 )
{
	if ( p1[ 0 ] == "#" )
	{
		p1 = p1.substr( 1 );

		if ( p1[ 0 ] == "x" ) p1 = parseInt( p1.match( /[a-f0-9]+$/i ), 16 );
		if ( commonASCII[ p1 ] ) return commonASCII[ p1 ];
		else return String.fromCharCode( p1 );
	}
	else
	{
		return currentEntities[ p1 ];
	}
}

const commonASCII =
{
	128:"\u20AC",130:"\u201A",131:"\u0192",132:"\u201E",133:"\u2026",134:"\u2020",
	135:"\u2021",136:"\u02C6",137:"\u2030",138:"\u0160",139:"\u2039",140:"\u0152",
	141:"",142:"\u017D",143:"",144:"",145:"\u2018",146:"\u2019",147:"\u201C",
	148:"\u201D",149:"\u2022",150:"\u2013",151:"\u2014",152:"\u02DC",153:"\u2122",
	154:"\u0161",155:"\u203A",156:"\u0153",157:"",158:"\u017E",159:"\u0178"
};

const xmlEntities = {
	"quot":"\u0022","amp":"\u0026","lt":"\u003C","gt":"\u003E"
}

const xmlPrepEntities = {
	"nbsp":"\u0020","iexcl":"\u00A1","cent":"\u00A2","pound":"\u00A3",
	"curren":"\u00A4","yen":"\u00A5","brvbar":"\u00A6","sect":"\u00A7","uml":"\u00A8","copy":"\u00A9","ordf":"\u00AA","laquo":"\u00AB",
	"not":"\u00AC","shy":"\u000A","reg":"\u00AE","macr":"\u00AF","deg":"\u00B0","plusmn":"\u00B1","sup2":"\u00B2","sup3":"\u00B3",
	"acute":"\u00B4","micro":"\u00B5","para":"\u00B6","middot":"\u00B7","cedil":"\u00B8","sup1":"\u00B9","ordm":"\u00BA","raquo":"\u00BB",
	"frac14":"\u00BC","frac12":"\u00BD","frac34":"\u00BE","iquest":"\u00BF","Agrave":"\u00C0","Aacute":"\u00C1","Acirc":"\u00C2",
	"Atilde":"\u00C3","Auml":"\u00C4","Aring":"\u00C5","AElig":"\u00C6","Ccedil":"\u00C7","Egrave":"\u00C8","Eacute":"\u00C9",
	"Ecirc":"\u00CA","Euml":"\u00CB","Igrave":"\u00CC","Iacute":"\u00CD","Icirc":"\u00CE","Iuml":"\u00CF","ETH":"\u00D0","Ntilde":"\u00D1",
	"Ograve":"\u00D2","Oacute":"\u00D3","Ocirc":"\u00D4","Otilde":"\u00D5","Ouml":"\u00D6","times":"\u00D7","Oslash":"\u00D8",
	"Ugrave":"\u00D9","Uacute":"\u00DA","Ucirc":"\u00DB","Uuml":"\u00DC","Yacute":"\u00DD","THORN":"\u00DE","szlig":"\u00DF",
	"agrave":"\u00E0","aacute":"\u00E1","acirc":"\u00E2","atilde":"\u00E3","auml":"\u00E4","aring":"\u00E5","aelig":"\u00E6",
	"ccedil":"\u00E7","egrave":"\u00E8","eacute":"\u00E9","ecirc":"\u00EA","euml":"\u00EB","igrave":"\u00EC","iacute":"\u00ED",
	"icirc":"\u00EE","iuml":"\u00EF","eth":"\u00F0","ntilde":"\u00F1","ograve":"\u00F2","oacute":"\u00F3","ocirc":"\u00F4","otilde":"\u00F5",
	"ouml":"\u00F6","divide":"\u00F7","oslash":"\u00F8","ugrave":"\u00F9","uacute":"\u00FA","ucirc":"\u00FB","uuml":"\u00FC",
	"yacute":"\u00FD","thorn":"\u00FE","yuml":"\u00FF","OElig":"\u0152","oelig":"\u0153","Scaron":"\u0160","scaron":"\u0161","Yuml":"\u0178",
	"fnof":"\u0192","circ":"\u02C6","tilde":"\u02DC","Alpha":"\u0391","Beta":"\u0392","Gamma":"\u0393","Delta":"\u0394","Epsilon":"\u0395",
	"Zeta":"\u0396","Eta":"\u0397","Theta":"\u0398","Iota":"\u0399","Kappa":"\u039A","Lambda":"\u039B","Mu":"\u039C","Nu":"\u039D",
	"Xi":"\u039E","Omicron":"\u039F","Pi":"\u03A0","Rho":"\u03A1","Sigma":"\u03A3","Tau":"\u03A4","Upsilon":"\u03A5","Phi":"\u03A6",
	"Chi":"\u03A7","Psi":"\u03A8","Omega":"\u03A9","alpha":"\u03B1","beta":"\u03B2","gamma":"\u03B3","delta":"\u03B4","epsilon":"\u03B5",
	"zeta":"\u03B6","eta":"\u03B7","theta":"\u03B8","iota":"\u03B9","kappa":"\u03BA","lambda":"\u03BB","mu":"\u03BC","nu":"\u03BD",
	"xi":"\u03BE","omicron":"\u03BF","pi":"\u03C0","rho":"\u03C1","sigmaf":"\u03C2","sigma":"\u03C3","tau":"\u03C4","upsilon":"\u03C5",
	"phi":"\u03C6","chi":"\u03C7","psi":"\u03C8","omega":"\u03C9","thetasym":"\u03D1","upsih":"\u03D2","piv":"\u03D6","ensp":"\u2002",
	"emsp":"\u2003","thinsp":"\u2009","zwnj":"\u200C","zwj":"\u200D","lrm":"\u200E","rlm":"\u200F","ndash":"\u2013","mdash":"\u2014",
	"lsquo":"\u2018","rsquo":"\u2019","sbquo":"\u201A","ldquo":"\u201C","rdquo":"\u201D","bdquo":"\u201E","dagger":"\u2020","Dagger":"\u2021",
	"bull":"\u2022","hellip":"\u2026","permil":"\u2030","prime":"\u2032","Prime":"\u2033","lsaquo":"\u2039","rsaquo":"\u203A","oline":"\u203E",
	"frasl":"\u2044","euro":"\u20AC","image":"\u2111","weierp":"\u2118","real":"\u211C","trade":"\u2122","alefsym":"\u2135","larr":"\u2190",
	"uarr":"\u2191","rarr":"\u2192","darr":"\u2193","harr":"\u2194","crarr":"\u21B5","lArr":"\u21D0","uArr":"\u21D1","rArr":"\u21D2",
	"dArr":"\u21D3","hArr":"\u21D4","forall":"\u2200","part":"\u2202","exist":"\u2203","empty":"\u2205","nabla":"\u2207","isin":"\u2208",
	"notin":"\u2209","ni":"\u220B","prod":"\u220F","sum":"\u2211","minus":"\u2212","lowast":"\u2217","radic":"\u221A","prop":"\u221D",
	"infin":"\u221E","ang":"\u2220","and":"\u2227","or":"\u2228","cap":"\u2229","cup":"\u222A","int":"\u222B","there4":"\u2234","sim":"\u223C",
	"cong":"\u2245","asymp":"\u2248","ne":"\u2260","equiv":"\u2261","le":"\u2264","ge":"\u2265","sub":"\u2282","sup":"\u2283","nsub":"\u2284",
	"sube":"\u2286","supe":"\u2287","oplus":"\u2295","otimes":"\u2297","perp":"\u22A5","sdot":"\u22C5","lceil":"\u2308","rceil":"\u2309",
	"lfloor":"\u230A","rfloor":"\u230B","lang":"\u2329","rang":"\u232A","loz":"\u25CA","spades":"\u2660","clubs":"\u2663","hearts":"\u2665",
	"diams":"\u2666"
}

const commonEntities =
{
	"quot":"\u0022","amp":"\u0026","lt":"\u003C","gt":"\u003E","nbsp":"\u0020","iexcl":"\u00A1","cent":"\u00A2","pound":"\u00A3",
	"curren":"\u00A4","yen":"\u00A5","brvbar":"\u00A6","sect":"\u00A7","uml":"\u00A8","copy":"\u00A9","ordf":"\u00AA","laquo":"\u00AB",
	"not":"\u00AC","shy":"\u000A","reg":"\u00AE","macr":"\u00AF","deg":"\u00B0","plusmn":"\u00B1","sup2":"\u00B2","sup3":"\u00B3",
	"acute":"\u00B4","micro":"\u00B5","para":"\u00B6","middot":"\u00B7","cedil":"\u00B8","sup1":"\u00B9","ordm":"\u00BA","raquo":"\u00BB",
	"frac14":"\u00BC","frac12":"\u00BD","frac34":"\u00BE","iquest":"\u00BF","Agrave":"\u00C0","Aacute":"\u00C1","Acirc":"\u00C2",
	"Atilde":"\u00C3","Auml":"\u00C4","Aring":"\u00C5","AElig":"\u00C6","Ccedil":"\u00C7","Egrave":"\u00C8","Eacute":"\u00C9",
	"Ecirc":"\u00CA","Euml":"\u00CB","Igrave":"\u00CC","Iacute":"\u00CD","Icirc":"\u00CE","Iuml":"\u00CF","ETH":"\u00D0","Ntilde":"\u00D1",
	"Ograve":"\u00D2","Oacute":"\u00D3","Ocirc":"\u00D4","Otilde":"\u00D5","Ouml":"\u00D6","times":"\u00D7","Oslash":"\u00D8",
	"Ugrave":"\u00D9","Uacute":"\u00DA","Ucirc":"\u00DB","Uuml":"\u00DC","Yacute":"\u00DD","THORN":"\u00DE","szlig":"\u00DF",
	"agrave":"\u00E0","aacute":"\u00E1","acirc":"\u00E2","atilde":"\u00E3","auml":"\u00E4","aring":"\u00E5","aelig":"\u00E6",
	"ccedil":"\u00E7","egrave":"\u00E8","eacute":"\u00E9","ecirc":"\u00EA","euml":"\u00EB","igrave":"\u00EC","iacute":"\u00ED",
	"icirc":"\u00EE","iuml":"\u00EF","eth":"\u00F0","ntilde":"\u00F1","ograve":"\u00F2","oacute":"\u00F3","ocirc":"\u00F4","otilde":"\u00F5",
	"ouml":"\u00F6","divide":"\u00F7","oslash":"\u00F8","ugrave":"\u00F9","uacute":"\u00FA","ucirc":"\u00FB","uuml":"\u00FC",
	"yacute":"\u00FD","thorn":"\u00FE","yuml":"\u00FF","OElig":"\u0152","oelig":"\u0153","Scaron":"\u0160","scaron":"\u0161","Yuml":"\u0178",
	"fnof":"\u0192","circ":"\u02C6","tilde":"\u02DC","Alpha":"\u0391","Beta":"\u0392","Gamma":"\u0393","Delta":"\u0394","Epsilon":"\u0395",
	"Zeta":"\u0396","Eta":"\u0397","Theta":"\u0398","Iota":"\u0399","Kappa":"\u039A","Lambda":"\u039B","Mu":"\u039C","Nu":"\u039D",
	"Xi":"\u039E","Omicron":"\u039F","Pi":"\u03A0","Rho":"\u03A1","Sigma":"\u03A3","Tau":"\u03A4","Upsilon":"\u03A5","Phi":"\u03A6",
	"Chi":"\u03A7","Psi":"\u03A8","Omega":"\u03A9","alpha":"\u03B1","beta":"\u03B2","gamma":"\u03B3","delta":"\u03B4","epsilon":"\u03B5",
	"zeta":"\u03B6","eta":"\u03B7","theta":"\u03B8","iota":"\u03B9","kappa":"\u03BA","lambda":"\u03BB","mu":"\u03BC","nu":"\u03BD",
	"xi":"\u03BE","omicron":"\u03BF","pi":"\u03C0","rho":"\u03C1","sigmaf":"\u03C2","sigma":"\u03C3","tau":"\u03C4","upsilon":"\u03C5",
	"phi":"\u03C6","chi":"\u03C7","psi":"\u03C8","omega":"\u03C9","thetasym":"\u03D1","upsih":"\u03D2","piv":"\u03D6","ensp":"\u2002",
	"emsp":"\u2003","thinsp":"\u2009","zwnj":"\u200C","zwj":"\u200D","lrm":"\u200E","rlm":"\u200F","ndash":"\u2013","mdash":"\u2014",
	"lsquo":"\u2018","rsquo":"\u2019","sbquo":"\u201A","ldquo":"\u201C","rdquo":"\u201D","bdquo":"\u201E","dagger":"\u2020","Dagger":"\u2021",
	"bull":"\u2022","hellip":"\u2026","permil":"\u2030","prime":"\u2032","Prime":"\u2033","lsaquo":"\u2039","rsaquo":"\u203A","oline":"\u203E",
	"frasl":"\u2044","euro":"\u20AC","image":"\u2111","weierp":"\u2118","real":"\u211C","trade":"\u2122","alefsym":"\u2135","larr":"\u2190",
	"uarr":"\u2191","rarr":"\u2192","darr":"\u2193","harr":"\u2194","crarr":"\u21B5","lArr":"\u21D0","uArr":"\u21D1","rArr":"\u21D2",
	"dArr":"\u21D3","hArr":"\u21D4","forall":"\u2200","part":"\u2202","exist":"\u2203","empty":"\u2205","nabla":"\u2207","isin":"\u2208",
	"notin":"\u2209","ni":"\u220B","prod":"\u220F","sum":"\u2211","minus":"\u2212","lowast":"\u2217","radic":"\u221A","prop":"\u221D",
	"infin":"\u221E","ang":"\u2220","and":"\u2227","or":"\u2228","cap":"\u2229","cup":"\u222A","int":"\u222B","there4":"\u2234","sim":"\u223C",
	"cong":"\u2245","asymp":"\u2248","ne":"\u2260","equiv":"\u2261","le":"\u2264","ge":"\u2265","sub":"\u2282","sup":"\u2283","nsub":"\u2284",
	"sube":"\u2286","supe":"\u2287","oplus":"\u2295","otimes":"\u2297","perp":"\u22A5","sdot":"\u22C5","lceil":"\u2308","rceil":"\u2309",
	"lfloor":"\u230A","rfloor":"\u230B","lang":"\u2329","rang":"\u232A","loz":"\u25CA","spades":"\u2660","clubs":"\u2663","hearts":"\u2665",
	"diams":"\u2666"
};

var currentEntities = commonEntities;


function DictionaryParseError(message) {
	this.message = message;
}

function DictionaryWordNotFoundError(message) {
	this.message = message;
}


// resultsBox.data = '<body><h1>Hello!</h1><p>Testing, 1, <span style="font-size: 14px;">2</span>, <i>3</i>...</p><h2>Heading 2</h2><p>More body text... <strong>la la la<br/>line break<br/>another</strong></p><p>More</p><p>and more</p><p>and yet more</p></body>';

// resultsBox.data = '<body><p>testing<br/>1 2 3 4 5 6 ....<br/>891012031231!</p></body>';


// resultsBox.data = '<body><p>hi ho</p><p style="display: none;">ho hi</p><p>off to work</p></body>';

resultsBox.data = '<body><h1>cast</h1><h2>adjective</h2><ol><li>(of molten metal or glass) formed by pouring or pressing into a mold<br/><small> <b><font color="gray">Similar:</font></b> <a class="innerlinks" href="http://word.sc/formed">formed</a></small></li></ol><h2>noun</h2><ol><li>the actors in a play<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/cast_of_characters">cast of characters</a>, <a class="innerlinks" href="http://word.sc/dramatis_personae">dramatis personae</a></small></li><li>container into which liquid is poured to create a given shape when it hardens<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/mold">mold</a>, <a class="innerlinks" href="http://word.sc/mould">mould</a></small></li><li>the distinctive form in which a thing is made; "pottery of this cast was found throughout the region"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/mold">mold</a>, <a class="innerlinks" href="http://word.sc/stamp">stamp</a></small></li><li class=\'more_n\' style=\'display: none\'>the visual appearance of something or someone; "the delicate cast of his features"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/form">form</a>, <a class="innerlinks" href="http://word.sc/shape">shape</a></small></li><li class=\'more_n\' style=\'display: none\'>bandage consisting of a firm covering (often made of plaster of Paris) that immobilizes broken bones while they heal<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/plaster_bandage">plaster bandage</a>, <a class="innerlinks" href="http://word.sc/plaster_cast">plaster cast</a></small></li><li class=\'more_n\' style=\'display: none\'>object formed by a mold<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/casting">casting</a></small></li><li class=\'more_n\' style=\'display: none\'>the act of throwing dice<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/roll">roll</a></small></li><li class=\'more_n\' style=\'display: none\'>the act of throwing a fishing line out over the water by means of a rod and reel<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/casting">casting</a></small></li><li class=\'more_n\' style=\'display: none\'>a violent throw<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/hurl">hurl</a></small></li></ol><h2>verb</h2><ol><li>put or send forth; "She threw the flashlight beam into the corner"; "The setting sun threw long shadows"; "cast a spell"; "cast a warm light"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/contrive">contrive</a>, <a class="innerlinks" href="http://word.sc/project">project</a>, <a class="innerlinks" href="http://word.sc/throw">throw</a></small></li><li>deposit; "cast a vote"; "cast a ballot"<br/></li><li>select to play,sing, or dance a part in a play, movie, musical, opera, or ballet; "He cast a young woman in the role of Desdemona"<br/></li><li class=\'more_v\' style=\'display: none\'>throw forcefully<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/hurl">hurl</a>, <a class="innerlinks" href="http://word.sc/hurtle">hurtle</a></small></li><li class=\'more_v\' style=\'display: none\'>assign the roles of (a movie or a play) to actors; "Who cast this beautiful movie?"<br/></li><li class=\'more_v\' style=\'display: none\'>move about aimlessly or without any destination, often in search of food or employment; "The gypsies roamed the woods"; "roving vagabonds"; "the wandering Jew"; "The cattle roam across the prairie"; "the laborers drift from one town to the next"; "They ro<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/drift">drift</a>, <a class="innerlinks" href="http://word.sc/ramble">ramble</a>, <a class="innerlinks" href="http://word.sc/range">range</a>, <a class="innerlinks" href="http://word.sc/roam">roam</a>, <a class="innerlinks" href="http://word.sc/roll">roll</a>, <a class="innerlinks" href="http://word.sc/rove">rove</a>, <a class="innerlinks" href="http://word.sc/stray">stray</a>, <a class="innerlinks" href="http://word.sc/swan">swan</a>, <a class="innerlinks" href="http://word.sc/tramp">tramp</a>, <a class="innerlinks" href="http://word.sc/vagabond">vagabond</a>, <a class="innerlinks" href="http://word.sc/wander">wander</a></small></li><li class=\'more_v\' style=\'display: none\'>form by pouring (e.g., wax or hot metal) into a cast or mold; "cast a bronze sculpture"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/mold">mold</a>, <a class="innerlinks" href="http://word.sc/mould">mould</a></small></li><li class=\'more_v\' style=\'display: none\'>get rid of; "he shed his image as a pushy boss"; "shed your clothes"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/cast_off">cast off</a>, <a class="innerlinks" href="http://word.sc/drop">drop</a>, <a class="innerlinks" href="http://word.sc/shake_off">shake off</a>, <a class="innerlinks" href="http://word.sc/shed">shed</a>, <a class="innerlinks" href="http://word.sc/throw">throw</a>, <a class="innerlinks" href="http://word.sc/throw_away">throw away</a>, <a class="innerlinks" href="http://word.sc/throw_off">throw off</a></small></li><li class=\'more_v\' style=\'display: none\'>choose at random; "draw a card"; "cast lots"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/draw">draw</a></small></li><li class=\'more_v\' style=\'display: none\'>formulate in a particular style or language; "I wouldn\'\'t put it that way"; "She cast her request in very polite language"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/couch">couch</a>, <a class="innerlinks" href="http://word.sc/frame">frame</a>, <a class="innerlinks" href="http://word.sc/put">put</a>, <a class="innerlinks" href="http://word.sc/redact">redact</a></small></li><li class=\'more_v\' style=\'display: none\'>eject the contents of the stomach through the mouth; "After drinking too much, the students vomited"; "He purged continuously"; "The patient regurgitated the food we gave him last night"<br/><small><b><font color="gray">Synonyms:</font></b> <a class="innerlinks" href="http://word.sc/barf">barf</a>, <a class="innerlinks" href="http://word.sc/be_sick">be sick</a>, <a class="innerlinks" href="http://word.sc/cat">cat</a>, <a class="innerlinks" href="http://word.sc/chuck">chuck</a>, <a class="innerlinks" href="http://word.sc/disgorge">disgorge</a>, <a class="innerlinks" href="http://word.sc/honk">honk</a>, <a class="innerlinks" href="http://word.sc/puke">puke</a>, <a class="innerlinks" href="http://word.sc/purge">purge</a>, <a class="innerlinks" href="http://word.sc/regorge">regorge</a>, <a class="innerlinks" href="http://word.sc/regurgitate">regurgitate</a>, <a class="innerlinks" href="http://word.sc/retch">retch</a>, <a class="innerlinks" href="http://word.sc/sick">sick</a>, <a class="innerlinks" href="http://word.sc/spew">spew</a>, <a class="innerlinks" href="http://word.sc/spue">spue</a>, <a class="innerlinks" href="http://word.sc/throw_up">throw up</a>, <a class="innerlinks" href="http://word.sc/upchuck">upchuck</a>, <a class="innerlinks" href="http://word.sc/vomit">vomit</a>, <a class="innerlinks" href="http://word.sc/vomit_up">vomit up</a></small><small> <b><font color="gray">Antonyms:</font></b> <a class="innerlinks" href="http://word.sc/keep_down">keep down</a></small></li></ol></body>';

// resultsBox.data = '<body><h1>Hello!</h1><p>Testing, 1, 2, 3...</p><h2>Heading 2</h2><p>More body text... la la la</p></body>';
// resultsBox.data = '<body><p>Testing</p><p>More</p><p>and more</p><p>and yet more</p></body>';