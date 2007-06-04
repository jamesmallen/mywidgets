/**
 * JController
 * Controller for Jumbalaya
 */


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
		var ret = {}, src;
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
		ret.letters = src[random(0, src.length)];
		
		ret.letters = arrayShuffle(ret.letters.split('')).join('');
		
		
		// set up times
		this.startTime = animator.milliseconds;
		this.finishTime = this.startTime + parseInt(preferences.roundLength.value);
		
		
		return ret;
	},
	
	
	
	
	scramble: function() {
		if (AnimationQueue.arr.length > 2) {
			// Don't queue things forever
			return;
		} else {
			this.view.scramble();
		}
	},
	
	
	
	
	
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
				letters: { visible: false },
			}
		},
		
		round: {
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
				letters: { visible: true },
			}
		}
	}
};

