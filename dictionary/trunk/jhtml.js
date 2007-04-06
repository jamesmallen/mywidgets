/**
 * -------------
 * JHTML v1.0
 * -------------
 *  A class for rendering HTML using Frame and Text objects
 *
 * By James M. Allen <james.m.allen@gmail.com>
 *
 * You are free to use this code to produce derivative works, provided that 
 * you give proper credit and you e-mail the author to inform him of any 
 * derivative works.
 *
 *
 * ---------------
 * Release History
 * ---------------
 * 1.0 - XX April 2007
 * - Initial release - yay Yahoo! Widget Engine 4.0!
 *
 */
 
 
/**
 * JHTML (constructor)
 *
 * @param params (optional) Initial parameters in JSON 
 *               (see JHTML.prototype for potential parameters)
 * @param parent (optional) Will add a new Frame object to the parent using
 *               parent.appendChild(). If you don't specify this parameter,
 *               you need to manually add the object's .frame object.
 */
function JHTML(params, parent)
{
	// PRIVATE VARIABLES
	var self = this;
	
	var _doc;
	
	// PRIVATE METHODS
	
	function _startLine(parentFrame, parentPointer, myStyle, ignorePadding) {
		var myFrame, myPointer;
		
		// log('block style - making new frame');
		// pdump(parentPointer);
		myFrame = new Frame();
		
		myFrame.hOffset = 0;
		myFrame.vOffset = parentPointer.vOffset;
		myFrame.width = parentFrame.width;
		
		if (!ignorePadding && myStyle.paddingTop) {
			myFrame.vOffset += parseInt(myStyle.paddingTop);
		}
		if (myStyle.paddingLeft) {
			myFrame.hOffset += parseInt(myStyle.paddingLeft);
			myFrame.width -= parseInt(myStyle.paddingLeft);
		}
		if (myStyle.paddingRight) {
			myFrame.width -= parseInt(myStyle.paddingRight);
			myFrame.width -= parseInt(myStyle.paddingRight);
		}
		
		// pdump(myFrame);
		
		parentFrame.appendChild(myFrame);
		myPointer = {hOffset: 0, vOffset: 0, baseline: 0};
		
		return {
			frame: myFrame,
			pointer: myPointer
		}
	}
	
	
	function _finishLine(frame, pointer, style, ignorePadding) {
		// log('New line');
		// readjust this line's height
		for (var i = frame.firstChild; i != null; i = i.nextSibling) {
			if (i.constructor == Text) {
				i.vOffset = pointer.baseline;
			}
		}
		pointer.vOffset += pointer.baseline;
		
		if (!ignorePadding && style.paddingBottom) {
			pointer.vOffset += parseInt(style.paddingBottom);
		}
		
		return pointer;
	}
	
	function _lineBreak(parentFrame, myFrame, myPointer, myStyle, ignorePadding) {
		myPointer = _finishLine(myFrame, myPointer, myStyle, ignorePadding);
		myPointer.vOffset += myFrame.vOffset;
		res = _startLine(parentFrame, myPointer, myStyle, ignorePadding);
		myFrame = res.frame;
		myPointer = res.pointer;
		myPointer.baseline = _calcLineHeight(myPointer, myStyle);
		return {
			frame: myFrame,
			pointer: myPointer
		};
	}
	
	function _calcLineHeight(pointer, style) {
		if (/px$/.test(style.lineHeight)) {
			return Math.max(pointer.baseline, parseInt(style.lineHeight));
		} else {
			return Math.max(pointer.baseline, style.lineHeight * parseInt(style.fontSize));
		}
	}
	
	
	function _truncate(str, len, break_words) {
		if (len == 0) {
			return '';
		}
		
		if (str.length > len) {
			if (!break_words) {
				str = str.substr(0, len + 1).replace(/\s+?(\S+)?$/, '');
			}
			return str.substr(0, len);
		} else {
			return str;
		}
	}
	
	
	function _fitText(textObj, maxWidth) {
		if (textObj.width <= maxWidth) {
			log('No need to truncate "' + textObj.data + '" to ' + maxWidth + ' - it already fits!');
			// already fits!
			return '';
		}
		
		log('Truncating "' + textObj.data + '" to ' + maxWidth);
		
		var cutoff = '';
		var origText = textObj.data;
		var lastWidth = textObj.width;
		
		// just make a big approximation to start
		textObj.data = _truncate(textObj.data, parseInt((maxWidth / textObj.width) * textObj.data.length));
		
		print(textObj.data);
		
		
		// log('Truncate test');
		// print(_truncate('Dramatis personae', 1));
		
		// if we're still too wide, shrink it down word by word
		while (textObj.width > maxWidth && lastWidth != textObj.width) {
			log('shrinking more...');
			textObj.data = _truncate(textObj.data, textObj.data.length - 1);
		}
		
		if (!/\s+/.test(textObj.data) && textObj.hOffset != 0) {
			log('minimum text is past end of line');
			// if this is not the beginning of a line, wipe it all
			textObj.removeFromSuperview();
			delete textObj;
			cutoff = origText;
		} else {
			cutoff = origText.substr(textObj.data.length);
		}
		return cutoff;
	}
	
	function _addText(text, myFrame, myPointer, myStyle) {
		t = new Text();
		for (var i in myStyle) {
			// apply relevant text style
			if (JHTML.styleText[i]) {
				t.style[i] = myStyle[i];
			}
		}
		
		t.hOffset = myPointer.hOffset;
		t.vOffset = myPointer.vOffset;
		t.data = text;
		t.bgColor = '#ff0000';
		// t.bgOpacity = 40;
		
		myFrame.appendChild(t);
		
		return t;
	}
	
	
	function _parse() {
		// log('clearing');
		_clear();
		
		// log('parsing recursive');
		_parseRecurse(_doc.documentElement, self.frame);
	}
	
	function _parseRecurse(domElement, parentFrame, parentPointer, parentStyle) {
		var myFrame, myPointer, myStyle, t;
		
		if (!parentPointer) {
			parentPointer = {hOffset: 0, vOffset: 0, baseline: 0};
		}
		
		if (!parentStyle) {
			parentStyle = new Object();
		}
		
		// log('Calculating style for node: new JHTML.Style(' + domElement.tagName + ', ' + parentStyle + ', "' + domElement.getAttribute('style') + '")');
		
		myStyle = new JHTML.Style(domElement.tagName, parentStyle, domElement.getAttribute('style'));
		
		if (myStyle.display == 'none') {
			return {
				display: 'none',
				frame: parentFrame,
				pointer: parentPointer
			};
		} else if (myStyle.display == 'block' || myStyle.display == 'list-item') {
			var res = _startLine(parentFrame, parentPointer, myStyle);
			myFrame = res.frame;
			myPointer = res.pointer;
		} else {
			// log('using existing frame');
			myFrame = parentFrame;
			myPointer = parentPointer;
		}
		
		// if there are any objects inside this frame, then calculate the lineHeight
		if (domElement.firstChild) {
			myPointer.baseline = _calcLineHeight(myPointer, myStyle);
		}
		
		for (var child = domElement.firstChild; child != null; child = child.nextSibling) {
			// pdump(child);
			switch (child.nodeType) {
				case 1: // Element
					switch (child.tagName) {
						case 'br':
							res = _lineBreak(parentFrame, myFrame, myPointer, myStyle, true);
							myFrame = res.frame;
							myPointer = res.pointer;
							break;
						default:
							var res = _parseRecurse(child, myFrame, myPointer, myStyle);
							// log('Returned from _parseRecurse');
							if (res.display == 'block') {
								myPointer.vOffset = (res.frame.vOffset + res.pointer.vOffset);
							} else if (res.display == 'none') {
								// do nothing
							} else {
								myPointer.hOffset = res.pointer.hOffset;
								myPointer.baseline = Math.max(myPointer.baseline, res.pointer.baseline);
							}
					}
					break;
				case 2: // Attribute
					// ignore
					break;
				case 3: // Text
					// add some text objects to the current frame, dealing with word wrap
					log('Text - adding new text ("' + child.nodeValue + '")to Frame named ' + myFrame.name);
					// pdump(myPointer);
					
					t = _addText(child.nodeValue, myFrame, myPointer, myStyle);
					
					while (!/^\s*$/.test(wrappedText = _fitText(t, myFrame.width - myPointer.hOffset))) {
						res = _lineBreak(parentFrame, myFrame, myPointer, myStyle, true);
						myFrame = res.frame;
						myPointer = res.pointer;
						log('wrapping to a new a line');
						pdump(myPointer);
						wrappedText = wrappedText.replace(/^\s+/, '');
						t = _addText(wrappedText, myFrame, myPointer, myStyle);
					}
					
					myPointer.hOffset += t.width;
					
					break;
				
				case 8: // Comment
					// ignore
					break;
				case 9: // Document
					// ignore
					break;
				default:
					// ignore
					break;
			}
		}
		
		// log('finishing node');
		
		
		
		if (myStyle.display == 'block') {
			pointer = _finishLine(myFrame, myPointer, myStyle);
		}
		
		return {
			display: myStyle.display,
			frame: myFrame,
			pointer: myPointer
		}
	}
	
	
	function _clear(root) {
		if (!root) {
			root = self.frame;
		}
		
		while (root.firstChild) {
			if (root.firstChild.firstChild) {
				_clear(root.firstChild);
			}
			root.removeChild(root.firstChild);
		}
		
	}
	
	
	
	
	// PUBLIC PROPERTIES
	// this.frame
	// see JHTML.prototype for more
	
	
	// handle any changes to the canvas object through this KImage object
	function _framePassThru(property, oldval, newval) {
		this.frame[property] = newval;
		return newval;
	}
	
	for (var i in JHTML.propertiesFrame) {
		this.watch(JHTML.propertiesFrame[i], _framePassThru);
	}
	
	
	this.watch('width', function(property, oldval, newval) {
		this.frame[property] = newval;
		this.refresh();
	});
	
	
	
	// Initialization of private and public properties
	
	// create frame, append it if a parent was passed in
	this.frame = new Frame();
	this.frame.hOffset = this.hOffset;
	this.frame.vOffset = this.vOffset;
	if (typeof(parent) == 'object' && parent.appendChild) {
		parent.appendChild(this.frame);
	}
	
	
	// override defaults with any passed-in params
	if (typeof(params) == 'object') {
		for (var p in params) {
			this[p] = params[p];
		}
	}
	
	
	this.watch('data', function(property, oldval, newval) { this.setHtml(newval); return newval; });
	
	
	// PRIVILEGED METHODS
	this.setHtml = function(html) {
		// log('Setting HTML...');
		if (!/^<body>/.test(html)) {
			html = '<body>' + html + '</body>';
		}
		print(html);
		
		try {
			_doc = XMLDOM.parse(html);
		} catch (ex) {
			log('Error parsing html - not well-formed!');
			throw(ex);
		}
		
		_parse();
		
		this.html = html;
	}
	
	this.refresh = function() {
		_parse();
	}
}


