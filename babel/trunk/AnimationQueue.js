/**
 * BabelController
 * Singleton object for maintaining state and whatnot
 */

AnimationQueue = {
	// PROPERTIES
	arr: null,
	held: null,
	heldEvents: ['onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel'],
	
	// METHODS
	/**
	 * init()
	 * Initialize AnimationQueue - shouldn't need to call this elsewhere
	 */
	init: function() {
		this.arr = [];
		this.held = {};
	},
	
	/**
	 * queue(anm, obj)
	 * Queues the specified animation, and starts it if possible.
	 * To work properly, all passed-in animations should have
	 * one call to AnimationQueue.done() their collective doneFuncs.
	 * (that is, once per step of the queue).
	 * Returns the queue length (with the new animation added)
	 */
	queue: function(anm) {
		this.arr.push(anm);
		
		if (this.arr.length == 1) {
			// start up the animation queue
			this.next();
		}
		
		return this.arr.length;
	},
	
	
	/**
	 * Starts up the next animation in the queue.
	 */
	next: function() {
		var objs = [];
		if (this.arr[0].objs) {
			for (var i in this.arr[0].objs) {
				if (this.arr[0].objs[i].obj) {
					objs.push(this.arr[0].objs[i].obj);
				} else {
					objs.push(this.arr[0].objs[i]);
				}
			}
		} else if (this.arr[0].owner) {
			objs.push(this.arr[0].owner);
		}
		
		// hold events
		this.held = [];
		for (var i in objs) {
			this.held.push({});
			
			for (var j in this.heldEvents) {
				var curEvent = this.heldEvents[j];
				
				if (objs[i][curEvent]) {
					this.held[i][curEvent] = objs[i][curEvent];
					objs[i][curEvent] = null;
				}
			}
		}
		
		animator.start(this.arr[0]);
	},
	
	
	/**
	 * done()
	 * Cleans up the held events and moves onto the next part of the queue
	 */
	done: function() {
		AnimationQueue.arr.shift(1);
		
		// release events
		var objs = [];
		if (this.objs) {
			for (var i in this.objs) {
				if (this.objs[i].obj) {
					objs.push(this.objs[i].obj);
				} else {
					objs.push(this.objs[i]);
				}
			}
		} else if (this.owner) {
			objs.push(this.owner);
		}
		
		for (var i in objs) {
			for (var j in AnimationQueue.held[i]) {
				// don't overwrite any manually specified events
				if (!objs[i][j]) {
					objs[i][j] = AnimationQueue.held[i][j];
				}
			}
		}
		
		// proceed
		if (AnimationQueue.arr.length > 0) {
			AnimationQueue.next();
		}
	}	
};

AnimationQueue.init();
