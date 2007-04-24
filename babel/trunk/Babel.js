
include('lib.js');

include('ImageText.js');

include('BabelConstants.js');
include('Letter.js');
include('Bag.js');
include('Tray.js');
include('Player.js');
include('Board.js');
include('GameSetup.js');
include('GameState.js');
include('WordDB.js');
include('BabelRules.js');
include('AnimationQueue.js');
include('BabelStats.js');
include('FadeButton.js');
include('BabelAI.js');
include('BabelPlay.js');







/**
 * BabelController
 * Singleton object for maintaining state and whatnot
 */

BabelController = {
	// PROPERTIES
	setup: null,      // GameSetup object
	state: null,      // GameState object
	
	play: null,       // Play object
	blankBoard: null, // Board object
	
	// METHODS
	/**
	 * init()
	 */
	init: function() {
		this.setup = new GameSetup();
		this.setup.fromString(preferences.lastGameSetup.value);
		
		this.blankBoard = new Board(BOARD_HEIGHT, BOARD_WIDTH);
		this.initMultipliers();
		
		this.updateFromPreferences();
		
		BabelView.init();
		BabelView.refresh();
		
	},
	
	
	/**
	 * initMultipliers()
	 * Adds the multipliers to the current GameState's Board object
	 */
	initMultipliers: function() {
		for (var type in MULTIPLIERS) {
			for (var i in MULTIPLIERS[type]) {
				if (MULTIPLIERS[type][i]) {
					this.blankBoard.putMultiplier(Math.floor(i / this.blankBoard.height), (i % this.blankBoard.width), type);
				}
			}
		}
	},
	
	
	backToMainMenu: function() {
		this.init();
	},
	
	
	/**
	 * newGame()
	 * Initializes values to defaults, creates important stuff
	 */
	newGame: function() {
		preferences.lastGameSetup.value = this.setup.toString();
		
		this.state = new GameState(this.blankBoard);
		
		for (var i in this.setup.players) {
			if (this.setup.getController(i)) {
				this.state.players[i] = new Player();
			}
		}
		
		this.state.currentPlayer = this.pickStartingPlayer();
		alert('Player ' + parseInt(this.state.currentPlayer + 1) + ' will go first.');
		
		for (var i = 0; i < this.state.players.length; i++) {
			this.state.players[(i + this.state.currentPlayer) % this.state.players.length].tray.fill(this.state.bag);
		}
		
		BabelView.newGame();
		
		this.newPlay();
		
	},
	
	getNextPlayer: function(p) {
		if (typeof(p) == 'undefined') {
			p = this.state.currentPlayer;
		}
		return (p + 1) % this.state.players.length;
	},
	
	getPreviousPlayer: function(p) {
		if (typeof(p) == 'undefined') {
			p = this.state.currentPlayer;
		}
		return (p + this.state.players.length - 1) % this.state.players.length;
	},
	
	
	pickStartingPlayer: function() {
		return random(0, this.state.players.length);
	},
	
	countHumanPlayers: function() {
		ret = 0;
		for (var i in this.setup.players) {
			if (this.setup.getController(i) == 'human') {
				ret++;
			}
		}
		return ret;
	},
	
	
	/**
	 * updateFromPreferences()
	 * Gets the latest important values from preferences
	 */
	updateFromPreferences: function() {
		if (BabelView.scale && (preferences.scale.value != BabelView.scale)) {
			// move window to keep board centered
			// if only hAlign actually worked on Window objects, this would be unnecessary
			var mainOffsetDiff = (9.5 * parseInt(preferences.scale.value) - 9.5 * BabelView.scale);
			mainWindow.hOffset -= mainOffsetDiff;
			mainWindow.vOffset -= mainOffsetDiff;
		}
		BabelView.scale = parseInt(preferences.scale.value);
		
		BabelView.statsSide = preferences.statsSide.value;
	},
	
	
	isValidPlay: function(debug) {
		try {
			if (BabelRules.isValidPlay(this.play)) {
				return true;
			}
		} catch (ex) {
			if (debug) {
				pdump(ex);
			}
		}
		return false;
	},
	
	assignBlanks: function() {
		var playAll = this.play.getAll();
		var blanks = [], t, filledBlank;
		
		for (var i in playAll) {
			if (playAll[i].obj.letter == '_' || playAll[i].obj.letter != playAll[i].obj.letter.toUpperCase()) {
				blanks.push(playAll[i].obj);
			}
		}
		
		if (blanks.length > 1) {
			for (var i in blanks) {
				filledBlank = false;
				while (true) {
					t = prompt('What letter is blank #' + (parseInt(i) + 1) + ' supposed to be?', '', 'Fill in the Blank');
					if (t && /^[a-z]$/i.test(t)) {
						blanks[i].letter = t.toLowerCase();
						blanks[i].image.tooltip = t.toUpperCase() + ' - 0 points';
						filledBlank = true;
						break;
					} else {
						alert('You must enter a valid letter!');
					}
				}
			}
		} else if (blanks.length == 1) {
			filledBlank = false;
			while (true) {
				t = prompt('What letter is the blank supposed to be?', '', 'Fill in the Blank', 'OK', '');
				if (t && /^[a-z]$/i.test(t)) {
					blanks[0].letter = t.toLowerCase();
					blanks[0].image.tooltip = t.toUpperCase() + ' - 0 points';
					filledBlank = true;
					break;
				} else {
					alert('You must enter a valid letter!');
				}
			}
		}
		
	},
	
	
	/**
	 * challenge()
	 * Challenges the previous play.
	 */
	challenge: function() {
		var invalidWords = BabelRules.getInvalidWords(this.state.lastPlay.getInfo().words);
		
		if (invalidWords.length > 0) {
			// challenge is acceptable!
			log('The word(s) ' + invalidWords.join(', ') + ' were not found.');
			alert('The challenge was acceptable. The word' + (invalidWords.length > 1 ? ('s below were not found in the word list:\n' + invalidWords.join("\n")) : (' ' + invalidWords[0] + ' was not found in the word list.')));
			
			// remove play from board, put it back in player's tray
			var letters = this.state.lastPlay.getAll();
			for (var i in letters) {
				this.state.board.remove(letters[i].row, letters[i].col);
			}
			// put pulled letters back in bag
			for (var i in letters) {
				this.state.bag.put(this.state.players[this.getPreviousPlayer()].tray.pop());
			}
			// put old letters back in tray
			for (var i in letters) {
				this.state.players[this.getPreviousPlayer()].tray.put(letters[i].obj);
			}
			
			// roll back score
			this.state.players[this.getPreviousPlayer()].score = this.state.previousState.players[this.getPreviousPlayer()].score;
			
			return true;
		} else {
			// challenge is unacceptable - act like a pass
			alert('The challenge was unacceptable. It is now Player ' + (parseInt(this.getNextPlayer()) + 1) + "'s turn.");
			this.pass();
			return false;
		}
	},
	
	
	/**
	 * playerIsOut(id)
	 * playerIsOut()
	 * Returns true if the current player is out.
	 */
	isEndGame: function(id) {
		if (typeof(id) == 'undefined') {
			id = this.state.currentPlayer;
		}
		// looks to see if a player is out and the bag is out
		if (this.state.bag.arr.length == 0 && this.state.players[this.state.currentPlayer].tray.arr.length == 0) {
			return true;
		} else {
			return false;
		}
	},
	
	
	/**
	 * endGame()
	 * Ends the game, calculating deduction/bonus points
	 */
	endGame: function(outPlayer) {
		var finalScores = [], outPlayers = [], leftOverPoints = 0;
		for (var i in this.state.players) {
			finalScores[i] = parseInt(this.state.players[i].score);
			var tray = this.state.players[i].tray;
			if (tray.arr.length == 0) {
				outPlayers.push(i);
			} else {
				for (var j in tray.arr) {
					leftOverPoints += parseInt(tray.arr[j].points);
					finalScores[i] -= parseInt(tray.arr[j].points);
				}
			}
		}
		
		pdump(finalScores);
		pdump(outPlayers);
		
		for (var i in outPlayers) {
			finalScores[outPlayers[i]] += leftOverPoints;
		}
		
		var bestScores = {score: 0, players: []};
		for (var i in finalScores) {
			if (finalScores[i] > bestScores.score) {
				bestScores.score = finalScores[i];
				bestScores.players = [i];
			} else if (finalScores[i] == bestScores.score) {
				bestScores.players.push(i);
			}
		}
		
		pdump(finalScores);
		
		log('Final Score:');
		var scoreStr = '';
		for (var i in finalScores) {
			scoreStr += 'Player ' + (parseInt(i) + 1) + ': ' + finalScores[i] + '\n';
		}
		log(scoreStr);
		
		// alert('Final Score:\n' + scoreStr + 'Thank you for playing Babel!');
		
		// TODO - handle ties appropriately
		
	},
	
	
	/**
	 * endTurn()
	 * Analyzes the current play and attempts to end it
	 */
	endTurn: function() {
		if (this.isValidPlay(true)) {
			log('play is valid!');
			
			this.assignBlanks();
			
			var playInfo = this.play.getInfo();
			
			if (preferences.challengeMode.value != 1) {
				var invalidWords = BabelRules.getInvalidWords(playInfo.words);
				
				if (invalidWords.length > 0) {
					log('The word(s) ' + invalidWords.join(', ') + ' were not found in the word list.');
					alert('The word' + (invalidWords.length > 1 ? ('s below were not found in the word list:\n' + invalidWords.join("\n")) : (' ' + invalidWords[0] + ' was not found in the word list.')));
					return false;
				}
			}
			
			// move to the next state
			this.state = this.state.stepForward();
			this.state.lastPlay = this.play.copy();
			
			log(this.play);
			// adjust score
			this.state.players[this.state.currentPlayer].score += this.play.score();
			
			// TODO allow challenges after final move?
			
			
			// modify board
			this.state.board.merge(this.play);
			BabelView.drawBoard();
			
			
			if (this.isEndGame()) {
				this.endGame();
			} else {
			
				
				
				// fill tray
				this.state.players[this.state.currentPlayer].tray.fill(this.state.bag);
				
				// end the turn
				this.state.firstPasser = null;
				this.nextPlayer();
			}
		}
	},
	
	nextPlayer: function() {
		this.state.currentPlayer = this.getNextPlayer();
		this.newPlay();
		
	},
	
	
	pass: function() {
		// return letters to the tray
		var playLetters = this.play.getAll();
		for (var i in playLetters) {
			log('removing ' + playLetters[i]);
			print(this.removeFromPlay(playLetters[i].obj));
		}
		
		this.state = this.state.stepForward();
		this.state.lastPlay = null;
		if (this.state.firstPasser == this.getNextPlayer() || this.state.players.length == 1) {
			if (this.state.board.getAll().length == 0) {
				alert('All players have passed on the first turn - restarting game.');
				this.newGame();
			} else {
				alert('All players have passed - ending game.');
				this.endGame();
			}
		} else if (this.state.firstPasser == null) {
			log('setting firstPasser to ' + this.state.currentPlayer);
			this.state.firstPasser = this.state.currentPlayer;
		}
		
		this.nextPlayer();
	},
	
	/**
	 * newPlay()
	 * Initializes things for a new play.
	 */
	newPlay: function() {
		this.play = new BabelPlay(this.state.board);
		
		var curController = this.setup.getController(this.state.currentPlayer);
		
		if (curController == 'human') {
			// hand off control to the view
			BabelView.newPlay();
		} else if (BabelAI[curController]) {
			var AI = new BabelAI[curController](this.state.board, this.state.players[this.state.currentPlayer].tray);
			AI.makePlay(this.play);
 		} else {
			log('uh oh - a controller-less player is in the game!');
			throw new Error('Controller error');
		}
		
	},
	
	/**
	 * addToPlay(letter, row, col)
	 * Attempts to add a letter to the current play.
	 * Returns true if the letter was added, or false if it was not.
	 */
	addToPlay: function(letter, row, col) {
		// make sure the space is unoccupied
		try {
			if (this.play.get(row, col, true)) {
				return false;
			} else {
				this.state.players[this.state.currentPlayer].tray.remove(letter);
				this.play.remove(letter);
				this.play.put(row, col, letter);
			}
		} catch (ex) {
			pdump(ex);
		}
		
		return true;
		
		/*
		if (!(this.play.get(row, col)) && !(this.state.board.get(row, col))) {
			// remove the letter if it's currently on the Play board or in the tray
			this.state.players[this.state.currentPlayer].tray.remove(letter);
			this.play.remove(letter);
			// add it at the correct location
			this.play.put(row, col, letter);
			return true;
		} else {
			return false;
		}
		*/
	},
	
	
	/**
	 * removeFromPlay(row, col)
	 * removeFromPlay(letter)
	 * Removes the specified Letter from the current play.
	 * Returns true if the Letter was removed, or false if the Letter 
	 * was not in the play to begin with.
	 */
	removeFromPlay: function(row, col) {
		if ((letter = this.play.remove(row, col)) != null) {
			// add it back into the tray
			this.state.players[this.state.currentPlayer].tray.put(letter.obj);
			return true;
		} else {
			return false;
		}
	},
	
	
	sortTray: function(criteria, autoReverse) {
		this.state.players[this.state.currentPlayer].tray.sort(criteria, autoReverse);
	},
	
	
	/**
	 * exchange()
	 * exchange(letters)
	 * Exchanges letters in the current tray with letters from the bag.
	 * Will prompt for letters if letters is not supplied.
	 */
	exchange: function(letters) {
		if (this.state.bag.arr.length < TRAY_SIZE) {
			alert('The bag has too few letters to be able to exchange.');
			return;
		}
		var exchangePile = [];
		if (!letters) {
			var t = prompt('Which letters would you like to exchange?\nEnter _ for blanks, otherwise just enter the letter, with no punctuation or spaces.', '', 'Exchange Letters', 'Exchange', 'Cancel');
			if (!t) {
				return;
			} else {
				if (!/^[a-zA-Z_]+$/.test(t)) {
					return;
				}
				var letters = t.split('');
			}
		}
		
		var tray = this.state.players[this.state.currentPlayer].tray;
		
		for (var i in letters) {
			var t = tray.remove(letters[i].toUpperCase());
			if (t) {
				exchangePile.push(t);
			}
		}
		
		// get new letters
		tray.fill(this.state.bag);
		
		// put old letters into bag
		for (var i in exchangePile) {
			this.state.bag.put(exchangePile[i]);
		}
		
		// mix up bag
		this.state.bag.mix();
		
		// act like a pass
		this.pass();
		
	}
	
	
};


