
log('loading word source plugin');

// Word Source (word.sc) plugin
sources.wordsc = {
	getURL: function(word) {
		return 'http://word.sc/' + escape(word) + '?widget=Dictionary&version=' + escape(widget.version) + '&author=' + escape(widget.author);
	},
	parse: function(response) {
		var ret = '';
		
		// Shorten up the HTML to speed things up and make debugging simpler
		var res = response.match(/<div class="contentwrapper">\s*<div id="contentcolumn">\s*<div id="maincontent">([\s\S]*)<\/div>\s*<\/div>\s*<\/div>\s*<div id="rightcolumn"\s*>/);
		
		if (!res) {
			throw new DictionaryParseError('Unable to find maincontent div.');
		} else {
			response = res[1];
		}
		
		// remove extraneous markup
		response = response.replace(/\s*(onmouseover|onmouseout)\=('([^']+|\\')*'|"([^"]+|\\")*")/g, '');
		
		// add helpful formatting markup
		response = response.replace(/<small>/g, '<div style="padding-top: 2px;"><small>').replace(/<\/small>/g, '</small></div>');
		response = response.replace(/<a class="innerlinks" href="http:\/\/word.sc\/([^"]+)"/g, '<a class="innerlinks" href="http://$1" onclick="lookup(\'$1\', \'wordsc\'); return false;"');
		
		// Find title
		var res = response.match(/<font face="Arial" style="font-size: 17pt"><b>\s*([^<]*)<\/b>/);
		if (!res) {
			throw new DictionaryParseError('Unable to find word title.');
		} else {
			
			ret += '<h1>' + deEnt(res[1]) + "</h1>\n";
			ret += '<div style="font-size: 10px; padding-left: 15px; padding-top: -4px;">From <a href="http://word.sc/' + escape(deEnt(res[1])) + '">http://word.sc/' + deEnt(res[1]) + '</a></div>';
		}
		
		// Look for error
		var res = response.match(/was not found in our dictionary./);
		if (res) {
			throw new DictionaryWordNotFoundError();
		}
		
		// Find word type groupings
		RegExp.lastIndex = 0;
		
		// var test = 
		
		while (res = /<a name="_([^"]+)"><\/a><div id="\1">([^<]|<[^b]|<b[^>])*<b>([^<]*)<\/b>([^<]|<[^o]|<o[^l]|<ol[^>])*<ol>(([^<]|<[^\/]|<\/[^o]|<\/o[^l]|<\/ol[^>])*)<\/ol>/g.exec(response)) {
			ret += '<h2>' + deEnt(res[3]) + "</h2>\n";
			
			ret += '<ol>' + deEnt(res[5]) + "</ol>\n";
		}
		
		return ret;
	}
}

