/**
 * WordDB()
 * Singleton object for looking up words
 */
WordDB = {
	// PROPERTIES
	
	// OBJECTS
	db: null,
	
	
	// METHODS
	/**
	 * init()
	 * Initializes db object, and fills it with words if necessary
	 */
	init: function() {
		this.db = new SQLite();
		this.db.open(system.widgetDataFolder + '/wordlist.sqlite');
		
		var emptyDB = false;
		
		var res = this.db.query('SELECT COUNT(*) FROM sqlite_master WHERE type="table" AND name="words"');
		if (!res || res.getColumn(0) == '0') {
			emptyDB = true;
		} else {
			res.dispose();
			res = this.db.query('SELECT COUNT(*) FROM words');
			if (!res || res.getColumn(0) == '0') {
				emptyDB = true;
			}
		}
		
		if (res) {
			res.dispose();
		}
		
		if (emptyDB) {
			// we need to create the words table
			if (1 == alert('It appears that this is your first time running Babble. I need to build a word database before you can start playing. This can take a few moments, but only needs to be done once. Is it okay for me to do this right now? If not, Babble will close.', 'Yes', 'No')) {
				delay(0.5, function() {
					var words = filesystem.readFile('word.lst', true);
					WordDB.add(words);
					alert('All right, that\'s done. Thank you for your patience, and I hope you enjoy playing Babble!');
				});
			} else {
				closeWidget();
			}
		}
	},
	
	
	/**
	*/
	lookup: function(word) {
		var ret, sql;
		word = word.replace(' ', '_');
		sql = 'SELECT COUNT(*) FROM words WHERE word LIKE "' + addSlashes(word) + '"';
		log(sql);
		var res = this.db.catchQuery(sql);
		if (res.getColumn(0) >= 1) {
			ret = true;
		} else {
			ret = false;
		}
		res.dispose();
		return ret;
	},
	
	
	/**
	 * find(pattern, limit)
	 * find(pattern)
	 */
	find: function(pattern, limit) {
		if (!limit) {
			limit = 50;
		}
		
		var whereStr;
		
		if (pattern instanceof Array) {
			whereStr = [];
			for (var i in pattern) {
				whereStr.push('word LIKE "' + addSlashes(pattern[i]) + '"');
			}
			whereStr = whereStr.join(' OR ');
		} else {
			whereStr = 'word LIKE "' + addSlashes(pattern) + '"';
		}
		
		var ret = [], sql, t;
		
		log('start query');
		
		sql = 'SELECT * FROM words WHERE ' + whereStr + ' LIMIT ' + limit;
		// sql = 'SELECT COUNT(*) FROM words WHERE word LIKE "' + addSlashes(pattern) + '" LIMIT ' + limit;
		log(sql);
		var res = this.db.catchQuery(sql);
		
		while ((t = res.getRow()) != null) {
			ret.push(t['word']);
		}
		
		log('end query');
		
		// ret = res.getColumn(0);
		res.dispose();
		return ret;
	},
	
	/**
	 * add(words, wipe)
	 * Adds an array of words (or just a single word) to the SQLite database.
	 * If wipe is set, then existing words table is dropped
	 * Uses atomic transactions to HUGELY speed up write time
	 */
	add: function(words, wipe) {
		// convert words to an array if necessary
		if (typeof(words) == 'string') {
			words = [words];
		}
		
		if (wipe) {
			this.db.catchExec('BEGIN TRANSACTION; DROP TABLE IF EXISTS words; COMMIT;');
		}
		
		this.db.catchExec('BEGIN TRANSACTION; CREATE TABLE IF NOT EXISTS words (word TEXT, PRIMARY KEY (word)); COMMIT;');
		
		this.db.catchExec('BEGIN TRANSACTION;');
		for (var i = 0; i < words.length; i++) {
			this.db.catchExec('INSERT INTO words (word) VALUES ("' + words[i] + '");');
		}
		this.db.catchExec('COMMIT;');
	}
}


