/**
 * JView()
 * View for Jumbalaya
 */


const MESSAGE_FADE_DURATION = 120; // in milliseconds
const MESSAGE_SHOW_DURATION = 4; // in seconds

const NOTECARD_LINE_HEIGHT = 18;
const NOTECARD_LINE_WIDTH = 150;
const NOTECARD_WORD_SPACING = {
	3: 75,
	4: 75,
	5: 100,
	6: 100,
	7: 175
};


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
		tracking: 'rectangle'
	});
	this.timer.pauseButton = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButtonPause.png',
		hOffset: 25,
		vOffset: 112,
		tracking: 'rectangle'
	});
	this.timer.quitButton = makeAndAppend(Image, this.timer, {
		src: 'Resources/TimerButtonQuit.png',
		hOffset: 72,
		vOffset: 116,
		tracking: 'rectangle'
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
	
	
	this.messageBox = makeAndAppend(Frame, this.gameWindow, {
		hOffset: 304,
		vOffset: 28
	});
	this.messageBox.bg = makeAndAppend(Image, this.messageBox, {
		src: 'Resources/ShrimpBubble.png'
	});
	this.messageBox.message = makeAndAppend(TextArea, this.messageBox, {
		data: 'This is a test message',
		hOffset: 13,
		vOffset: 64,
		vAlign: 'center',
		width: 110,
		editable: false,
		scrollbar: false,
		style: {
			color: '#000',
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", sans-serif',
			fontSize: '14px',
			textAlign: 'center'
		}
	}, true);
	
	
	this.answer = makeAndAppend(Frame, this.gameWindow, {
		hOffset: 3,
		vOffset: 30
	});
	this.answer.bg = makeAndAppend(Image, this.answer, {
		src: 'Resources/AnswerBG.png'
	});
	
	this.answer.buttons = makeAndAppend(Frame, this.answer, {
		vOffset: 30,
		visible: false
	});
	
	this.answer.clearButton = makeAndAppend(Image, this.answer.buttons, {
		src: 'Resources/AnswerButtonClear.png',
		hAlign: 'center',
		hOffset: 23,
		tracking: 'rectangle',
		onClick: this.actions.clearWord
	});
	this.answer.playButton = makeAndAppend(Image, this.answer.buttons, {
		src: 'Resources/AnswerButtonEnter.png',
		hAlign: 'center',
		hOffset: 261,
		tracking: 'rectangle',
		onClick: this.actions.playWord
	});
	
	
	this.letters = makeAndAppend(Frame, this.gameWindow);
	
	
	
	
	// wordsWindow
	/*
	makeAndAppend(Image, this.wordsWindow, {
		src: 'Resources/Notecards.png'
	});
	*/
	
	this.notecard = makeAndAppend(Canvas, this.wordsWindow, {
		width: 362,
		height: 271
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
	
	
	this._messageTimer = new Timer();
	this._messageTimer.onTimerFired = function() { ct.view.hideMessage(); };
	
};

JView.prototype = {
	// PROPERTIES
	state: null,
	
	// PRIVATE PROPERTIES
	_messageFadeAnim: null,
	_messageTimer: null,
	
	
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
				this.pan.pan.onMouseUp = this.actions.scramble;
				this.trayLetters = makeObject(LetterHolder, {
					parentNode: this.letters,
					hOffset: 145,
					vOffset: 145
				});
				
				this.playLetters = makeObject(LetterHolder, {
					parentNode: this.letters,
					hOffset: 145,
					vOffset: 51
				});
				
				for (var i = 0; i < params.letters.length; i++) {
					this.trayLetters.add(params.letters[i]);
				}
				
				for (var i = 0; i < this.trayLetters.letters.length; i++) {
					this.trayLetters.letters[i].onClick = this.actions.clickLetter;
				}
				
				this.initNotecard();
				// this.updateNotecard();
				
				// this.gameWindow.onKeyPress = function() {
				// widget.onKeyDown = function() {
				//widget.onKeyUp = function() {
				this.gameWindow.onTextInput = this.actions.textInput;
				
				this.timer.pauseButton.onClick = this.actions.pause;
				this.timer.startButton.onClick = this.actions.resume;
				this.timer.quitButton.onClick = this.actions.quit;
				
			default:
				break;
		}
		this.state = state;
	},
	
	/**
	 * showMessage(msg)
	 * showMessage(msg, duration)
	 */
	showMessage: function(msg, duration, nextMsg) {
		if (typeof(duration) == 'undefined' || duration == null) {
			duration = MESSAGE_SHOW_DURATION;
		}
		
		if (typeof(nextMsg) != 'undefined') {
			this.nextMsg = nextMsg;
		}
		
		this._messageTimer.ticking = false;
		this.messageBox.message.data = msg;
		
		if (this._messageFadeAnim && this._messageFadeAnim.kill) {
			this._messageFadeAnim.kill();
		}
		
		this._messageFadeAnim = new FadeAnimation(this.messageBox, 255, MESSAGE_FADE_DURATION, animator.kEaseNone);
		animator.start(this._messageFadeAnim);
		
		if (duration >= 0) {
			this._messageTimer.interval = duration;
			this._messageTimer.reset();
			this._messageTimer.ticking = true;
		}
	},
	
	hideMessage: function() {
		if (this.nextMsg) {
			this.showMessage(this.nextMsg, 0);
			this.nextMsg = null;
		} else {
			this._messageTimer.ticking = false;
			if (this._messageFadeAnim && this._messageFadeAnim.kill) {
				this._messageFadeAnim.kill();
			}
			
			this._messageFadeAnim = new FadeAnimation(this.messageBox, 0, MESSAGE_FADE_DURATION, animator.kEaseNone);
			animator.start(this._messageFadeAnim);
		}
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
		this.timer.score.data = ct.score;
	},
	
	
	/**
	 * drawNotecardStack()
	 */
	drawNotecardStack: function() {
		var ctx = this.notecard.getContext('2d');
		
		var oldCompositeOperation = ctx.globalCompositeOperation;
		ctx.globalCompositeOperation = 'source-over';
		
		ctx.clearRect(0, 0, this.notecard.width, this.notecard.height);
		
		var width = this.notecard.width - 33;
		var height = this.notecard.height - 39;
		
		ctx.save();
		ctx.translate(20, 11);
		ctx.rotate(1.4 * Math.PI / 180);
		this.drawNotecard(ctx, width, height, true);
		ctx.restore();
		
		ctx.save();
		ctx.translate(19, 9.5);
		ctx.rotate(0.7 * Math.PI / 180);
		this.drawNotecard(ctx, width, height, true);
		ctx.restore();
		
		ctx.save();
		ctx.translate(18, 8);
		this.drawNotecard(ctx, width, height, false);
		ctx.restore();
		
		ctx.globalCompositeOperation = oldCompositeOperation;
	},
	
	/**
	 * drawNotecard(ctx, simple)
	 * drawNotecard(ctx)
	 */
	drawNotecard: function(ctx, width, height, simple) {
		if (typeof(simple) == 'undefined') {
			simple = false;
		}
		
		ctx.save();
		
		// drop shadow
		rectangleShadow(ctx, 0, 6, width, height, 15, 0.33);
		
		// notecard fill
		ctx.save();
		ctx.rect(0, 0, width, height);
		ctx.clip();
		ctx.translate(-0.25 * width, 0);
		ctx.scale(1.5, 1);
		// ctx.fillStyle = 'rgb(241, 241, 241)';
		var grad = ctx.createRadialGradient(0.5 * width, 0.095 * height, 0.017 * height, 0.5 * width, -0.095 * height, 1.293 * height);
		grad.addColorStop(0, 'rgb(241,241,241)');
		grad.addColorStop(1, 'rgb(198,198,198)');
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, width, height);
		
		if (!simple) {
			// lines
			ctx.lineWidth = 1.5;
			
			// red line
			ctx.strokeStyle = 'rgba(255,0,0,0.15)';
			ctx.beginPath();
			ctx.moveTo(0, 29);
			ctx.lineTo(width, 29);
			ctx.stroke();
			
			// blue lines
			ctx.strokeStyle = 'rgba(0,0,255,0.15)';
			for (var vOffset = 47; vOffset < height; vOffset += 18) {
				ctx.beginPath();
				ctx.moveTo(0, vOffset);
				ctx.lineTo(width, vOffset);
				ctx.stroke();
			}
		}
		
		ctx.restore();
		
		
		ctx.restore();
	},
	
	/**
	 * initNotecard()
	 */
	initNotecard: function() {
		// draws the notecard stack
		var vOffset = this.updateNotecard(false);
		
		this.notecard.height = Math.max(vOffset + 90, 31);
		this.drawNotecardStack();
		
		this.wordsWindow.height = this.notecard.height;
		this.wordsWindow.opacity = 255;
	},
	
	/**
	 * updateNotecard()
	 * updateNotecard(highlightMissing)
	 */
	updateNotecard: function(highlightMissing) {
		var hOffset = 0;
		var vOffset = 0;
		var t, lastLength;
		
		emptyFrame(this.words);
		
		for (var i in ct.currentWords) {
			if (lastLength != i.length && hOffset > 0) {
				hOffset = 0;
				vOffset += NOTECARD_LINE_HEIGHT;
			}
			lastLength = i.length;
			
			if (ct.currentWords[i] || highlightMissing) {
				t = new ImageText({src:'Resources/HandLetters/*.png', data:i, hOffset: hOffset, vOffset: vOffset}, this.words);
				if (!ct.currentWords[i] && highlightMissing) {
					t.frame.style.background = 'rgba(255, 255, 0, 0.4)';
				}
			} else {
				var placeholder = '';
				for (var j = 0; j < i.length; j++) {
					placeholder += '_';
				}
				t = new ImageText({src:'Resources/HandLetters/*.png', data:placeholder, hOffset: hOffset, vOffset: vOffset}, this.words);
			}
			
			hOffset += NOTECARD_WORD_SPACING[lastLength];
			if (hOffset > NOTECARD_LINE_WIDTH) {
				hOffset = 0;
				vOffset += NOTECARD_LINE_HEIGHT;
			}
		}
		
		return vOffset;
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
		
		if (this.playLetters.letters.length > 0) {
			this.answer.buttons.visible = true;
		} else {
			this.answer.buttons.visible = false;
		}
		
		this.timer.score.data = ct.score;
	},
	
	/**
	 * endRound(advance)
	 * advance is whether or not to show a button to advance to the next round
	 */
	endRound: function(advance) {
		this.timer.time.data = "";
		
		this.timer.pauseButton.visible = false;
		if (advance) {
			this.timer.startButton.visible = true;
			this.timer.startButton.onClick = this.actions.nextRound;
		} else {
			this.timer.startButton.visible = false;
		}
		
		this.timer.quitButton.visible = true;
		this.answer.buttons.visible = false;
		
		this.gameWindow.onTextInput = null;
		this.pan.pan.onMouseUp = null;
		
		for (var i = 0; i < this.trayLetters.letters.length; i++) {
			this.trayLetters.letters[i].onClick = null;
		}
		
		for (var i = 0; i < this.playLetters.letters.length; i++) {
			this.playLetters.letters[i].onClick = null;
		}
		
		this.updateNotecard(true);
	},
	
	
	

	
	actions: {
		scramble: function() {
			ct.scramble();
		},
		resume: function() {
			ct.paused = false;
			ct.updateRound();
			ct.view.timer.startButton.visible = false;
			ct.view.timer.pauseButton.visible = true;
		},
		pause: function() {
			ct.paused = true;
			ct.updateRound();
			ct.view.timer.startButton.visible = true;
			ct.view.timer.pauseButton.visible = false;
		},
		quit: function() {
			if (!ct.ended) {
				var oldPaused = ct.paused;
				ct.paused = true;
				ct.updateRound();
				if (1 == alert('Are you sure you want to quit?', 'Yes', 'No')) {
					ct.changeState('menu');
				} else {
					ct.paused = oldPaused;
					ct.updateRound();
				}
			} else {
				ct.changeState('menu');
			}
		},
		nextRound: function() {
			ct.changeState('round');
		},
		textInput: function() {
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
		},
		playWord: function() {
			ct.playWord();
		},
		clearWord: function() {
			ct.clearWord();
		},
		clickLetter: function() {
			if (this.holder == ct.view.playLetters) {
				ct.trayLetter(this.index);
			} else {
				ct.playLetter(this.index);
			}
		}
	}
};
