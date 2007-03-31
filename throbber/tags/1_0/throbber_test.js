/**
 * ------------------
 * Throbber Test v1.0
 * ------------------
 *  Examples of using the Throbber class in a Widget
 *
 * By James M. Allen <james.m.allen@gmail.com>
 *
 * You are free to use this code to produce derivative works, provided that 
 * you give proper credit and you e-mail the author to inform him of any 
 * derivative works.
 *
 *
 * In the examples below, main is the name of the window. You can pass
 * a window, a frame, or any other object with an appendChild method as the 
 * second parameter to the Throbber constructor (though passing anything other
 * than a window hasn't been heavily tested). The Throbber will be added to the
 * object with an appendChild call.
 *
 * You can even use Throbber in ways other than the ways demonstrated below.
 * Have a look inside throbber.js for other parameters you can change.
 * Feel free to play around with the class, and e-mail me if you notice any
 * issues!
 *
 */


// Default usage, result is pretty similar to Firefox's throbber:
var t1 = new Throbber(null, main);

// You can access the Canvas through the Throbber object:
t1.canvas.hOffset = 16;
t1.canvas.vOffset = 32;
t1.canvas.tooltip = 't1';


// Larger, more dots, only using a part of the arc with jogLength,
// and different colors with a semi-transparent transition.
// By specifying the hOffset and vOffset inside the constructor, you don't have
// to edit the canvas object later.
// This example uses JSON to specify the parameters.
var t2 = new Throbber({
	hOffset: 40,
	vOffset: 32,
	size: 64,
	nodes: 13,
	headColor: 'rgba(255,0,0,0.7)',
	tailColor: 'rgba(255,0,0,0.0)',
	jogLength: 7
}, main);

t2.canvas.tooltip = 't2';



// Small, revolving loop effect by using nodes that overlap,
// with specifying different colors and a different direction.
// This example uses JSON with a separate object to specify parameters.
var params = {hOffset:112, vOffset:32, size:20, nodes:15, nodeRadius:3, inactiveColor:'rgba(90, 153, 240, 0.4)', headColor:'#7cf', tailColor:'#27c', clockwise:false};
var t3 = new Throbber(params, main);

t3.canvas.tooltip = 't3';



// Medium-sized, smooth-style by using lots of big nodes.
// This uses a yet another style of notation to specify the parameters.
var params = new Object();
params.hOffset = 136;
params.vOffset = 32;
params.size = 36;
params.nodes = 23;
params.nodeRadius = 9;
var t4 = new Throbber(params, main);

t4.canvas.tooltip = 't4';


// usage examples end here



var throbbers = [t1, t2, t3, t4];

toggleThrobbers();

for (var i in throbbers) {
	throbbers[i].canvas.onMouseUp = 'throbbers[' + i + '].toggle();';
}

// Toggle throbbers spinning every 3 seconds
var throbberTimer = new Timer();
throbberTimer.interval = 3.0;
throbberTimer.onTimerFired = 'toggleThrobbers();';
throbberTimer.ticking = true;


function toggleThrobbers() {
	for (var i in throbbers) {
		throbbers[i].toggle();
	}
}


// Print console DEBUG instructions
print("\nHello! Thanks for checking out my Throbber library.\n\n" +
"Many parameters can be tweaked in realtime, so you can play with things without restarting a Widget if you're trying to get colors or size just right.\n\n" +
"To change a property, just use the Evaluate box below. The four throbbers in the Widget are t1, t2, t3, and t4. Here are some examples to get you started:\n\n" +
"t1.inactiveColor = 'rgba(0, 255, 100, 0.7)'\n" +
"t2.rpm = 20\n" +
"t3.nodeRadius = 1\n");

