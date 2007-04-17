
var globals = {
	scale: parseInt(preferences.scale.value),
	stickers: [],
	letters: [],
	trays: [ [], [], [], [] ],
	bag: [],
	boardMatrix: [],
	stickersMatrix: [],
	currentTray: 0,
	firstMove: true,
	currentMove: [],
	lastMove: [],
	challengeMode: new Boolean(parseInt(preferences.challengeMode.value))
};


globals.boardVars = {};

include('lib.js');
include('BabelStickers.js');
include('BabelRules.js');
include('BabelWords.js');
include('BabelLetters.js');
include('BabelTrays.js');




/**
 * Create the main objects
 */
var boardFrame = new Frame();
mainWindow.appendChild(boardFrame);

var board = new Image();
board.src = 'Resources/Board.png';
boardFrame.appendChild(board);



var gridFrame = new Frame();
boardFrame.appendChild(gridFrame);

var grid = new Image();
gridFrame.appendChild(grid);



globals.stickersMatrix = globals.boardVars.blankBoard.slice(0, globals.boardVars.blankBoard.length);

addStickers('TripleWordScore', globals.boardVars.tripleWordScores);
addStickers('DoubleWordScore', globals.boardVars.doubleWordScores);
addStickers('TripleLetterScore', globals.boardVars.tripleLetterScores);
addStickers('DoubleLetterScore', globals.boardVars.doubleLetterScores);

globals.stickers.push(new Sticker(7, 7, 'HomeSquare'))

/*
for (var i in globals.stickers) {
	gridFrame.appendChild(globals.stickers[i].image);
}
*/

/**
 * Create the tray frames
 */
var trayFrames = [];
for (var i in globals.trays) {
	var t = new Frame();
	mainWindow.appendChild(t);
	trayFrames.push(t);
	
	var y = new Image();
	y.src = 'Resources/Tray.png';
	t.appendChild(y);
	
	if (i == globals.currentTray) {
		t.visible = true;
	} else {
		t.visible = false;
	}
}

var sortAlphaButton = new Image();
sortAlphaButton.src = 'Resources/SortA.png';
sortAlphaButton.onMouseDown = function() { this.src = 'Resources/SortADown.png'; };
sortAlphaButton.onMouseUp = function() { traySort(globals.currentTray, 'alpha'); this.src = 'Resources/SortA.png'; };
sortAlphaButton.tooltip = 'Sort letters alphabetically (double-click to reverse)';
mainWindow.appendChild(sortAlphaButton);

var sortPointsButton = new Image();
sortPointsButton.src = 'Resources/Sort1.png';
sortPointsButton.onMouseDown = function() { this.src = 'Resources/Sort1Down.png'; };
sortPointsButton.onMouseUp = function() { traySort(globals.currentTray, 'points'); this.src = 'Resources/Sort1.png'; };
sortPointsButton.tooltip = 'Sort letters by points value (double-click to reverse)';
mainWindow.appendChild(sortPointsButton);

var sortRandomButton = new Image();
sortRandomButton.src = 'Resources/SortX.png';
sortRandomButton.onMouseDown = function() { this.src = 'Resources/SortXDown.png'; };
sortRandomButton.onMouseUp = function() { traySort(globals.currentTray, 'random'); this.src = 'Resources/SortX.png'; };
sortRandomButton.tooltip = 'Mix up letters (shortcut key: spacebar)';
mainWindow.appendChild(sortRandomButton);


/**
 * Create the stats window and objects
 */
var endTurnButton = new Text();
endTurnButton.data = 'End Turn';
endTurnButton.style.fontSize = '24px';
endTurnButton.style.color = '#005';
endTurnButton.vOffset = 40;
endTurnButton.onMouseUp = function() {
	try {
		endTurn();
		
		fillTray(globals.currentTray);
		updateTray(globals.currentTray);
	} catch (ex) {
		switch (ex.constructor) {
			case MoveEmpty:
				log('You cannot make an empty move!');
				break;
			case MoveNotLine:
				log('Your move is not in a single straight row or column.');
				break;
			case MoveNotConsecutive:
				log('Placed letters must be adjacent.');
				break;
			case MoveNotCoverHome:
				log('The first move must cover the Home Square.');
				break;
			case MoveNotTouching:
				log('Placed letters must be touching existing letters.');
				break;
				
			default:
				log('Unknown exception');
				pdump(ex);
				break;
		}
	}
}
statsWindow.appendChild(endTurnButton);



widget.onKeyDown = function() {
	if (system.event.isChar && system.event.keyString == 'Space') {
		sortRandomButton.onMouseUp();
	}
}


/**
 * Set up a game 
 */

clearBoard();

loadLetters(globals.boardVars.letters);

mixBag();

// placeString(3, 5, 'babelz', 'horizontal');

fillTray(0);





widget.onPreferencesChanged = updateScale;





updateScale();



// after interface elements have been created, update the DB
getDB();



function updateScale() {
	if (preferences.scale.value != globals.scale) {
		// move window to keep board centered
		// if only hAlign actually worked on Window objects, this would be unnecessary
		var mainOffsetDiff = (9.5 * parseInt(preferences.scale.value) - 9.5 * globals.scale);
		mainWindow.hOffset -= mainOffsetDiff;
		mainWindow.vOffset -= mainOffsetDiff;
		
		globals.scale = parseInt(preferences.scale.value);
	}
	
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



