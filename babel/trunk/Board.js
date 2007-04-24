

// CONSTRUCTOR
function Board(height, width) {
	// this.arr = new Array(BOARD_HEIGHT * BOARD_WIDTH);
	if (typeof(width) == 'undefined') {
		width = BOARD_WIDTH;
		height = BOARD_HEIGHT;
	}
	this.arr = [];
	this.multipliers = [];
	this.width = width;
	this.height = height;
}

Board.prototype = {
	// PUBLIC PROPERTIES
	arr: null,
	multipliers: null,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new Board(this.height, this.width);
		
		for (var i in this.arr) {
			ret.put(this.arr[i].row, this.arr[i].col, this.arr[i].obj);
		}
		for (var i in this.multipliers) {
			ret.putMultiplier(this.multipliers[i].row, this.multipliers[i].col, this.multipliers[i].obj);
		}
		return ret;
	},
	
	/**
	 * merge(src)
	 * Merges the contents of src with this Board's contents.
	 * Requires src to have a getAll() method that returns an array of objects
	 * of the format {row, col, obj}.
	 */
	merge: function(src) {
		var t = src.getAll();
		for (var i in t) {
			this.put(t[i].row, t[i].col, t[i].obj);
		}
		this.reorder();
	},
	
	
	/**
	 * getAll()
	 * Returns an array of all of the objects in the Board and their coordinates.
	 */
	getAll: function(target) {
		if (!target) {
			target = this.arr;
		}
		return target.slice(0);
	},
	
	getAllMultipliers: function() {
		return this.getAll(this.multipliers);
	},
	
	
	/**
	 * get(row, col)
	 * Gets the Letter at the specified row and col.
	 * Returns null if there is none.
	 */
	get: function(row, col, target) {
		if (!target) {
			target = this.arr;
		}
		for (var i in target) {
			if (target[i].row == row && target[i].col == col) {
				return target[i].obj;
			}
		}
		return null;
	},
	
	
	
	getMultiplier: function(row, col) {
		return this.get(row, col, this.multipliers);
	},
	
	/**
	 * put(row, col, obj)
	 * Puts the object at a particular row and olumn
	 */
	put: function(row, col, obj, target) {
		if (!target) {
			target = this.arr;
		}
		target.push({row: row, col: col, obj: obj});
		this.reorder(target);
	},
	
	
	putMultiplier: function(row, col, obj) {
		this.put(row, col, obj, this.multipliers);
	},
	
	
	/**
	 * remove(row, col)
	 * remove(obj)
	 * Removes the Letter at the specified row and col from the Board, or the
	 * specified Letter.
	 * Returns the Letter object removed (or null)
	 */
	remove: function(row, col, target) {
		if (!target) {
			target = this.arr;
		}
		for (var i in target) {
			t = target[i];
			if ((typeof(col) == 'undefined' && t.obj == row) || (t.row == row && t.col == col)) {
				target.splice(i, 1);
				return t;
			}
		}
		return null;
	},
	
	removeMultiplier: function(row, col) {
		this.remove(row, col, this.multipliers);
	},
	
	
	/**
	 * find(obj, target)
	 * Looks for the specified obj in the Board.
	 * Returns an object with row, col, and obj attributes, or null if the object
	 * was not found.
	 */
	find: function(obj, target) {
		if (!target) {
			target = this.arr;
		}
		for (var i in target) {
			t = target[i];
			if (t.obj == obj) {
				return t;
			}
		}
		return null;
	},
	
	
	/**
	 * reorder()
	 * reorder(target)
	 * Re-orders the contents of this.arr or target so that they're in
	 * "reading" order.
	 * Called automatically whenever a new Letter is put.
	 */
	reorder: function(target) {
		if (!target) {
			target = this.arr;
		}
		target.sort(function(a, b) {
			if (a.row == b.row) {
				return a.col - b.col;
			} else {
				return a.row - b.row;
			}
		});
	},
	
	
	/**
	 * assertInBounds(row, col)
	 * Semi-internal helper function to throw an Error if an invalid row or col
	 * is passed in.
	 */
	assertInBounds: function(row, col) {
		assert((0 <= row) && (row < this.height) && (0 <= col) && (col < this.width), 'Specified location is out of bounds');
	},
	
	
	toString: function() {
		var boardLines = [], ret, t;
		for (var row = 0; row < this.height; row++) {
			ret = '';
			for (var col = 0; col < this.width; col++) {
				t = this.get(row, col);
				if (t) {
					ret += t;
				} else {
					ret += ' ';
				}
			}
			boardLines.push(ret);
		}
		return boardLines.join("\n");
	}
	
	
};
