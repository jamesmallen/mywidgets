/**
 * JView()
 * View for Jumbalaya
 */


JView = function() {
	this.gameWindow = gameWindow;
	
	this.wordsWindow = wordsWindow;
	
	this.pan = makeAndAppend(Frame, this.gameWindow, {
	});
	this.pan.shadow = makeAndAppend(Image, this.pan, {
		src: 'Resources/PanShadow.png',
		vOffset: 95
	});
	this.pan.pan = makeAndAppend(Image, this.pan, {
		src: 'Resources/Pan.png'/*,
		hOffset: 352,
		vOffset: 255,
		hRegistrationPoint: 352,
		vRegistrationPoint: 255*/
	});
	this.pan.panTilted = makeAndAppend(Image, this.pan, {
		src: 'Resources/PanTilted.png',
		visible: false
	});
	
	
	this.menu = makeAndAppend(Frame, this.gameWindow, {
		hOffset: 6,
		vOffset: 61
	});
	this.menu.newGame = makeAndAppend(Image, this.menu, {
		src: 'Resources/MenuNewGame.png',
		hOffset: 140,
		vOffset: 42,
		hAlign: 'center',
		tracking: 'rectangle',
		onMouseUp: function() { ct.newGame(); }
	});
	this.menu.highScores = makeAndAppend(Image, this.menu, {
		src: 'Resources/MenuHighScores.png',
		hOffset: 140,
		vOffset: 82,
		hAlign: 'center',
		tracking: 'rectangle',
		visible: false
	});
	this.menu.options = makeAndAppend(Image, this.menu, {
		src: 'Resources/MenuOptions.png',
		hOffset: 140,
		vOffset: 122,
		hAlign: 'center',
		tracking: 'rectangle',
		onMouseUp: function() { showWidgetPreferences(); }
	});
	this.menu.help = makeAndAppend(Image, this.menu, {
		src: 'Resources/MenuHelp.png',
		hOffset: 140,
		vOffset: 162,
		hAlign: 'center',
		tracking: 'rectangle',
		onMouseUp: function() { alert('Help is not quite done yet...'); }
	});
	
	
	this.timer = makeAndAppend(Frame, this.gameWindow, {
		hOffset: 214,
		vOffset: 177
		// opacity: 0
	});
	this.timer.timer = makeAndAppend(Image, this.timer, {
		src: 'Resources/Timer.png',
		hOffset: 0,
		vOffset: 0
	});
	this.timer.labels = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerLabels.png',
		hOffset: 41,
		vOffset: 27
	});
	this.timer.button1 = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButton.png',
		hOffset: 25,
		vOffset: 112
	});
	this.timer.button2 = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButton.png',
		hOffset: 72,
		vOffset: 116
	});
	this.timer.startButton = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButtonStart.png',
		hOffset: 25,
		vOffset: 112,
		tracking: 'rectangle',
		onMouseUp: function() {
			ct.paused = false;
			ct.updateRound();
			ct.view.timer.startButton.visible = false;
			ct.view.timer.pauseButton.visible = true;
		}
	});
	this.timer.pauseButton = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButtonPause.png',
		hOffset: 25,
		vOffset: 112,
		tracking: 'rectangle',
		onMouseUp: function() {
			ct.paused = true;
			ct.updateRound();
			ct.view.timer.startButton.visible = true;
			ct.view.timer.pauseButton.visible = false;
		}
	});
	this.timer.quitButton = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButtonQuit.png',
		hOffset: 72,
		vOffset: 116,
		tracking: 'rectangle',
		onMouseUp: function() {
			ct.paused = true;
			ct.updateRound();
			if (1 == alert('Are you sure you want to quit?', 'Yes', 'No')) {
				ct.changeState('menu');
			} else {
				ct.paused = false;
				ct.updateRound();
			}
		}
	});
	
	this.timer.time = makeAndAppend(Text, this.timer, {
		// data: '3:02',
		hOffset: 114,
		vOffset: 60,
		rotation: 5,
		hAlign: 'right',
		font: 'Lucida Grande, Lucida Sans, Arial',
		size: 18,
		opacity: 137
	});
	this.timer.score = makeAndAppend(Text, this.timer, {
		// data: '14,230',
		hOffset: 111,
		vOffset: 99,
		rotation: 5,
		hAlign: 'right',
		font: 'Lucida Grande, Lucida Sans, Arial',
		size: 18,
		opacity: 137
	});
	
	
	
	this.answer = makeAndAppend(Frame, this.gameWindow, {
		hOffset: 3
	});
	this.answer.bg = makeAndAppend(Image, this.answer, {
		src: 'Resources/AnswerBG.png'
	});
	
	
	
	this.letters = makeAndAppend(Frame, this.gameWindow);
	
	
	
	
	// wordsWindow
	makeAndAppend(Image, this.wordsWindow, {
		src: 'Resources/Notecards.png'
	});
	
	this.words = makeAndAppend(Frame, this.wordsWindow, {
		hOffset: 35,
		vOffset: 40
	});
	
	/*
	this.sampleWords = [
		//new ImageText({src:'Resources/HandLetters/*.png',data:'___',hOffset:0,vOffset:0}, this.words),
		new ImageText({src:'Resources/HandLetters/*.png',data:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',hOffset:0,vOffset:18}, this.words),
		//new ImageText({src:'Resources/HandLetters/*.png',data:'____',hOffset:0,vOffset:36}, this.words),
		//new ImageText({src:'Resources/HandLetters/*.png',data:'____',hOffset:0,vOffset:54}, this.words),
		new ImageText({src:'Resources/HandLetters/*.png',data:'LIGHT',hOffset:0,vOffset:72}, this.words)
	];
	*/
	
};

