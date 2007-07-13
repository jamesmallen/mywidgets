/**
 * JController
 * Controller for Jumbalaya
 */

const MIN_WORDS_PER_ROUND = 5;
const MAX_WORDS_PER_ROUND = 36;
const POINTS_PER_LETTER = 20;
const POINTS_PER_MS = .01;


JController = function() {
	this.view = new JView();
	
	this.words = new WordDB();
	
	this.sixes = [];
	this.sevens = [];
	
	this.words.controller = this;
	this.words.addHook = function(word) {
		if (word.length == 6) {
			this.controller.sixes.push(word);
		} else if (word.length == 7) {
			this.controller.sevens.push(word);
		}
	}
	
	this.loadWords();
	
	widget.onPreferencesChanged = this.onPreferencesChanged;
	
	/*
	gameWindow.onKeyDown = function() {
		log('onKeyDown');
		print('\tsystem.event.keyCode: ' + system.event.keyCode + '\n\tsystem.event.keyString: ' + system.event.keyString + '\n\tsystem.event.charCode: ' + system.event.charCode + '\n\tsystem.event.isChar: ' + system.event.isChar);
	};
	gameWindow.onKeyUp = function() {
		log('onKeyUp');
		print('\tsystem.event.keyCode: ' + system.event.keyCode + '\n\tsystem.event.keyString: ' + system.event.keyString + '\n\tsystem.event.charCode: ' + system.event.charCode + '\n\tsystem.event.isChar: ' + system.event.isChar);
	};
	*/

};

