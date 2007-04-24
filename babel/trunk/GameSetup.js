/**
 * GameSetup object
 */

// CONSTRUCTOR
function GameSetup() {
	this.players = [0, 0, 0, 0];
}


GameSetup.controllers = [
	null,
	'human',
	'simple'
];

GameSetup.prototype = {
	// PUBLIC PROPERTIES
	players: null,
	
	// PUBLIC METHODS
	cycleController: function(player) {
		this.players[player] = (this.players[player] + 1) % GameSetup.controllers.length;
		if (this.players[player] == 0 && this.players[player + 1] > 0) {
			// prevent "out" from being selected if there are filled slots below
			this.players[player]++;
		}
		return this.getController(player);
	},
	
	getController: function(player) {
		return GameSetup.controllers[this.players[player]];
	},
	
	toString: function() {
		return this.players.join(',');
	},
	
	/**
	 * Loads GameSetup settings from a string (e.g., a preferences string)
	 */
	fromString: function(str) {
		
		this.players = str.split(',');
	}
	
	
};
