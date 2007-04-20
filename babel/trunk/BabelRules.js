/**
 * Error Numbers
 */


/**
 * BabelRules singleton
 * Functions for scoring and checking validity of moves
 */
BabelRules = {
	isValidMove: function(move, board) {
		var moveAll = move.getAll();
		
		if (moveAll.length <= 0) {
			throw new InvalidMove(MOVE_EMPTY);
		}
		
		if (!BabelRules.isStraightLine(moveAll)) {
			throw new InvalidMove(MOVE_CROOKED);
		}
		
		
		
		return true;
	},
	
	
	
	
	
	/**
	 * isStraightLine(moveAll)
	 * Determines if a move is in a straight line
	 * startRow / startCol may be specified to speed up detection
	 */
	isStraightLine: function(moveAll) {
		var letter, moveRow = null, moveCol = null, vertical = true, horizontal = true;
		
		for (var i in moveAll) {
			if (moveRow == null) {
				moveRow = moveAll[i].row;
			} else if (moveRow != moveAll[i].row) {
				horizontal = false;
			}
			if (moveCol == null) {
				moveCol = moveAll[i].col;
			} else if (moveCol != moveAll[i].col) {
				vertical = false;
			}
			
			if (!vertical && !horizontal) {
				return false;
			}
		}
		
		return true;
	}
}


function InvalidMove(code) {
	this.code = code;
	
	if (InvalidMove.messages[code]) {
		this.message = InvalidMove.messages[code];
	} else {
		this.message = code;
	}
}



const MOVE_EMPTY = 1;
const MOVE_CROOKED = 2;


InvalidMove.messages = {
	1: 'MOVE_EMPTY - No letters found in move',
	2: 'MOVE_CROOKED - Move is not in a straight line'
}
