/**
 * -------------
 * Throbber v1.0
 * -------------
 *  A class for creating "throbber"-type loading animations on Canvases
 *
 * By James M. Allen <james.m.allen@gmail.com>
 *
 * You are free to use this code to produce derivative works, provided that 
 * you give proper credit and you e-mail the author to inform him of any 
 * derivative works.
 *
 *
 * For usage examples, see throbber_test.js.
 *
 * ---------------
 * Release History
 * ---------------
 * 1.0 - 31 March 2007
 * - Initial release - yay Yahoo! Widget Engine 4.0!
 *
 */
 
 
/**
 * Throbber (constructor)
 *
 * @param existingCanvas (optional) If you wish to use a pre-existing Canvas, 
 *                       specify it here. The default behavior is to create a new Canvas.
 * @param params         (optional) Initial parameters in JSON 
 *                       (see Throbber.prototype for potential parameters)
 */
function Throbber(params, parent)
{
	// PRIVATE VARIABLES
	var self = this;
	var _ctx;
	var _lastSize, _lastHeadColor, _lastTailColor, _lastInactiveColor, _lastJogLength;
	var _calculatedNodeRadius;
	var _headColorObject, _tailColorObject, _diffColorObject, _inactiveColorObject;
	
	// PRIVATE METHODS
	function _getNodeRadius() {
		if (self.nodeRadius < 0) {
			if (_lastSize != self.size) {
				var st_2 = Math.sin(Math.PI / self.nodes);
				_calculatedNodeRadius = 0.45 * (self.size * st_2) / (1 + st_2);
				_lastSize = self.size;
			}
			return _calculatedNodeRadius;
		} else {
			return self.nodeRadius;
		}
	}
	
	function _getJogLength() {
		if (self.jogLength < 0) {
			return self.nodes;
		} else {
			return self.jogLength;
		}
	}
	
	function _getNodeColor(position) {
		var localJogLength, ret;
		
		localJogLength = _getJogLength();
		
		// check cache of color info
		if (_lastHeadColor != self.headColor || _lastTailColor != self.tailColor || _lastInactiveColor != self.inactiveColor || localJogLength != _lastJogLength) {
			_headColorObject = Throbber.parseColor(self.headColor);
			_tailColorObject = Throbber.parseColor(self.tailColor);
			_inactiveColorObject = Throbber.parseColor(self.inactiveColor);
			
			_diffColorObject = {r: 0, g: 0, b: 0, a: 0};
			for (var i in _diffColorObject) {
				_diffColorObject[i] = (_headColorObject[i] - _tailColorObject[i]) / localJogLength;
			}
			
			_lastHeadColor = self.headColor;
			_lastTailColor = self.tailColor;
			_lastInactiveColor = self.inactiveColor;
			_lastJogLength = localJogLength;
		}
		
		ret = new Object();
		for (var i in _diffColorObject) {
			ret[i] = _tailColorObject[i] + (position * _diffColorObject[i]);
		}
		
		return ret;
	}
	
	// PUBLIC PROPERTIES
	// this.canvas
	this.active = false;
	// see Throbber.prototype for more
	
	// Initialization of private and public properties
	
	// override defaults with any passed-in params
	if (typeof(params) == 'object') {
		for (var p in params) {
			this[p] = params[p];
		}
	}
	
	// create canvas if necessary
	if (typeof(parent) == 'object' && parent.constructor == Canvas) {
		this.canvas = parent;
	} else {
		this.canvas = new Canvas();
		this.canvas.width = this.canvas.height = this.size;
		this.canvas.hOffset = this.hOffset;
		this.canvas.vOffset = this.vOffset;
		if (typeof(parent) == 'object' && parent.appendChild) {
			parent.appendChild(this.canvas);
		}
	}
	
	// set private context
	_ctx = this.canvas.getContext('2d');
	
	
	// PRIVILEGED METHODS
	this.draw = function(position) {
		var localX, localY, localNodeRadius, localRadius, localJogLength;
		var startPosition, endPosition;
		
		if (typeof(position) != 'number') {
			position = 0;
		}
		
		if (this.x < 1) {
			var localX = this.canvas.width / 2;
		} else {
			localX = this.x + this.size / 4;
		}
		
		if (this.y < 1) {
			var localY = this.canvas.height / 2;
		} else {
			localY = this.y + this.size / 4;
		}
		
		localNodeRadius = _getNodeRadius();
		
		localRadius = (this.size / 2) - localNodeRadius;
		
		localJogLength = _getJogLength();
		
		_ctx.clearRect(localX - (this.size / 2), localY - (this.size / 2), localX + (this.size / 2), localY + (this.size / 2));
		
		if (this.active) {
			startPosition = position;
			endPosition = position + localJogLength;
		} else {
			startPosition = 0;
			endPosition = this.nodes;
		}
		
		for (var j = startPosition; j < endPosition; j++) {
			// prevent nodes jumping around due to rounding errors
			i = j % this.nodes;
			
			var t = 2 * Math.PI * i / this.nodes;
			var curX = localX + ((this.clockwise ? 1 : -1) * localRadius * Math.sin(t));
			var curY = localY - localRadius * Math.cos(t);
			
			_ctx.beginPath();
			_ctx.arc(curX, curY, localNodeRadius, 0, 2 * Math.PI, false);
			
			switch (this.style) {
				case 'filled':
				default:
					if (this.active) {
						_ctx.fillStyle = Throbber.colorToString(_getNodeColor(j - position));
					} else {
						_ctx.fillStyle = this.inactiveColor;
					}
					_ctx.fill();
			}
		}
	}
	
	this.start = function() {
		this.active = true;
		this.anim = new CustomAnimation(1, function() {
			// min-checking to prevent stalling on illegal numbers encountered
			this.interval = Math.min(2000, parseInt(60000 / this.throbber.rpm / this.throbber.nodes));
			this.throbber.draw(this.position);
			this.position++;
			if (this.throbber.active) {
				return true;
			} else {
				return false;
			}
		});
		this.anim.throbber = this;
		this.anim.position = 0;
		animator.start(this.anim);
	}
	
	this.stop = function() {
		if (typeof(this.anim) == 'object' && this.anim.constructor == 'CustomAnimation') {
			this.anim.kill();
		}
		this.active = false;
		this.draw();
	}
	
	this.toggle = function() {
		if (this.active) {
			this.stop();
		} else {
			this.start();
		}
	}
	
	
	// Finally, draw the throbber in its initial state
	this.draw();
}


