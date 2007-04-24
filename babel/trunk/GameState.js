/**
 * GameState object
 */

// CONSTRUCTOR
// GameState(numPlayers)
function GameState(numPlayers) {
	if (typeof(numPlayers) == 'object' && numPlayers instanceof GameState) {
		// COPY CONSTRUCTOR
		var src = numPlayers;
		numPlayers = src.players.length;
	}
	
	this.board = new Board();
	
	this.players = [];
	for (var i = 0; i < numPlayers; i++) {
		this.players[i] = new Player();
	}
	
	this.bag = new Bag();
	
}


GameState.prototype = {
	// PUBLIC PROPERTIES
	board: null,
	players: null,
	bag: null,
	previousState: null,
	nextState: null,
	currentPlayer: 0,
	firstPasser: null,
	
	
	// PUBLIC METHODS
	copy: function() {
		var ret = new GameState();
		ret.board = this.board.copy();
		for (var i in this.players) {
			ret.players[i] = this.players[i].copy();
		}
		ret.bag = this.bag.copy();
		ret.currentPlayer = this.currentPlayer;
		ret.firstPasser = this.firstPasser;
		
		return ret;
	},
	
	eraseFuture: function() {
		/*
		state = this;
		while (state = state.nextState) {
			state
		}
		*/
		// If automatic garbage collection is amazing, this should be all we need to do...
		this.nextState = null;
	},
	
	stepForward: function(redo) {
		if (!redo) {
			this.eraseFuture();
		}
		if (!this.nextState) {
			this.nextState = this.copy();
			this.nextState.previousState = this;
		}
		return this.nextState;
	},
	
	stepBackward: function() {
		assert(this.previousState, 'Tried to go back to a negative gameState');
		return this.previousState;
	},
	
	toString: function() {
		var ret = [], show = { board: "Board", players: "Players", bag: "Bag" };
		for (var i in show) {
			ret.push(show[i] + ":\n" + this[i]);
		}
		return ret.join("\n");
	}
	
	
};
