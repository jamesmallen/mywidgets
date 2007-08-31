include('lib.js');

include('Magnet.js');
include('WordMagnet.js');


// clean up any existing entries in the tmp directory
function cacheClean() {
	var i, d = filesystem.getDirectoryContents(system.widgetDataFolder + '/tmp');
	for (i = 0; i < d.length; i++) {
		filesystem.remove(system.widgetDataFolder + '/tmp/' + d[i]);
	}
}


function resizeToScreen(wn) {
	/*
	wn.hOffset = screen.availLeft;
	wn.vOffset = screen.availTop;
	wn.width = screen.availWidth;
	wn.height = screen.availHeight;
	*/
	
	wn.hOffset = 0;
	wn.vOffset = 0;
	wn.width = screen.width;
	wn.height = screen.height;
	
	wn.locked = true;
}


function importWordlist(filename) {
	var words = filesystem.readFile(filename, true), i, x, y, mag, highest;
	
	if (words.length > 1000) {
		var i = alert('This word list has over 1000 words, but Magnets wasn\'t really meant to be used with more than a few hundred. Importing it may take a long time and clutter up your screen. Are you sure you want to continue?', 'Yes', 'No');
		
		if (i != 1) {
			return;
		}
	}
	
	x = y = highest = 0;
	for (i = 0; i < words.length; i++) {
		mag = new WordMagnet(magFrame, words[i]);
		mag.update();
		if (x + mag.width > magFrame.width) {
			x = highest = 0;
			y += highest;
		}
		highest = Math.max(highest, mag.height);
		mag.hOffset = x;
		mag.vOffset = y;
	}
	
	Magnet.refresh();
}


cacheClean();
var wn, magFrame;

var deg = Math.PI / 180;


wn = widget.getElementById('mainWindow');
magFrame = widget.getElementById('magnetsFrame');
resizeToScreen(wn);
magFrame.width = wn.width;
magFrame.height = wn.height;

filesystem.createDirectory(system.widgetDataFolder + '/tmp');


Magnet.fromXML(filesystem.readFile('DefaultMagnets.xml'));