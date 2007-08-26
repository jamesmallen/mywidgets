/**
 * JController
 * Controller for Jumbalaya
 */

const MIN_WORDS_PER_ROUND = 5;
const POINTS_PER_LETTER = 20;
const POINTS_PER_MS = .01;


JController = function() {
	this.view = new JView();
	
	if (!filesystem.itemExists(system.widgetDataFolder + '/words0.txt')) {
		// first run - extract words
		log('extracting words');
		try {
			if (!filesystem.unzip(widget.extractFile('words.zip'), system.widgetDataFolder)) {
				throw(new Error());
			}
		} catch (e) {
			alert('There was an error extracting the word lists. The Widget will now close.');
			closeWidget();
		}
	}
	
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
		
		this.roundScore = 0;
		
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
				
				var playScore = word.length * POINTS_PER_LETTER;
				
				this.roundScore += playScore;
				this.score += playScore;
				
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
		
		if (this.paused || !widget.visible) {
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
		
		switch (this.roundAdvance()) {
			case 2:
				// bonus points!
				var bonusPoints = Math.floor((this.finishTime - animator.milliseconds) * POINTS_PER_MS);
				this.roundScore += bonusPoints;
				this.score += bonusPoints;
				this.view.updateScore();
				this.view.showMessage(getMessage('endAll'), null, getMessage('advance'));
				this.view.endRound(true);
				break;
			case 1:
				this.view.showMessage(getMessage('advance'), 0);
				this.view.endRound(true);
				break;
			default:
			case 0:
				this.view.showMessage(getMessage('noAdvance'), null, getMessage('noAdvance2'));
				this.view.endRound(false);
				break;
		}
	},
	
	roundAdvance: function() {
		// determine if the buzzword was gotten
		var maxLength = 0;
		var maxFoundLength = 0;
		var foundAll = true;
		var wordCount = 0;
		var foundCount = 0;
		
		
		for (var i in this.currentWords) {
			maxLength = Math.max(i.length, maxLength);
			wordCount++;
			if (this.currentWords[i]) {
				maxFoundLength = Math.max(i.length, maxFoundLength);
				foundCount++;
			} else {
				foundAll = false;
			}
		}
		
		var normalAdvance = false;
		
		if ( // advance conditions
			(maxFoundLength == maxLength) || // found the 6/7 letter word
			((foundCount / wordCount) >= 0.75) || // found 75% of the words
			(this.roundScore >= 750) // got 750 points (approx. 10-15 words)
		) {
			if (foundAll) {
				return 2;
			} else {
				return 1;
			}
		} else {
			return 0;
		}
	},
	
	/**
	 * onPreferencesChanged()
	 */
	onPreferencesChanged: function() {
		ct.loadWords();
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
				this.words.load(system.widgetDataFolder + '/words' + i + '.txt');
			}
			
			this.lastDifficulty = curDifficulty;
		}
	},
	
	states: {
		menu: {
			view: {
				gameWindow: { visible: true },
				wordsWindow: { visible: false, opacity: 0 },
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
				wordsWindow: { visible: true },
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
	foundWord: 'You got %1%.',
	foundBuzzword: 'You got a %2%-letter word!',
	duplicate: 'You already found %1%.',
	nonWord: '%1% isn\'t one of the words.',
	start: 'Let\'s make some Jumbalaya!',
	noAdvance: 'Sorry, you didn\'t get enough points.',
	noAdvance2: 'Click on "QUIT" to go back to the Main Menu.',
	advance: 'Click "START" to continue to the next round.',
	endAll: 'You guessed all the words!'
};
	
	
	
