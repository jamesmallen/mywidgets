
function endTurn() {
	var move = globals.currentMove;
	
	if (move.length <= 0) {
		throw new MoveEmpty();
	}
	
	sortMoveLetters();
	
	var direction = checkLine(move);
	if (!direction) {
		throw new MoveNotLine();
	}
	
	if (!checkConsecutive(move, direction)) {
		throw new MoveNotConsecutive();
	}
	
	if (globals.firstMove) {
		if (!checkCoverHome(move)) {
			throw new MoveNotCoverHome();
		}
	} else {
		if (!checkTouching(move)) {
			throw new MoveNotTouching();
		}
	}
	
	// finally lock the letters down
	globals.lastMove = [];
	while (move.length > 0) {
		var letter = move.pop();
		globals.lastMove.push(letter);
		letter.lock();
	}
	
	globals.firstMove = false;
	
}

function checkCoverHome(letters) {
	for (var i in letters) {
		var sticker = globals.stickersMatrix[letters[i].coords.y * 15 + letters[i].coords.x];
		if (sticker && sticker.type == 'HomeSquare') {
			return true;
		}
	}
	return false;
}


function checkTouching(letters) {
	var board = globals.boardMatrix;
	var positions = ['top', 'bottom', 'left', 'right'];
	
	for (var i in letters) {
		for (var j in positions) {
			var letter = getAdjacentLetter(letters[i], positions[j]);
			if (letter && letter.location == 'board') {
				return true;
			}
		}
	}
}

function getAdjacentLetter(letter, direction) {
	var board = globals.boardMatrix;
	var c = letter.coords;
	switch (direction) {
		case 'top':
			if (c.y >= 1) {
				return board[((c.y - 1) * 15) + c.x];
			}
			break;
		case 'bottom':
			if (c.y <= 13) {
				return board[((c.y + 1) * 15) + c.x];
			}
			break;
		case 'left':
			if (c.x >= 1) {
				return board[(c.y * 15) + c.x - 1];
			}
			break;
		case 'right':
			if (c.y <= 13) {
				return board[(c.y * 15) + c.x + 1];
			}
	}
	return null;
}


function checkConsecutive(letters, direction) {
	var consecutive = true;
	
	switch (direction) {
		case 'horizontal':
			var row = letters[0].coords.y;
			for (var i = letters[0].coords.x; i <= letters[letters.length - 1].coords.x; i++) {
				if (!globals.boardMatrix[(row * 15) + i]) {
					consecutive = false;
					break;
				}
			}
			break;
		case 'vertical':
			var col = letters[0].coords.x;
			for (var i = letters[0].coords.y; i <= letters[letters.length - 1].coords.y; i++) {
				if (!globals.boardMatrix[(i * 15) + col]) {
					consecutive = false;
					break;
				}
			}
			break;
		default:
			consecutive = false;
			break;
	}
	
	return consecutive;
}


function sortMoveLetters() {
	globals.currentMove.sort(function(a, b) {
		if (a.coords.y == b.coords.y) {
			return a.coords.x - b.coords.x;
		} else {
			return a.coords.y - b.coords.y;
		}
	});
}


function checkLine(letters) {
	if (letters.length <= 0) {
		return false;
	}
	var row = letters[0].coords.y, col = letters[0].coords.x;
	
	for (var i in letters) {
		if (letters[i].coords.y != row) {
			for (var j in letters) {
				if (letters[j].coords.x != col) {
					return false;
				}
			}
			return 'vertical';
		}
	}
	
	return 'horizontal';
}



function isValidWord(str)
{
	var sql = 'SELECT COUNT(*) FROM words WHERE word="' + addSlashes(str) + '"';
	log(sql);
	var res = globals.db.catchQuery(sql).getColumn(0);
	
	if (res && res != 0) {
		return true;
	} else {
		return false;
	}
}



/**
 * Rules error object constructors
 */

function MoveEmpty() { };

function MoveNotLine() { };

function MoveNotConsecutive() { };
function MoveNotCoverHome() { };
function MoveNotTouching() { };