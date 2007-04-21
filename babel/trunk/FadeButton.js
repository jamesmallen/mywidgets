const FADEBUTTON_OPACITY = 120;
const FADEBUTTON_OPACITY_OVER = 190;
const FADEBUTTON_OPACITY_CLICK = 255;
const FADEBUTTON_OPACITY_DISABLED = 70;

const FADEBUTTON_DURATION = 240;
const FADEBUTTON_EASETYPE = animator.kEaseOut;

function makeFadeButton() {
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
		if (this.mouseOver) {
			this.onMouseEnter();
		} else {
			this.onMouseExit();
		}
		this.mouseDown = false;
	}
}
