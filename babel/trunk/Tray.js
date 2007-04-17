

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
		
		assert(typeof(letter) == 'object' && letter.constructor != Letter, 'Must put a valid Letter object');
		
		if (typeof(location) == 'undefined' || location >= this.arr.length) {
			this.arr.push(letter);
		} else {
			this.arr.splice(location, 0, letter);
		}
	},
	
	/**
	 * pull(q)
	 * Pulls a letter out of the tray
	 */
	pull: function(q) {
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
