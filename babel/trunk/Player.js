

// CONSTRUCTOR
function Player() {
	this.tray = new Tray();
}

Player.prototype = {
	// PUBLIC PROPERTIES
	tray: null,
	score: 0,
	loseNextTurn: false,
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new Player();
		ret.tray = this.tray.copy();
		ret.score = this.score;
		ret.loseNextTurn = this.loseNextTurn;
		
		return ret;
	},
	
	toString: function() {
		var ret = ['Score: ' + this.score, 'Tray: ' + this.tray];
		if (this.loseNextTurn) {
			ret.push('Will lose next turn.');
		}
		return "\t" + ret.join("\n\t") + "\n";
	}
};
