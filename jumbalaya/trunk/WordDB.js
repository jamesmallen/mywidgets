const WORDDB_BLOCKLENGTH = 27;


/**
 * WordDB()
 * Object for storing and looking up words
 */
WordDB = function() {
	this._arr = [];
	this._blocks = 1;
}

WordDB.prototype = {
	// PROPERTIES
	_blocks: 0,
	_arr: null,
	addHook: null,
	
	
	// METHODS
	/**
	 * load(wordList, showProgress)
	 * load(wordList)
	 * Fills the object with words
	 * wordList can be a file name (text file, words on separate lines)
	 * or an array of words.
	 * If showProgress is set, logs the latest entry every 1000 words
	 */
	load: function(wordList, showProgress) {
		if (typeof(wordList) == 'string') {
			wordList = filesystem.readFile(wordList, true);
		}
		
		for (var i = 0; i < wordList.length; i++) {
			if (showProgress && (i % 1000 == 0)) {
				log('adding ' + wordList[i]);
			}
			this.add(wordList[i]);
			if (this.addHook) {
				this.addHook(wordList[i]);
			}
		}
		
	},
	
	
	/**
	 * getOffset(letter)
	 */
	getOffset: function(letter) {
		var code = letter.toUpperCase().charCodeAt(0);
		if (code >= 65 && code <= 90) { // code is between A-Z
			return letter.toUpperCase().charCodeAt(0) - 64; // A = 1, Z = 26
		} else {
			return 0;
		}
	},
	
	
	/**
	 * lookup(word)
	 * lookup(word, block)
	 * Returns true if the given word is found in the DB, false otherwise.
	 * If block is provided, starts search from that block.
	 */
	lookup: function(word, block) {
		var offset, innerOffset, nextBlock;
		
		if (!block) {
			block = 0;
		}
		
		offset = block * WORDDB_BLOCKLENGTH;
		if (word) {
			innerOffset = this.getOffset(word);
			if (!innerOffset) {
				// sanity checking to prevent infinite loops
				return false;
			} else {
				// look to see if next block exists
				nextBlock = this._arr[offset + innerOffset];
				if (nextBlock) {
					return this.lookup(word.substr(1), nextBlock);
				} else {
					return false;
				}
			}
		} else {
			return (this._arr[offset] == 0);
		}
	},
	
	/**
	 * permute(letters)
	 * Returns all the words in the WordDB containing (only) the supplied letters
	 */
	permute: function(letters, block, word) {
		var offset, innerOffset, nextBlock;
		
		if (typeof(block) == 'undefined') {
			block = 0;
			letters = letters.split('').sort().join('');
		}
		if (!word) {
			word = '';
		}
		
		var ret = [];
		
		// print("letters: " + letters);
		
		offset = block * WORDDB_BLOCKLENGTH;
		
		for (var i = 0; i < letters.length; i++) {
			if (i > 0 && letters[i] == letters[i - 1]) {
				// prevent duplicates and cut off duplicate branches - win/win!
				continue;
			}
			
			// print('trying "' + word + letters[i] + '"...');
			innerOffset = this.getOffset(letters[i]);
			if (innerOffset) {
				nextBlock = this._arr[offset + innerOffset];
				// print("a:" + nextBlock);
				if (nextBlock) {
					var leftovers = letters.slice(0).split('');
					leftovers.splice(i, 1);
					leftovers = leftovers.join('');
					// print('b: ' + leftovers);
					ret = arrayMerge(ret, this.permute(leftovers, nextBlock, word + letters[i]));
				}
			}
		}
		
		if (this._arr[offset] == 0) {
			// log('adding ' + word);
			ret.push(word);
		}
		return ret;
	},
	
	/**
	 * add(word)
	 * add(word, block)
	 */
	add: function(word, block) {
		var offset, innerOffset, nextBlock;
		
		if (!block) {
			// log('adding ' + word);
			block = 0;
		}
		
		offset = block * WORDDB_BLOCKLENGTH;
		
		if (word) {
			innerOffset = this.getOffset(word);
			if (!innerOffset) {
				// sanity checking to prevent infinite loops
				log('unexpected letter');
				return false;
			} else {
				// look to see if next block exists
				nextBlock = this._arr[offset + innerOffset];
				if (!nextBlock) {
					// add the next block if it doesn't already exist
					nextBlock = this._arr[offset + innerOffset] = this._blocks;
					this._blocks++;
				}
				this.add(word.substr(1), nextBlock);
			}
		} else {
			// add terminator
			this._arr[offset] = 0;
		}
		
		
	},
	
	
	/**
	 * debugBlock(block)
	 */
	debugBlock: function(block) {
		print('[$]: ' + this._arr[block * WORDDB_BLOCKLENGTH]);	
		for (var i = 1; i < WORDDB_BLOCKLENGTH; i++) {
			print('[' + String.fromCharCode(i + 64) + ']: ' + (this._arr[block * WORDDB_BLOCKLENGTH + i] ? this._arr[block * WORDDB_BLOCKLENGTH + i] : ''));
		}
	},
	
	
	/**
	 * find(pattern, limit)
	 * find(pattern)
	 */
	find: function(pattern, limit) {
		
	}
	
}



