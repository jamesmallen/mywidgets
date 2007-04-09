/**
 * -------------
 * KImage v4.0
 * -------------
 *  A class for creating flexible auto-stretching images using Canvas objects
 *
 * By James M. Allen <james.m.allen@gmail.com>
 *
 * You are not free to reuse this code without express written consent from the
 * author.
 *
 *
 * ---------------
 * Release History
 * ---------------
 * 4.0 - XX April 2007
 * - New release for Y!WE4 - uses Canvas objects instead of Frames
 *
 */
 


/**
 * KFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
 *  Works just like FadeAnimation, on a KImage.
 *  Should be called with "var a = KFadeAnimation(...)",
 *  not "var a = new KFadeAnimation(...)".
 */
function KFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KFadeAnimation.update, KFadeAnimation.done);
  
  anm.object = object;
  anm.fromOpacity = object.opacity;
  anm.toOpacity = toOpacity;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KFadeAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newOpacity;
  var ret;
  
  if (percent >= 1.0) {
    newOpacity = this.toOpacity;
    ret = false;
  } else {
    newOpacity = animator.ease(this.fromOpacity, this.toOpacity, percent, this.easeType);
    ret = true;
  }
  
  this.object.opacity = newOpacity;
  return ret;
}

KFadeAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


/**
 * KMoveAnimation(object, toX, toY, duration, easeType, doneFunc)
 *  Works just like MoveAnimation, on a KImage.
 *  Should be called with "var a = KMoveAnimation(...)",
 *  not "var a = new KMoveAnimation(...)".
 */
function KMoveAnimation(object, toX, toY, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KMoveAnimation.update, KMoveAnimation.done);
  
  anm.object = object;
  anm.fromX = object.hOffset;
  anm.fromY = object.vOffset;
  anm.toX = toX;
  anm.toY = toY;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KMoveAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newX;
  var newY;
  var ret;
  
  if (percent >= 1.0) {
    newX = this.toX;
    newY = this.toY;
    ret = false;
  } else {
    newX = animator.ease(this.fromX, this.toX, percent, this.easeType);
    newY = animator.ease(this.fromY, this.toY, percent, this.easeType);
    ret = true;
  }
  
  this.object.hOffset = newX;
  this.object.vOffset = newY;
  return ret;
}

KMoveAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


/**
 * KResizeAnimation(object, toWidth, toHeight, easeType, doneFunc, resizeRegistrationPoints)
 *  Works like MoveAnimation, only it resizes, and works on a KImage.
 *  Should be called with "var a = KResizeAnimation(...)",
 *  not "var a = new KResizeAnimation(...)".
 */
function KResizeAnimation(object, toWidth, toHeight, duration, easeType, doneFunc, resizeRegistrationPoints)
{
  var anm = new CustomAnimation(1, KResizeAnimation.update, KResizeAnimation.done);
  
  anm.object = object;
  anm.fromWidth = object.width;
  anm.fromHeight = object.height;
	anm.fromHRegistrationPoint = object.hRegistrationPoint;
	anm.fromVRegistrationPoint = object.vRegistrationPoint;
  anm.toWidth = toWidth;
  anm.toHeight = toHeight;
	anm.toHRegistrationPoint = object.hRegistrationPoint / object.width * toWidth;
	anm.toVRegistrationPoint = object.vRegistrationPoint / object.height * toHeight;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  anm.resizeRegistrationPoints = resizeRegistrationPoints;
	
  return anm;
}

KResizeAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newWidth, newHeight;
	var newHRegistrationPoint, newVRegistrationPoint;
  var ret;
  
  if (percent >= 1.0) {
    newWidth = this.toWidth;
    newHeight = this.toHeight;
		if (this.resizeRegistrationPoints) {
			newHRegistrationPoint = this.toHRegistrationPoint;
			newVRegistrationPoint = this.toVRegistrationPoint;
		}
    ret = false;
  } else {
    newWidth = animator.ease(this.fromWidth, this.toWidth, percent, this.easeType);
    newHeight = animator.ease(this.fromHeight, this.toHeight, percent, this.easeType);
		if (this.resizeRegistrationPoints) {
			newHRegistrationPoint = this.fromHRegistrationPoint / this.fromWidth * newWidth;
			newVRegistrationPoint = this.fromVRegistrationPoint / this.fromHeight * newHeight;
		}
		
    ret = true;
  }
  
  this.object.width = newWidth;
  this.object.height = newHeight;
	
	if (this.resizeRegistrationPoints) {
		this.object.hRegistrationPoint = newHRegistrationPoint;
		this.object.vRegistrationPoint = newVRegistrationPoint;
	}
  return ret;
}

KResizeAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}



/**
 * KRotateAnimation(object, toAngle, duration, easeType, doneFunc)
 *  Works just like RotateAnimation, on a KImage.
 *  Should be called with "var a = KRotateAnimation(...)",
 *  not "var a = new KRotateAnimation(...)".
 */
function KRotateAnimation(object, toAngle, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KRotateAnimation.update, KRotateAnimation.done);
  
  anm.object = object;
  anm.fromAngle = object.rotation;
  anm.toAngle = toAngle;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KRotateAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newAngle;
  var ret;
  
  if (percent >= 1.0) {
    newAngle = this.toAngle;
    ret = false;
  } else {
    newAngle = animator.ease(this.fromAngle, this.toAngle, percent, this.easeType);
    ret = true;
  }
  
  this.object.rotation = newAngle;
  return ret;
}

KRotateAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


 
/**
 * KImage (constructor)
 *
 * @param params (optional) Initial parameters in JSON 
 *               (see KImage.prototype for potential parameters)
 * @param parent (optional) Will add a new Canvas object to the parent using
 *               parent.appendChild(). If you don't specify this parameter,
 *               you need to manually add the object's .canvas object.
 */
function KImage(params, parent)
{
	// PRIVATE VARIABLES
	var self = this;
	var _ctx;
	var _pattern, _images = new Array(9);
	var _maskPattern, _maskImages = new Array(9);
	
	
	// PRIVATE METHODS
	
	function _draw_pattern(images, pattern, hOffset, vOffset, width, height) {
		// log('_draw_pattern(..., ..., ' + hOffset + ', ' + vOffset + ', ' + width + ', ' + height + ')');
		
		var cWidth = 0, cHeight = 0, cHOffset, cVOffset;
		
		switch (pattern) {
			case 'full':
			case 'vert':
			case 'hori':
				cVOffset = 0;
				
				for (var i = 0; i < 3; i++) { // row
					cHOffset = 0;
					for (var j = 0; j < 3; j++) { // column
						var ij = i * 3 + j;
						cWidth = 0;
						cHeight = 0;
						if (images[ij]) {
							if (j % 3 == 0 || j % 3 == 2) {
								// left and right columns: width = srcWidth
								cWidth = images[ij].srcWidth;
							} else {
								// middle column
								if (pattern == 'vert') {
									cWidth = width;
								} else {
									cWidth = width - (images[ij + 1].srcWidth + images[ij - 1].srcWidth);
								}
							}
							
							if (i % 3 == 0 || i % 3 == 2) {
								// top and bottom columns: height = srcHeight
								cHeight = images[ij].srcHeight;
							} else {
								// midddle row
								if (pattern == 'hori') {
									cHeight = height;
								} else {
									cHeight = height - (images[ij + 3].srcHeight + images[ij - 3].srcHeight);
								}
							}
							
							// log('drawImage(' + ij + ', ' + cHOffset + ', ' + cVOffset + ', ' + cWidth + ', ' + cHeight + ')');
							_ctx.drawImage(images[ij], cHOffset, cVOffset, cWidth, cHeight);
						}
						cHOffset += cWidth;
					}
					cVOffset += cHeight;
				}
				break;
			case 'cent':
				_ctx.drawImage(images[4], 0, 0, self.canvas.width, self.canvas.height);
				break;
			default:
				log('Unknown pattern');
				break;
		}
	}
	
	function _draw() {
		var cWidth, cHeight, cHOffset, cVOffset;
		
		var workingHeight, workingWidth, workingMaskHeight, workingMaskWidth;
		
		if (self.width < 0) {
			workingWidth = self.srcWidth;
		} else {
			workingWidth = Math.max(self.width, self.minWidth);
		}
		
		if (self.height < 0) {
			workingHeight = self.srcHeight;
		} else {
			workingHeight = Math.max(self.height, self.minHeight);
		}
		
		if (self.canvas.width != workingWidth) {
			self.canvas.width = workingWidth;
		}
			
		if (self.canvas.height != workingHeight) {
			self.canvas.height = workingHeight;
		}
		
		_ctx.globalCompositeOperation = 'source-over';
		
		_ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		
		_draw_pattern(_images, _pattern, 0, 0, workingWidth, workingHeight);
		
		// log('end draw');
		
		if (self.mask) {
			_ctx.globalCompositeOperation = self.maskOperation;
			
			if (self.maskWidth < 0) {
				workingMaskWidth = workingWidth;
			} else {
				workingMaskWidth = self.maskWidth;
			}
			
			if (self.maskHeight < 0) {
				workingMaskHeight = workingHeight;
			} else {
				workingMaskHeight = self.maskHeight;
			}
			
			_draw_pattern(_maskImages, _maskPattern, self.maskHOffset, self.maskVOffset, workingMaskWidth, workingMaskHeight);
		}
	}
	
	
	function _updateImages(newSrc, mask) {
		var cSrcWidth, cSrcHeight, cMinWidth, cMinHeight;
		var images;
		
		if (typeof(newSrc) == 'undefined') {
			if (mask) {
				newSrc = self.mask;
			} else {
				newSrc = self.src;
			}
		}
		
		if (mask) {
			images = _maskImages;
		} else {
			images = _images;
			self.srcWidth = 0;
			self.srcHeight = 0;
			self.minWidth = 0;
			self.minHeight = 0;
		}
		
		// clear out old images
		for (var i in images) {
			if (images[i] && images[i].removeFromSuperview) {
				images[i].removeFromSuperview();
			}
		}
		
		// _images = new Array(9);
		
		if (newSrc) {
			for (var i = 0; i < 3; i++) {
				cSrcWidth = 0;
				cSrcHeight = 0;
				cMinWidth = 0;
				cMinHeight = 0;
				for (var j = 0; j < 3; j++) {
					var ij = i * 3 + j;
					if (newSrc[ij]) {
						images[ij] = new Image();
						images[ij].src = newSrc[ij];
						
						if (!mask) {
							if (j == 0 || j == 2) {
								// left/right edges
								cMinWidth += images[ij].srcWidth;
							}
							
							cSrcWidth += images[ij].srcWidth;
							
							if (i == 0 || i == 2) {
								// top/bottom edges
								cMinHeight = Math.max(images[ij].srcHeight, cMinHeight);
							}
							
							cSrcHeight = Math.max(images[ij].srcHeight, cSrcHeight);
						}
					}
				}
				if (!mask) {
					self.srcWidth = Math.max(cSrcWidth, self.srcWidth);
					self.minWidth = Math.max(cMinWidth, self.minWidth);
					
					self.srcHeight += cSrcHeight;
					self.minHeight += cMinHeight;
				}
			}
		}
		
	}
	
	function _checkPattern(newSrc, mask) {
		
		if (typeof(newSrc) == 'undefined') {
			if (mask) {
				newSrc = self.mask;
			} else {
				newSrc = self.src;
			}
		}
		
		if (newSrc) {
			for (var pat in KImage.patterns) {
				var match = true;
				for (var i in KImage.patterns[pat]) {
					if (KImage.patterns[pat][i] == 1 && !newSrc[i]) {
						match = false;
						break;
					}
				}
				if (match) {
					if (mask) {
						_maskPattern = pat;
					} else {
						_pattern = pat;
					}
					break;
				}
			}
		} else {
			log('Unknown newSrc');
		}
		return _pattern;
	}
	
	// PUBLIC PROPERTIES
	// this.canvas
	// this.src
	this.watch('src', _watchSrc);
	this.watch('mask', _watchSrc);
	
	function _watchSrc(property, oldval, newval) {
		var ret = new Array(9);
		
		if (typeof(newval) == 'object' && newval.constructor == Array) {
			switch (newval.length) {
				case 1:
					// 1 image - default to centered
					ret[4] = newval[0];
					break;
				case 3:
					// 3 images - default to vertical
					ret[1] = newval[0];
					ret[4] = newval[1];
					ret[7] = newval[2];
					break;
				case 9:
				default:
					ret = newval;
					break;
			}
		} else if (typeof(newval) == 'string') {
			var foundWildcard = false;
			for (var wildcard in KImage.namingRules) {
				if (newval.indexOf(wildcard) != -1) {
					var map = KImage.namingRules[wildcard];
					for (var i in map) {
						if (map[i]) {
							ret[i] = newval.replace(wildcard, map[i]);
						}
					}
					foundWildcard = true;
					break;
				}
			}
			
			if (!foundWildcard) {
				// only 1 image specified
				ret[4] = newval;
			}
		} else {
			// wtf?
			return oldval;
		}
		
		this.proxy('_checkPattern', [ret, (property == 'mask' ? true : false)]);
		
		// calculate the new srcHeight/srcWidth
		this.proxy('_updateImages', [ret, (property == 'mask' ? true : false)]);
		
		if (this.width < 0) {
			this.width = this.srcWidth;
		}
		
		if (this.height < 0) {
			this.height = this.srcHeight;
		}
		
		return ret;
	}
	
	
	// handle any changes to the image object through this KImage object
	function _imagePassThru(property, oldval, newval) {
		for (var i in _images) {
			_images[i][property] = newval;
		}
		_draw();
		return newval;
	}
	
	function _imagePassThruProxy(property, oldval, newval) {
		return this.proxy('_imagePassThru', [property, oldval, newval]);
	}
	
	for (var i in KImage.propertiesImage) {
		this.watch(KImage.propertiesImage[i], _imagePassThruProxy);
	}
	
	var _canvasPassThru = function(property, oldval, newval) {
		this.canvas[property] = newval;
		return newval;
	}
	
	for (var i in KImage.propertiesCanvas) {
		this.watch(KImage.propertiesCanvas[i], _canvasPassThru);
	}
	
	
	var _refreshPassThru = function(property, oldval, newval) {
		newval = parseInt(newval);
		
		this[property] = newval;
		
		this.canvas[property] = newval;
		this.proxy('_draw');
		return newval;
	}
	
	for (var i in KImage.propertiesRefresh) {
		this.watch(KImage.propertiesRefresh[i], _refreshPassThru);
	}
	
	function _proxy(func, params) {
		if (typeof(func) == 'function') {
			log('Incorrect usage of this.proxy: first parameter must be a function name in the form of a string.');
			return;
		}
		var paramsString = '', evalString = '';
		
		for (var i in params) {
			if (paramsString) {
				paramsString += ',';
			}
			paramsString += 'params[' + i + ']';
		}
		evalString = func + '(' + paramsString + ');';
		return eval(evalString);
	}
	
	this.proxy = function(func, params)
	{
		return _proxy(func, params);
	}
	
	
	// see KImage.prototype for more
	
	// Initialization of private and public properties
	
	// create canvas, append it if a parent was passed in
	this.canvas = new Canvas();
	this.canvas.hOffset = this.hOffset;
	this.canvas.vOffset = this.vOffset;
	if (typeof(parent) == 'object' && parent.appendChild) {
		parent.appendChild(this.canvas);
	}
	
	
	// set private context
	_ctx = this.canvas.getContext('2d');
	
	
	// override defaults with any passed-in params
	if (typeof(params) == 'object') {
		for (var p in params) {
			this[p] = params[p];
		}
	}
	
	// PRIVILEGED METHODS
	this.getPattern = function() {
		return _pattern;
	}
	
	this.getImages = function() {
		return _images;
	}
	
	this.refresh = function() {
		_draw();
	}
	
	// Finally, draw the KImage in its initial state
	_draw();
};



