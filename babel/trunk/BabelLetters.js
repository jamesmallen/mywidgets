globals.boardVars.letters = {
	' ': { qty:  2, points:  0 },
	E:   { qty: 12, points:  1 },
	A:   { qty:  9, points:  1 },
	I:   { qty:  9, points:  1 },
	O:   { qty:  8, points:  1 },
	N:   { qty:  6, points:  1 },
	R:   { qty:  6, points:  1 },
	T:   { qty:  6, points:  1 },
	L:   { qty:  4, points:  1 },
	S:   { qty:  4, points:  1 },
	U:   { qty:  4, points:  1 },
	D:   { qty:  4, points:  2 },
	G:   { qty:  3, points:  2 },
	B:   { qty:  2, points:  3 },
	C:   { qty:  2, points:  3 },
	M:   { qty:  2, points:  3 },
	P:   { qty:  2, points:  3 },
	F:   { qty:  2, points:  4 },
	H:   { qty:  2, points:  4 },
	V:   { qty:  2, points:  4 },
	W:   { qty:  2, points:  4 },
	Y:   { qty:  2, points:  4 },
	K:   { qty:  1, points:  5 },
	J:   { qty:  1, points:  8 },
	X:   { qty:  1, points:  8 },
	Q:   { qty:  1, points: 10 },
	Z:   { qty:  1, points: 10 }
}


globals.boardVars.blankBoard = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];



function placeString(startRow, startCol, str, direction, src) {
	var letters = [];
	for (var i in str) {
		letters.push(pullLetter(str[i], src));
	}
	placeLetters(startRow, startCol, letters, direction);
}


function fillTray(trayNumber) {
	var letters = [];
	var tray = globals.trays[trayNumber];
	for (var i = tray.length; i < 7; i++) {
		var letter = pullLetter(null);
		letter.location = 'tray';
		letter.coords = { y: trayNumber, x: i };
		trayFrames[trayNumber].appendChild(letter.image);
		letter.place();
		tray.push(letter);
	}
	
}



function placeLetters(startRow, startCol, letters, direction) {
	switch (direction) {
		case 'vertical':
			/*
			assert(col + str.length < 15);
			for (var i = row; i < row + str.length; i++) {
				assert(!globals.boardMatrix[(i * 15) + col]);
			}
			*/
			
			for (var i = 0; i < letters.length; i++) {
				globals.boardMatrix[((startRow + i) * 15) + startCol] = letters[i];
				letters[i].location = 'board';
				letters[i].coords = { y: startRow + i, x: startCol };
				gridFrame.appendChild(letters[i].image);
				letters[i].place();
			}
			
			break;
		case 'horizontal':
		default:
			/*
			assert(row + str.length < 15);
			for (var i = col; i < col + str.length; i++) {
				assert(!globals.boardMatrix[(row * 15) + i]);
			}
			*/
			
			for (var i = 0; i < letters.length; i++) {
				globals.boardMatrix[(startRow * 15) + (startCol + i)] = letters[i];
				letters[i].location = 'board';
				letters[i].coords = { y: startRow, x: startCol + i };
				gridFrame.appendChild(letters[i].image);
				letters[i].place();
			}
			
			break;
	}
}


function loadBoard(matrix) {
	clearBoard();
	
	for (var i in tilesArray) {
		if (matrix[i]) {
			var letter = pullLetter(matrix[i]);
			if (!letter) {
				log('Letter ' + matrix[i] + ' not available!');
				throw new Error();
			} else {
				letter.row = Math.floor(i / 15);
				letter.col = i % 15;
			}
			globals.boardMatrix[i] = letter;
		}
	}
}


function loadLetters(rules) {
	// clear letters first
	clearLetters();
	
	for (var i in rules) {
		for (var j = 0; j < rules[i].qty; j++) {
			globals.letters.push(new Letter(i));
		}
	}
	
	for (var i in globals.letters) {
		globals.bag.push(globals.letters[i]);
	}
}


function mixBag() {
	var t = [], ret = [], src = globals.bag;
	while (src.length > 0 && (t = src.splice(random(src.length), 1))) {
		ret.push(t[0]);
	}
	globals.bag = ret;
}


function pullLetter(letterStr, src) {
	if (!src) {
		src = globals.bag;
	}
	
	if (!letterStr) {
		return src.pop();
	} else {
		letterStr = letterStr.toUpperCase();
		
		for (var i in src) {
			// print(src[i].letter);
			if (src[i].letter == letterStr) {
				t = src.splice(i, 1);
				return t[0];
			}
		}
		// if we get here, we couldn't find the letter in the src
		log('Letter "' + letterStr + '" not found in src');
		throw new Error();
	}
	
}


function clearLetters() {
	for (var i in globals.letters) {
		globals.letters[i].image.removeFromSuperview();
		delete globals.letters[i].image;
	}
	globals.letters.length = 0;
	
	globals.bag.length = 0;
	for (var i in globals.trays) {
		globals.trays[i].length = 0;
	}
	
}


function clearBoard() {
	globals.boardMatrix = globals.boardVars.blankBoard.slice(0, globals.boardVars.blankBoard.length);
	
	while (globals.letters.length) {
		globals.letters[i].pop().remove();
	}
	
}


function Letter(letter, location, coords) {
	if (!location) {
		location = 'bag';
	}
	if (!coords) {
		coords = { row: null, col: null };
	}
	
	this.letter = letter;
	this.location = location;
	this.coords = coords;
	
	this.points = globals.boardVars.letters[this.letter].points;
	this.image = new Image();
	this.image.letterObject = this;
	this.image.tooltip = this.letter + ': ' + this.points + ' point' + (this.points != 1 ? 's' : '');
	
	this.anms = [];
}