JController.prototype = {
	// PROPERTIES
	state: null,
	score: null,
	startTime: null,
	finishTime: null,
	ended: false,
	paused: false,
	updateAnimation: null,
	lastDifficulty: null,
	
	
	
	
	/**
	 * changeState()
	 * Called to switch states
	 */
	changeState: function(state) {
		params = {};
		
		// first clean up
		switch (this.state) {
			case 'round':
				if (this.updateAnimation && this.updateAnimation.kill) {
					this.updateAnimation.kill();
				}
				break;
		}
		
		// then apply simple properties changes from states object
		applyProperties(this, this.states[state]);
		
		// then complex logic
		switch (state) {
			case 'menu':
				
				break;
			case 'round':
				params = this.newRound();
				this.updateAnimation = new CustomAnimation(FLUID_ANIMATION_INTERVAL, function() { this.ct.updateRound(); return true; });
				this.updateAnimation.ct = this;
				animator.start(this.updateAnimation);
				this.view.showMessage(getMessage('start'));
				break;
			default:
				log('Unhandled state switch: ' + state);
				break;
		}
		this.state = state;
		this.view.changeState(state, params);
	},
	
	
	
	/**
	 * newGame()
	 * starts a new game
	 */
	newGame: function() {
		this.score = 0;
		this.changeState('round');
	},
	
	/**
	 * newRound()
	 * starts a new round
	 * Returns params to pass to view state change
	 */
	newRound: function() {
		var src;
		
		switch (parseInt(preferences.numberLetters.value)) {
			case 6:
				src = this.sixes;
				break;
			case 7:
				src = this.sevens;
				break;
			default:
				throw new Error('Unexpected numberLetters value');
				break;
		}
		
		this.currentWords = [];
		
		// ensure we get at least the minimum number of word permutations
		while (this.currentWords.length < MIN_WORDS_PER_ROUND) {
			// get a random six/seven-letter word
			this.letters = src[random(0, src.length)];
			this.letters = arrayShuffle(this.letters.split('')).join('');
			
			// get all the permutations of the word
			this.currentWords = this.words.permute(this.letters);
		}
		
		// sort by word length
		this.sortWords();
		
		// pare down the word list to fit on the notecard
		// this.pareWords();
		this.sortWords();
		
		// convert this.currentWords to object format
		this.convertWords();
		
		// set up times
		this.startTime = animator.milliseconds;
		this.finishTime = this.startTime + parseInt(preferences.roundLength.value);
		
		
		return {
			letters: this.letters
		};
	},
	
	
	/**
	 * clearWord()
	 * clears out the current play
	 */
	clearWord: function() {
		while (this.trayLetter(0)) {
			// noop
		}
	},
	
	
	/**
	 * playWord()
	 */
	playWord: function() {
		var word = this.view.playLetters.getWord().toLowerCase();
		if (typeof(this.currentWords[word]) != 'undefined') {
			if (this.currentWords[word] == false) {
				this.view.showMessage(getMessage('foundWord', word.toUpperCase()));
				
				this.currentWords[word] = true;
				
				this.score += word.length * POINTS_PER_LETTER;
				
				this.view.updateScore();
			} else {
				this.view.showMessage(getMessage('duplicate', word.toUpperCase()));
			}
		} else {
			this.view.showMessage(getMessage('nonWord', word.toUpperCase()));
		}
		this.clearWord();
	},
	
	/**
	 * trayLetter()
	 * trayLetter(i)
	 * pulls off the last letter from the tray
	 */
	trayLetter: function(i) {
		if (typeof(i) == 'undefined') {
			i = this.view.playLetters.letters.length - 1;
		}
		
		if (i < 0) {
			return;
		}
		
		var tLetter = this.view.playLetters.pull(i);
		
		if (tLetter) {
			this.view.trayLetters.push(tLetter);
		}
		
		return tLetter;
	},
	
	
	/**
	 * playLetter(i)
	 * Plays the letter at index i
	 */
	playLetter: function(i) {
		var tLetter = this.view.trayLetters.pull(i);
		
		if (tLetter) {
			this.view.playLetters.push(tLetter);
		}
		
		return tLetter;
	},
	
	/**
	 * convertWords()
	 * converts this.currentWords to object format
	 */
	convertWords: function() {
		var t = {};
		for (var i = 0; i < this.currentWords.length; i++) {
			t[this.currentWords[i]] = false;
		}
		
		this.currentWords = t;
	},
	
	
	/**
	 * pareWords()
	 * pares down this.currentWords to fit on a notecard
	 */
	pareWords: function() {
		var newWords = [];
		
		/*
		var row = 0;
		var col = 0;
		var currentWordLength = this.currentWords[0].length;
		
		var newWords = [];
		
		for (var i = 0; i < this.currentWords.length; i++) {
			if (
			if (this.currentWords[i].length != currentWordLength) {
				row++;
				col = 0;
			}
		}
		*/
		if (this.currentWords.length > MAX_WORDS_PER_ROUND) {
			log('Paring words');
			
			for (var i = 0; i < MAX_WORDS_PER_ROUND - 1; i++) {
				newWords.push(this.currentWords.splice(random(0, this.currentWords.length - 1), 1)[0]);
			}
			newWords.push(this.currentWords.splice(this.currentWords.length - 1, 1)[0]);
			
			this.currentWords = newWords;
			this.sortWords();
			// this.currentWords.splice(MAX_WORDS_PER_ROUND - 2, this.currentWords.length - MAX_WORDS_PER_ROUND);
		}
	},
	
	/**
	 * sortWords()
	 */
	sortWords: function() {
		this.currentWords.sort(function(a, b) {
			return a.length - b.length;
		});
	},
	
	
	
	scramble: function() {
		if (AnimationQueue.arr.length > 2) {
			// Don't queue things forever
			return;
		} else {
			this.view.scramble();
		}
	},
	
	
	
	
	/**
	 * updateRound()
	 * function to force graphical updates of the timer elements, and to check
	 * for the end of the round
	 */
	updateRound: function() {
		var now = animator.milliseconds;
		
		if (this.paused) {
			this.finishTime += (now - this.updateRound.lastUpdated);
		} else {
			if (now >= this.finishTime) {
				this.endRound();
				return;
			} else {
				// see if all the words are found
				var foundAll = true;
				
				for (var i in this.currentWords) {
					if (!this.currentWords[i]) {
						foundAll = false;
					}
				}
				if (foundAll) {
					this.endRound();
					return;
				}
			}
		}
		
		this.view.updateTimer();
		
		this.updateRound.lastUpdated = now;
	},
	
	/**
	 * endRound()
	 * ends the round
	 */
	endRound: function() {
		this.ended = true;
		if (this.updateAnimation && this.updateAnimation.kill) {
			this.updateAnimation.kill();
		}
		
		// determine if the buzzword was gotten
		var maxLength = 0;
		var maxFoundLength = 0;
		var foundAll = true;
		
		for (var i in this.currentWords) {
			maxLength = Math.max(i.length, maxLength);
			if (this.currentWords[i]) {
				maxFoundLength = Math.max(i.length, maxFoundLength);
			} else {
				foundAll = false;
			}
		}
		
		if (foundAll) {
			// bonus points!
			this.score += Math.floor((this.finishTime - animator.milliseconds) * POINTS_PER_MS);
			this.view.updateScore();
			this.view.showMessage(getMessage('endAll'), null, getMessage('advance2'));
			this.view.endRound(true);
		} else if (maxFoundLength == maxLength) {
			this.view.showMessage(getMessage('advance'), null, getMessage('advance2'));
			this.view.endRound(true);
		} else {
			this.view.showMessage(getMessage('noAdvance'), null, getMessage('noAdvance2'));
			this.view.endRound(false);
		}
	},
	
	/**
	 * onPreferencesChanged()
	 */
	onPreferencesChanged: function() {
		log('preferences changed');
		this.loadWords();
	},
	
	/**
	 * loadWords()
	 * Loads the appropriate wordlists into this.words from preferences
	 */
	loadWords: function() {
		var curDifficulty = parseInt(preferences.difficulty.value);
		if (curDifficulty != this.lastDifficulty) {
			this.words.reset();
			
			for (var i = 0; i < curDifficulty; i++) {
				log('Loading wordlist ' + i + '...');
				this.words.load('words' + i + '.txt');
			}
			
			this.lastDifficulty = curDifficulty;
		}
	},
	
	states: {
		menu: {
			view: {
				gameWindow: { visible: true },
				wordsWindow: { opacity: 0 },
				menu: { visible: true },
				timer: { visible: false },
				messageBox: { visible: false },
				answer: { visible: false },
				letters: { visible: false }
			}
		},
		
		round: {
			ended: false,
			paused: false,
			view: {
				gameWindow: { visible: true },
				// wordsWindow: { opacity: 255 },
				menu: { visible: false },
				timer: {
					visible: true,
					startButton: { visible: false },
					pauseButton: { visible: true }
				},
				messageBox: { opacity: 0, visible: true },
				answer: { visible: true },
				letters: { visible: true }
			}
		}
	}
};


/**
 * getMessage(code)
 * getMessage(code, str)
 * Gets an appropriate message for a particular message type
 */
getMessage = function(code, str) {
	var msg = getMessage.messages[code];
	
	if (msg instanceof Array) {
		msg = msg[random(0, msg.length)];
	}
	
	msg = msg.replace('%1%', str);
	
	return msg;
};

getMessage.messages = {
	foundWord: '%1% is one of the words!',
	foundBuzzword: 'Bon! %1% is the buzzword for the next round!',
	duplicate: 'You already got %1%.',
	nonWord: 'Desole, %1% isn\'t one of the words.',
	start: 'Allons!',
	noAdvance: 'You didn\'t get the buzzword. C\'est la vie.',
	noAdvance2: 'Click on "QUIT" to go back to the Main Menu.',
	advance: 'Laissez les bons temps rouler!',
	advance2: 'Click "START" to continue to the next round.',
	endAll: 'Way to go! You got all the words!'
};
	
	
	
