
function assert(q, str) {
	if (!q) { throw new Error('Assertion failed' + (str ? (': ' + str) : '')); }
}


function pdump(obj) {
  print("PDUMP of " + obj);
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}




function apply(dst, src) {
	for (var i in src) {
		if (typeof(src[i]) == 'object') {
			if (typeof(dst[i]) != 'object') {
				dst[i] = {};
			}
			apply(dst[i], src[i]);
		} else {
			dst[i] = src[i];
		}
	}
};



/**
 * rectangleShadow(ctx, x, y, width, height, r, opacity)
 */
rectangleShadow = function(ctx, x, y, width, height, r, opacity) {
	opacity = opacity || .5;
	
	x += r / 2;
	y += r / 2;
	width -= r;
	height -= r;
	
	// ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
	
	// top left
	cornerShadow(ctx, x, y, r, opacity, 2);
	
	// top center
	sideShadow(ctx, x, y - r, width, r, opacity, 1);
	
	// top right
	cornerShadow(ctx, x + width, y, r, opacity, 1);
	
	// middle left
	sideShadow(ctx, x - r, y, r, height, opacity, 4);
	
	// middle center
	ctx.fillRect(x, y, width, height);
	
	// middle right
	sideShadow(ctx, x + width, y, r, height, opacity, 2);
	
	// bottom left
	cornerShadow(ctx, x, y + height, r, opacity, 3);
	
	// bottom center
	sideShadow(ctx, x, y + height, width, r, opacity, 3);
	
	// bottom right
	cornerShadow(ctx, x + width, y + height, r, opacity, 4);
	
};

sideShadow = function(ctx, x, y, width, height, opacity, side) {
	var grad;
	
	switch (side) {
		case 1:
			// top
			grad = ctx.createLinearGradient(x, y + height, x, y);
			break;
		case 2:
			// right
			grad = ctx.createLinearGradient(x, y, x + width, y);
			break;
		case 3:
			// bottom
			grad = ctx.createLinearGradient(x, y, x, y + height);
			break;
		case 4:
			// left
			grad = ctx.createLinearGradient(x + width, y, x, y);
			break;
	}
	grad.addColorStop(0, 'rgba(0,0,0,' + opacity + ')');
	grad.addColorStop(1, 'rgba(0,0,0,0)');
	
	ctx.fillStyle = grad;
	ctx.fillRect(x, y, width, height);
	
};

cornerShadow = function(ctx, x, y, r, opacity, quadrant) {
	
	var grad = ctx.createRadialGradient(x, y, 0, x, y, r);
	grad.addColorStop(0, 'rgba(0,0,0,' + opacity + ')');
	grad.addColorStop(1, 'rgba(0,0,0,0)');
	
	ctx.fillStyle = grad;
	switch (quadrant) {
		case 1:
			// top right
			ctx.fillRect(x, y - r, r, r);
			break;
		case 2:
			// top left
			ctx.fillRect(x - r, y - r, r, r);
			break;
		case 3:
			// bottom left
			ctx.fillRect(x - r, y, r, r);
			break;
		case 4:
			// bottom right
			ctx.fillRect(x, y, r, r);
			break;
		default:
			ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
			break;
	}
};


function toImage(input, file, img) {
	img = img ? img : new Image();
	
	img.src = null;
	
	input.saveImageToFile(file, 'png');
	
	img.src = file;
	
	return img;
}


function randString(len, safeChars) {
	safeChars = safeChars || 'abcdefghijklmnopqrstuvwxyz0123456789';
	var i, ret = '';
	
	for (i = 0; i < len; i++) {
		ret += safeChars.charAt(random(0, safeChars.length));
	}
	
	return ret;
}

// Inheritance fun
Object.prototype.Inherits = function( parent )
{
	// Apply parent's constructor to this object
	if( arguments.length > 1 )
	{
		// Note: 'arguments' is an Object, not an Array
		parent.apply( this, Array.prototype.slice.call( arguments, 1 ) );
	}
	else
	{
		parent.call( this );
	}
}

Function.prototype.Inherits = function( parent )
{
	this.prototype = {};
	apply(this.prototype, parent.prototype);
	this.prototype.constructor = this;
}

/*


	Cat.Inherits( Mammal );
	function Cat( name )
	{
		this.Inherits( Mammal, name );
	}

	ColoredCat.Inherits( Cat );
	function ColoredCat( name, color )
	{
		this.Inherits( Cat, name );
	}

	Lion.Inherits( ColoredCat );
	function Lion( name )
	{
		this.Inherits( ColoredCat, name, "gold" );
	}
*/