// Color helper functions

/**
 * JHTML.colorToString
 * Takes a color object (such as that returned by parseColor) and returns 
 * a string in the form rgba(255, 127, 63, 0.5)
 */
JHTML.colorToString = function(colorObject, normalized)
{
	if (normalized) {
		return 'rgba(' + parseInt(255 * colorObject.r) + ',' + parseInt(255 * colorObject.g) + ',' + parseInt(255 * colorObject.b) + ',' + parseFloat(colorObject.a) + ')';
	} else {
		return 'rgba(' + parseInt(colorObject.r) + ',' + parseInt(colorObject.g) + ',' + parseInt(colorObject.b) + ',' + parseFloat(colorObject.a) + ')';
	}
}

/**
 * JHTML.parseColor
 * Takes a CSS-style color string and converts it to an object
 * with r, g, b, and a properties.
 * Can handle rgba, rgb, long and short hex-style strings.
 * @param normalize If true, will set all colors to a float between 0 and 1
 *                  (default behavior is to only do this with alpha)
 */
JHTML.parseColor = function(colorString, normalize) {
	var red = 0, green = 0, blue = 0, alpha = 1.0, res;
	
	if (res = colorString.match(/^rgba\s*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([0-9\.]+)\)$/)) {
		red = parseInt(res[1]);
		green = parseInt(res[2]);
		blue = parseInt(res[3]);
		alpha = parseFloat(res[4]);
	} else if (res = colorString.match(/^rgb\s*\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/)) {
		red = parseInt(res[1]);
		green = parseInt(res[2]);
		blue = parseInt(res[3]);
	} else if (res = colorString.match(/^\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)) {
		red = parseInt('0x' + res[1]);
		green = parseInt('0x' + res[2]);
		blue = parseInt('0x' + res[3]);
	} else if (res = colorString.match(/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i)) {
		red = parseInt('0x' + res[1] + res[1]);
		green = parseInt('0x' + res[2] + res[2]);
		blue = parseInt('0x' + res[3] + res[3]);
	}
	
	var ret = {
		r: red,
		g: green,
		b: blue,
		a: alpha
	};
	
	// Make sure data is between 0 and 255
	for (var i in ret) {
		ret[i] = Math.max(ret[i], 0);
		ret[i] = Math.min(ret[i], 255);
	}
	
	if (normalize) {
		for (var i in ret) {
			ret[i] = ret[i] / 255;
		}
	}
	
	return ret;
}


