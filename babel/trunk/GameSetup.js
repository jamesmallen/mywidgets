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
	'cpu'
];

GameSetup.prototype = {
	// PUBLIC PROPERTIES
	players: null,
	
	// PUBLIC METHODS
	cycleController: function(player) {
		this.players[player] = (this.players[player] + 1) % GameSetup.controllers.length;
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
