
include('lib.js');

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
		
		this.words.load('easywords.txt');
	},
	
	
	
};


JView = {
	init: function() {
		
	}
};

JController.init();

var ct = JController;
var vw = JView;