Letter.prototype.anmDone = function() {
	this.owner.letterObject.anms.shift(1);
	if (this.owner.letterObject.anms.length > 0) {
		animator.start(this.owner.letterObject.anms[0]);
	} else {
		// release events
		for (var i in this.owner.letterObject.heldEvents) {
			// don't overwrite any manually specified events
			if (!this.owner[i]) {
				this.owner[i] = this.owner.letterObject.heldEvents[i];
			}
		}
	}
}

Letter.prototype.anmQueue = function(anm) {
	this.anms.push(anm);
	if (this.anms.length == 1) {
		// hold events
		this.heldEvents = {};
		for (var i in Letter.anmHoldEvents) {
			var curEvent = Letter.anmHoldEvents[i];
			if (this.image[curEvent]) {
				this.heldEvents[curEvent] = this.image[curEvent];
				this.image[curEvent] = null;
			}
		}
		animator.start(this.anms[0]);
	}
}

Letter.prototype.remove = function() {
	this.image.removeFromSuperview();
	this.image = null;
}





Letter.prototype.place = function() {
	switch (this.location) {
		case 'board':
		case 'limbo':
			this.image.src = getScaledImage('Tile' + this.letter);
			this.image.width = this.image.height = globals.scale;
			
			var boardOffset = this.getBoardPosition();
			
			this.image.hOffset = boardOffset.x;
			this.image.vOffset = boardOffset.y;
			
			break;
			
		case 'tray':
			this.image.src = getScaledImage('Tile' + this.letter, 2.0);
			this.image.width = this.image.height = globals.scale * 2;
			
			var trayOffset = this.getTrayPosition();
			
			this.image.hOffset = trayOffset.x;
			this.image.vOffset = trayOffset.y;
			
			// log('setting tray events');
			this.image.onMouseDown = Letter.tray_onMouseDown;
			this.image.onMouseDrag = Letter.tray_onMouseDrag;
			this.image.onMouseUp = Letter.tray_onMouseUp;
			break;
			
		case 'bag':
		default:
			if (this.image.parentNode) {
				// pdump(this.image.parentNode);
				// maybe we should be using removeFromSuperview() here...
				// this.image.parentNode(removeChild(this.image));
				this.image.removeFromSuperview();
			}
			break;
	}
}


Letter.prototype.lock = function() {
	if (this.image.parentNode != gridFrame) {
		var gridPoint = gridFrame.convertPointFromWindow(this.image.parentNode.convertPointToWindow(this.image.hOffset, this.image.vOffset));
		
		gridFrame.appendChild(this.image);
		
		this.image.hOffset = gridPoint.x;
		this.image.vOffset = gridPoint.y;
	}
	
	this.location = 'board';
	
	this.image.onMouseUp = this.image.onMouseDown = this.image.onMouseDrag = null;
}



Letter.prototype.getBoardPosition = function() {
	return {
		x: this.coords.x * globals.scale,
		y: this.coords.y * globals.scale
	};
}


Letter.prototype.getTrayPosition = function() {
	var t = trayFrames[this.coords.y].firstChild;
	
	var trayWidth = globals.trays[this.coords.y].length * globals.scale * 2;
	var diffHOffset = ((7 * globals.scale * 2) - trayWidth) / 2;
	return {
		x: t.hOffset + diffHOffset + (globals.scale + (this.coords.x * globals.scale * 2)),
		y: t.vOffset + globals.scale
	};
}

Letter.tray_onMouseDown = function() {
	/*
	if (this.parentNode.convertPointToWindow) {
		var newPoint = this.parentNode.convertPointToWindow(this.hOffset, this.vOffset);
		log('removing...');
		this.removeFromSuperview();
		log('appending...');
		mainWindow.appendChild(this);
		log('appended');
		this.hOffset = newPoint.x;
		this.vOffset = newPoint.y;
		log('moved');
	}
	*/
	this.orderAbove();
}


Letter.tray_onMouseUp = function() {
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
			spliceInTray(globals.currentTray, this.letterObject);
		} else {
			spliceOutTray(globals.currentTray, this.letterObject.coords.x);
			spliceInTray(globals.currentTray, this.letterObject);
		}
	}
	
	if (returnLetter) {
		switch (this.letterObject.location) {
			case 'tray':
				// return it to the tray
				updateTray(globals.currentTray);
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


Letter.tray_onMouseDrag = function() {
	var windowPoint = this.convertPointToWindow(system.event.x, system.event.y);
	
	var gridPoint = gridFrame.convertPointFromWindow(windowPoint);
	
	if (gridPoint.within(0, 0, gridFrame.width, gridFrame.height)) {
		this.width = this.height = globals.scale;
	} else {
		this.width = this.height = globals.scale * 2;
	}
	
	var parentPoint = this.parentNode.convertPointFromWindow(
		Math.max(0, Math.min(mainWindow.width - this.width, windowPoint.x - this.width / 2)),
		Math.max(0, Math.min(mainWindow.height - this.height, windowPoint.y - this.height / 2))
	);
	
	this.hOffset = parentPoint.x;
	this.vOffset = parentPoint.y;
	
}


function removeFromCurrentMove(letter) {
	for (var i in globals.currentMove) {
		if (globals.currentMove[i] == letter) {
			globals.currentMove.splice(i, 1);
			break;
		}
	}
}


function removeFromBoard(letter) {
	globals.boardMatrix[letter.coords.y * 15 + letter.coords.x] = 0;
}

Letter.anmHoldEvents = [
	'onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel'
];

