
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









/**
 * BabelController
 * Singleton object for maintaining state and whatnot
 */

BabelController = {
	// PROPERTIES
	setup: null, // GameSetup object
	state: null, // GameState object
	
	stickers: null, // Board object
	move: null,  // Board object
	
	// METHODS
	/**
	 * init()
	 */
	init: function() {
		this.setup = new GameSetup();
		
		this.initStickers();
		
		this.updateFromPreferences();
		
		BabelView.init();
		BabelView.refresh();
		
	},
	
	
	/**
	 * initStickers()
	 */
	initStickers: function() {
		this.stickers = new Board();
		
		if (!this.initStickers.typeMap) {
			this.initStickers.typeMap = {
				doubleLetter: 'l',
				tripleLetter: 'L',
				doubleWord:   'w',
				tripleWord:   'W',
				homeSquare:   '*'
			};
		}
		
		for (var type in STICKERS) {
			for (var i in STICKERS[type]) {
				if (STICKERS[type][i]) {
					this.stickers.put(Math.floor(i / BOARD_HEIGHT), (i % BOARD_WIDTH), this.initStickers.typeMap[type]);
				}
			}
		}
		
	},
	
	/**
	 * newGame()
	 * Initializes values to defaults, creates important stuff
	 */
	newGame: function(numPlayers) {
		numPlayers = Math.min(numPlayers, 4);
		this.state = new GameState(numPlayers);
		
		for (var i in this.state.players) {
			this.state.players[i].tray.fill(this.state.bag);
		}
		
		BabelView.newGame();
		
		this.newMove();
		BabelView.newMove();
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
	
	
	isValidMove: function() {
		try {
			if (BabelRules.isValidMove(this.move, this.state.board)) {
				return true;
			}
		} catch (ex) {
			pdump(ex);
		}
		return false;
	},
	
	
	/**
	 * endTurn()
	 * Analyzes the current move and attempts to end it
	 */
	endTurn: function() {
		if (this.isValidMove()) {
			// adjust score
			
			// fill tray
			
			// end the turn
		}
	},
	
	/**
	 * newMove()
	 * Initializes things for a new move.
	 */
	newMove: function() {
		this.move = new Board();
	},
	
	/**
	 * addToMove(letter, row, col)
	 * Attempts to add a letter to the current move.
	 * Returns true if the letter was added, or false if it was not.
	 */
	addToMove: function(letter, row, col) {
		// make sure the space is unoccupied
		if (!(this.move.get(row, col)) && !(this.state.board.get(row, col))) {
			// remove the letter if it's currently on the Move board or in the tray
			this.state.players[this.state.currentPlayer].tray.remove(letter);
			this.move.remove(letter);
			// add it at the correct location
			this.move.put(row, col, letter);
			return true;
		} else {
			return false;
		}
	},
	
	
	/**
	 * removeFromMove(letter)
	 * Removes the specified Letter from the current move.
	 * Returns true if the Letter was removed, or false if the Letter 
	 * was not in the move to begin with.
	 */
	removeFromMove: function(letter) {
		if (this.move.remove(letter)) {
			// add it back into the tray
			this.state.players[this.state.currentPlayer].tray.put(letter);
			return true;
		} else {
			return false;
		}
	},
	
	
	sortTray: function(criteria, autoReverse) {
		this.state.players[this.state.currentPlayer].tray.sort(criteria, autoReverse);
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
	moveFrames: [null, null, null, null],
	
	
	// METHODS
	/**
	 * init()
	 * Create view objects
	 * Make sure that this.scale has been set before calling!
	 */
	init: function() {
		mainWindow.scaleWidth = 25;
		mainWindow.scaleHeight = 21.5;
		
		// statsFrame
		log('creating statsFrame');
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
		
		this.initStickers();
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
	},
	
	
	initStatsUI: function() {
		this.mainMenuFrame = new Frame();
		this.statsFrame.appendChild(this.mainMenuFrame);
		
		var newGame = makeFadeButton();
		newGame.scaleSrc = 'Menu/NewGame';
		newGame.hAlign = 'center';
		newGame.scaleHOffset = 4;
		newGame.scaleVOffset = 4.5;
		newGame.scaleWidth = 4;
		newGame.scaleHeight = 1.34375;
		newGame.onClick = function() { BabelView.playersMenuFrame.visible = true; };
		this.mainMenuFrame.appendChild(newGame);
		
		this.playersMenuFrame = new Frame();
		this.playersMenuFrame.visible = false;
		this.mainMenuFrame.appendChild(this.playersMenuFrame);
		
		this.playerControllers = [];
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
			
			var tButton = makeFadeButton();
			tButton.hAlign = 'center';
			tButton.scaleWidth = 4;
			tButton.scaleHeight = 0.5;
			tButton.scaleHOffset = 4;
			tButton.scaleVOffset = 6.5 + i;
			this.playersMenuFrame.appendChild(tButton);
			
		}
		
		
		var help = makeFadeButton();
		help.scaleSrc = 'Menu/Help';
		help.hAlign = 'center';
		help.scaleHOffset = 4;
		help.scaleVOffset = 16;
		help.scaleWidth = 4;
		help.scaleHeight = 0.421875;
		help.onClick = function() { BabelView.playersMenuFrame.visible = false; BabelView.showHelp(); };
		this.mainMenuFrame.appendChild(help);
		
	},
	
	/**
	 * cyclePlayerController(player)
	 * Cycles through the possible controllers for a player while in the menu.
	 */
	cyclePlayerController: function(player, img) {
		var newController = BabelController.setup.cycleController(player);
		img.scaleSrc = BabelView.getControllerSrc(player);
		BabelView.drawScaledRecursive(img);
	},
	
	
	/**
	 * getControllerSrc(player)
	 */
	getControllerSrc: function(player) {
		switch (BabelController.setup.getController(player)) {
			case 'human':
				return 'Menu/Human';
				break;
			case 'cpu':
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
	 * Sets up the trayFrames and moveFrames. Initial opacity of all trayFrames is 0.
	 */
	initTrays: function() {
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
			
			
			this.moveFrames[i] = new Frame;
			this.trayFrames[i].appendChild(this.moveFrames[i]);
		}
	},
	
	/**
	 * initStickers()
	 */
	initStickers: function() {
		if (this.stickersFrame) {
			this.stickersFrame.removeFromSuperview();
		}
		this.stickersFrame = new Frame();
		this.stickersFrame.opacity = 179;
		this.gridFrame.appendChild(this.stickersFrame);
		
		if (!this.initStickers.map) {
			this.initStickers.map = {
				'l': { scaleSrc: 'DoubleLetterScore', tooltip: 'Double Letter Score' },
				'L': { scaleSrc: 'TripleLetterScore', tooltip: 'Triple Letter Score' },
				'w': { scaleSrc: 'DoubleWordScore', tooltip: 'Double Word Score' },
				'W': { scaleSrc: 'TripleWordScore', tooltip: 'Triple Word Score' },
				'*': { scaleSrc: 'HomeSquare', tooltip: 'Home Square (Double Word)' }
			};
		}
		
		for (var row = 0; row < BOARD_HEIGHT; row++) {
			for (var col = 0; col < BOARD_HEIGHT; col++) {
				var sticker = BabelController.stickers.get(row, col);
				if (sticker) {
					var t = new Image();
					t.hAlign = t.vAlign = 'center';
					for (var i in this.initStickers.map[sticker]) {
						t[i] = this.initStickers.map[sticker][i];
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
					t.scaleVOffset = row + 0.5;
					t.scaleHOffset = col + 0.5;
					this.stickersFrame.appendChild(t);
				}
			}
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
		}
	},
	
	
	/**
	 * drawBoard()
	 */
	drawBoard: function() {
		var board = BabelController.state.board;
		var letter;
		
		for (var row = 0; i < BOARD_HEIGHT; i++) {
			for (var col = 0; j < BOARD_WIDTH; j++) {
				letter = board.get(row, col);
				if (letter) {
					this.initLetter(letter);
					var attribs = alignLetterOnBoard(letter, row, col);
					for (var a in attribs) {
						letter.image[a] = attribs[a];
					}
					gridFrame.appendChild(letter.image);
				}
			}
		}
		
		this.drawScaledRecursive(gridFrame);
		
		/*
		
		for (var i in globals.letters) {
			globals.letters[i].place();
		}
		
		*/
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
			emptyFrame(this.moveFrames[id]);
			
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
				
				this.moveFrames[id].appendChild(letter.image);
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
			
			var parentPoint = convertPoint(mainWindow, this.parentNode,
				Math.max(0, Math.min(mainWindow.width - this.width, windowPoint.x - this.width / 2)),
				Math.max(0, Math.min(mainWindow.height - this.height, windowPoint.y - this.height / 2))
			);
			
			this.scaleHOffset = parentPoint.x / BabelView.scale;
			this.scaleVOffset = parentPoint.y / BabelView.scale;
			
			BabelView.drawScaledRecursive(this);
		},
		
		onMouseUp: function() {
			var windowPoint = convertPoint(this, mainWindow, system.event.x, system.event.y);
			
			var gridPoint = convertPoint(this, BabelView.gridFrame, system.event.x, system.event.y);
			
			var returnLetter = true;
			
			if (gridPoint.within(0, 0, BabelView.gridFrame.width, BabelView.gridFrame.height, true)) {
				BabelController.addToMove(this.letterObject, Math.floor(gridPoint.y / BabelView.scale), Math.floor(gridPoint.x / BabelView.scale));
			} else {
				BabelController.removeFromMove(this.letterObject);
				BabelController.state.players[BabelController.state.currentPlayer].tray.sort('hOffset', false);
			}
			
			// animate the transitions
			AnimationQueue.queue([BabelView.animateTray(), BabelView.animateMove(null, true)]);
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
	 * animateMove(move, noDone)
	 * animateMove(move)
	 * animateMove()
	 * Returns an animation object for a Move, suitable for use 
	 * with AnimationQueue. Set noDone to true or an alternate doneFunc
	 * if you would not like AnimationQueue.done() set as the doneFunc.
	 */
	animateMove: function(move, noDone) {
		if (typeof(move) == 'undefined' || move == null) {
			move = BabelController.move;
		}
		
		if (noDone == true) {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc);
		} else {
			var anm = new CustomAnimation(CUSTOM_ANIMATION_INTERVAL, this.animateHelpers.updateFunc, (noDone ? noDone : AnimationQueue.done));
		}
		
		anm.objs = [];
		for (var row = 0; row < BOARD_HEIGHT; row++) {
			for (var col = 0; col < BOARD_WIDTH; col++) {
				var letter = move.get(row, col);
				if (!letter) {
					continue;
				}
				var itMoves = false;
				var t = {
					obj: letter.image,
					start: {},
					finish: {}
				};
				t.finish = this.alignLetterOnBoard(letter, row, col);
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
			this.drawScaledRecursive.multiplyAttribs = {scaleWidth:'width', scaleHeight:'height'};
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




BabelController.updateFromPreferences();


// after interface elements have been created, update the DB
WordDB.init();



BabelController.init();


ct = BabelController;
vw = BabelView;


