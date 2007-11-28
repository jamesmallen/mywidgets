/**
 * -------------
 * JHTML v1.0.1
 * -------------
 *  A class for rendering HTML using Frame and Text objects
 *
 * by James M. Allen <james.m.allen@gmail.com>
 * $Id$
 *
 * You are not free to reuse this code without express written consent from the
 * author.
 *
 * ---------------
 * Release History
 * ---------------
 * 1.0.1 - 24 October 2007
 * - Fixed an issue with order of object creation.
 *
 * 1.0 - 19 April 2007
 * - Initial release - yay Yahoo! Widgets 4.0!
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
	
	function _startBlock(parentFrame, parentPointer, myStyle, ignorePadding) {
		var myFrame, myPointer;
		
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
		
		parentFrame.appendChild(myFrame);
		myPointer = {hOffset: 0, vOffset: 0, baseline: 0};
		
		return {
			frame: myFrame,
			pointer: myPointer
		}
	}
	
	
	function _finishLine(pointer, style, ignorePadding) {
		// readjust this line's height
		for (var i = 0; i < JHTML.lineObjs.length; i++) {
			if (JHTML.lineObjs[i].constructor == Text) {
				JHTML.lineObjs[i].vOffset = pointer.vOffset + pointer.baseline;
			}
		}
		pointer.vOffset += pointer.baseline;
		
		if (!ignorePadding && style.paddingBottom) {
			pointer.vOffset += parseInt(style.paddingBottom);
		}
		
		JHTML.lineObjs = new Array();
		
		pointer.hOffset = 0;
		
		return pointer;
	}
	
	function _lineBreak(myPointer, myStyle) {
		myPointer = _finishLine(myPointer, myStyle, true);
		
		myPointer.baseline = _calcLineHeight(null, myStyle);
		return myPointer;
	}
	
	function _calcLineHeight(pointer, style) {
		if (!pointer) {
			pointer = { hOffset: 0, vOffset: 0, baseline: 0 };
		}
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
			// already fits!
			return '';
		}
		
		var cutoff = '';
		var origText = textObj.data;
		var lastWidth = textObj.width;
		
		// just make a big approximation to start
		textObj.data = _truncate(textObj.data, parseInt((maxWidth / textObj.width) * textObj.data.length));
		
		// if we're still too wide, shrink it down word by word
		while (textObj.width > maxWidth && lastWidth != textObj.width) {
			textObj.data = _truncate(textObj.data, textObj.data.length - 1);
		}
		
		if (!/\s+/.test(textObj.data) && textObj.hOffset != 0) {
			// if this is not the beginning of a line, wipe it all
			textObj.removeFromSuperview();
			delete textObj;
			cutoff = origText;
		} else {
			cutoff = origText.substr(textObj.data.length);
		}
		return cutoff;
	}
	
	function _addText(text, myFrame, myPointer, myStyle, outOfLine) {
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
		
		myFrame.appendChild(t);
		
		if (outOfLine) {
			t.vOffset += myPointer.baseline + parseInt(myStyle.paddingTop);
		} else {
			JHTML.lineObjs.push(t);
		} 
		
		return t;
	}
	
	
	function _parse() {
		_clear();
		
		var res = _parseRecurse(_doc.documentElement, self.frame, self.frame);
		self.frame.updateScrollBars();
		var paddingFrame = new Frame();
		paddingFrame.height = res.pointer.vOffset;
		self.frame.appendChild(paddingFrame);
		
	}
	
	function _convertPointToFrame(myFrame, x, y) {
		if (typeof(x) == 'number' && typeof(y) == 'number') {
			x = { x: x, y: y };
		}
		
		var t = myFrame;
		while (t != self.frame) {
			x = t.convertPointToParent(x);
			t = t.parentNode;
		}
		
	}
	
	function _baseHref() {
		return self.url.replace(/\/[^\/]*$/, '');
	}
	
	function _transformURL(href) {
		if (/:\/\//.test(href)) {
			return href;
		} else {
			return _baseHref() + href;
		}
	}
	
	function _applyAttributes(parent, child) {
		for (var i in parent) {
			child[i] = parent[i];
		}
		return child;
	}
	
	function _parseRecurse(domElement, gpFrame, parentFrame, parentPointer, parentStyle, parentAttributes) {
		var myFrame, myPointer, myStyle, t, myAttributes;
		
		if (!parentPointer) {
			parentPointer = {hOffset: 0, vOffset: 0, baseline: 0};
		}
		
		if (!parentStyle) {
			parentStyle = new Object();
		}
		
		if (!parentAttributes) {
			parentAttributes = new Object();
		}
		
		myAttributes = new Object();
		_applyAttributes(parentAttributes, myAttributes);
		
		var parentElement = domElement.parentNode;
		
		myStyle = new JHTML.Style(domElement, parentStyle, domElement.getAttribute('style'));
		
		if (myStyle.display == 'none') {
			return {
				display: 'none',
				frame: parentFrame,
				pointer: parentPointer
			};
		} else if (myStyle.display == 'list-item') {
			// add list item
			var res = _startBlock(parentFrame, parentPointer, myStyle);
			myFrame = res.frame;
			myPointer = res.pointer;
		} else if (myStyle.display == 'block') {
			var res = _startBlock(parentFrame, parentPointer, myStyle);
			myFrame = res.frame;
			myPointer = res.pointer;
		} else {
			myFrame = parentFrame;
			parentFrame = gpFrame;
			myPointer = parentPointer;
		}
		
		// if there are any objects inside this frame, then calculate the lineHeight
		if (domElement.firstChild) {
			myPointer.baseline = _calcLineHeight(myPointer, myStyle);
		}
		
		
		// miscellaneous tag-specific changes
		
		if (domElement.tagName == 'ol') {
			if (!domElement.getAttribute('start')) {
				switch (myStyle.listStyleType) {
					case 'lower-alpha':
						domElement.setAttribute('start', 'a');
						break;
					case 'upper-alpha':
						domElement.setAttribute('start', 'A');
						break;
					case 'lower-roman':
						domElement.setAttribute('start', 'i');
						break;
					case 'upper-roman':
						domElement.setAttribute('start', 'I');
						break;
					case 'decimal':
					default:
						domElement.setAttribute('start', 1);
				}
			}
			domElement.setAttribute('current', domElement.getAttribute('start'));
		}
		
		if (domElement.tagName == 'li') {
			var listMarker;
			switch (parentElement.tagName) {
				case 'ol':
					listMarker = parentElement.getAttribute('current');
					parentElement.setAttribute('current', JHTML.getNextLI(listMarker, myStyle.listStyleType));
					listMarker += '.';
					break;
				case 'ul':
				default:
					switch (myStyle.listStyleType) {
						case 'square':
							listMarker = '\u25aa';
							break;
						case 'circle':
							listMarker = '\u25cb';
							break;
						case 'none':
							listMarker = '';
							break;
						case 'disc':
						default:
							listMarker = '\u2022';
							break;
					}
			}
			_addText(listMarker, parentFrame, parentPointer, myStyle, true)
		}
		
		
		if (domElement.tagName == 'a') {
			var name = domElement.getAttribute('name');
			var href = domElement.getAttribute('href');
			var onclick = domElement.getAttribute('onclick');
			if (name) {
				self.anchors[name] = _convertPointToFrame(myFrame, myPointer.hOffset, myPointer.vOffset).y;
			}
			if (onclick) {
				myAttributes.onMouseUp = 'var tOnClick = function() { ' + onclick + ' }; var openLink = tOnClick();';
			}
			if (href) {
				var url = _transformURL(href);
				var target = domElement.getAttribute('target');
				
				if (!myAttributes.onMouseUp) {
					myAttributes.onMouseUp = 'openURL(unescape("' + escape(url) + '"));';
				} else {
					myAttributes.onMouseUp += ' if (openLink) { openURL(unescape("' + escape(url) + '")); }';
				}
			}
		}
		
		
		
		for (var child = domElement.firstChild; child != null; child = child.nextSibling) {
			switch (child.nodeType) {
				case 1: // Element
					switch (child.tagName) {
						case 'br':
							myPointer = _lineBreak(myPointer, myStyle);
							break;
						default:
							var res = _parseRecurse(child, parentFrame, myFrame, myPointer, myStyle, myAttributes);
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
					t = _addText(child.nodeValue, myFrame, myPointer, myStyle);
					_applyAttributes(myAttributes, t);
					
					while (!/^\s*$/.test(wrappedText = _fitText(t, myFrame.width - myPointer.hOffset))) {
						myPointer = _lineBreak(myPointer, myStyle);
						wrappedText = wrappedText.replace(/^\s+/, '');
						t = _addText(wrappedText, myFrame, myPointer, myStyle);
						_applyAttributes(myAttributes, t);
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
		
		if (myStyle.display == 'block') {
			pointer = _finishLine(myPointer, myStyle);
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
		
		JHTML.lineObjs = new Array();
		
	}
	
	
	// PRIVILEGED METHODS
	this.setHtml = function(html) {
		if (!/^<body>/.test(html)) {
			html = '<body>' + html + '</body>';
		}
		
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
	
	
	
	// PUBLIC PROPERTIES
	// this.frame
	// see JHTML.prototype for more
	this.id = JHTML.ids.length;
	JHTML.ids.push(this);
	
	
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

JHTML.ids = [ ];

JHTML.prototype = {
	anchors: [ ],
	hOffset: 0,
	height: 0,
	opacity: 255,
	rotation: 0,
	url: '',
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
JHTML.Style = function(domElement, parent, inline) {
	if (parent) {
		for (var i in parent) {
			if (JHTML.styleInherit[i]) {
				this[i] = parent[i];
			}
		}
	}
	
	for (var i in JHTML.defaultStyle[domElement.tagName]) {
		this[i] = JHTML.defaultStyle[domElement.tagName][i];
	}
	
	// Replace (usually deprecated) HTML attributes with CSS
	var attribMap = JHTML.styleFromHTMLAttributes[domElement.tagName];
	for (var i in attribMap) {
		var attrib = domElement.getAttribute(attribMap[i].attributeName);
		if (attrib && attribMap[i].values[attrib]) {
			this[attribMap[i].cssProperty] = attribMap[i][values][attrib]
		}
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
	onMouseUp:true,
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
	listStyleType: 'list-style-type',
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

JHTML.getNextLI = function(currentLI, listStyleType) {
	if (!listStyleType) {
		if (/^[0-9]+$/.test(currentLI)) {
			listStyleType = 'decimal';
		} else if (/^[a-z]+$/.test(currentLI)) {
			listStyleType = 'lower-alpha';
		} else if (/^[A-Z]+$/.test(currentLI)) {
			listStyleType = 'upper-alpha';
		} else {
			throw new Error('Unable to determine listStyleType - please supply.');
		}
	}
	
	switch (listStyleType) {
		case 'none':
			return '';
			break;
		case 'lower-alpha':
		case 'upper-alpha':
			return String.fromCharCode(currentLI.charCodeAt(0) + 1);
			break;
		case 'lower-roman':
			return JHTML.intToRoman(JHTML.romanToInt(currentLI) + 1).toLowerCase();
			break;
		case 'upper-roman':
			return JHTML.intToRoman(JHTML.romanToInt(currentLI) + 1).toUpperCase();
			break;
		case 'decimal':
		default:
			return parseInt(currentLI) + 1;
			break;
		
	}
	
}


JHTML.intToRoman = function(x) {
	if (x > 1399) {
		throw new Error('integer out of range (must be lower than 1400)');
	}
	
	var ret = '';
	var map = JHTML.romanNumerals;
	for (var i = 0; i < map.length; i++) {
		while (x - map[i][0] >= 0) {
			ret += map[i][1];
			x -= map[i][0];
		}
	}
	
	return ret;
}

JHTML.romanToInt = function(x) {
	var ret = 0;
	var map = JHTML.romanNumerals;
	
	x = x.toUpperCase();
	
	while (x) {
		var match = false;
		for (var i = 0; i < map.length; i++) {
			if (x.indexOf(map[i][1]) == 0) {
				ret += map[i][0];
				x = x.substr(map[i][1].length);
				match = true;
				break;
			}
		}
		if (!match) {
			throw new Error("Not a valid roman numeral, or value greater than 3999");
		}
	}
	
	return ret;
}

JHTML.romanNumerals = [
	[1000, 'M'],
	[900,  'CM'],
	[500,  'D'],
	[400,  'CD'],
	[100,  'C'],
	[90,   'XC'],
	[50,   'L'],
	[40,   'XL'],
	[10,   'X'],
	[9,    'IX'],
	[5,    'V'],
	[1,    'I']
];


JHTML.styleFromHTMLAttributes = {
	ol: [
		{ attributeName: 'type', cssProperty: 'listStyleType', map: {
				'1': 'decimal',
				'a': 'lower-alpha',
				'i': 'lower-roman',
				'A': 'upper-alpha',
				'I': 'upper-roman'
			}
		}
	],
	ul: [
		{ attributeName: 'type', cssProperty: 'listStyleType', map: {
				'circle': 'circle',
				'disc': 'disc',
				'square': 'square'
			}
		}
	]
}




/*
// check to see if the default style file exists, if not, extract it
if (!filesystem.itemExists(system.widgetDataFolder + 'jhtml.css')) {
	widget.extractFile('jhtml.css');
}
*/
JHTML.defaultStyle = JHTML.loadCSS(filesystem.readFile('jhtml.css'));
// ddump(JHTML.defaultStyle);


