/**
 * BabelController
 * Singleton object for maintaining state and whatnot
 */

AnmQueue = {
	// PROPERTIES
	arr: null,
	held: null,
	
	// METHODS
	/**
	 * init()
	 * Initialize AnmQueue - shouldn't need to call this elsewhere
	 */
	init: function() {
		this.arr = [];
		this.held = {};
	},
	
	queue: function(anm, obj) {
		if (!this.queue.heldEvents) {
			this.queue.heldEvents = ['onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel'];
		}
		this.arr.push({
			obj: obj,
			anm: anm
		});
		
		if (this.anms.length == 1) {
			// hold events
			this.heldEvents = {};
			for (var i in this.queue.heldEvents) {
				var curEvent = this.queue.heldEvents[i];
				if (obj[curEvent]) {
					this.held[curEvent] = obj[curEvent];
					obj[curEvent] = null;
				}
			}
			// start up the animation queue
			this.next();
		}
	},
	
	
	
	done: function() {
		AnmQueue.arr.shift(1);
		if (AnmQueue.length > 0) {
			animator.start(AnmQueue.arr[0].anm);
		} else {
			// release events
			for (var i in this.owner.letterObject.heldEvents) {
				// don't overwrite any manually specified events
				if (!this.owner[i]) {
					this.owner[i] = this.owner.letterObject.heldEvents[i];
				}
			}
		}
	},
	
	next: function() {
		animator.start(this.arr[0]);
	}
};

AnmQueue.init();