JView.prototype = {
	// PROPERTIES
	state: null,
	
	/**
	 * changeState()
	 * Called to switch states
	 */
	changeState: function(state, params) {
		// first clean up
		switch (this.state) {
			case 'round':
				widget.onKeyDown = null;
				break;
		}
		
		// then change
		switch (state) {
			case 'menu':
				emptyFrame(this.letters);
				this.pan.pan.onMouseUp = null;
				break;
			case 'round':
				emptyFrame(this.letters);
				emptyFrame(this.words);
				this.pan.pan.onMouseUp = function() { ct.scramble(); };
				this.trayLetters = makeObject(LetterHolder, {
					parentNode: this.letters,
					hOffset: 145,
					vOffset: 145
				});
				
				this.playLetters = makeObject(LetterHolder, {
					parentNode: this.letters,
					hOffset: 145,
					vOffset: 25
				});
				
				for (var i in params.letters) {
					this.trayLetters.add(params.letters[i]);
				}
				
				this.updateNotecard();
				
				// this.gameWindow.onKeyPress = function() {
				// widget.onKeyDown = function() {
				//widget.onKeyUp = function() {
				this.gameWindow.onTextInput = function() {
					lastdata = system.event.data;
					switch (system.event.data) {
						case ' ':
							ct.scramble();
							break;
						case '\b': // backspace
							ct.trayLetter();
							break;
						case '\r': // return
						case '\n': // linefeed
							ct.playWord();
							break;
						default:
							var letter = system.event.data.toUpperCase();
							if (/^[A-Z]$/.test(letter)) {
								ct.playLetter(letter);
							}
							break;
					}
				};
				
				this.gameWindow.on
				
				
			default:
				break;
		}
		this.state = state;
	},
	
	
	scramble: function() {
		var anms = [];
		
		var panAnm = new CustomAnimation(FLUID_ANIMATION_INTERVAL, function() {
			if (!this.initialized) {
				this.interval = SCRAMBLE_DURATION * 0.5;
				this.pan.panTilted.visible = true;
				this.pan.pan.visible = false;
				this.initialized = true;
				return true;
			} else {
				this.pan.pan.visible = true;
				this.pan.panTilted.visible = false;
				return false;
			}
		});
		panAnm.pan = this.pan;
		
		anms.push(panAnm);
		anms.push(this.trayLetters.scramble());
		
		AnimationQueue.queue(anms);
	},
	
	
	updateScore: function() {
		
		this.updateNotecard();
	},
	
	updateNotecard: function() {
		var hOffset = 0;
		var vOffset = 0;
		var t, lastLength;
		
		emptyFrame(this.words);
		
		for (var i in ct.currentWords) {
			if (lastLength != i.length && hOffset > 0) {
				hOffset = 0;
				vOffset += 18;
			}
			lastLength = i.length;
			
			if (ct.currentWords[i]) {
			// if (random(0, 2) >= 1) {
				t = new ImageText({src:'Resources/HandLetters/*.png', data:i, hOffset: hOffset, vOffset: vOffset}, this.words);
			} else {
				var placeholder = '';
				for (var j = 0; j < i.length; j++) {
					placeholder += '_';
				}
				t = new ImageText({src:'Resources/HandLetters/*.png', data:placeholder, hOffset: hOffset, vOffset: vOffset}, this.words);
			}
			
			hOffset = Math.ceil((hOffset + t.frame.width + 50) / 15) * 15;
			if (hOffset > 240) {
				hOffset = 0;
				vOffset += 18;
			}
		}
	},
	
	
	updateTimer: function() {
		var now = animator.milliseconds;
		var secondsLeft = Math.ceil((ct.finishTime - now) / 1000);
		var timeSeparator = ((Math.floor((ct.finishTime - now) / 500) % 2 == 0) ? " " : ":");
		this.timer.time.data = Math.floor(secondsLeft / 60) + timeSeparator + padString(('' + secondsLeft % 60), 2, '0');
		
		if (ct.paused) {
			if (this.letters.visible) {
				this.letters.visible = false;
				this.answer.visible = false;
			}
			if ((now % 1500) >= 750) {
				this.timer.time.data = "";
			}
		} else {
			if (!this.letters.visible) {
				this.letters.visible = true;
				this.answer.visible = true;
			}
		}
		
		this.timer.score.data = ct.score;
	}
	
	
	

	
	
};