// Color helper functions

/**
 * Throbber.colorToString
 * Takes a color object (such as that returned by parseColor) and returns 
 * a string in the form rgba(255, 127, 63, 0.5)
 */
Throbber.colorToString = function(colorObject, normalized)
{
	if (normalized) {
		return 'rgba(' + parseInt(255 * colorObject.r) + ',' + parseInt(255 * colorObject.g) + ',' + parseInt(255 * colorObject.b) + ',' + parseFloat(colorObject.a) + ')';
	} else {
		return 'rgba(' + parseInt(colorObject.r) + ',' + parseInt(colorObject.g) + ',' + parseInt(colorObject.b) + ',' + parseFloat(colorObject.a) + ')';
	}
}

/**
 * Throbber.parseColor
 * Takes a CSS-style color string and converts it to an object
 * with r, g, b, and a properties.
 * Can handle rgba, rgb, long and short hex-style strings.
 * @param normalize If true, will set all colors to a float between 0 and 1
 *                  (default behavior is to only do this with alpha)
 */
Throbber.parseColor = function(colorString, normalize) {
	var red = 0, green = 0, blue = 0, alpha = 1.0, res;
	
	if (res = colorString.match(/^rgba\s*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9\.]+)\)$/)) {
		red = parseInt(res[1]);
		green = parseInt(res[2]);
		blue = parseInt(res[3]);
		alpha = parseFloat(res[4]);
	} else if (res = colorString.match(/^rgb\s*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/)) {
		red = parseInt(res[1]);
		green = parseInt(res[2]);
		blue = parseInt(res[3]);
	} else if (res = colorString.match(/^\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)) {
		red = parseInt('0x' + res[1]);
		green = parseInt('0x' + res[2]);
		blue = parseInt('0x' + res[3]);
	} else if (res = colorString.match(/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i)) {
		red = parseInt('0x' + res[1] + res[1]);
		green = parseInt('0x' + res[2] + res[2]);
		blue = parseInt('0x' + res[3] + res[3]);
	}
	
	var ret = {
		r: red,
		g: green,
		b: blue,
		a: alpha
	};
	
	// Make sure data is between 0 and 255
	for (var i in ret) {
		ret[i] = Math.max(ret[i], 0);
		ret[i] = Math.min(ret[i], 255);
	}
	
	if (normalize) {
		for (var i in ret) {
			ret[i] = ret[i] / 255;
		}
	}
	
	return ret;
}


