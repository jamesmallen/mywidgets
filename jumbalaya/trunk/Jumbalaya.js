


include('lib.js');
include('ImageText.js');

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
		
		this.pan = makeAndAppend(Frame, this.gameWindow);
		this.pan.shadow = makeAndAppend(Image, this.pan, {
			src: 'Resources/PanShadow.png',
			vOffset: 95
		});
		this.pan.pan = makeAndAppend(Image, this.pan, {
			src: 'Resources/Pan.png'
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
		for (var i in letters) {
			makeAndAppend(JLetter, this.letters, {
				letter: letters[i]
			});
		}
		
	}
	
};

JController.init();

var ct = JController;
var vw = JView;




