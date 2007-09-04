const WORDDB_BLOCKLENGTH = 27;


/**
 * WordDB()
 * Object for storing and looking up words
 */
WordDB = function() {
	this.reset();
}

WordDB.prototype = {
	// PROPERTIES
	_blocks: 0,
	_arr: null,
	_anm: null,
	addHook: null,
	
	
	// METHODS
	/**
	 * reset()
	 * Resets _arr and _blocks.
	 */
	reset: function() {
		this._blocks = 1;
		this._arr = {};
	},
	
	/**
	 * load(wordList, showProgress)
	 * load(wordList)
	 * Fills the object with words
	 * wordList can be a file name (text file, words on separate lines)
	 * or an array of words.
	 * If showProgress is set, runs asynchronously and calls showProgress
	 */
	load: function(wordList, showProgress, showProgressContext, doneFunc) {
		
		if (typeof(wordList) == 'string') {
			wordList = filesystem.readFile(wordList, true);
		}
		
		if (this._anm && this._anm.kill) {
			this._anm.kill();
		}
		
		this._anm = new CustomAnimation(1, this.loadUpdateFunc, doneFunc); // run the load process as quickly as possible
		this._anm.wordList = wordList;
		this._anm.wdb = this;
		this._anm.showProgress = showProgress;
		this._anm.showProgressContext = showProgressContext;
		this._anm.bookmark = 0;
		this._anm.progOffset = random(0, 300);
		
		animator.start(this._anm);
		
	},
	
	loadUpdateFunc: function() {
		var i;
		
		for (i = this.bookmark; i < this.bookmark + 300 && i < this.wordList.length; i++) {
			if (i == this.bookmark + this.progOffset && this.showProgress) {
				this.showProgress.call(this.showProgressContext, i / this.wordList.length, this.wordList[i]);
			}
			
			this.wdb.add(this.wordList[i]);
			if (this.wdb.addHook) {
				this.wdb.addHook(this.wordList[i]);
			}
		}
		
		if (i >= this.wordList.length) {
			if (this.showProgress) {
				this.showProgress.call(this.showProgressContext, 1, this.wordList[i]);
			}
			delete this.wordList;
			return false;
		} else {
			this.bookmark = i;
			return true;
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