/**
 * BabelView
 * Singleton object for maintaining view
 */
BabelView = {
	// PROPERTIES
	scale: 0,
	imagesPath: 'Resources/',
	
	// VIEW OBJECTS
	statsFrame: null,
	statsWritingFrame: null,
	boardFrame: null,
	gridFrame: null,
	trayFrames: [null, null, null, null],
	playFrames: [null, null, null, null],
	
	
	// METHODS
	/**
	 * init()
	 * Create view objects
	 * Make sure that this.scale has been set before calling!
	 */
	init: function() {
		// clear things out
		emptyFrame(mainWindow);
		
		// Build context menu
		var cxt = [];
		var tItem = new MenuItem();
		tItem.title = 'Back to Main Menu';
		tItem.onSelect = function() {
			if (1 == alert('Are you sure you want to go back to the Main Menu? This will end any game in progress.', 'Yes', 'No')) {
				BabelController.backToMainMenu();
			}
		};
		cxt.push(tItem);
		mainWindow.contextMenuItems = cxt;
		
		mainWindow.scaleWidth = 25;
		mainWindow.scaleHeight = 21.5;
		
		// statsFrame
		this.statsFrame = new Frame();
		mainWindow.appendChild(this.statsFrame);
		
		var statsBG = new Image();
		statsBG.scaleSrc = 'StatsBG';
		statsBG.scaleWidth = 8;
		statsBG.scaleHeight = 19;
		this.statsFrame.appendChild(statsBG);
		
		var statsLogo = new Image();
		statsLogo.scaleSrc = 'StatsLogo';
		statsLogo.scaleWidth = 3.5078125;
		statsLogo.scaleHeight = 1.03125;
		statsLogo.hAlign = 'center';
		statsLogo.scaleHOffset = 4;
		statsLogo.scaleVOffset = 2.5625;
		this.statsFrame.appendChild(statsLogo);
		
		this.statsWritingFrame = new Frame();
		this.statsWritingFrame.opacity = 191;
		this.statsFrame.appendChild(this.statsWritingFrame);
		
		this.initStatsUI();
		
		// boardFrame
		this.boardFrame = new Frame();
		mainWindow.appendChild(this.boardFrame);
		
		var board = new Image();
		board.scaleSrc = 'Board';
		board.scaleWidth = board.scaleHeight = 19;
		this.boardFrame.appendChild(board);
		
		this.gridFrame = new Frame();
		this.gridFrame.scaleHOffset = this.gridFrame.scaleVOffset = 2;
		this.boardFrame.appendChild(this.gridFrame);
		
		var grid = new Image();
		grid.scaleSrc = 'Grid';
		grid.fillMode = 'tile';
		grid.tileOrigin = 'topleft';
		this.gridFrame.appendChild(grid);
		
		this.gridFrame.scaleWidth = this.gridFrame.scaleHeight = grid.scaleWidth = grid.scaleHeight = 15;
		
		this.initMultipliers();
		this.initTrays();
	},
	
	/**
	 * refresh()
	 * updates positions and all that jazz
	 */
	refresh: function() {
		switch (this.statsSide) {
			case 'left':
				this.statsFrame.scaleHOffset = 0;
				this.boardFrame.scaleHOffset = 6;
			break;
			case 'right':
			default:
				this.statsFrame.scaleHOffset = 17;
				this.boardFrame.scaleHOffset = 0;
			break;
		}
		this.drawScaledRecursive(mainWindow);
		this.updateScores();
	},
	
	
	showMenu: function() {
		this.fadeStatsFrames(this.mainMenuFrame);
	},
	
	showScores: function() {
		this.fadeStatsFrames(this.scoresFrame);
	},
	
	fadeStatsFrames: function(activeFrame) {
		var anms = [];
		for (var i = this.statsFrame.firstChild; i != null; i = i.nextSibling) {
			if (i instanceof Frame && i != activeFrame && i.opacity > 0) {
				anms.push(new FadeAnimation(i, 0, STATS_FADE_DURATION));
			}
		}
		anms.push(new FadeAnimation(activeFrame, 255, STATS_FADE_DURATION));
		animator.start(anms);
	},
	
	fadeTrayFrames: function(activeFrame) {
		var anms = [];
		for (var i in this.trayFrames) {
			var t = this.trayFrames[i];
			if (t instanceof Frame && t != activeFrame && t.opacity > 0) {
				anms.push(new FadeAnimation(t, 0, TRAY_FADE_DURATION));
			}
		}
		if (activeFrame) {
			anms.push(new FadeAnimation(activeFrame, 255, TRAY_FADE_DURATION));
		}
		animator.start(anms);
	},
	
	
	updateScores: function() {
		emptyFrame(this.scoreDigitsFrame);
		if (BabelController.state) {
			for (var i = 0; i < BabelController.state.players.length; i++) {
				this.scoreLabels[i].visible = true;
				
				tScore = new ImageText({src: 'Resources/ScoreDigits/*.png', scaleHOffset: 4.0, scaleVOffset: 6.575 + i}, this.scoreDigitsFrame);
				tScore.scaleMultiplier = 0.5 * (this.scale / 64);
				tScore.data = BabelController.state.players[i].score;
			}
			for (; i < this.scoreLabels.length; i++) {
				this.scoreLabels[i].visible = false;
			}
			this.curPlayerLabel.scaleVOffset = 6.5 + (1 * BabelController.state.currentPlayer);
		}
		this.drawScaledRecursive(this.scoresFrame);
		if (preferences.challengeMode.value == 1 && BabelController.countHumanPlayers() > 1) {
			this.challengeButton.visible = true;
		} else {
			this.challengeButton.visible = false;
		}
	},
	
	
	initStatsUI: function() {
		this.mainMenuFrame = new Frame();
		this.mainMenuFrame.opacity = 0;
		this.statsFrame.appendChild(this.mainMenuFrame);
		
		this.scoresFrame = new Frame();
		this.scoresFrame.opacity = 0;
		this.statsFrame.appendChild(this.scoresFrame);
		
		this.scoreDigitsFrame = new Frame();
		this.scoreDigitsFrame.opacity = FADEBUTTON_OPACITY;
		this.scoresFrame.appendChild(this.scoreDigitsFrame);
		
		
		var newGameButton = new Image();
		newGameButton.opacity = FADEBUTTON_OPACITY;
		newGameButton.scaleSrc = 'Menu/NewGame';
		newGameButton.hAlign = 'center';
		newGameButton.scaleHOffset = 4;
		newGameButton.scaleVOffset = 4.5;
		newGameButton.scaleWidth = 4;
		newGameButton.scaleHeight = 1.34375;
		this.mainMenuFrame.appendChild(newGameButton);
		
		this.playersMenuFrame = new Frame();
		this.mainMenuFrame.appendChild(this.playersMenuFrame);
		
		this.scoreLabels = [];
		
		for (var i = 0; i < 4; i++) {
			var tLabel = new Image();
			tLabel.scaleSrc = 'Menu/P' + (i + 1) + '_';
			tLabel.hAlign = 'center';
			tLabel.scaleWidth = 4;
			tLabel.scaleHeight = 0.5;
			tLabel.scaleHOffset = 4;
			tLabel.scaleVOffset = 6.5 + i;
			tLabel.opacity = FADEBUTTON_OPACITY;
			this.playersMenuFrame.appendChild(tLabel);
			
			this.scoreLabels[i] = new Image();
			this.scoreLabels[i].scaleSrc = 'Menu/P' + (i + 1) + '_';
			this.scoreLabels[i].hAlign = 'center';
			this.scoreLabels[i].scaleWidth = 4;
			this.scoreLabels[i].scaleHeight = 0.5;
			this.scoreLabels[i].scaleHOffset = 4.5;
			this.scoreLabels[i].scaleVOffset = 6.5 + i;
			this.scoreLabels[i].opacity = FADEBUTTON_OPACITY;
			this.scoresFrame.appendChild(this.scoreLabels[i]);
			
			var tButton = makeFadeButton();
			tButton.hAlign = 'center';
			tButton.player = i;
			tButton.scaleWidth = 4;
			tButton.scaleHeight = 0.5;
			tButton.scaleHOffset = 4;
			tButton.scaleVOffset = 6.5 + i;
			tButton.scaleSrc = this.getControllerSrc(i);
			tButton.onClick = function() {
				BabelView.cyclePlayerController(this.player);
			};
			this.playersMenuFrame.appendChild(tButton);
			
		}
		
		this.startButton = makeFadeButton();
		this.startButton.hAlign = 'center';
		this.startButton.scaleWidth = 4;
		this.startButton.scaleHeight = 0.453125;
		this.startButton.scaleHOffset = 4;
		this.startButton.scaleVOffset = 10.75;
		this.startButton.scaleSrc = 'Menu/Start';
		this.startButton.onClick = function() {
			BabelController.newGame();
		}
		this.playersMenuFrame.appendChild(this.startButton);
		
		var help = makeFadeButton();
		help.scaleSrc = 'Menu/Help';
		help.hAlign = 'center';
		help.scaleHOffset = 4;
		help.scaleVOffset = 16;
		help.scaleWidth = 4;
		help.scaleHeight = 0.421875;
		help.onClick = function() { BabelView.playersMenuFrame.visible = false; BabelView.showHelp(); };
		this.mainMenuFrame.appendChild(help);
		
		this.updatePlayerControllers();
		
		
		this.curPlayerLabel = new Image();
		this.curPlayerLabel.scaleSrc = 'Menu/PArrow';
		this.curPlayerLabel.scaleWidth = 0.25;
		this.curPlayerLabel.scaleHeight = 0.5;
		this.curPlayerLabel.scaleHOffset = 2.25;
		this.curPlayerLabel.scaleVOffset = 6.5;
		this.curPlayerLabel.opacity = FADEBUTTON_OPACITY;
		this.scoresFrame.appendChild(this.curPlayerLabel);
		
		
		this.challengeButton = makeFadeButton({
			scaleSrc: 'Menu/Challenge',
			hAlign: 'center',
			scaleHOffset: 4,
			scaleVOffset: 11.5,
			scaleWidth: 4,
			scaleHeight: 0.390625,
			onClick: function() {
				if (1 == alert('Would you like to challenge the last play?', 'Yes', 'No')) {
					BabelController.challenge();
					for (var i in BabelController.state.players) {
						BabelView.drawTray(i);
					}
					BabelView.refresh();
				}
			}
		}, this.scoresFrame);
		
		this.exchangeButton = makeFadeButton({
			scaleSrc: 'Menu/Exchange',
			hAlign: 'center',
			scaleHOffset: 4,
			scaleVOffset: 12.5,
			scaleWidth: 4,
			scaleHeight: 0.453125,
			onClick: function() {
				// if (1 == alert('Would you like to exchange your 7 letters for 7 letters in the bag?', 'Yes', 'No')) {
				BabelController.exchange();
				// }
			}
		}, this.scoresFrame);
		
		this.passButton = makeFadeButton({
			scaleSrc: 'Menu/Pass',
			hAlign: 'center',
			scaleHOffset: 4,
			scaleVOffset: 13.5,
			scaleWidth: 4,
			scaleHeight: 0.453125,
			onClick: function() {
				if (1 == alert('Are you sure you want to pass?', 'Yes', 'No')) {
					BabelController.pass();
				}
			}
		}, this.scoresFrame);
		
		this.endTurnButton = makeFadeButton();
		this.endTurnButton.scaleSrc = 'Menu/EndTurn';
		this.endTurnButton.hAlign = 'center';
		this.endTurnButton.scaleHOffset = 4;
		this.endTurnButton.scaleVOffset = 15.5;
		this.endTurnButton.scaleWidth = 4;
		this.endTurnButton.scaleHeight = 1.328125;
		this.endTurnButton.onClick = function() { BabelController.endTurn(); };
		this.endTurnButton.disabled = true;
		this.scoresFrame.appendChild(this.endTurnButton);
		
		
		this.showMenu();
		
	},
	
	/**
	 * cyclePlayerController(player)
	 * Cycles through the possible controllers for a player while in the menu.
	 */
	cyclePlayerController: function(player) {
		BabelController.setup.cycleController(player);
		this.updatePlayerControllers();
	},
	
	updatePlayerControllers: function() {
		var disableLater = false;
		for (var i = this.playersMenuFrame.firstChild; i != null; i = i.nextSibling) {
			if (typeof(i.player) != 'undefined') {
				if (disableLater) {
					i.disabled = true;
				} else {
					i.scaleSrc = BabelView.getControllerSrc(i.player);
					i.disabled = false;
					if (i.scaleSrc == 'Menu/Out') {
						disableLater = true;
					}
				}
			}
		}
		this.drawScaledRecursive(this.playersMenuFrame);
		var startDisabled = true;
		for (var i = 0; i < 4; i++) {
			if (BabelController.setup.getController(i)) {
				startDisabled = false;
				break;
			}
		}
		if (startDisabled) {
			this.startButton.disabled = true;
		} else {
			this.startButton.disabled = false;
		}
	},
	
	
	/**
	 * getControllerSrc(player)
	 */
	getControllerSrc: function(player) {
		switch (BabelController.setup.getController(player)) {
			case 'human':
				return 'Menu/Human';
				break;
			case 'simple':
				return 'Menu/CPU';
				break;
			case null:
			default:
				return 'Menu/Out';
				break;
		}
	},
	
	/**
	 * initTrays()
	 * Sets up the trayFrames and playFrames. Initial opacity of all trayFrames is 0.
	 */
	initTrays: function() {
		this.trayActivateButtons = [];
		for (var i in this.trayFrames) {
			this.trayFrames[i] = new Frame;
			this.trayFrames[i].opacity = 0;
			this.boardFrame.appendChild(this.trayFrames[i]);
			
			var tray = new Image();
			tray.scaleSrc = 'Tray';
			tray.scaleWidth = 16;
			tray.scaleHeight = 4;
			tray.scaleHOffset = 1.5;
			tray.scaleVOffset = 17.5;
			this.trayFrames[i].appendChild(tray);
			
			this.trayActivateButtons[i] = new Text();
			this.trayActivateButtons[i].trayID = i;
			this.trayActivateButtons[i].style.fontFamily = "'Lucida Grande','Lucida Sans','Lucida Sans Unicode',sans-serif";
			this.trayActivateButtons[i].scaleSize = 0.5625;
			this.trayActivateButtons[i].data = 'Player ' + (parseInt(i) + 1) + ', click here to activate your tray.';
			this.trayActivateButtons[i].scaleHOffset = 9.5;
			this.trayActivateButtons[i].scaleVOffset = 19.75;
			this.trayActivateButtons[i].hAlign = 'center';
			this.trayActivateButtons[i].opacity = 0;
			this.trayActivateButtons[i].onClick = function() { BabelView.activateTray(this.trayID); this.opacity = 0; BabelView.challengeButton.disabled = true; };
			this.trayFrames[i].appendChild(this.trayActivateButtons[i]);
			
			var sortAlphaButton = new Image();
			var sortPointsButton = new Image();
			var sortRandomButton = new Image();
			
			sortAlphaButton.src = this.imagesPath + 'SortA.png';
			sortPointsButton.src = this.imagesPath + 'Sort1.png';
			sortRandomButton.src = this.imagesPath + 'SortX.png';
			
			sortAlphaButton.player = sortPointsButton.player = sortRandomButton.player = i;
			sortAlphaButton.scaleWidth = sortAlphaButton.scaleHeight = sortPointsButton.scaleWidth = sortPointsButton.scaleHeight = sortRandomButton.scaleWidth = sortRandomButton.scaleHeight = 0.65625;
			sortAlphaButton.scaleVOffset = sortPointsButton.scaleVOffset = sortRandomButton.scaleVOffset = 20.484375;
			sortAlphaButton.scaleHOffset = 2.5;
			sortPointsButton.scaleHOffset = 3.5;
			sortRandomButton.scaleHOffset = 4.5;
			
			sortAlphaButton.onMouseDown = function() {
				this.src = BabelView.imagesPath + 'SortADown.png';
			};
			sortAlphaButton.onMouseUp = function() {
				this.src = BabelView.imagesPath + 'SortA.png';
				BabelController.sortTray('alpha');
				AnimationQueue.queue(BabelView.animateTray());
			};
			sortPointsButton.onMouseDown = function() {
				this.src = BabelView.imagesPath + 'Sort1Down.png';
			};
			sortPointsButton.onMouseUp = function() {
				this.src = BabelView.imagesPath + 'Sort1.png';
				BabelController.sortTray('points');
				AnimationQueue.queue(BabelView.animateTray());
			};
			sortRandomButton.onMouseDown = function() {
				this.src = BabelView.imagesPath + 'SortXDown.png';
			};
			sortRandomButton.onMouseUp = function() {
				this.src = BabelView.imagesPath + 'SortX.png';
				BabelController.sortTray('random');
				AnimationQueue.queue(BabelView.animateTray());
			};
			
			this.trayFrames[i].appendChild(sortAlphaButton);
			this.trayFrames[i].appendChild(sortPointsButton);
			this.trayFrames[i].appendChild(sortRandomButton);
			
			
			this.playFrames[i] = new Frame;
			this.trayFrames[i].appendChild(this.playFrames[i]);
		}
	},
	
	/**
	 * initMultipliers()
	 */
	initMultipliers: function() {
		if (this.stickersFrame) {
			this.stickersFrame.removeFromSuperview();
		}
		this.stickersFrame = new Frame();
		this.stickersFrame.opacity = 179;
		this.gridFrame.appendChild(this.stickersFrame);
		
		if (!this.initMultipliers.map) {
			this.initMultipliers.map = {
				1: { scaleSrc: 'DoubleLetterScore', tooltip: 'Double Letter Score' },
				2: { scaleSrc: 'TripleLetterScore', tooltip: 'Triple Letter Score' },
				3: { scaleSrc: 'DoubleWordScore', tooltip: 'Double Word Score' },
				4: { scaleSrc: 'TripleWordScore', tooltip: 'Triple Word Score' },
				5: { scaleSrc: 'HomeSquare', tooltip: 'Home Square (Double Word)' }
			};
		}
		
		var multipliers = BabelController.blankBoard.getAllMultipliers();
		
		for (var i in multipliers) {
			var multiplier = multipliers[i];
			var t = new Image();
			t.hAlign = t.vAlign = 'center';
			for (var i in this.initMultipliers.map[multiplier.obj]) {
				t[i] = this.initMultipliers.map[multiplier.obj][i];
			}
			t.src = this.scaledSrc(t.scaleSrc);
			var res = t.src.match(/(\d+)\.png$/i);
			if (!res) {
				log('Error calculating sticker\'s baseScale');
			} else {
				var baseScale = res[1];
				t.scaleWidth = t.srcWidth / baseScale;
				t.scaleHeight = t.srcHeight / baseScale;
			}
			t.scaleVOffset = multiplier.row + 0.5;
			t.scaleHOffset = multiplier.col + 0.5;
			this.stickersFrame.appendChild(t);
		}
	},
	
	
	/**
	 * initLetterImage(letter)
	 * Initializes a Letter object's image if it hasn't been done already
	 */
	initLetter: function(letter) {
		if (!letter.image.scaleSrc) {
			letter.image.scaleSrc = 'Tile' + letter.letter;
			letter.image.scaleWidth = letter.image.scaleHeight = 1;
			letter.image.tooltip = letter.letter + ' - ' + letter.points + ' point' + (letter.points != 1 ? 's' : '');
		}
	},
	
	
	/**
	 * drawBoard()
	 */
	drawBoard: function() {
		var board = BabelController.state.board;
		var letter;
		
		for (var row = 0; row < BOARD_HEIGHT; row++) {
			for (var col = 0; col < BOARD_WIDTH; col++) {
				letter = board.get(row, col);
				if (letter) {
					this.initLetter(letter);
					this.gridFrame.appendChild(letter.image);
					var attribs = this.alignLetterOnBoard(letter, row, col);
					for (var a in attribs) {
						letter.image[a] = attribs[a];
					}
					letter.image.onMouseUp = letter.image.onMouseDown = letter.image.onMouseDrag = null;
				}
			}
		}
		
		this.drawScaledRecursive(this.gridFrame);
		
		/*
		
		for (var i in globals.letters) {
			globals.letters[i].place();
		}
		
		*/
	},
	
	/**
	 * Called to initialize view info for a new game
	 */
	newGame: function() {
		this.showScores();
		this.drawBoard();
	},
	
	newPlay: function() {
		this.endTurnButton.disabled = true;
		if (BabelController.state.bag.arr.length < TRAY_SIZE) {
			this.exchangeButton.disabled = true;
		} else {
			this.exchangeButton.disabled = false;
		}
		if (BabelController.state.lastPlay && BabelController.state.lastPlay.getAll().length > 0) {
			this.challengeButton.disabled = false;
		} else {
			this.challengeButton.disabled = true;
		}
		this.drawTray();
		this.fadeTrayFrames(this.trayFrames[BabelController.state.currentPlayer]);
		this.updateScores();
	},
	
	/**
	 * activateTray(id)
	 */
	activateTray: function(id) {
		if (typeof(id) == 'undefined') {
			id = BabelController.state.currentPlayer;
		}
		
		this.playFrames[id].opacity = 255;
	},
	
	
	/**
	 * drawTray()
	 * drawTray(id)
	 * Draws the trays. If id is specified, draws the specific tray.
	 * Otherwise draws the current player's tray
	 */
	drawTray: function(id) {
		if (typeof(id) == 'undefined') {
			id = BabelController.state.currentPlayer;
		}
		
		var tray = BabelController.state.players[id].tray;
		
		if (tray) {
			emptyFrame(this.playFrames[id]);
			
			for (var j in tray.arr) {
				var letter = tray.arr[j];
				this.initLetter(letter);
				
				var attribs = this.alignLetterInTray(letter, j, tray);
				for (var a in attribs) {
					letter.image[a] = attribs[a];
				}
				
				// assign event handlers, etc.
				for (var k in this.trayLetterImagePrototype) {
					letter.image[k] = this.trayLetterImagePrototype[k];
				}
				
				this.playFrames[id].appendChild(letter.image);
			}
			
			if (BabelController.countHumanPlayers() == 1) {
				this.playFrames[id].opacity = 255;
				this.trayActivateButtons[id].opacity = 0;
			} else {
				this.playFrames[id].opacity = 0;
				this.trayActivateButtons[id].opacity = 255;
			}
			this.drawScaledRecursive(this.trayFrames[id]);
		}
		
	},
	
	/**
	 * alignLetterInTray(letter, tray)
	 * alignLetterInTray(letter, pos, tray)
	 * Returns target attributes for a Letter inside a given Tray.
	 * Useful for previewing where a Letter needs to go (and animating it).
	 */
	alignLetterInTray: function(letter, pos, tray) {
		if (pos instanceof Tray) {
			tray = pos;
			pos = tray.indexOf(letter);
			var trayLength = tray.arr.length;
		}
		if (tray instanceof Tray) {
			var trayLength = tray.arr.length;
		}
		
		return {
			scaleMultiplier: 2,
			scaleHOffset: 9.5 - (trayLength - 2 * pos),
			scaleVOffset: 18.45
		};
	},
	
	/**
	 * alignLetterOnBoard(letter, board)
	 * alignLetterOnBoard(letter, row, col)
	 * Returns target attributes for a Letter on the Board.
	 * Useful for previewing where a Letter needs to go (and animating it).
	 */
	alignLetterOnBoard: function(letter, row, col) {
		if (row instanceof Board) {
			var board = row;
			var t = board.find(letter);
			row = t.row;
			col = t.col;
		}
		
		var addlOffset = convertPoint(this.gridFrame.parentNode, letter.image.parentNode, this.gridFrame.hOffset, this.gridFrame.vOffset);
		
		return {
			scaleMultiplier: 1,
			scaleHOffset: col + addlOffset.x / this.scale,
			scaleVOffset: row + addlOffset.y / this.scale
		};
	},
	
	trayLetterImagePrototype: {
		onMouseDown: function() {
			this.orderAbove();
		},
		
		onMouseDrag: function() {
			var windowPoint = convertPoint(this, mainWindow, system.event.x, system.event.y);
			
			var gridPoint = convertPoint(this, BabelView.gridFrame, system.event.x, system.event.y);
			
			if (gridPoint.within(0, 0, BabelView.gridFrame.width, BabelView.gridFrame.height, true)) {
				this.scaleMultiplier = 1;
			} else {
				this.scaleMultiplier = 2;
			}
			
			BabelView.drawScaledRecursive(this);
			
			/*
			var parentPoint = convertPoint(mainWindow, this.parentNode,
				Math.max(0, Math.min(mainWindow.width - this.width, windowPoint.x - this.width / 2)),
				Math.max(0, Math.min(mainWindow.height - this.height, windowPoint.y - this.height / 2))
			);
			*/
			var parentPoint = convertPoint(mainWindow, this.parentNode,
				Math.max(0, Math.min(mainWindow.width - this.width, windowPoint.x - this.width / 2)),
				Math.max(0, Math.min(mainWindow.height - this.height, windowPoint.y - this.height / 2))
			);
			
			parentPoint.x = Math.max(0, parentPoint.x);
			
			this.scaleHOffset = parentPoint.x / BabelView.scale;
			this.scaleVOffset = parentPoint.y / BabelView.scale;
			
			BabelView.drawScaledRecursive(this);
		},
		
		onMouseUp: function() {
			var windowPoint = convertPoint(this, mainWindow, system.event.x, system.event.y);
			
			var gridPoint = convertPoint(this, BabelView.gridFrame, system.event.x, system.event.y);
			
			var returnLetter = true;
			
			if (gridPoint.within(0, 0, BabelView.gridFrame.width, BabelView.gridFrame.height, true)) {
				BabelController.addToPlay(this.letterObject, Math.floor(gridPoint.y / BabelView.scale), Math.floor(gridPoint.x / BabelView.scale));
			} else {
				if (this.letterObject.letter == this.letterObject.letter.toLowerCase()) {
					// reset blank tooltip
					this.tooltip = '_ - 0 points';
				}
				BabelController.removeFromPlay(this.letterObject);
				BabelController.state.players[BabelController.state.currentPlayer].tray.sort('hOffset', false);
			}
			
			if (BabelController.isValidPlay()) {
				BabelView.endTurnButton.disabled = false;
			} else {
				BabelView.endTurnButton.disabled = true;
			}
			
			if (BabelController.state.players[BabelController.state.currentPlayer].tray.arr.length < TRAY_SIZE || BabelController.state.bag.arr.length < TRAY_SIZE) {
				BabelView.exchangeButton.disabled = true;
			} else {
				BabelView.exchangeButton.disabled = false;
			}
			
			// animate the transitions
			AnimationQueue.queue([BabelView.animateTray(), BabelView.animatePlay(null, true)]);
		}
	},
	
	
	/**
	 * animateTray(id, noDone)
	 * animateTray(id)
	 * animateTray()
	 * Returns an animation object for the tray, suitable for use with
	 * AnimationQueue. Set noDone to true or an alternate doneFunc if you 
	 * would not like AnimationQueue.done() set as the doneFunc
	 */
	animateTray: function(id, noDone) {
		if (typeof(id) == 'undefined' || id == null) {
			id = BabelController.state.currentPlayer;
		}
		var tray = BabelController.state.players[id].tray;
		
		if (noDone == true) {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc);
		} else {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc, (noDone ? noDone : AnimationQueue.done));
		}
		
		anm.objs = [];
		for (var i in tray.arr) {
			var itMoves = false;
			var letter = tray.arr[i];
			var t = {
				obj: letter.image,
				start: {},
				finish: {}
			};
			t.finish = this.alignLetterInTray(letter, i, tray);
			for (var a in t.finish) {
				if (letter.image[a] != t.finish[a]) {
					itMoves = true;
					t.start[a] = letter.image[a];
				}
			}
			if (itMoves) {
				anm.objs.push(t);
			}
		}
		
		return anm;
	},
	
	
	/**
	 * animatePlay(play, noDone)
	 * animatePlay(play)
	 * animatePlay()
	 * Returns an animation object for a Play, suitable for use 
	 * with AnimationQueue. Set noDone to true or an alternate doneFunc
	 * if you would not like AnimationQueue.done() set as the doneFunc.
	 */
	animatePlay: function(play, noDone) {
		if (typeof(play) == 'undefined' || play == null) {
			play = BabelController.play;
		}
		
		if (noDone == true) {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc);
		} else {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc, (noDone ? noDone : AnimationQueue.done));
		}
		
		anm.objs = [];
		var playLetters = play.getAll();
		for (var i in playLetters) {
			var letter = playLetters[i].obj;
			var itMoves = false;
			var t = {
				obj: letter.image,
				start: {},
				finish: {}
			};
			t.finish = this.alignLetterOnBoard(letter, playLetters[i].row, playLetters[i].col);
			for (var a in t.finish) {
				if (letter.image[a] != t.finish[a]) {
					itMoves = true;
					t.start[a] = letter.image[a];
				}
			}
			if (itMoves) {
				anm.objs.push(t);
			}
		}
		
		return anm;
	},
	
	animateHelpers: {
		updateFunc: function() {
			var now = animator.milliseconds;
			
			var t = Math.max(now - this.startTime, 0);
			
			if (t >= PIECE_MOVE_DURATION) {
				for (var i in this.objs) {
					var t = this.objs[i];
					for (var a in t.finish) {
						t.obj[a] = t.finish[a];
					}
					BabelView.drawScaledRecursive(t.obj);
				}
				return false;
			} else {
				var percent = t / PIECE_MOVE_DURATION;
				for (var i in this.objs) {
					var t = this.objs[i];
					for (var a in t.start) {
						t.obj[a] = animator.ease(t.start[a], t.finish[a], percent, PIECE_MOVE_EASETYPE);
					}
					BabelView.drawScaledRecursive(t.obj);
				}
				return true;
			}
		},
		
		
	}, 	
	
	
	/**
	 * drawScaledRecursive
	 */
	drawScaledRecursive: function(container) {
		if (!this.drawScaledRecursive.attribs) {
			this.drawScaledRecursive.multiplyAttribs = {scaleWidth:'width', scaleHeight:'height', scaleSize:'size'};
			this.drawScaledRecursive.attribs = {scaleHOffset:'hOffset', scaleVOffset:'vOffset'};
		}
		for (var obj = container.firstChild; obj; obj = obj.nextSibling) {
			this.drawScaledRecursive(obj);
		}
		var multiplier = (container.scaleMultiplier ? container.scaleMultiplier : 1.0);
		if (container.scaleSrc) {
			// log('scaling ' + container.scaleSrc);
			var tSrc = this.scaledSrc(container.scaleSrc, multiplier)
			if (container.src != tSrc) {
				container.src = tSrc;
			}
		}
		for (var i in this.drawScaledRecursive.multiplyAttribs) {
			if (typeof(container[i]) != 'undefined') {
				container[this.drawScaledRecursive.multiplyAttribs[i]] = multiplier * this.scale * container[i];
			}
		}
		for (var i in this.drawScaledRecursive.attribs) {
			if (typeof(container[i]) != 'undefined') {
				container[this.drawScaledRecursive.attribs[i]] = this.scale * container[i];
			}
		}
	},
	
	/**
	 * scaledSrc(name, multiplier)
	 * Returns the best src for use with a particular image at the current scale
	 * Will multiply the current scale by multiplier if provided
	 */
	scaledSrc: function(name, multiplier) {
		// create cache if necessary
		if (typeof(this.scaledSrc.cache) == 'undefined') {
			this.scaledSrc.cache = {};
		}
		
		if (typeof(this.scaledSrc.cache[name]) == 'undefined') {
			this.scaledSrc.cache[name] = {};
		}
		
		if (!multiplier) {
			multiplier = 1.0;
		}
		var idealSize = multiplier * this.scale;
		
		if (typeof(this.scaledSrc.cache[name][idealSize]) == 'undefined') {
			// get all potential files for this type
			var curSrc, curSize, bestSize = 0, matchRE = new RegExp('^' + name + '(\\d+)\\.png$', 'i');
			var dh = filesystem.getDirectoryContents(this.imagesPath, true);
			
			for (var i in dh) {
				var res = dh[i].match(matchRE);
				if (res) {
					curSize = parseInt(res[1]);
					if (bestSize <= 0 || (bestSize < idealSize && curSize > bestSize) || (curSize >= idealSize && curSize < bestSize)) {
						curSrc = dh[i];
						bestSize = curSize;
					}
				}
			}
			
			this.scaledSrc.cache[name][idealSize] = this.imagesPath + curSrc;
		}
		
		return this.scaledSrc.cache[name][idealSize];
	},
	
	
	/**
	 * showHelp()
	 * Shows playing help/rules to the user
	 */
	showHelp: function() {
		alert('Help is on the way!');
	}
};



widget.onKeyDown = function() {
	if (system.event.isChar && system.event.keyString == 'Space') {
		sortRandomButton.onMouseUp();
	}
}



widget.onPreferencesChanged = function() {
	BabelController.updateFromPreferences();
	BabelView.refresh();
}

widget.onUnload = function() {
	// save settings for next time
	preferences.lastGameSetup.value = BabelController.setup.toString();
	savePreferences();
}




BabelController.updateFromPreferences();


// after interface elements have been created, update the DB
WordDB.init();



BabelController.init();


ct = BabelController;
vw = BabelView;


