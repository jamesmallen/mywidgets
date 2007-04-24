
/**
 * BabelRules singleton
 * Functions for scoring and checking validity of Plays
 */
BabelRules = {
	isValidPlay: function(play) {
		var playInfo;
		
		if (play.getAll().length == 0) {
			throw new InvalidPlay(PLAY_EMPTY);
		}
		
		playInfo = play.getInfo();
		
		if (!playInfo.direction || !playInfo.continuous) {
			throw new InvalidPlay(PLAY_CROOKED);
		}
		
		if (playInfo.words.length == 0) {
			throw new InvalidPlay(PLAY_EMPTY);
		}
		
		var words = playInfo.words;
		if (play.board.getAll().length > 0) {
			var usesExisting = false;
			for (var i in words) {
				for (var j in words[i].letters) {
					if (words[i].letters[j].existingLetter) {
						usesExisting = true;
					}
				}
			}
			if (!usesExisting) {
				throw new InvalidPlay(PLAY_DISCONNECTED);
			}
		}
		
		
		
		
		return true;
	},
	
	
	/**
	 * calculate score for a play
	 */
	scoreWord: function(wordAll) {
		var totalScore = 0;
	}
	
}


function InvalidPlay(code) {
	var message;
	if (InvalidPlay.messages[code]) {
		message = InvalidPlay.messages[code];
	} else {
		message = code;
	}
	
	Error.apply(this, [message]);
	
	this.code = code;
	this.message = message;
}

InvalidPlay.prototype = new Error();
InvalidPlay.prototype.constructor = InvalidPlay;

const PLAY_EMPTY = 1;
const PLAY_CROOKED = 2;
const PLAY_DISCONNECTED = 3;


InvalidPlay.messages = {
	1: 'PLAY_EMPTY - No letters found in play',
	2: 'PLAY_CROOKED - Play is not in a continuous straight line',
	3: 'PLAY_DISCONNECTED - Play is not connected to any pre-existing letters'
}
