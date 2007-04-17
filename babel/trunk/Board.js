

// CONSTRUCTOR
function Board() {
	this.arr = new Array(BOARD_HEIGHT * BOARD_WIDTH);
}

Board.prototype = {
	// PUBLIC PROPERTIES
	arr: null,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new Board();
		ret.arr = arrayCopy(this.arr);
		return ret;
	},
	
	/**
	 * get(row, col)
	 * Gets the Letter at a partiular row and column
	 */
	get: function(row, col) {
		this.assertInBounds(row, col);
		return this.arr[row * BOARD_WIDTH + col];
	},
	
	/**
	 * put(row, col, letter)
	 * Puts the Letter at a particular row and olumn
	 */
	put: function(row, col, letter) {
		this.assertInBounds(row, col);
		this.arr[row * BOARD_WIDTH + col] = letter;
	},
	
	/**
	 * assertInBounds(row, col)
	 * Semi-internal helper function to throw an Error if an invalid row or col
	 * is passed in.
	 */
	assertInBounds: function(row, col) {
		assert((0 <= row) && (row < BOARD_HEIGHT) && (0 <= col) && (col < BOARD_WIDTH), 'Specified location is out of bounds');
	},
	
	toString: function() {
		var ret = '', t;
		for (var i = 0; i < BOARD_HEIGHT; i++) {
			for (var j = 0; j < BOARD_WIDTH; j++) {
				t = this.get(i, j);
				if (t) {
					ret += t;
				} else {
					ret += ' ';
				}
			}
			ret += "\n";
		}
		return ret;
	}
	
	
};