/**
 * Throbber.prototype
 * Here, the defaults are specified for Throbber objects.
 * All of these defaults can be overridden with the params object in the constructor,
 * or by specifying them at runtime like so:
 *    myThrobberObject.headColor = '#ff00ff';
 * Optionally, you can overwrite these defaults by using the following code:
 *    Throbber.prototype.nodes = 12;
 *    Throbber.prototype.size = 32;
 * 
 * Values of -1 below (and specified at run-time) will try to figure out the best "fit."
 * This includes centering the Throbber on the canvas object, and a node radius that
 * is nearly touching.
 */
Throbber.prototype = {
	/**
	 * Horizontal offset of the canvas relative to the parent object.
	 * Only applicable if a canvas is not specified.
	 */
	hOffset: 0,
	/**
	 * Vertical offset of the canvas relative to the parent object.
	 * Only applicable if a canvas is not specified.
	 */
	vOffset: 0,
	/**
	 * Horizontal offset of the throbber within the canvas.
	 * Defaults to center.
	 */
	x: -1,
	/**
	 * Vertical offset of the throbber within the canvas.
	 * Defaults to center.
	 */
	y: -1,
	/**
	 * Size of the throbber - aka, the diameter.
	 */
	size: 16,
	/**
	 * Radius of the individual "nodes" of the throbber. 
	 * Defaults to nearly touching other nodes.
	 */
	nodeRadius: -1,
	/**
	 * Number of "nodes" in the throbber (the dots around the outside).
	 */
	nodes: 8,
	/**
	 * Style of the throbber.
	 * Currently only "filled" is valid, but others may be added in the future.
	 */
	style: 'filled',
	/**
	 * The color of the throbber when it is motionless.
	 * Four CSS-style types of strings are valid:
	 *   Preferred: 'rgba(255, 127, 127, 0.7)'
	 *              'rgb(255, 127, 127)'
	 *              '#ff8888'
	 *              '#f88'
	 * If you wish to keep the throbber hidden when inactive, 
	 * set this to rgba(0,0,0,0)
	 */
	inactiveColor: 'rgba(178, 178, 178, 178)',
	/**
	 * The color of the "head" of the throbber when animated.
	 * Colors in between the head and tail will be smoothly calculated.
	 * See above for accepted string formats.
	 */
	headColor: 'rgba(119, 117, 109, 255)',
	/**
	 * The color of the "tail" of the throbber when animated.
	 * Colors in between the head and tail will be smoothly calculated.
	 * See above for accepted string formats.
	 */
	tailColor: 'rgba(208, 206, 197, 255)',
	/**
	 * The number of nodes that are colored in when the throbber is animated.
	 * Default is to display all nodes.
	 */
	jogLength: -1,
	/**
	 * The speed of the throbber, in rotations per minute.
	 */
	rpm: 60,
	/**
	 * Whether or not the throbber goes clockwise.
	 */
	clockwise: true
}