JHTML.prototype = {
	hOffset: 0,
	height: 0,
	opacity: 255,
	rotation: 0,
	mask: '',
	maskHeight: -1,
	maskHOffset: 0,
	maskOperation: 'destination-out',
	maskVOffset: 0,
	maskWidth: -1,
	visible: true,
	vOffset: 0,
	width: 0
}

JHTML.propertiesFrame = ['height', 'hLineSize', 'hOffset', 'hRegistrationPoint', 'hScrollBar', 'onClick', 'onContextMenu', 'onDragDrop', 'onDragEnter', 'onDragExit', 'onMouseDown', 'onMouseDrag', 'onMouseEnter', 'onMouseExit', 'onMouseMove', 'onMouseUp', 'onMouseWheel', 'onMultiClick', 'opacity', 'rotation', 'scrollX', 'scrollY', 'style', 'tooltip', 'tracking', 'visible', 'vLineSize', 'vRegistrationPoint', 'vOffset', 'vScrollBar', 'zOrder'];

JHTML.propertiesRefresh = ['width'];


JHTML.loadCSS = function(css) {
	var res, ret = new Object();
	var selectors, properties, curProperties;
	
	// remove comments
	css = css.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*\*\//g, '');
	
	while (res = /\s*([^{]*[^\s])\s*\{\s*([^{}]*)\s*\}/g.exec(css)) {
		selectors = res[1].split(/\s*,\s*/);
		
		properties = JHTML.parseCSSProperties(res[2]);
		
		for (var i in selectors) {
			if (!ret[selectors[i]]) {
				ret[selectors[i]] = new Object();
			}
			for (var j in properties) {
				ret[selectors[i]][j] = properties[j];
			}
		}
	}
	
	return ret;
}


JHTML.parseCSSProperties = function(propertiesString) {
	var res, ret = new Object();
	
	var properties = propertiesString.split(/\s*;\s*/);
	for (var i in properties) {
		if (!/^\s*$/.test(properties[i])) {
			res = properties[i].match(/^\s*([\w._-]+)\s*:\s*(.*?)\s*$/);
			if (JHTML.styleFromCSS[res[1]]) {
				ret[JHTML.styleFromCSS[res[1]]] = res[2];
			}
		}
	}
	
	return ret;
}

/**
 * CSSStyle class
 *
 * Constructor
 * applies cascaded styles, specified styles, and finally custom styles
 */
JHTML.Style = function(selector, parent, inline) {
	if (parent) {
		for (var i in parent) {
			if (JHTML.styleInherit[i]) {
				this[i] = parent[i];
			}
		}
	}
	
	for (var i in JHTML.defaultStyle[selector]) {
		this[i] = JHTML.defaultStyle[selector][i];
	}
	
	if (typeof(inline) == 'string') {
		// convert inline if necessary
		inline = JHTML.parseCSSProperties(inline);
	}
	
	if (typeof(inline) == 'object') {
		for (var i in inline) {
			this[i] = inline[i];
		}
	}
}

JHTML.styleInherit = {
	color:true,
	fontFamily:true,
	fontSize:true,
	fontStretch:true,
	fontStyle:true,
	fontWeight:true,
	lineHeight:true,
	textAlign:true,
	textDecoration:true,
	KONShadow:true,
	KONShadowColor:true,
	KONShadowOffset:true,
	KONTextTruncation:true
};

JHTML.styleText = {
	color:true,
	fontFamily:true,
	fontSize:true,
	fontStretch:true,
	fontStyle:true,
	fontWeight:true,
	textAlign:true,
	textDecoration:true,
	KONShadow:true,
	KONShadowColor:true,
	KONShadowOffset:true,
	KONTextTruncation:true
}

JHTML.styleFromJS = {
	background: 'background',
	backgroundAttachment: 'background-attachment',
	backgroundColor: 'background-color',
	backgroundImage: 'background-image',
	backgroundPosition: 'background-position',
	backgroundRepeat: 'background-repeat',
	color: 'color',
	display: 'display',
	fontFamily: 'font-family',
	fontSize: 'font-size',
	fontStretch: 'font-stretch',
	fontStyle: 'font-style',
	fontWeight: 'font-weight',
	lineHeight: 'line-height',
	opacity: 'opacity',
	padding: 'padding',
	paddingBottom: 'padding-bottom',
	paddingLeft: 'padding-left',
	paddingRight: 'padding-right',
	paddingTop: 'padding-top',
	textAlign: 'text-align',
	textDecoration: 'text-decoration',
	KONBackgroundFill: '-kon-background-fill',
	KONShadow: '-kon-shadow',
	KONShadowColor: '-kon-shadow-color',
	KONShadowOffset: '-kon-shadow-offset',
	KONTextTruncation: '-kon-text-truncation'
};

JHTML.styleFromCSS = new Object();
for (var i in JHTML.styleFromJS) {
	JHTML.styleFromCSS[JHTML.styleFromJS[i]] = i;
}





function pdump(obj)
{
  print("PDUMP of " + obj);
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}

function domdump(obj, level)
{
	if (!level) {
		print('DOMDUMP');
		print(obj.name);
		level = 0;
	} else if (level > 5) {
		return;
	}
	
	var indent = '';
	for (var i = 0; i < level; i++) {
		indent += '  ';
	}
	
	for (var i = obj.firstChild; i != null; i = i.nextSibling) {
		print(indent + '  ' + i.name);
		if (i.firstChild) {
			domdump(i, level + 1);
		}
	}
	
}

function ddump(obj, level)
{
	if (!level) {
		print('DDUMP');
		level = 0;
	} else if (level > 3) {
		return;
	}
	var indent = '';
	for (var i = 0; i < level; i++) {
		indent += '  ';
	}
  for (var i in obj) {
		if (typeof(obj[i]) == 'object') {
			print(indent + '  [' + i + ']: OBJECT');
			ddump(obj[i], level + 1);
		} else if (typeof(obj[i]) != "function") {
      print(indent + "  [" + i + "]: " + obj[i]);
    }
  }
}








/*
// check to see if the default style file exists, if not, extract it
if (!filesystem.itemExists(system.widgetDataFolder + 'jhtml.css')) {
	widget.extractFile('jhtml.css');
}
*/
JHTML.defaultStyle = JHTML.loadCSS(filesystem.readFile('jhtml.css'));
// ddump(JHTML.defaultStyle);


