

// CONSTRUCTOR
function Bag() {
	this.arr = [];
	
	this.fill();
	
	this.mix();
}

Bag.prototype = {
	// PUBLIC PROPERTIES
	arr: null,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new Bag();
		ret.arr = arrayCopy(this.arr);
		return ret;
	},
	
	/**
	 * fill()
	 * Fills the Bag with letters according to the LETTER_SETUP constant
	 * Returns the number of letters added.
	 */
	fill: function() {
		var letter;
		var t = 0;
		for (var i in LETTER_SETUP) {
			for (var j = 0; j < LETTER_SETUP[i].qty; j++) {
				letter = new Letter(i);
				this.arr.push(letter);
				t++;
			}
		}
		return t;
	},
	
	/**
	 * pull()
	 * Pulls the next letter out of the bag.
	 * Returns the Letter object.
	 */
	pull: function() {
		return this.arr.pop();
	},
	
	/**
	 * mix()
	 * Mixes up the bag
	 */
	mix: function() {
		this.arr = arrayShuffle(this.arr);
	},
	
	
	toString: function() {
		return this.arr.join();
	}
};
