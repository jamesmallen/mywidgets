
const BIGOBJECT_SIZE = 100000;

function BigObject() {
	this.arr = [];
	for (var i = 0; i < BIGOBJECT_SIZE; i++) {
		this.arr.push(i);
	}
	
}

BigObject.prototype = {
	arr: null,
	next: null,
	previous: null,
	push: function(q) {
		this.next = q;
		q.previous = this;
	},
	eraseToEnd: function() {
		this.next = null;
	}
}



function assert(q, str) {
	if (!q) { throw new Error('Assertion failed' + (str ? (': ' + str) : '')); }
}


// Array.prototype.copy = function() {
arrayCopy = function(arr) {
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		ret.push(arr[i]);
	}
	return ret;
}


// Array.prototype.shuffle = function() {
arrayShuffle = function(arr) {
	// var c = this.copy(), t, ret = [];
	var c = arrayCopy(arr), t, ret = [];
	while (c.length > 0 && (t = c.splice(random(c.length), 1)[0])) {
		ret.push(t);
	}
	return ret;
};


SQLite.prototype.catchQuery = function(sql) {
	try {
		return this.query(sql);
	} catch (ex) {
		pdump(ex);
		throw ex;
		return null;
	}
};

SQLite.prototype.catchExec = function(sql) {
	try {
		this.exec(sql);
	} catch (ex) {
		pdump(ex);
		throw ex;
	}
};



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
};



function emptyFrame(obj) {
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	}
}


/**
 * exchangePoint(src, dst, pointX, pointY)
 * exchangePoint(src, dst, point)
 * Converts a point from one context to another
 */
function convertPoint(src, dst, pointX, pointY) {
	var point;
	if (typeof(pointX) == 'number') {
		point = { x: pointX, y: pointY };
	} else {
		point = pointX;
	}
	
	if (src.constructor == Window) {
		windowPoint = point;
	} else {
		windowPoint = src.convertPointToWindow(point.x, point.y);
	}
	
	if (dst.constructor == Window) {
		return windowPoint;
	} else {
		return dst.convertPointFromWindow(windowPoint.x, windowPoint.y);
	}
}


/**
 * permute(v, m)
 * Takes a set v and returns all permutations of it
 * If m is true, then only array indexes are returned.
 */
permute = function(v, m){ //v1.0
    for(var p = -1, j, k, f, r, l = v.length, q = 1, i = l + 1; --i; q *= i);
    for(x = [new Array(l), new Array(l), new Array(l), new Array(l)], j = q, k = l + 1, i = -1;
        ++i < l; x[2][i] = i, x[1][i] = x[0][i] = j /= --k);
    for(r = new Array(q); ++p < q;)
        for(r[p] = new Array(l), i = -1; ++i < l; !--x[1][i] && (x[1][i] = x[0][i],
            x[2][i] = (x[2][i] + 1) % l), r[p][i] = m ? x[3][i] : v[x[3][i]])
            for(x[3][i] = x[2][i], f = 0; !f; f = !f)
                for(j = i; j; x[3][--j] == x[2][i] && (x[3][i] = x[2][i] = (x[2][i] + 1) % l, f = 1));
    return r;
};


arrayCompare = function(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return false;
	}
	
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}
	
	return true;
}

