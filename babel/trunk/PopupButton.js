
/**
 * makePopupButton
 * Returns a Frame object with special mouse handlers set for
 * use with a button with a pop-up feel
 */
function makePopupButton(params, parent) {
	var ret = new Frame();
	
	ret.mouseOver = false;
	ret.mouseDown = false;
	
	ret.image = new Image();
	ret.appendChild(ret.image);
	ret.image.tracking = 'rectangle';
	
	ret.label = new Text();
	ret.appendChild(ret.label);
	ret.label.hAlign = 'center';
	ret.label.vAlign = 'center';
	ret.label.anchorStyle = 'topLeft';
	
	ret.watch('onClick', function(property, oldval, newval) { this.onClickInternal = newval; return oldval; });
	
	ret.watch('src', function(property, oldval, newval) { this.image.src = newval; this.refresh(); return oldval; });
	
	ret.watch('data', function(property, oldval, newval) { this.label.data = newval; this.refresh(); return oldval; });
	
	ret.onMouseEnter = PopupButton.onMouseEnter;
	ret.onMouseExit = PopupButton.onMouseExit;
	ret.onMouseDown = PopupButton.onMouseDown;
	ret.onMouseUp = PopupButton.onMouseUp;
	
	ret.refresh = function() {
		this.label.hOffset = this.image.width / 2;
		this.label.vOffset = this.image.height / 2;
		this.image.vOffset = 0;
		ret.label.style.KonShadowOffset = '0px 2px';
	};
	
	ret.pushDown = function() {
		this.label.vOffset = (this.image.height / 2) + 1;
		this.image.vOffset = 1;
		ret.label.style.KonShadowOffset = '0px 1px';
	};
	
	if (typeof(parent) == 'object' && parent.appendChild) {
		parent.appendChild(ret);
	}
	
	// override defaults with any passed-in params
	if (typeof(params) == 'object') {
		for (var p in params) {
			ret[p] = params[p];
		}
	}
	
	return ret;
	
}

PopupButton = {
	
	onMouseEnter: function() {
		this.mouseOver = true;
	},
	
	onMouseExit: function() {
		this.mouseOver = false;
		this.refresh();
	},
	
	onMouseDown: function() {
		this.mouseDown = true;
		this.pushDown();
	},
	
	onMouseUp: function() {
		if (this.mouseOver && this.mouseDown) {
			if (this.onClickInternal) {
				this.onClickInternal();
			}
		}
		if (this.mouseOver && this.onMouseEnter) {
			this.onMouseEnter();
		} else if (this.onMouseExit) {
			this.onMouseExit();
		}
		this.mouseDown = false;
		this.refresh();
	}
}
