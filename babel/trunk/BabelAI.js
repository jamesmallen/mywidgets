/**
 * BabelAI
 * Collection of classes for dealing with AI
 */

/**
 * BabelAI
 * Base Class
 * (Other AI classes should inherit from this, and override methods as necessary)
 */
function BabelAI(board, tray) {
	if (typeof(board) != 'undefined') {
		this.board = board;
	}
	if (typeof(tray) != 'undefined') {
		this.tray = tray;
	}
	
}

BabelAI.prototype = {
	// PROPERTIES
	board: null,
	tray: null,
	move: null,
	trayLetters: null,
	
	// METHODS
	getMove: function() {
		return this.move;
	}
};


/**
 * BabelAI.simple()
 * Simple AI implementation
 */
BabelAI.simple = function(board, tray) {
	BabelAI.apply(this, [board, tray]); // base constructor call
	
	this.trayLetters = this.tray.toString().split(',');
	
	// find a good move
	var boardAll = this.board.getAll();
	if (boardAll.length == 0) {
		// first move - just find a good one that crosses the center
		print(BabelAI.getPotentialWords(this.trayLetters, false));
		
		throw(new Error('backing out'));
	}
	
}
// begin inheritance stuff
BabelAI.simple.prototype = new BabelAI();
BabelAI.simple.prototype.constructor = BabelAI.simple;
// end inheritance stuff

/**
 *
 */
BabelAI.getPotentialWords = function(letters, addBlank) {
	var t, permutations = [], ret = [];
	log('Finding permutations of ' + letters);
	t = letters.slice(0);
	if (addBlank) {
		t.push('_');
	}
	// for (var i = letters.length; i > 1; i--) {
	permutations = permute(t).slice(0, 20);
	
	for (var i in permutations) {
		permutations[i] = permutations[i].join('');
	}
	
	ret = WordDB.find(permutations);
	
	return ret;
}


BabelAI.scoreString = function(str) {
	var ret = 0;
	str = str.toUpperCase().replace(' ', '_');
	for (var i in str) {
		ret += LETTER_SETUP[str[i]].points;
	}
	return ret;
}


