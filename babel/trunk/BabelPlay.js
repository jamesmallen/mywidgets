// CONSTRUCTOR
function BabelPlay(board) {
	this.arr = [];
	this.board = board;
}

BabelPlay.prototype = {
	// PUBLIC PROPERTIES
	arr: null,
	board: null,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new BabelPlay(this.board);
		for (var i in this.arr) {
			ret.put(this.arr[i].row, this.arr[i].col, this.arr[i].obj);
		}
		return ret;
	},
	
	/**
	 * put(row, col, obj);
	 * Puts a Letter at the specified row and col.
	 */
	put: function(row, col, obj) {
		if (this.board.get(row, col) || this.get(row, col)) {
			throw new Error('Spot is already occupied.');
		}
		
		this.arr.push({row: row, col: col, obj: obj});
		this.reorder();
		this.getDirection();
	},
	
	/**
	 * get(row, col, includeBoard)
	 * get(row, col)
	 * Gets the Letter at the specified row and col.
	 * If includeBoard is set to true, also looks on the Board.
	 * Returns null if there is none.
	 */
	get: function(row, col, includeBoard) {
		for (var i in this.arr) {
			if (this.arr[i].row == row && this.arr[i].col == col) {
				return this.arr[i].obj;
			}
		}
		if (includeBoard) {
			return this.board.get(row, col);
		}
		return null;
	},
	
	/**
	 * getAll()
	 */
	getAll: function() {
		return this.arr.slice(0);
	},
	
	
	/**
	 * remove(row, col)
	 * remove(obj)
	 * Removes the Letter at the specified row and col from the Play, or the
	 * specified Letter.
	 * Returns the Letter object removed (or null)
	 */
	remove: function(row, col) {
		for (var i in this.arr) {
			t = this.arr[i];
			if ((typeof(col) == 'undefined' && t.obj == row) || (t.row == row && t.col == col)) {
				this.arr.splice(i, 1);
				this.getDirection();
				return t;
			}
		}
		return null;
	},
	
	
	/**
	 * find(obj)
	 * Looks for the specified obj in the Play.
	 * Returns an object with row, col, and obj attributes, or null if the object
	 * was not found.
	 */
	find: function(obj, includeBoard) {
		for (var i in this.arr) {
			t = this.arr[i];
			if (t.obj == obj) {
				return t;
			}
		}
		return null;
	},
	
	
	
	/**
	 * getDirection()
	 * Gets the primary direction of a Play.
	 * If the Play is not in a straight line, returns null.
	 * Normally, you should be able to look this up just by reading
	 * this.direction. Calling getDirection() forces a recalculation.
	 */
	getDirection: function() {
		var letter, playRow = null, playCol = null, vertical = true, horizontal = true;
		
		if (this.arr.length == 0) {
			this.direction = null;
		} else if (this.arr.length == 1) {
			this.direction = PLAY_DIRECTION_BOTH;
		} else {
			
			for (var i in this.arr) {
				if (playRow == null) {
					playRow = this.arr[i].row;
				} else if (playRow != this.arr[i].row) {
					horizontal = false;
				}
				if (playCol == null) {
					playCol = this.arr[i].col;
				} else if (playCol != this.arr[i].col) {
					vertical = false;
				}
				
				if (!vertical && !horizontal) {
					break;
				}
			}
			
			this.direction = (vertical ? PLAY_DIRECTION_VERTICAL : (horizontal ? PLAY_DIRECTION_HORIZONTAL : null));
		}
		return this.direction;
	},
	
	
	/**
	 * isContinuous()
	 * Checks to see that a play is continuous, broken up only by letters on the
	 * board. Assumes that the array is in order
	 */
	isContinuous: function() {
		var row, col, startRow, startCol, endRow, endCol;
		switch (this.direction) {
			case PLAY_DIRECTION_VERTICAL:
				startRow = this.arr[0].row;
				col = this.arr[0].col;
				endRow = this.arr[this.arr.length - 1].row;
				for (var row = startRow, i = 0; row <= endRow; row++) {
					if (this.arr[i].row == row) {
						i++;
					} else if (!this.board.get(row, col)) {
						return false;
					}
				}
				break;
			case PLAY_DIRECTION_HORIZONTAL:
				row = this.arr[0].row;
				startCol = this.arr[0].col;
				endCol = this.arr[this.arr.length - 1].col;
				for (var col = startCol, i = 0; col <= endCol; col++) {
					if (this.arr[i].col == col) {
						i++;
					} else if (!this.board.get(row, col)) {
						return false;
					}
				}
				break;
			default:
				if (this.direction) {
					return true;
				} else {
					return false;
				}
				break;
		}
		return true;
	},
	
	
	
	/**
	 * reorder()
	 * Re-orders the contents of this.arr so that they're in "reading" order.
	 * Called automatically whenever a new Letter is put.
	 */
	reorder: function() {
		this.arr.sort(function(a, b) {
			if (a.row == b.row) {
				return a.col - b.col;
			} else {
				return a.row - b.row;
			}
		});
	},
	
	
	/**
	 * getWords()
	 * Calculates the words formed by the Play.
	 */
	getWords: function() {
		var ret = [], t, word, directions = [PLAY_DIRECTION_VERTICAL, PLAY_DIRECTION_HORIZONTAL];
		
		if (!this.direction) {
			return null;
		}
		
		// look for the main word
		if (this.direction != PLAY_DIRECTION_BOTH) {
			word = this.getWord(this.arr[0].row, this.arr[0].col, this.direction);
			ret.push({direction: this.direction, letters: word});
		}
		
		// look for cross-wise words
		for (var i in this.arr) {
			for (var d in directions) {
				if (this.direction != directions[d]) {
					t = this.arr[i];
					word = this.getWord(t.row, t.col, directions[d]);
					if (word.length > 1) {
						ret.push({direction: directions[d], letters: word});
					}
				}
			}
		}
		
		return ret;
	},
	
	/**
	 * getWord(row, col, direction)
	 * Gets the word around a specific letter in a specific direction
	 */
	getWord: function(row, col, direction) {
		var change, ret = [], t, coords;
		switch (direction) {
			case PLAY_DIRECTION_VERTICAL:
				change = 'row';
				break;
			case PLAY_DIRECTION_HORIZONTAL:
				change = 'col';
				break;
			default:
				return ret;
				break;
		}
		
		coords = {row: row, col: col};
		while (true) {
			coords[change]--;
			if (coords[change] < 0) {
				break;
			}
			// shouldn't need to check this.arr, since we're starting at the top/left
			t = this.board.get(coords.row, coords.col);
			if (!t) {
				break;
			} else {
				ret.unshift({row: coords.row, col: coords.col, obj: t, existingLetter: true});
			}
		}
		
		coords = {row: row, col: col};
		ret.push({row: coords.row, col: coords.col, obj: this.get(row, col), existingLetter: false});
		
		while (true) {
			coords[change]++;
			if (coords[change] >= ((change == PLAY_DIRECTION_VERTICAL) ? BOARD_HEIGHT : BOARD_WIDTH)) {
				break;
			}
			t = this.get(coords.row, coords.col);
			if (t) {
				ret.push({row: coords.row, col: coords.col, obj: t, existingLetter: false});
			} else {
				t = this.board.get(coords.row, coords.col);
				if (t) {
					ret.push({row: coords.row, col: coords.col, obj: t, existingLetter: true});
				} else {
					break;
				}
			}
		}
		
		return ret;
	},
	
	/**
	 * score()
	 * Returns the score for the current play
	 */
	score: function() {
		var totalScore = 0;
		var words = this.getWords();
		for (var i in words) {
			wordScore = 0;
			wordMultiplier = 1.0;
			for (var j in words[i].letters) {
				var letter = words[i].letters[j];
				var letterScore = letter.obj.points;
				var letterMultiplier = 1.0;
				if (!letter.existingLetter) {
					var multiplier = parseInt(this.board.getMultiplier(letter.row, letter.col));
					switch (multiplier) {
						case MULTIPLIER_DOUBLE_LETTER:
							letterMultiplier = 2.0;
							break;
						case MULTIPLIER_TRIPLE_LETTER:
							letterMultiplier = 3.0;
							break;
						case MULTIPLIER_DOUBLE_WORD:
						case MULTIPLIER_HOME_SQUARE:
							wordMultiplier *= 2.0;
							break;
						case MULTIPLIER_TRIPLE_WORD:
							wordMultiplier *= 3.0;
							break;
					}
				}
				letterScore *= letterMultiplier;
				wordScore += letterScore;
			}
			wordScore *= wordMultiplier;
			totalScore += wordScore;
		}
		if (this.arr.length == TRAY_SIZE) {
			// bingo!
			totalScore += BINGO_POINTS;
		}
		return totalScore;
	},
	
	/**
	 * getInfo()
	 * Returns an object with information about the move, such as the words that
	 * were formed.
	 */
	getInfo: function() {
		var continuous = this.isContinuous();
		
		return {
			continuous: continuous,
			direction: this.direction,
			words: this.getWords(),
			score: this.score()
		};
	},
	
	
	/**
	 * toString()
	 * Returns a tournament-style notation of the Play.
	 */
	toString: function() {
		var info = this.getInfo();
		var ret, openParens, wordsInfo = [];
		
		for (var w in info.words) {
			ret = '';
			openParens = false;
			mainWord = info.words[w];
			for (var i in mainWord.letters) {
				var letter = mainWord.letters[i];
				if (!openParens && letter.existingLetter) {
					ret += '(';
					openParens = true;
				} else if (openParens && !letter.existingLetter) {
					ret += ')';
					openParens = false;
				}
				ret += letter.obj.toString();
			}
			if (openParens) {
				ret += ')';
			}
			ret += ' ';
			
			switch (mainWord.direction) {
				case PLAY_DIRECTION_VERTICAL:
					ret += BabelPlay.colString(mainWord.letters[0].col) + BabelPlay.rowString(mainWord.letters[0].row);
					break;
				case PLAY_DIRECTION_HORIZONTAL:
					ret += BabelPlay.rowString(mainWord.letters[0].row) + BabelPlay.colString(mainWord.letters[0].col);
					break;
			}
			
			wordsInfo.push(ret);
		}
		return wordsInfo.join(' / ') + ' ' + info.score;
;
	},
	
};

BabelPlay.rowString = function(row) {
	return '' + parseInt(row + 1);
};
	
BabelPlay.colString = function(col) {
	return String.fromCharCode('A'.charCodeAt(0) + col);
}
	
	
	

