
SQLite.prototype.catchQuery = function(sql) {
	try {
		return this.query(sql);
	} catch (ex) {
		pdump(ex);
		throw ex;
		return null;
	}
}

SQLite.prototype.catchExec = function(sql) {
	try {
		this.exec(sql);
	} catch (ex) {
		pdump(ex);
		throw ex;
	}
}



function pdump(obj) {
  print("PDUMP of " + obj);
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}



function delay(duration, func) {
	for (var i in delay.timers) {
		if (!delay.timers[i].ticking) {
			delete delay.timers[i];
		}
	}
	var t = new Timer();
	t.onTimerFired = function() {
		this.ticking = false;
		func();
	};
	t.interval = duration;
	t.ticking = true;
	delay.timers.push(t);
}
delay.timers = new Array();


function getScaledImage(baseName, multiplier) {
	if (typeof(getScaledImage.cache) == 'undefined') {
		getScaledImage.cache = {};
	}
	
	if (typeof(getScaledImage.cache[baseName]) == 'undefined') {
		getScaledImage.cache[baseName] = {};
	}
	
	if (!multiplier) {
		multiplier = 1.0;
	}
	
	if (typeof(getScaledImage.cache[baseName][globals.scale]) == 'undefined') {
		// get all potential files for this type
		var dh = filesystem.getDirectoryContents('Resources');
		
		var curSrc, bestSize = 0, curSize, idealSize = multiplier * globals.scale, matchRE;
		
		matchRE = new RegExp('^' + baseName + '(\\d+)\\.png$', 'i');
		
		for (var i in dh) {
			var res = dh[i].match(matchRE);
			if (res) {
				curSize = parseInt(res[1]);
				if (bestSize <= 0 || (bestSize < idealSize && curSize > bestSize) || (curSize >= idealSize && curSize < bestSize)) {
					curSrc = dh[i];
					bestSize = curSize;
				}
			}
		}
		
		getScaledImage.cache[baseName][globals.scale] = 'Resources/' + curSrc;
	}
	
	return getScaledImage.cache[baseName][globals.scale];
}



function addSlashes(str) {
	return str.replace(/(['"\\])/g, '\\$1');
}


Point.prototype.within = function(left, top, right, bottom, noEdges) {
	if (typeof(left) == 'object' && typeof(top) == 'object') {
		// assignment order is important!
		noEdges = right;
		right = top.x;
		bottom = top.y;
		top = left.y;
		left = left.x;
	}
	
	if (noEdges) {
		if (left < this.x && this.x < right &&
		    top < this.y && this.y < bottom) {
			return true;
		}
	} else {
		if (left <= this.x && this.x <= right &&
		    top <= this.y && this.y <= bottom) {
			return true;
		}
	}
	
	return false;
}



