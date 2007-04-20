

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
	 * getAll()
	 * Returns an array of all of the objects in the Board and their coordinates.
	 */
	getAll: function() {
		var ret = [], t;
		for (var row = 0; row < BOARD_WIDTH; row++) {
			for (var col = 0; col < BOARD_HEIGHT; col++) {
				if (t = this.get(row, col)) {
					ret.push({ row: row, col: col, obj: t });
				}
			}
		}
		return ret;
	},
	
	
	/**
	 * get(row, col)
	 * Gets the object at a partiular row and column
	 */
	get: function(row, col) {
		this.assertInBounds(row, col);
		return this.arr[row * BOARD_WIDTH + col];
	},
	
	/**
	 * put(row, col, obj)
	 * Puts the object at a particular row and olumn
	 */
	put: function(row, col, obj) {
		this.assertInBounds(row, col);
		this.arr[row * BOARD_WIDTH + col] = obj;
	},
	
	/**
	 * remove(row, col)
	 * remove(obj)
	 * Removes any object at the specified location, or, if an object is
	 * passed, removes the object.
	 * Returns the object that was removed (if any), otherwise null.
	 */
	remove: function(row, col) {
		if (typeof(row) != 'number') {
			var t = this.find(row);
			if (t) {
				row = t.row;
				col = t.col;
			} else {
				return null;
			}
		}
		
		var obj = this.get(row, col);
		this.put(row, col, null);
		
		return obj;
	},
	
	/**
	 * find(obj)
	 * Searches the Board for the specified obj.
	 * obj can be passed as a string or the object itself
	 */
	find: function(obj) {
		if (typeof(q) == 'string') {
			for (var row = 0; row < BOARD_HEIGHT; row++) {
				for (var col = 0; col < BOARD_WIDTH; col++) {
					if (this.get(row, col).toString() == q) {
						return { row: row, col: col };
					}
				}
			}
		} else {
			for (var row = 0; row < BOARD_HEIGHT; row++) {
				for (var col = 0; col < BOARD_WIDTH; col++) {
					if (this.get(row, col) == obj) {
						return { row: row, col: col };
					}
				}
			}
		}
		
		return null;
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
