function getDB() {
	if (typeof(globals.db) == 'undefined') {
		globals.db = new SQLite();
		globals.db.open(system.widgetDataFolder + '/wordlist.sqlite');
		
		var needToAddWords = false;
		
		var res = globals.db.query('SELECT COUNT(*) FROM sqlite_master WHERE type="table" AND name="words"');
		if (!res || res.getColumn(0) == '0') {
			needToAddWords = true;
		} else {
			res.dispose();
			res = globals.db.query('SELECT COUNT(*) FROM words');
			if (!res || res.getColumn(0) == '0') {
				needToAddWords = true;
			}
		}
		
		if (res) {
			res.dispose();
		}
		
		if (needToAddWords) {
			// we need to create the words table
			if (1 == alert('It appears that this is your first time running Babble. I need to build a word database before you can start playing. This can take a few moments, but only needs to be done once. Is it okay for me to do this right now? If not, Babble will close.', 'Yes', 'No')) {
				delay(0.5, function() {
					var words = filesystem.readFile('word.lst', true);
					addWordsToDB(words);
					alert('All right, that\'s done. Thank you for your patience, and I hope you enjoy playing Babble!');
				});
			} else {
				closeWidget();
			}
		}
	}
	
	return globals.db;
}


function addWordsToDB(words) {
	
	globals.db.catchExec('BEGIN TRANSACTION; DROP TABLE IF EXISTS words; CREATE TABLE IF NOT EXISTS words (word TEXT, PRIMARY KEY (word)); COMMIT;');
	
	globals.db.catchExec('BEGIN TRANSACTION;');
	
	for (var i = 0; i < words.length; i++) {
		globals.db.catchExec('INSERT INTO words (word) VALUES ("' + words[i] + '");');
		/*
		if ((i + 1) % 1000 == 0) {
			log('Committing 1000 words (most recent word: ' + words[i]);
			db.catchExec('COMMIT; BEGIN TRANSACTION;');
		}
		*/
	}
	globals.db.catchExec('COMMIT;');
	
}


