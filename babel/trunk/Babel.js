
include('lib.js');

include('BabelConstants.js');
include('Letter.js');
include('Bag.js');
include('Tray.js');
include('Player.js');
include('Board.js');
include('GameState.js');
include('WordDB.js');









/**
 * BabelController
 * Singleton object for maintaining state and whatnot
 */

BabelController = {
	// PROPERTIES
	state: null, // GameState object
	
	stickers: null, // Board object
	move: null,  // Board object
	
	// METHODS
	/**
	 * init()
	 */
	init: function() {
		
		this.initStickers();
		
		this.updateFromPreferences();
		
		this.newGame();
		
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
	newGame: function() {
		var numPlayers = Math.min(parseInt(preferences.numPlayers.value) + ((preferences.cpuPlayer.value == 1) ? 1 : 0), 4);
		this.state = new GameState(parseInt(preferences.numPlayers.value));
		
		for (var i in this.state.players) {
			this.state.players[i].tray.fill(this.state.bag);
		}
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
	},
	
	
	
	newMove: function() {
		move = new Board();
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
		mainWindow.scaleWidth = 19;
		mainWindow.scaleHeight = 21.5;
		
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
	 * initTrays()
	 * Sets up the trayFrames and moveFrames. Initial opacity of all trayFrames is 0.
	 */
	initTrays: function() {
		for (var i in this.trayFrames) {
			this.trayFrames[i] = new Frame;
			this.trayFrames[i].opacity = 0;
			mainWindow.appendChild(this.trayFrames[i]);
			
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
					letter.image.scaleMultiplier = 1;
					letter.image.scaleHOffset = col;
					letter.image.scaleVOffset = row;
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
	 * drawTrays(id)
	 * Draws the trays. If id is specified, only draws the specific tray - otherwise draws all trays
	 */
	drawTrays: function(id) {
		var trays = [null, null, null, null];
		if (!id) {
			for (var i = 0; i < BabelController.state.players.length; i++) {
				trays[i] = BabelController.state.players[i].tray;
			}
		} else {
			trays[id] = BabelController.state.players[id].tray;
		}
		
		for (var i in trays) {
			if (trays[i]) {
				emptyFrame(this.moveFrames[i]);
				
				for (var j in trays[i].arr) {
					var letter = trays[i].arr[j];
					this.initLetter(letter);
					letter.image.scaleMultiplier = 2;
					letter.image.scaleHOffset = 16.5 - 2 * (trays[i].arr.length - j);
					letter.image.scaleVOffset = 18.45;
					
					for (var k in this.trayLetterImagePrototype) {
						letter.image[k] = this.trayLetterImagePrototype[k];
					}
					
					this.moveFrames[i].appendChild(letter.image);
				}
				
				this.drawScaledRecursive(this.trayFrames[i]);
			}
		}
		
	},
	
	
	trayLetterImagePrototype: {
		onMouseDown: function() {
			this.orderAbove();
		},
		
		onMouseDrag: function() {
			var windowPoint = convertPoint(this, mainWindow, system.event.x, system.event.y);
			
			var gridPoint = convertPoint(this, BabelView.gridFrame, system.event.x, system.event.y);
			
			if (gridPoint.within(0, 0, BabelView.gridFrame.width, BabelView.gridFrame.height)) {
				this.scaleMultiplier = 1;
			} else {
				this.scaleMultiplier = 2;
			}
			
			var parentPoint = convertPoint(mainWindow, this.parentNode,
				Math.max(0, Math.min(mainWindow.width - this.width, windowPoint.x - this.width / 2)),
				Math.max(0, Math.min(mainWindow.height - this.height, windowPoint.y - this.height / 2))
			);
			
			this.scaleHOffset = parentPoint.x / BabelView.scale;
			this.scaleVOffset = parentPoint.y / BabelView.scale;
			
			BabelView.drawScaledRecursive(this);
		},
		
		onMouseUp: function() {
			var windowPoint = this.convertPointToWindow(system.event.x, system.event.y);
			
			var gridPoint = gridFrame.convertPointFromWindow(windowPoint);
			
			var returnLetter = true;
			
			if (gridPoint.within(0, 0, gridFrame.width, gridFrame.height)) {
				var spot = {
					x: Math.floor(gridPoint.x / globals.scale),
					y: Math.floor(gridPoint.y / globals.scale)
				};
				
				if (!globals.boardMatrix[spot.y * 15 + spot.x]) {
					switch (this.letterObject.location) {
						case 'limbo':
							globals.boardMatrix[this.letterObject.coords.y * 15 + this.letterObject.coords.x] = 0;
							break;
						case 'tray':
							spliceOutTray(this.letterObject.coords.y, this.letterObject.coords.x);
							updateTray(this.letterObject.coords.y);
							globals.currentMove.push(this.letterObject);
							break;
					}
					
					globals.boardMatrix[spot.y * 15 + spot.x] = this.letterObject;
					
					this.letterObject.location = 'limbo';
					this.letterObject.coords = spot;
					returnLetter = false;
					
					var boardOffset = this.letterObject.getBoardPosition();
					boardOffset = gridFrame.convertPointToWindow(boardOffset.x, boardOffset.y);
					this.letterObject.anmQueue(new MoveAnimation(this, boardOffset.x, boardOffset.y, 225, animator.kEaseOut, this.letterObject.anmDone));
				}
			} else {
				if (this.letterObject.location == 'limbo') {
					// return to tray
					removeFromBoard(this.letterObject);
					removeFromCurrentMove(this.letterObject);
					spliceInTray(globals.currentPlayer, this.letterObject);
				} else {
					spliceOutTray(globals.currentPlayer, this.letterObject.coords.x);
					spliceInTray(globals.currentPlayer, this.letterObject);
				}
			}
			
			if (returnLetter) {
				switch (this.letterObject.location) {
					case 'tray':
						// return it to the tray
						updateTray(globals.currentPlayer);
						break;
					case 'limbo':
						// return it to its old spot on the board
						var boardOffset = this.letterObject.getBoardPosition();
						boardOffset = gridFrame.convertPointToWindow(boardOffset.x, boardOffset.y);
						this.letterObject.anmQueue(new MoveAnimation(this, boardOffset.x, boardOffset.y, 225, animator.kEaseOut, this.letterObject.anmDone));
						break;
				}
			}
			
			// pdump(gridPoint);
		}
	},
	
	
	
	refresh: function() {
		this.drawScaledRecursive(mainWindow);
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
			if (container[i]) {
				container[this.drawScaledRecursive.multiplyAttribs[i]] = multiplier * this.scale * container[i];
			}
		}
		for (var i in this.drawScaledRecursive.attribs) {
			if (container[i]) {
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
			var dh = filesystem.getDirectoryContents(this.imagesPath);
			
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




widget.onPreferencesChanged();


// after interface elements have been created, update the DB
WordDB.init();



function updateScale() {
	
	mainWindow.width = board.width = board.height = 19 * globals.scale;
	mainWindow.height = 21.5 * globals.scale;
	
	grid.src = 'Resources/Grid' + globals.scale + '.png';
	grid.fillMode = 'tile';
	grid.tileOrigin = 'topLeft';
	
	gridFrame.width = gridFrame.height = grid.width = grid.height = 15 * globals.scale;
	gridFrame.hOffset = gridFrame.vOffset = 2 * globals.scale;
	
	for (var i in globals.stickers) {
		globals.stickers[i].image.src = getScaledImage(globals.stickers[i].type);
		// pdump(globals.stickers[i]);
		var res = globals.stickers[i].image.src.match(/(\d+)\.png$/i);
		if (!res) {
			log('Error calculating sticker\'s base Scale');
			continue;
		}
		
		var baseScale = res[1];
		
		globals.stickers[i].image.width = (globals.scale) * globals.stickers[i].image.srcWidth / baseScale;
		globals.stickers[i].image.height = (globals.scale) * globals.stickers[i].image.srcHeight / baseScale;
		globals.stickers[i].image.hOffset = (globals.scale / 2) + globals.stickers[i].col * globals.scale;
		globals.stickers[i].image.vOffset = (globals.scale / 2) + globals.stickers[i].row * globals.scale;
		
	}
	
	for (var i in trayFrames) {
		var t = trayFrames[i];
		var u = t.firstChild;
		
		t.width = mainWindow.width;
		t.height = mainWindow.height;
		
		u.width = 16 * globals.scale;
		u.height = 4 * globals.scale;
		
		u.hOffset = 1.5 * globals.scale;
		u.vOffset = 17.5 * globals.scale;
	}
	
	sortAlphaButton.width = sortAlphaButton.height = sortPointsButton.width = sortPointsButton.height = sortRandomButton.width = sortRandomButton.height = 0.65625 * globals.scale;
	sortAlphaButton.vOffset = sortPointsButton.vOffset = sortRandomButton.vOffset = 20.484375 * globals.scale;
	
	sortAlphaButton.hOffset = 2.5 * globals.scale;
	sortPointsButton.hOffset = 3.5 * globals.scale;
	sortRandomButton.hOffset = 4.5 * globals.scale;
	
	for (var i in globals.letters) {
		globals.letters[i].place();
	}
	
}



BabelController.init();


ct = BabelController;
vw = BabelView;

vw.trayFrames[0].opacity = 255;
vw.drawTrays(0);


