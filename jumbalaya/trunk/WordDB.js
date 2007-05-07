const WORDDB_BLOCKLENGTH = 27;


/**
 * WordDB()
 * Singleton object for looking up words
 */
WordDB = {
	// PROPERTIES
	defaultWordList: 'shortword.lst',
	
	// PRIVATE PROPERTIES
	_blocks: 0,
	
	// PRIVATE OBJECTS
	_arr: null,
	
	
	// METHODS
	/**
	 * init(wordList)
	 * init()
	 * Initializes _root object, and fills it with words
	 */
	init: function(wordList) {
		if (!wordList) {
			wordList = this.defaultWordList;
		}
		
		if (typeof(wordList) == 'string') {
			wordList = filesystem.readFile(wordList, true);
		}
		
		if (!this._arr) {
			this._arr = [];
			this._blocks = 1;
		}
		
		for (var i = 0; i < wordList.length; i++) {
			if (i % 1000 == 0) {
				log('adding ' + wordList[i]);
			}
			this.add(wordList[i]);
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
		
		if (!block) {
			block = 0;
		}
		if (!word) {
			word = '';
		}
		
		var ret = [];
		
		offset = block * WORDDB_BLOCKLENGTH;
		
		for (var i in letters) {
			innerOffset = this.getOffset(letters[i]);
			if (innerOffset) {
				log('a');
				nextBlock = this._arr[offset + innerOffset];
				if (nextBlock) {
					log('b: ' + letters[i]);
					var leftovers = letters.slice(0);
					leftovers.splice(i, 1);
					arrayMerge(ret, this.permute(leftovers, nextBlock), word + letters[i]);
				}
			}
		}
		
		if (this._arr[offset] == 0) {
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
				return false;
			} else {
				// look to see if next block exists
				nextBlock = this._arr[offset + innerOffset];
				if (!nextBlock) {
					// add the next block if it doesn't already exist
					nextBlock = this._arr[offset] = this._blocks;
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
	
	
	toFile: function(path) {
		ret = '';
		var ct = 0;
		for (var i in this._arr) {
			ret += i + ':' + this._arr[i] + ',';
			ct++;
			if (ct % 100 == 0) {
				filesystem.writeFile(path, ret + "\n", true);
				ret = '';
			}
		}
	},
	
	
	/**
	 * find(pattern, limit)
	 * find(pattern)
	 */
	find: function(pattern, limit) {
		
	}
	
}



