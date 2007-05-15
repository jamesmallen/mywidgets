
const SCRAMBLE_DURATION = 250;
const SCRAMBLE_MIN_HEIGHT = 15;
const SCRAMBLE_MAX_HEIGHT = 40;
const SCRAMBLE_ROTATION = 10;

/**
 * LetterHolder(letters)
 * LetterHolder()
 * You must specify parentNode later
 */
function LetterHolder(letters) {
	if (!letters) {
		letters = [];
	}
	
	
	this.letters = [];
	for (var i in letters) {
		this.add(letters[i]);
	}
}

LetterHolder.prototype = {
	// PROPERTIES
	hOffset: 0,
	vOffset: 0,
	hAlign: 'center',
	letters: null,
	parentNode: null,
	spacing: 40,
	
	// METHODS
	/**
	 * refresh()
	 * Updates the hOffset and whatnot of all the letters
	 */
	refresh: function() {
		if (this.letters.length > 0) {
			var totalWidth = (this.letters.length - 1) * this.spacing;
			var hOffset = this.hOffset - (totalWidth / 2);
			for (var i = 0; i < this.letters.length; i++) {
				this.letters[i].hOffset = hOffset;
				this.letters[i].vOffset = this.vOffset;
				hOffset += this.spacing;
			}
		}
	},
	
	
	/**
	 * scramble()
	 * Returns a CustomAnimation object that, when called, will mix up the letters
	 */
	scramble: function() {
		var anm = new CustomAnimation(FLUID_ANIMATION_INTERVAL, function() {
			var now = animator.milliseconds;
			
			var t = Math.max(now - this.startTime, 0);
			
			if (!this.initialized) {
				this.holder.letters = arrayShuffle(this.holder.letters);
				
				this.slides = [];
				this.peaks = [];
				this.rots = [];
				var tHOffset = this.holder.hOffset - ((this.holder.letters.length - 1) * this.holder.spacing) / 2;
				for (var i in this.holder.letters) {
					this.slides[i] = [this.holder.letters[i].hOffset, tHOffset];
					this.peaks[i] = random(SCRAMBLE_MIN_HEIGHT, SCRAMBLE_MAX_HEIGHT);
					this.rots[i] = [this.holder.letters[i].rotation, (SCRAMBLE_ROTATION * 2 * Math.random()) - SCRAMBLE_ROTATION];
					tHOffset += this.holder.spacing;
				}
				this.initialized = true;
			}
			
			if (t >= SCRAMBLE_DURATION) {
				this.holder.refresh();
				return false;
			} else {
				var percent = t / SCRAMBLE_DURATION;
				var heightP = Math.sin(Math.PI * percent);
				
				for (var i in this.holder.letters) {
					var t = this.holder.letters[i];
					t.hOffset = animator.ease(this.slides[i][0], this.slides[i][1], percent, animator.kEaseNone);
					t.vOffset = this.holder.vOffset - (heightP * this.peaks[i]);
					t.rotation = animator.ease(this.rots[i][0], this.rots[i][1], percent, animator.kEaseNone);
				}
				return true;
			}
		}, function() { AnimationQueue.done() });
		
		anm.holder = this;
		return anm;
		
	},
	
	add: function(letter) {
		var ret = makeAndAppend(Image, this.parentNode, {
			src: 'Resources/Letters/' + letter.toUpperCase() + '.png',
			hAlign: 'center',
			letter: letter.toUpperCase(),
			parentNode: this.parentNode
		});
		this.letters.push(ret);
		this.refresh();
		return ret;
	}
};