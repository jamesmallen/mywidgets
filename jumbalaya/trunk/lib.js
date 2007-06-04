
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
	var c = arr.slice(0), t, ret = [];
	while (c.length > 0 && (t = c.splice(random(c.length), 1)[0])) {
		ret.push(t);
	}
	return ret;
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
};


inArray = function(needle, haystack, strict) {
	var equals;
	if (strict) {
		equals = function(a,b) {
			return a === b;
		}
	} else {
		equals = function(a,b) {
			return a == b;
		}
	}

	for (var i in haystack) {
		if (equals(haystack[i], needle)) return true;
	}
	return false;
};


arrayMerge = function(arr1, arr2, excludeDuplicates) {
	var tArr = arr1.slice(0);
	for (var i in arr2) {
		if (!excludeDuplicates || !inArray(arr2[i], arr1)) {
			tArr.push(arr2[i]);
		}
	}
	return tArr;
};


makeObject = function(objType, params) {
	if (!params) {
		params = {};
	}
	var ret = new objType();
	for (var i in params) {
		ret[i] = params[i];
	}
	return ret;
};

makeAndAppend = function(objType, parent, params) {
	var ret = makeObject(objType, params);
	parent.appendChild(ret);
	return ret;
};

applyProperties = function(dst, src) {
	for (var i in src) {
		if (typeof(src[i]) == 'object') {
			applyProperties(dst[i], src[i]);
		} else {
			dst[i] = src[i];
		}
	}
};

padString = function(str, len, padString, suffix) {
	if (typeof(padString) == 'undefined' || padString.length <= 0) {
		padString = ' ';
	}
	while (str.length < len) {
		if (suffix) {
			str += padString;
		} else {
			str = padString + str;
		}
	}
	
	if (suffix) {
		str = str.substr(0, len);
	} else {
		str = str.substr(str.length - len);
	}
	
	return str;
};
