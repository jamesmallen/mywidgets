function updateTray(trayID) {
	var tray = globals.trays[trayID];
	
	var anms = new Array(tray.length);
	
	for (var i in tray) {
		trayOffset = tray[i].getTrayPosition();
		tray[i].image.width = tray[i].image.height = globals.scale * 2;
		tray[i].anmQueue(new MoveAnimation(tray[i].image, trayOffset.x, trayOffset.y, 225, animator.kEaseOut, tray[i].anmDone));
	}
}



function spliceOutTray(trayID, col) {
	var tray = globals.trays[trayID];
	
	tray.splice(col, 1);
	
	fixLettersInTray(trayID);
}


function spliceInTray(trayID, letter) {
	var tray = globals.trays[trayID];
	
	for (var i = 0; i < tray.length; i++) {
		if (letter.image.hOffset < tray[i].image.hOffset) {
			tray.splice(i, 0, letter);
			break;
		}
	}
	if (i == tray.length) {
		tray.push(letter);
	}
	
	fixLettersInTray(trayID);
}


function fixLettersInTray(trayID) {
	var tray = globals.trays[trayID];
	for (var i in tray) {
		tray[i].location = 'tray';
		tray[i].coords = { x: i, y: trayID };
	}
}


function traySort(trayID, sortBy) {
	var t = [], ret = [], src = globals.trays[trayID];
	
	switch (sortBy) {
		case 'points':
			globals.trays[trayID].sort(function(a, b) {
				if (a.letter == b.letter) {
					return a.coords.x - b.coords.x;
				} else if (a.points == b.points) {
					return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
				} else {
					return a.points - b.points;
				}
			});
			break;
		case 'alpha':
			globals.trays[trayID].sort(function(a, b) { if (a.letter == b.letter) { return a.coords.x - b.coords.x; } else {return a.letter.charCodeAt(0) - b.letter.charCodeAt(0); } });
			break;
		case 'random':
		default:
			while (globals.trays[trayID].length > 0 && (t = globals.trays[trayID].splice(random(globals.trays[trayID].length), 1))) {
				ret.push(t[0]);
			}
			globals.trays[trayID] = ret;
			break;
	}
	
	var doReverse = true;
	for (var i in globals.trays[trayID]) {
		if (globals.trays[trayID][i] != traySort.lastResults[i]) {
			doReverse = false;
			break;
		}
	}
	if (doReverse) {
		globals.trays[trayID].reverse();
	}
	traySort.lastResults = [];
	for (var i in globals.trays[trayID]) {
		traySort.lastResults.push(globals.trays[trayID][i]);
	}
	
	fixLettersInTray(trayID);
	updateTray(trayID);
}

traySort.lastResults = [];
