
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
		if (move.length <= 1) {
			throw new MoveShort();
		}
		if (!checkCoverHome(move)) {
			throw new MoveNotCoverHome();
		}
	} else {
		if (!checkTouching(move)) {
			throw new MoveNotTouching();
		}
	}
	
	var wordsForScore = getWordsForScore(move, direction);
	
	if (!globals.challengeMode) {
		invalidWords = [];
		
		log('Not in challenge mode - looking up words');
		for (var i in wordsForScore) {
			if (!isValidWord(wordsForScore[i].join(''))) {
				log('"' + wordsForScore[i].join('') + '" was not found in word list.');
				invalidWords.push(wordsForScore[i].join(''));
			} else {
				log('"' + wordsForScore[i].join('') + '" was found in word list.');
			}
		}
		if (invalidWords.length > 0) {
			throw new MoveInvalidWords(invalidWords);
		}
	} else {
		print(globals.challengeMode);
	}
	
	var score = calculateScore(move, wordsForScore);
	
	globals.lastScore = score;
	globals.scores[globals.currentPlayer] += score;
	
	// finally lock the letters down
	globals.lastMove = [];
	while (move.length > 0) {
		var letter = move.pop();
		globals.lastMove.push(letter);
		letter.lock();
	}
	
	globals.lastWords = [];
	for (var i in wordsForScore) {
		// just save the strings of the words
		globals.lastWords.push(wordsForScore.join(''));
	}
	
	globals.firstMove = false;
	
}


/**
 * direction can be passed in to save on calculation
 */
function getWordsForScore(letters, direction) {
	var words = [];
	
	if (!direction) {
		direction = checkLine(letters);
	}
	
	var oppositeDirection = (direction == 'vertical' ? 'horizontal' : 'vertical');
	
	var potentialLetters = getAllAdjacentLetters(letters[0], direction);
	if (potentialLetters.length > 1) {
		words.push(potentialLetters);
	}
	
	for (var i in letters) {
		var potentialLetters = getAllAdjacentLetters(letters[i], oppositeDirection);
		if (potentialLetters.length > 1) {
			words.push(potentialLetters);
		}
	}
	
	return words;
}


function calculateScore(letters, words) {
	var score = 0;
	
	for (var i in words) {
		var tScore = 	scoreWord(words[i]);
		log('Score for word "' + words[i].join('') + '": ' + tScore);

		score += tScore;
	}
	
	if (letters.length >= 7) {
		log('BINGO! 50 additional points.');
		score += 50;
	}
	
	log('Total score for move: ' + score);
	
	return score;
}

function scoreWord(letters) {
	var wordMultiplier = 1;
	var wordScore = 0;
	
	for (var i in letters) {
		var letterMultiplier = 1;
		if (letters[i].location == 'limbo') {
			var sticker = globals.stickersMatrix[(letters[i].coords.y * 15) + letters[i].coords.x];
			if (sticker) {
				switch (sticker.type) {
					case 'DoubleLetterScore':
						letterMultiplier *= 2;
						break;
					case 'TripleLetterScore':
						letterMultiplier *= 3;
						break;
					case 'DoubleWordScore':
					case 'HomeSquare':
						wordMultiplier *= 2;
						break;
					case 'TripleWordScore':
						wordMultiplier *= 3;
						break;
				}
			}
		}
		wordScore += letters[i].points * letterMultiplier;
	}
	
	wordScore *= wordMultiplier;
	
	return wordScore;
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

function getAllAdjacentLetters(letter, direction) {
	var ret = [], t;
	var directionMap = {
		vertical: ['top', 'bottom'],
		horizontal: ['left', 'right']
	}
	t = letter;
	while (t = getAdjacentLetter(t, directionMap[direction][0])) {
		ret.unshift(t);
	}
	ret.push(letter);
	t = letter;
	while (t = getAdjacentLetter(t, directionMap[direction][1])) {
		ret.push(t);
	}
	
	return ret;
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
	
	if (letters.length == 1) {
		// look for surrounding letters to determine primary direction
		
	}
	
	return 'horizontal';
}



function isValidWord(str)
{
	var str = str.replace(' ', '_');
	var sql = 'SELECT COUNT(*) FROM words WHERE word LIKE "' + addSlashes(str) + '"';
	log(sql);
	var res = globals.db.catchQuery(sql).getColumn(0);
	
	if (res && res != 0) {
		log(str + ' found!');
		return true;
	} else {
		log(str + ' not found');
		return false;
	}
}



/**
 * Rules error object constructors
 */

function MoveEmpty() { };

function MoveNotLine() { };
function MoveShort() { };
function MoveNotConsecutive() { };
function MoveNotCoverHome() { };
function MoveNotTouching() { };


function MoveInvalidWords(words) {
	this.words = words;
};