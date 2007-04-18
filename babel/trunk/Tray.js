

// CONSTRUCTOR
function Tray() {
	this.arr = [];
}

Tray.prototype = {
	// PUBLIC PROPERTIES
	arr: null,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new Tray();
		ret.arr = arrayCopy(this.arr);
		return ret;
	},
	
	
	/**
	 * put(letter, location)
	 * Puts a letter into the tray
	 * letter must be a Letter object
	 * location is optional, and is the index where the new letter should be put
	 */
	put: function(letter, location) {
		assert(this.arr.length < TRAY_SIZE, 'Tray is already full');
		
		if (typeof(location) == 'undefined' || location >= this.arr.length) {
			this.arr.push(letter);
		} else {
			this.arr.splice(location, 0, letter);
		}
	},
	
	
	/**
	 * get(q)
	 * Gets a Letter from the tray (does not pull it out)
	 */
	get: function(q) {
		var i;
		
		if (typeof(q) == 'number') {
			i = q;
		} else {
			i = this.indexOf(q);
		}
		
		if (i >= 0) {
			return this.arr[i];
		} else {
			return null;
		}
	},
	
	/**
	 * remove(q)
	 * Removes a letter from the tray
	 * Returns null if the letter was not found in the tray
	 */
	remove: function(q) {
		var i;
		
		if (typeof(q) == 'number') {
			i = q;
		} else {
			i = this.indexOf(q);
		}
		
		if (i >= 0) {
			return this.arr.splice(i, 1)[0];
		} else {
			return null;
		}
	},
	
	
	/**
	 * sort(criteria, autoReverse)
	 * Sorts the tray by the given criteria (will be eval'd if).
	 * Valid criteria are 'points', 'alpha', 'random', and 'hOffset'
	 */
	sort: function(criteria, autoReverse) {
		var t, ret = [];
		
		if (typeof(autoReverse) == 'undefined') {
			autoReverse = true;
		}
		
		if (autoReverse) {
			var c = arrayCopy(this.arr)
		}
		
		switch (criteria) {
			case 'random':
				while (this.arr.length > 0 && (t = this.arr.splice(random(this.arr.length), 1))) {
					ret.push(t[0]);
				}
				this.arr = ret;
				break;
			case 'points':
			case 'alpha':
			case 'hOffset':
			default:
				this.arr.sort(this.sortFunctions[criteria]);
				break;
		}
		
		if (autoReverse) {
			var doReverse = true;
			for (var i in this.arr) {
				if (this.arr[i] != c[i]) {
					doReverse = false;
					break;
				}
			}
			if (doReverse) {
				this.arr.reverse();
			}
		}
	},
	
	
	sortFunctions: {
		points: function(a, b) {
			if (a.letter == b.letter) {
				return a.image.hOffset - b.image.hOffset;
			} else if (a.points == b.points) {
				return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
			} else {
				return a.points - b.points;
			}
		},
		
		alpha: function(a, b) {
			if (a.letter == b.letter) {
				return a.image.hOffset - b.image.hOffset;
			} else {
				return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
			}
		},
		
		hOffset: function(a, b) {
			return a.image.hOffset - b.image.hOffset;
		}
	},
	
	
	
	/**
	 * fill(src)
	 * Fills the tray with Letters from src.
	 * Returns the number of Letters added.
	 */
	fill: function(src) {
		var letter, i = 0;
		while ((this.arr.length < TRAY_SIZE) && (letter = src.pull())) {
			i++;
			this.arr.push(letter);
		}
		return i;
	},
	
	
	/**
	 * indexOf(q)
	 * Finds the index of the specified letter in the tray.
	 * Takes either a string literal of the letter or a Letter object.
	 */
	indexOf: function(q) {
		if (typeof(q) == 'string') {
			for (var i = 0; i < this.arr.length; i++) {
				if (this.arr[i].toString() == q) {
					return i;
				}
			}
		} else {
			for (var i = 0; i < this.arr.length; i++) {
				if (this.arr[i] == q) {
					return i;
				}
			}
		}
		
		return -1;
	},
	
	toString: function() {
		return this.arr.join();
	}
	
};
