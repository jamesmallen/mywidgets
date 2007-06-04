/**
 * JController
 * Controller for Jumbalaya
 */

const MIN_WORDS_PER_ROUND = 5;
const MAX_WORDS_PER_ROUND = 26;


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
	
	this.words.load('words0.txt');
	
	
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
	paused: false,
	updateAnimation: null,
	
	
	
	
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
		this.currentWords.sort(function(a, b) {
			return a.length - b.length;
		});
		
		// pare down the word list to fit on the notecard
		this.pareWords();
		
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
			this.currentWords.splice(MAX_WORDS_PER_ROUND - 2, this.currentWords.length - MAX_WORDS_PER_ROUND);
		}
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
	 * function to force graphical updates of the timer elements
	 */
	updateRound: function() {
		var now = animator.milliseconds;
		
		if (this.paused) {
			this.finishTime += (now - this.updateRound.lastUpdated);
		}
		
		this.view.updateTimer();
		
		this.updateRound.lastUpdated = now;
	},
	
	
	
	
	
	states: {
		menu: {
			view: {
				gameWindow: { visible: true },
				wordsWindow: { opacity: 0 },
				menu: { visible: true },
				timer: { visible: false },
				answer: { visible: false },
				letters: { visible: false }
			}
		},
		
		round: {
			paused: false,
			view: {
				gameWindow: { visible: true },
				wordsWindow: { opacity: 255 },
				menu: { visible: false },
				timer: {
					visible: true,
					startButton: { visible: false },
					pauseButton: { visible: true }
				},
				answer: { visible: true },
				letters: { visible: true }
			}
		}
	}
};

