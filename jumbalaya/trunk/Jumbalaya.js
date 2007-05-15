


include('lib.js');
include('AnimationQueue.js');
include('LetterHolder.js');

include('WordDB.js');


JController = {
	init: function() {
		
		JView.init();
		
		this.words = new WordDB();
		
		this.sixes = [];
		this.sevens = [];
		
		this.words.addHook = function(word) {
			if (word.length == 6) {
				JController.sixes.push(word);
			} else if (word.length == 7) {
				JController.sevens.push(word);
			}
		}
		
		this.words.load('words0.txt');
	},
	
	
	
};


JView = {
	
	
	
	init: function() {
		this.gameWindow = widget.getElementById('gameWindow');
		this.wordsWindow = widget.getElementById('wordsWindow');
		
		this.pan = makeAndAppend(Frame, this.gameWindow, {
		});
		this.pan.shadow = makeAndAppend(Image, this.pan, {
			src: 'Resources/PanShadow.png',
			vOffset: 95
		});
		this.pan.pan = makeAndAppend(Image, this.pan, {
			src: 'Resources/Pan.png',
			hOffset: 352,
			vOffset: 255,
			hRegistrationPoint: 352,
			vRegistrationPoint: 255
		});
		
		
		this.answer = makeAndAppend(Frame, this.gameWindow, {
			hOffset: 3
		});
		this.answer.bg = makeAndAppend(Image, this.answer, {
			src: 'Resources/AnswerBG.png'
		});
		
		
		
		this.letters = makeAndAppend(Frame, this.gameWindow);
		
	},
	
	
	newRound: function(letters) {
		emptyFrame(this.letters);
		
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
		
		for (var i in letters) {
			this.trayLetters.add(letters[i]);
		}
		
		this.pan.onMouseUp = function() { vw.scramble(); };
		
		
	},
	
	
	scramble: function() {
		if (AnimationQueue.arr.length > 2) {
			// Don't queue things forever
			return;
		}
		var anms = [];
		
		var panAnm = new CustomAnimation(FLUID_ANIMATION_INTERVAL * 2, function() {
			var now = animator.milliseconds;
			
			var t = Math.max(now - this.startTime, 0);
			
			if (!this.initialized) {
				this.startVOffset = this.pan.pan.vOffset;
				this.startRotation = this.pan.pan.rotation;
				this.startOpacity = this.pan.shadow.opacity;
				this.pan.pan.rotation = 3;
				this.initialized = true;
			}
			
			if (t >= (SCRAMBLE_DURATION * 0.5)) {
				this.pan.pan.vOffset = this.startVOffset;
				this.pan.pan.rotation = this.startRotation;
				this.pan.shadow.opacity = this.startOpacity;
				return false;
			} else {
				// var percent = t / (SCRAMBLE_DURATION * 0.5);
				// this.pan.pan.vOffset = this.startVOffset - Math.sin(Math.PI * percent) * SCRAMBLE_MIN_HEIGHT / 2;
				// this.pan.pan.rotation = this.startRotation + Math.sin(Math.PI * percent) * 3;
				return true;
			}
		});
		panAnm.pan = this.pan;
		
		anms.push(panAnm);
		anms.push(this.trayLetters.scramble());
		
		AnimationQueue.queue(anms);
	}
	
};

JController.init();

var ct = JController;
var vw = JView;