/**
 * KImage.prototype
 * Here, the defaults are specified for KImage objects.
 * All of these defaults can be overridden with the params object in the constructor,
 * or by specifying them at runtime.
 *
 * Values of -1 below (and specified at run-time) will try to figure out the best "fit."
 */
KImage.prototype = {
	hOffset: 0,
	height: -1,
	opacity: 255,
	rotation: 0,
	mask: '',
	maskHeight: -1,
	maskHOffset: 0,
	maskOperation: 'destination-out',
	maskVOffset: 0,
	maskWidth: -1,
	src: '',
	srcHeight: 0,
	srcWidth: 0,
	minWidth: 0,
	minHeight: 0,
	vOffset: 0,
	width: -1
};

KImage.namingRules = {
	'*': ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'],
	'|': [null, 'Top', null, null, 'Middle', null, null, 'Bottom', null],
	'<': [null, null, null, 'Left', 'Center', 'Right', null, null, null]
};

KImage.patterns = {
	full: [1, 1, 1,    1, 1, 1,    1, 1, 1],
	vert: [0, 1, 0,    0, 1, 0,    0, 1, 0],
	hori: [0, 0, 0,    1, 1, 1,    0, 0, 0],
	cent: [0, 0, 0,    0, 1, 0,    0, 0, 0],
	none: [0, 0, 0,    0, 0, 0,    0, 0, 0]
};


KImage.propertiesCanvas = ['onClick', 'onContextMenu', 'onDragDrop', 'onDragEnter', 'onDragExit', 'onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel', 'onMultiClick', 'opacity', 'style', 'tooltip', 'tracking', 'visible', 'zOrder'];

KImage.propertiesRefresh = ['height', 'hOffset', 'hRegistrationPoint', 'rotation', 'vRegistrationPoint', 'vOffset', 'width'];

KImage.propertiesImage = ['colorize'];







