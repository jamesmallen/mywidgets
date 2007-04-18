

// CONSTRUCTOR
function Letter(letter) {
	this.letter = letter;
	this.points = LETTER_SETUP[letter].points;
	this.image = new Image();
	this.image.letterObject = this;
}

Letter.prototype = {
	// PUBLIC PROPERTIES
	letter: null,
	points: 0,
	image: null,
	
	// PUBLIC METHODS
	toString: function() {
		return this.letter;
	}
};
