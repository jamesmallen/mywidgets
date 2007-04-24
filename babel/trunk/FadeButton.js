const FADEBUTTON_OPACITY = 180;
const FADEBUTTON_OPACITY_OVER = 240;
const FADEBUTTON_OPACITY_CLICK = 255;
const FADEBUTTON_OPACITY_DISABLED = 60;

const FADEBUTTON_DURATION = 240;
const FADEBUTTON_EASETYPE = animator.kEaseOut;

/**
 * makeFadeButton
 * Returns an Image object with special mouse handlers set for
 * use with a button with "hover"-type states
 */
function makeFadeButton(params, parent) {
	var ret = new Image();
	ret.disabled = false;
	ret.mouseOver = false;
	ret.mouseDown = false;
	
	ret.handlers = {};
	
	for (var i in FadeButton) {
		ret.handlers[i] = FadeButton[i];
	}
	
	ret.opacity = FADEBUTTON_OPACITY;
	ret.tracking = 'rectangle';
	
	ret.watch('onClick', function(property, oldval, newval) { this.onClickInternal = newval; return oldval; });
	
	
	ret.watch('disabled', function(property, oldval, newval) {
		if (newval) {
			this.opacity = FADEBUTTON_OPACITY_DISABLED;
			this.clearHandlers();
		} else {
			this.opacity = FADEBUTTON_OPACITY;
			this.loadHandlers();
		}
		return newval;
	});
	
	ret.anm = null;
	
	ret.loadHandlers = function() {
		for (var i in this.handlers) {
			this[i] = this.handlers[i];
		}
	}
	
	ret.clearHandlers = function() {
		for (var i in this.handlers) {
			this[i] = null;
		}
	}
	
	ret.anmStop = function() {
		if (this.anm && this.anm.kill) {
			this.anm.kill();
		}
	};
	
	ret.anmStart = function() {
		if (this.anm && this.anm.kill) {
			animator.start(this.anm);
		}
	}
	
	
	ret.onMouseEnter = FadeButton.onMouseEnter;
	ret.onMouseExit = FadeButton.onMouseExit;
	ret.onMouseDown = FadeButton.onMouseDown;
	ret.onMouseUp = FadeButton.onMouseUp;
	
	
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

FadeButton = {
	onMouseEnter: function() {
		if (!this.disabled) {
			this.anmStop();
			this.opacity = FADEBUTTON_OPACITY_OVER;
		}
		this.mouseOver = true;
	},
	
	onMouseExit: function() {
		if (!this.disabled && !this.mouseDown) {
			this.anmStop();
			this.anm = new FadeAnimation(this, FADEBUTTON_OPACITY, FADEBUTTON_DURATION, FADEBUTTON_EASETYPE);
			this.anmStart();
		}
		this.mouseOver = false;
	},
	
	onMouseDown: function() {
		if (!this.disabled) {
			this.anmStop();
			this.opacity = FADEBUTTON_OPACITY_CLICK;
		}
		this.mouseDown = true;
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
	}
}
