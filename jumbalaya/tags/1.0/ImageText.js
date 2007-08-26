

/**
 * ImageText
 * Object for automatically creating several image objects based
 * on text - i.e., for use with custom fonts
 */
function ImageText(params, parent) {
	
	// WATCHERS
	var _framePassThru = function(property, oldval, newval) {
		this.frame[property] = newval;
		return newval;
	}
	
	for (var i in ImageText.propertiesFrame) {
		this.watch(ImageText.propertiesFrame[i], _framePassThru);
	}
	
	this.clear = function() {
		while (this.frame.firstChild) {
			this.frame.removeChild(this.frame.firstChild);
		}
	}
	
	
	this.refresh = function() {
		this.clear();
		if (!this.src) {
			return;
		}
		var tHOffset = 0;
		this.data = this.data.toString();
		for (var i = 0; i < this.data.length; i++) {
			var letter = this.data[i];
			var t = new Image();
			var newSrc = this.src.replace('*', letter);
			t.src = newSrc;
			t.width = t.srcWidth * this.scaleMultiplier;
			t.height = t.srcHeight * this.scaleMultiplier;
			t.hOffset = tHOffset;
			this.frame.appendChild(t);
			
			if (this.letterSpacing < 0) {
				tHOffset += t.width;
			} else {
				tHOffset += this.letterSpacing * this.scaleMultiplier;
			}
		}
	}
	
	
	var _refreshPassThru = function(property, oldval, newval) {
		this[property] = newval;
		
		this.refresh();
		return newval;
	}
	
	for (var i in ImageText.propertiesRefresh) {
		this.watch(ImageText.propertiesRefresh[i], _refreshPassThru);
	}
	
	
	
	// INITIALIZE
	this.frame = new Frame();
	
	if (typeof(parent) == 'object' && parent.appendChild) {
		parent.appendChild(this.frame);
	}
	
	// override defaults with any passed-in params
	if (typeof(params) == 'object') {
		for (var p in params) {
			this[p] = params[p];
		}
	}
	
	
	
	// PUBLIC METHODS
	
	
}

ImageText.propertiesFrame = ['colorize', 'hAlign', 'hOffset', 'onClick', 'onContextMenu', 'onDragDrop', 'onDragEnter', 'onDragExit', 'onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel', 'onMultiClick', 'opacity', 'scaleHOffset', 'scaleVOffset', 'style', 'tooltip', 'tracking', 'vAlign', 'visible', 'vOffset', 'zOrder'];

ImageText.propertiesRefresh = ['letterSpacing', 'data', 'src', 'scaleMultiplier'];


ImageText.prototype = {
	data: '',
	letterSpacing: -1,
	scaleMultiplier: 1.0,
	src: ''
}