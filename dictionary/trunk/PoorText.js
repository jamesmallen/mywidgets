/*
 * --------------------------
 * PoorText v0.6
 * --------------------------
 *   A not-quite-RichText class for Konfabulator.
 * 
 * By James M. Allen (james.m.allen@gmail.com)
 *
 * You are free to use this code to produce derivative works, provided that 
 * you give proper credit and you e-mail the author to inform him of any 
 * derivative works.
 *
 * Usage notes are forthcoming - for now, refer to Dictionary.js, or watch
 * the Konfabulator forums!
 *
 * ---------------
 * Release History
 * ---------------
 * 0.6 - 13 September 2005
 * - Various bugfixes, additional features for use in Dictionary
 *
 * 0.5 - 07 September 2005
 * - First public release
 * - Able to display limited html tags:
 *   - b,strong (bold)
 *   - i,em (italicized)
 *   - br (line break)
 *   - font
 *     - face,size,color
 *   - sup (superscript)
 *   - sub (subscript)
 *   - a (href)
 *   - ol,ul,li (lists)
 * - Able to "fake" these html tags:
 *   - table,tr (table row)
 *     - Just inserts a line break to separate rows
 *   - img (Images)
 *     - Displays alt text if it's set, enclosed in []
 *   - blockquote
 *      - Just inserts a line break
 *   - more (try it and see!)
 * - Semi-scrolling functionality (Requires a "cowl" to cover up
 *   overlapping text at top and optionally bottom
 * - Handles HTML entities
 *
 */


const html_dec = /&#(\d+);/m
const html_hex = /&#x([a-f0-9]+);/mi
const html_entities = Array(/&nbsp;/gi,/&iexcl;/gi,/&cent;/gi,/&pound;/gi,/&curren;/gi,/&yen;/gi,/&brvbar;/gi,/&sect;/gi,/&uml;/gi,/&copy;/gi,/&ordf;/gi,/&laquo;/gi,/&not;/gi,/&shy;/gi,/&reg;/gi,/&macr;/gi,/&deg;/gi,/&plusmn;/gi,/&sup2;/gi,/&sup3;/gi,/&acute;/gi,/&micro;/gi,/&para;/gi,/&middot;/gi,/&cedil;/gi,/&sup1;/gi,/&ordm;/gi,/&raquo;/gi,/&frac14;/gi,/&frac12;/gi,/&frac34;/gi,/&iquest;/gi,/&Agrave;/gi,/&Aacute;/gi,/&Acirc;/gi,/&Atilde;/gi,/&Auml;/gi,/&Aring;/gi,/&AElig;/gi,/&Ccedil;/gi,/&Egrave;/gi,/&Eacute;/gi,/&Ecirc;/gi,/&Euml;/gi,/&Igrave;/gi,/&Iacute;/gi,/&Icirc;/gi,/&Iuml;/gi,/&ETH;/gi,/&Ntilde;/gi,/&Ograve;/gi,/&Oacute;/gi,/&Ocirc;/gi,/&Otilde;/gi,/&Ouml;/gi,/&times;/gi,/&Oslash;/gi,/&Ugrave;/gi,/&Uacute;/gi,/&Ucirc;/gi,/&Uuml;/gi,/&Yacute;/gi,/&THORN;/gi,/&szlig;/gi,/&agrave;/gi,/&aacute;/gi,/&acirc;/gi,/&atilde;/gi,/&auml;/gi,/&aring;/gi,/&aelig;/gi,/&ccedil;/gi,/&egrave;/gi,/&eacute;/gi,/&ecirc;/gi,/&euml;/gi,/&igrave;/gi,/&iacute;/gi,/&icirc;/gi,/&iuml;/gi,/&eth;/gi,/&ntilde;/gi,/&ograve;/gi,/&oacute;/gi,/&ocirc;/gi,/&otilde;/gi,/&ouml;/gi,/&divide;/gi,/&oslash;/gi,/&ugrave;/gi,/&uacute;/gi,/&ucirc;/gi,/&uuml;/gi,/&yacute;/gi,/&thorn;/gi,/&yuml;/gi,/&fnof;/gi,/&Alpha;/gi,/&Beta;/gi,/&Gamma;/gi,/&Delta;/gi,/&Epsilon;/gi,/&Zeta;/gi,/&Eta;/gi,/&Theta;/gi,/&Iota;/gi,/&Kappa;/gi,/&Lambda;/gi,/&Mu;/gi,/&Nu;/gi,/&Xi;/gi,/&Omicron;/gi,/&Pi;/gi,/&Rho;/gi,/&Sigma;/gi,/&Tau;/gi,/&Upsilon;/gi,/&Phi;/gi,/&Chi;/gi,/&Psi;/gi,/&Omega;/gi,/&alpha;/gi,/&beta;/gi,/&gamma;/gi,/&delta;/gi,/&epsilon;/gi,/&zeta;/gi,/&eta;/gi,/&theta;/gi,/&iota;/gi,/&kappa;/gi,/&lambda;/gi,/&mu;/gi,/&nu;/gi,/&xi;/gi,/&omicron;/gi,/&pi;/gi,/&rho;/gi,/&sigmaf;/gi,/&sigma;/gi,/&tau;/gi,/&upsilon;/gi,/&phi;/gi,/&chi;/gi,/&psi;/gi,/&omega;/gi,/&thetasym;/gi,/&upsih;/gi,/&piv;/gi,/&bull;/gi,/&hellip;/gi,/&prime;/gi,/&Prime;/gi,/&oline;/gi,/&frasl;/gi,/&weierp;/gi,/&image;/gi,/&real;/gi,/&trade;/gi,/&alefsym;/gi,/&larr;/gi,/&uarr;/gi,/&rarr;/gi,/&darr;/gi,/&harr;/gi,/&crarr;/gi,/&lArr;/gi,/&uArr;/gi,/&rArr;/gi,/&dArr;/gi,/&hArr;/gi,/&forall;/gi,/&part;/gi,/&exist;/gi,/&empty;/gi,/&nabla;/gi,/&isin;/gi,/&notin;/gi,/&ni;/gi,/&prod;/gi,/&sum;/gi,/&minus;/gi,/&lowast;/gi,/&radic;/gi,/&prop;/gi,/&infin;/gi,/&ang;/gi,/&and;/gi,/&or;/gi,/&cap;/gi,/&cup;/gi,/&int;/gi,/&there4;/gi,/&sim;/gi,/&cong;/gi,/&asymp;/gi,/&ne;/gi,/&equiv;/gi,/&le;/gi,/&ge;/gi,/&sub;/gi,/&sup;/gi,/&nsub;/gi,/&sube;/gi,/&supe;/gi,/&oplus;/gi,/&otimes;/gi,/&perp;/gi,/&sdot;/gi,/&lceil;/gi,/&rceil;/gi,/&lfloor;/gi,/&rfloor;/gi,/&lang;/gi,/&rang;/gi,/&loz;/gi,/&spades;/gi,/&clubs;/gi,/&hearts;/gi,/&diams;/gi,/&quot;/gi,/&amp;/gi,/&lt;/gi,/&gt;/gi,/&OElig;/gi,/&oelig;/gi,/&Scaron;/gi,/&scaron;/gi,/&Yuml;/gi,/&circ;/gi,/&tilde;/gi,/&ensp;/gi,/&emsp;/gi,/&thinsp;/gi,/&zwnj;/gi,/&zwj;/gi,/&lrm;/gi,/&rlm;/gi,/&ndash;/gi,/&mdash;/gi,/&lsquo;/gi,/&rsquo;/gi,/&sbquo;/gi,/&ldquo;/gi,/&rdquo;/gi,/&bdquo;/gi,/&dagger;/gi,/&Dagger;/gi,/&permil;/gi,/&lsaquo;/gi,/&rsaquo;/gi,/&euro;/gi);
const unicode_entities = Array('\u00A0','\u00A1','\u00A2','\u00A3','\u00A4','\u00A5','\u00A6','\u00A7','\u00A8','\u00A9','\u00AA','\u00AB','\u00AC','\u00AD','\u00AE','\u00AF','\u00B0','\u00B1','\u00B2','\u00B3','\u00B4','\u00B5','\u00B6','\u00B7','\u00B8','\u00B9','\u00BA','\u00BB','\u00BC','\u00BD','\u00BE','\u00BF','\u00C0','\u00C1','\u00C2','\u00C3','\u00C4','\u00C5','\u00C6','\u00C7','\u00C8','\u00C9','\u00CA','\u00CB','\u00CC','\u00CD','\u00CE','\u00CF','\u00D0','\u00D1','\u00D2','\u00D3','\u00D4','\u00D5','\u00D6','\u00D7','\u00D8','\u00D9','\u00DA','\u00DB','\u00DC','\u00DD','\u00DE','\u00DF','\u00E0','\u00E1','\u00E2','\u00E3','\u00E4','\u00E5','\u00E6','\u00E7','\u00E8','\u00E9','\u00EA','\u00EB','\u00EC','\u00ED','\u00EE','\u00EF','\u00F0','\u00F1','\u00F2','\u00F3','\u00F4','\u00F5','\u00F6','\u00F7','\u00F8','\u00F9','\u00FA','\u00FB','\u00FC','\u00FD','\u00FE','\u00FF','\u0192','\u0391','\u0392','\u0393','\u0394','\u0395','\u0396','\u0397','\u0398','\u0399','\u039A','\u039B','\u039C','\u039D','\u039E','\u039F','\u03A0','\u03A1','\u03A3','\u03A4','\u03A5','\u03A6','\u03A7','\u03A8','\u03A9','\u03B1','\u03B2','\u03B3','\u03B4','\u03B5','\u03B6','\u03B7','\u03B8','\u03B9','\u03BA','\u03BB','\u03BC','\u03BD','\u03BE','\u03BF','\u03C0','\u03C1','\u03C2','\u03C3','\u03C4','\u03C5','\u03C6','\u03C7','\u03C8','\u03C9','\u03D1','\u03D2','\u03D6','\u2022','\u2026','\u2032','\u2033','\u203E','\u2044','\u2118','\u2111','\u211C','\u2122','\u2135','\u2190','\u2191','\u2192','\u2193','\u2194','\u21B5','\u21D0','\u21D1','\u21D2','\u21D3','\u21D4','\u2200','\u2202','\u2203','\u2205','\u2207','\u2208','\u2209','\u220B','\u220F','\u2211','\u2212','\u2217','\u221A','\u221D','\u221E','\u2220','\u2227','\u2228','\u2229','\u222A','\u222B','\u2234','\u223C','\u2245','\u2248','\u2260','\u2261','\u2264','\u2265','\u2282','\u2283','\u2284','\u2286','\u2287','\u2295','\u2297','\u22A5','\u22C5','\u2308','\u2309','\u230A','\u230B','\u2329','\u232A','\u25CA','\u2660','\u2663','\u2665','\u2666','\u0022','\u0026','\u003C','\u003E','\u0152','\u0153','\u0160','\u0161','\u0178','\u02C6','\u02DC','\u2002','\u2003','\u2009','\u200C','\u200D','\u200E','\u200F','\u2013','\u2014','\u2018','\u2019','\u201A','\u201C','\u201D','\u201E','\u2020','\u2021','\u2030','\u2039','\u203A','\u20AC');



function trim(str)
{
  return str.replace(/^\s*|\s*$/g,"");
}

function decodehtmlentities(s) {
  var a;
  
  if (s.indexOf('&') < 0) {
    return s;
  }
  
  // pull out html entities in decimal
  while ((a = s.match(html_dec)) != null) {
    s = s.replace(new RegExp(a[0]), String.fromCharCode(parseInt(a[1], 10)));
  }
  
  // pull out html entities in hex
  while ((a = s.match(html_hex)) != null) {
    s = s.replace(new RegExp(a[0]), String.fromCharCode(parseInt(a[1], 16)));
  }
  
  // pull out other html entities from tables above
  for (var i = 0; i < html_entities.length; i++) {
    // every 10 iterations, check to see if there are any more entities
    if (i % 10 == 0) {
      if (s.indexOf('&') < 0) {
        return s;
      }
    }
    s = s.replace(html_entities[i], unicode_entities[i]);
  }
  
  return s;
}




/**
 * closeTags(s)
 * Simple function that closes up commonly left-open HTML tags.
 * Sometimes returns something that might be close to XHTML. ;-)
 * Currently closes open img's, br's, and hr's.
 * @param     s     The HTML string to operate on
 * @returns   The newly XHTML-ized string.
 */
function closeTags(s)
{
  // pick up img tags
  s = s.replace(/<img([^>]*[^\/])>/gi, '<img$1/>');
  
  // pick up br's
  s = s.replace(/<br>/gi, '<br/>');
  
  // pick up hr's
  s = s.replace(/<hr([^>]*[^\/])>/gi, '<hr$1/>');
  
  // pull out comments
  s = s.replace(/<!--([^-]|-[^-]|--[^>])*-->/g, '')
  
  // pull out script tags
  s = s.replace(/<script[^>]*>([^<]|<[\/]|<\/[^s]|<\/s[^c]|<\/sc[^r]|<\/scr[^i]|<\/scri[^p]|<\/scrip[^t]|<\/script[^>])*<\/script>/gi, "");
  
  // pull out style tags
  s = s.replace(/<style[^>]*>([^<]|<[\/]|<\/[^s]|<\/s[^t]|<\/st[^y]|<\/sty[^l]|<\/styl[^e]|<\/style[^>]|<\/script[^>])*<\/script>/gi, "");
  
  
  return s;
}


/**
 * class HTMLParser
 * Internal class to parse html. Attempts to act sort of like an XML parser,
 * but makes no validation.
 */

HTMLParser.prototype.HTML = "";

HTMLParser.prototype.characters = function(len)
{
  if (this.onCharacters != null) {
    this.onCharacters(decodehtmlentities(this.HTML.substring(0, len)));
  }
}

HTMLParser.prototype.startElement = function(len)
{
  
  if (this.onStartElement != null) {
    var result;
    var name;
    var attrObj = new Object();
    
    var attrDQuoteRE = /\s*([a-zA-Z0-9]*)\s*=\s*"([^"]*)"\s*/g;
    var attrSQuoteRE = /\s*([a-zA-Z0-9]*)\s*=\s*'([^']*)'\s*/g;
    var attrNQuoteRE = /\s*([a-zA-Z0-9]*)\s*=\s*([^'">\s]*)\s*/g;
    
    var tag = this.HTML.substring(0, len);
    result = tag.match(/<([a-zA-Z0-9]*)/);
    if (!result || !result[1]) {
      return;
    }
    name = result[1].toLowerCase();
    tag = tag.substring(result.index + result[0].length);
    
    while ((result = attrDQuoteRE.exec(tag)) != null) {
      if (!attrObj[result[1].toLowerCase()]) {
        attrObj[result[1].toLowerCase()] = decodehtmlentities(result[2]);
      }
    }
    while ((result = attrSQuoteRE.exec(tag)) != null) {
      if (!attrObj[result[1].toLowerCase()]) {
        attrObj[result[1].toLowerCase()] = decodehtmlentities(result[2]);
      }
    }
    while ((result = attrNQuoteRE.exec(tag)) != null) {
      if (!attrObj[result[1].toLowerCase()]) {
        attrObj[result[1].toLowerCase()] = decodehtmlentities(result[2]);
      }
    }
    
    this.onStartElement(name, attrObj);
  }
}


HTMLParser.prototype.endElement = function(len)
{
  if (this.onEndElement != null) {
    var result;
    
    var tag = this.HTML.substring(0, len);
    // First / is optional to accomodate self-closing tags
    result = tag.match(/<\/?([a-zA-Z0-9]*)/);
    
    if (!result || !result[1]) {
      return;
    }
    
    this.onEndElement(result[1].toLowerCase());
  }
}


HTMLParser.prototype.parse = function(html)
{
  if (html != null) {
    this.HTML = html;
  }
  
  var htmlCopy = this.HTML;
  
  // var selfClosingTagRE = /<([a-zA-Z0-9]*)\s*(("[^"]*"|'[^']*'|[^>\/'"]*)*)\/>/i;
  // var closingTagRE = /<\/([a-zA-Z0-9]*)\s*(("[^"]*"|'[^']*'|[^>'"]*)*)>/i;
  // var openingTagRE = /<([a-zA-Z0-9]*)\s*(("[^"]*"|'[^']*'|[^>'"]*)*)>/i;
  var selfClosingTagRE = /<[^>]*\/>/;
  var closingTagRE = /<\/[^>]*>/;
  var openingTagRE = /<[^>]*>/;
  
  while (this.HTML.length > 0) {
    var len = 0;
    var nextTagStart = this.HTML.indexOf("<");
    if (nextTagStart == 0) {
      len = this.HTML.indexOf(">") + 1;
      var tag = this.HTML.substring(nextTagStart, len);
      
      if (selfClosingTagRE.test(tag)) {
        this.startElement(len);
        this.endElement(len);
      } else if (closingTagRE.test(tag)) {
        this.endElement(len);
      } else if (openingTagRE.test(tag)) {
        this.startElement(len);
      } else {
        // eh, we can't recognize it... just treat it as characters
        this.characters(len);
      }
    } else {
      if (nextTagStart < 0) {
        len = this.HTML.length;
      } else {
        len = nextTagStart;
      }
      this.characters(len);
    }
    
    this.HTML = this.HTML.substring(len);
    
  }
  
  // Restore HTML back to fullness, for debugging
  this.HTML = htmlCopy;
  
}

function HTMLParser(html)
{
  if (html != null) {
    this.HTML = html;
  }
}



/**
 * class PoorTextLine
 * Internal class for putting up a line of text.
 * Determines if the text needs to be wrapped to another line.
 * Used by PoorText.render()
 */
 
// PoorTextLine - the current calculated width
PoorTextLine.prototype.width = 0;

// PoorTextLine.height - the current calculated height
PoorTextLine.prototype.height = 0;

// PoorTextLine.maxWidth - the specified maximum width allowed
//                         (Set to -1 for no maximum)
PoorTextLine.prototype.maxWidth = -1;

// PoorTextLine.fixedWidth - set to true if you're using a fixedwidth font
PoorTextLine.prototype.fixedWidth = false;

// PoorTextLine.spacing - word-spacing multiplier (1 = normal)
PoorTextLine.prototype.spacing = 1;

// PoorTextLine Spacing multiplier constants
PoorTextLine.prototype.fwSpacingMult = 0.565;
PoorTextLine.prototype.vwSpacingMult = 0.25;


/**
 * PoorTextLine.getSMult()
 * Returns the current spacing multiplier
 */
PoorTextLine.prototype.getSMult = function()
{
  if (this.fixedWidth) {
    return this.fwSpacingMult;
  } else {
    return this.vwSpacingMult;
  }
}


/**
 * PoorTextLine.push(obj)
 * Attempts to add the object on to the given line.
 * @params    obj     The object to attempt to add.
                      Must have width and height properties.
 * @returns   true    obj fit on this line and was added
 * @returns   false   obj didn't fit, so it was not added
 */
PoorTextLine.prototype.push = function(obj)
{
  var sMult = this.getSMult();
  var newWidth = Math.max(this.width + (this.spacing * obj.size * sMult) + 
                          obj.width, this.width, obj.width);
  var newHeight = Math.max(this.height, obj.height);
  
  if (this.arr.length > 0) {
    if (this.maxWidth >= 0 && newWidth > this.maxWidth) {
      return false;
    }
    this.height = newHeight;
    this.width = newWidth;
  } else {
    this.width = obj.width;
    this.height = obj.height;
  }
  
  this.arr.push(obj);
  return true;
}


/**
 * PoorTextLine.render(hOffset, vOffset)
 * "Renders" a line by setting the hOffset and vOffset of all the objects.
 * @params    hOffset   The horizontal offset to start from (left alignment)
 * @params    vOffset   The vertical offset (top alignment)
 */
PoorTextLine.prototype.render = function(hOffset, vOffset)
{
  var sMult = this.getSMult();
  var localH = hOffset;
  for (var o in this.arr) {
    this.arr[o].hOffset = localH;
    this.arr[o].vOffset = vOffset;
    
    // Use max so that we don't end up moving any elements to the left
    localH += Math.max(0, this.arr[o].width + (this.spacing * this.arr[o].size * sMult));
  }
}


/**
 * PoorTextLine()
 * Constructor
 */
function PoorTextLine()
{
  this.arr = new Array();
}


/**
 * class PoorTextNode
 * Internal class to represent elements of the PoorText class
 * Handles inheritance of properties and ordering
 */
 
// PoorTextNode.obj - the renderable object 
PoorTextNode.prototype.obj = null;

// PoorTextNode.proto - a "prototype" object, with properties to apply to obj
//                      and children at render time
PoorTextNode.prototype.proto = null;

// PoorTextNode.special - used for special flags, such as 'br' for a linebreak
//                        (this does not propagate like proto)
PoorTextNode.prototype.special = '';


/**
 * PoorTextNode.inherit()
 * Examines a property, and if it is null, empty, or -1, looks up the same
 * property in its parent, and recurses like so until it gets to the root
 * PoorText object.
 * Note that this doesn't actually SET the property, it just returns it.
 * @params    property    The property to look up.
 * @returns   The inherited value.
 */
PoorTextNode.prototype.inherit = function(property)
{
  // ignore these properties (they should not be inherited)
  if (/^height$|^width$|^hOffset$|^vOffset$|^alignment$|^bgColor$|^bgOpacity$/.test(property)) {
    return null;
  }
  
  // inherit from the root object
  if (this.parent == -1) {
    if (this.pt[property] != null) {
      return this.pt[property];
    } else {
      return null;
    }
  }
  
  // normal inherit
  switch(property) {
    default:
      if (this.proto && this.proto[property] != null) {
        return this.proto[property];
      } else {
        //   recurse
        return this.pt.elements[this.parent].inherit(property);
      }
      break;
  }
}


/**
 * PoorTextNode(pt, parent)
 * Constructor
 * @params    pt      The PoorText object that this node is a member of
 * @params    parent  The index of the parent of this node.
 *                    Set to -1 for this to be the root node.
 */
function PoorTextNode(pt, parent)
{
  this.pt = pt;
  this.parent = parent;
}


/**
 * class PoorText
 * A class to handle the display of not-quite-RichText, by rendering each word
 * as its own Text() object, while offering functionality vaguely reminiscent
 * of a TextArea() object.
 */

// BEGIN PRIVATE VARIABLES
PoorText.prototype.ip = -1;
PoorText.prototype.xml = null;
PoorText.prototype.vScroll = 0;
PoorText.prototype.scrollBottomOverlap = 0.2;
PoorText.prototype.scrollTopOverlap = 0.2;
PoorText.prototype.scrollState = 0;
PoorText.prototype.scrollGrabbedY = 0;
// END PRIVATE VARIABLES

// BEGIN READ ONLY VARIABLES
PoorText.prototype.totalHeight = -1;
PoorText.prototype.plainText = "";
// END READ ONLY VARIABLES

// PoorText.scrollSpeed - the speed at which to scroll when using the built-in
//                        scroll buttons
PoorText.prototype.scrollSpeed = 5;

// When encountering <a href="..."> tags, the url to use as the base for
// relative urls
PoorText.prototype.hrefBase = '';

// Callback function for handling href's.
// Set this to something to override the default behavior of opening a new
// browser window. Set to null to do default.
PoorText.prototype.hrefAbsCallback = null;

PoorText.prototype.hrefRelCallback = null;

// PoorText.name - the JavaScript name of the object
//                 (This must be manually set to use multiple PoorText objects)
PoorText.prototype.name = 'PoorText.cur';

// PoorText.width - how wide to make the PoorText object
PoorText.prototype.width = 0;

// PoorText.height - how high to make the PoorText object
PoorText.prototype.height = 0;

// PoorText.hOffset - the offset for the left edge of the PoorText object
PoorText.prototype.hOffset = 0;

// PoorText.vOffset - the offset for the top edge of the PoorText object
PoorText.prototype.vOffset = 0;

// PoorText.lineSpacing - the amount of space between lines - 1 is normal
PoorText.prototype.lineSpacing = 1;

// PoorText.wordSpacing - the amount of space between words - 1 is normal
PoorText.prototype.wordSpacing = 1;

// PoorText.fixedWidth - set to true if the PoorText is using a fixed-width
//                       font - affects wordspacing
PoorText.prototype.fixedWidth = false;

PoorText.prototype.opacity = 255;
PoorText.prototype.bgOpacity = 0;
PoorText.prototype.bgColor = "#000000";

// Static's

// PoorText.cur - global variable pointing to the current PoorText object -
//                for use in the event-driven XML parser
PoorText.cur = null;

//PoorText.scrollStateOverBar     = 0x01;
PoorText.scrollStateOverHandle  = 0x01;
PoorText.scrollStateDragging    = 0x02;
PoorText.scrollStateDown        = 0x04;

PoorText.scrollHandle_onMouseEnter = function(pt)
{
  // print("scrollHandle_onMouseEnter");
  pt.scrollState = pt.scrollState | PoorText.scrollStateOverHandle;
}

PoorText.scrollHandle_onMouseDown = function(pt)
{
  // print("scrollHandle_onMouseDown");
  pt.scrollState = pt.scrollState | PoorText.scrollStateDragging;
//  pt.scrollState = pt.scrollState | PoorText.scrollStateDown;
  pt.scrollGrabbedY = system.event.vOffset - pt.scrollHandleImage.vOffset;
  PoorText.scrollBar_onMouseDown(pt);
}

PoorText.scrollHandle_onMouseMove = function(pt)
{
  // print("scrollHandle_onMouseMove");
  // pass-through
  PoorText.scrollBar_onMouseMove(pt);
}

PoorText.scrollHandle_onMouseUp = function(pt)
{
  // print("scrollHandle_onMouseUp");
  // pass-through
  PoorText.scrollBar_onMouseUp(pt);
}


PoorText.scrollHandle_onMouseExit = function(pt)
{
  // print("scrollHandle_onMouseExit");
  pt.scrollState = pt.scrollState & ~PoorText.scrollStateOverHandle;
}



PoorText.scrollBar_onMouseEnter = function(pt)
{
  // print("scrollBar_onMouseEnter");
  // pt.scrollState = pt.scrollState | PoorText.scrollStateOverBar;
}

PoorText.scrollBar_onMouseDown = function(pt)
{
  // print("scrollBar_onMouseDown");
  pt.scrollGrabbedY = pt.scrollHandleImage.height / 2;
  PoorText.scrollDrag(pt);
}

PoorText.scrollBar_onMouseMove = function(pt)
{
  // print("scrollBar_onMouseMove");
  if (pt.scrollState & PoorText.scrollStateDragging) {
    PoorText.scrollDrag(pt);
  }
}

PoorText.scrollBar_onMouseUp = function(pt)
{
  // print("scrollBar_onMouseUp");
  pt.scrollState = pt.scrollState & ~PoorText.scrollStateDragging;
  pt.scrollState = pt.scrollState & ~PoorText.scrollStateDown;
}

PoorText.scrollBar_onMouseExit = function(pt)
{
  // print("scrollBar_onMouseExit");
  //pt.scrollState = pt.scrollState & ~PoorText.scrollStateOverBar;
}



PoorText.scrollDrag = function(pt)
{
  if (pt.totalHeight < pt.height) {
    return;
  }
  var newY = system.event.vOffset - pt.scrollGrabbedY;
  if (newY < pt.scrollHandleTop) {
    newY = pt.scrollHandleTop;
  } else if (newY > pt.scrollHandleBottom) {
    newY = pt.scrollHandleBottom;
  }
  
  pt.scrollHandleImage.vOffset = newY;
  
  pt.scrollPercent((newY - pt.scrollHandleTop) / (pt.scrollHandleBottom - pt.scrollHandleTop) * 100.0);
}


/**
 * static PoorText.splitWords(s)
 * Takes a string and splits it at word boundaries, removing empty words
 * @params    s       The input string
 * @returns   an array containing the extracted words
 */
PoorText.splitWords = function(s)
{
  var a = s.split(/[\s\n]+/);
  for (var word in a) {
    trim(a[word]);
    if (a[word] == '') {
      // remove empty words
      a.splice(word, 1);
    }
  }
  return a;
}


/**
 * static PoorText.tagStart(name, atts)
 * SAX Event handler for startElement
 * , endElement, characters
 */
PoorText.tagStart = function(name, atts) {
  // print('\ntagStart - name: ' + name);
  
  // add a new node
  PoorText.cur.elements.push(new PoorTextNode(PoorText.cur, PoorText.cur.ip));
  
  // set the insertion point to our new node
  PoorText.cur.ip = PoorText.cur.elements.length - 1;
  
  // set up the proto for children
  var element = PoorText.cur.elements[PoorText.cur.ip];
  var proto = element.proto = new Object();
  
  switch (name) {
    case 'h1':
      proto.size = PoorText.cur.size * 2;
      break;
    case 'h2':
      proto.size = PoorText.cur.size * 1.5;
      break;
    case 'h3':
      proto.size = PoorText.cur.size * 1.2;
      var base = element.inherit('style');
      if (base != null && base.length > 0) {
        proto.style = 'bold;' + base;
      } else {
        proto.style = 'bold';
      }
      break;
    case 'b':
      var base = element.inherit('style');
      if (base != null && base.length > 0) {
        proto.style = 'bold;' + base;
      } else {
        proto.style = 'bold';
      }
      break;
    case 'i':
      var base = element.inherit('style');
      if (base != null && base.length > 0) {
        proto.style = 'italic;' + base;
      } else {
        proto.style = 'italic';
      }
      break;
    case 'html':
      // dummy
      break;
    case 'font':
      if (atts.face) {
        proto.font = atts.face;
      }
      if (atts.size) {
        if (atts.size.charAt(0) == "-" || atts.size.charAt(0) == "+") {
          var base = element.inherit('size');
          if (base == null) {
            base = 20;
          }
          if (atts.size.charAt(0) == "-") {
            proto.size = base - atts.size.substr(1);
          } else {
            proto.size = base + atts.size.substr(1);
          }
        } else {
          proto.size = atts.size;
        }
      }
      if (atts.color) {
        proto.color = atts.color;
      }
      break;
    case 'sup':
      var base = element.inherit('size');
      if (base == null) {
        base = 20;
      }
      proto.size = base * 0.6;
      proto.baseOffset = -base * 0.6;
      break;
    case 'sub':
      var base = element.inherit('size');
      if (base == null) {
        base = 20;
      }
      proto.size = base * 0.6;
      proto.baseOffset = base * 0.1;
      break;
    case 'a':
      if (atts.href) {
        var absHref;
        proto.color = '#0000FF';
        if (/:\/\//.test(atts.href)) {
          // absolute
          absHref = atts.href;
          if (PoorText.cur.hrefAbsCallback != null) {
            proto.onMouseUp = PoorText.cur.name + ".hrefAbsCallback('" + absHref + "');";
          } else {
            proto.onMouseUp = "openURL('" + absHref + "');";
          }
        } else {
          // relative
          if (atts.href.charAt(0) == "/") {
            var result = PoorText.cur.hrefBase.match(/^([^:]*:\/\/[^\/]*)/);
            if (result) {
              absHref = result[1] + atts.href;
            } else {
              absHref = PoorText.cur.hrefBase + atts.href;
            }
            
            if (PoorText.cur.hrefRelCallback != null) {
              proto.onMouseUp = PoorText.cur.name + ".hrefRelCallback('" + absHref + "');";
            } else {
              proto.onMouseUp = "openURL('" + absHref + "');";
            }
          }
        }
        proto.tooltip = absHref;
      }
      break;
    case 'br':
      element.special = 'br';
      break;
    case 'blockquote':
      element.special = 'blockquote';
      break;
    case 'dd':
      element.special = 'dd';
      break;
    case 'tr':
      element.special = 'tr';
      break;
    case 'div':
      element.special = 'br';
      break;
    case 'ul':
      PoorText.cur.listStack.push('\u2022');
      break;
    case 'ol':
      if (atts.type) {
        PoorText.cur.listStack.push(atts.type);
      } else {
        PoorText.cur.listStack.push('1');
      }
      break;
    case 'li':
      element.special = 'br';
      var obj = element.obj = new Text();
      for (var p in obj) {
        var t = element.inherit(p);
        if (t) {
          obj[p] = t;
        }
      }
      var bullet = PoorText.cur.listStack[PoorText.cur.listStack.length - 1];
      if (/^\d+$/.test(bullet)) {
        // numbered
        PoorText.tagContents(bullet + ".");
        PoorText.cur.listStack[PoorText.cur.listStack.length - 1] = (parseInt(bullet, 10) + 1).toString();
      } else if (/^[a-zA-Z]$/.test(bullet)) {
        // lettered
        PoorText.tagContents(bullet + ".");
        if (bullet == 'z' || bullet == 'Z') {
          bullet = String.fromCharCode(bullet.charCodeAt(0) - 25);
        } else {
          bullet = String.fromCharCode(bullet.charCodeAt(0) + 1);
        }
        PoorText.cur.listStack[PoorText.cur.listStack.length - 1] = bullet;
      } else {
        // other
        PoorText.tagContents(bullet);
      }
      break;
    case 'img':
      if (atts.alt) {
        PoorText.tagContents(atts.alt);
      }
      break;
    default:
      break;
  }  
}

PoorText.tagContents = function(data) {
  if (trim(data).length == 0) {
    // print('\ntagContents - [EMPTY]');
    // nothing to be added
  } else {
    data = trim(data);
    // print('\ntagContents - data: ' + data);
    
    var words = PoorText.splitWords(data);
    
    for (var i in words) {
      // print ("word: '" + words[i] + "'");
      n = new PoorTextNode(PoorText.cur, PoorText.cur.ip);
      // print("\nn: " + n);
      
      PoorText.cur.elements.push(n);
      
      // get a reference to the element we just added
      var cur = PoorText.cur.elements[PoorText.cur.elements.length - 1];
      
      cur.obj = new Text();
      
      for (var p in cur.obj) {
        var t = cur.inherit(p);
        if (t) {
          cur.obj[p] = t;
        }
      }
      
      cur.obj.data = words[i];
    }
      
  }
}

PoorText.tagEnd = function(name) {
  // print('\ntagEnd - name: ' + name);
  
  // move up the tree
  if (PoorText.cur.ip >= 0) {
    PoorText.cur.ip = PoorText.cur.elements[PoorText.cur.ip].parent;
  }
  
  // print("ip = " + PoorText.cur.ip);
  
  switch (name) {
    case 'ol':
    case 'ul':
      var element = new PoorTextNode(PoorText.cur, PoorText.cur.ip)
      element.special = 'br';
      PoorText.cur.elements.push(element);
      PoorText.cur.listStack.pop();
      break;
    case 'table':
    case 'dl':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'p':
      var element = new PoorTextNode(PoorText.cur, PoorText.cur.ip)
      element.special = 'br';
      PoorText.cur.elements.push(element);
      break;
  }
  
}


PoorText.prototype.showScroll = function(visible)
{
  if (visible || visible == null) {
    this.scrollBarImage.opacity = this.opacity;
    this.scrollUpImage.opacity = this.opacity;
    this.scrollDownImage.opacity = this.opacity;
    this.scrollHandleImage.opacity = this.opacity;
  } else {
    this.scrollBarImage.opacity = 0;
    this.scrollUpImage.opacity = 0;
    this.scrollDownImage.opacity = 0;
    this.scrollHandleImage.opacity = 0;
  }
}


PoorText.prototype.clear = function()
{
  suppressUpdates();
  for (var  i in this.elements) {
    delete this.elements[i].proto;
    delete this.elements[i].obj;
    delete this.elements[i];
  }
  delete this.elements;
  this.elements = new Array();
  this.ip = -1;
  
  this.xml = null;
  this.vScroll = 0;
  
  this.bg.hOffset = this.hOffset;
  this.bg.vOffset = this.vOffset;
  this.bg.width = this.width;
  this.bg.height = this.height;
  this.bg.bgColor = this.bgColor;
  this.bg.bgOpacity = this.bgOpacity;
  
  this.scrollUpImage.hOffset = this.hOffset + this.width - this.scrollUpImage.width;
  this.scrollUpImage.vOffset = this.vOffset;
  this.scrollUpImage.opacity = this.opacity;

  this.scrollDownImage.hOffset = this.hOffset + this.width - this.scrollDownImage.width;
  this.scrollDownImage.vOffset = this.vOffset + this.height - this.scrollDownImage.height;
  this.scrollDownImage.opacity = this.opacity;

  this.scrollHandleTop = this.scrollUpImage.vOffset + this.scrollUpImage.height;
  this.scrollHandleBottom = this.scrollDownImage.vOffset - this.scrollHandleImage.height;
  
  this.scrollBarImage.hOffset = this.hOffset + this.width - this.scrollBarImage.width;
  this.scrollBarImage.vOffset = this.scrollHandleTop - 10;
  this.scrollBarImage.height = this.scrollHandleBottom - this.scrollHandleTop + 40;
  this.scrollBarImage.opacity = this.opacity;
  
  this.scrollHandleImage.hOffset = this.hOffset + this.width - this.scrollHandleImage.width;
  this.scrollHandleImage.vOffset = this.scrollHandleTop;
  this.scrollHandleImage.opacity = this.opacity;
  
  resumeUpdates();
  
  this.totalHeight = -1;
  this.plainText = "";
}


PoorText.prototype.setHtml = function(html)
{
  PoorText.cur = this;
  this.clear();
  
  // check for opening/closing tags
  if (!(/<html>/.test(html))) {
    html = '<html>' + html;
  }
  if (!(/<\/html>/.test(html))) {
    html += '</html>';
  }
  
  html = closeTags(html);
  
  suppressUpdates();
  this.parser.parse(html);
  this.render();
}

PoorText.prototype.updateScrollHandle = function()
{
  if (this.totalHeight < this.height) {
    return;
  }
  
  var percent = this.vScroll / (this.totalHeight - this.height);
  
  this.scrollHandleImage.vOffset = this.scrollHandleTop + (percent * (this.scrollHandleBottom - this.scrollHandleTop));
}

PoorText.prototype.scroll = function(y, disableUpdate)
{
  for (var e in this.elements) {
    if (e == 0) {
      continue;
    }
    
    var obj = this.elements[e].obj;
    if (obj != null) {
      obj.vOffset = obj.vOffset + this.vScroll - y;
      obj.height = -1;
      
      if (obj.vOffset - obj.height - (obj.size * 0.2) > this.vOffset + this.height) {
        // off the bottom
        // print("Off bottom: " + obj.data);
        obj.opacity = 0;
      } else if (obj.vOffset < this.vOffset) {
        // off the top
        // print("Off top: " + obj.data);
        obj.opacity = 0;
      } else if (obj.vOffset > this.vOffset + this.height) {
        // straddling the bottom
        // print("Straddling bottom: " + obj.data);
        obj.opacity = this.opacity;
        var height = obj.height - (obj.vOffset - this.vOffset - this.height) - (obj.size * 0.2);
        if (height < 0) {
          height = 0;
        }
        obj.height = height;
      } else {
        // in the middle
        obj.opacity = this.opacity;
      }
    }
  }
  this.vScroll = y;
  
  if (!disableUpdate) {
    this.updateScrollHandle();
  }
}


PoorText.prototype.scrollPercent = function(p)
{
  this.scroll(Math.round(p * 0.01 * (this.totalHeight - this.height)), true);
}

PoorText.prototype.scrollUp = function(y)
{
  var newScroll = this.vScroll - y;
  if (newScroll < 0) {
    newScroll = 0;
  }
  this.scroll(newScroll);
}

PoorText.prototype.scrollDown = function(y)
{
  if (this.totalHeight < this.height) {
    return;
  }
  var newScroll = this.vScroll + y;
  if (newScroll > (this.totalHeight - this.height)) {
    newScroll = this.totalHeight - this.height;
  }
  this.scroll(newScroll);
}


PoorText.prototype.render = function()
{
  
  var vOffset = this.vOffset;
  var hOffset = this.hOffset;
  
  var listType = new Array();
  
  var line = new PoorTextLine()
  line.maxWidth = this.width - this.scrollBarImage.width;
  line.spacing = this.wordSpacing;
  line.fixedWidth = this.fixedWidth;
  
  for (var e in this.elements) {
    // the root (html) element is special (don't render it!)
    if (e == 0) {
      continue;
    }
    
    if (this.elements[e].special != null) {
      switch (this.elements[e].special) {
        case 'br':
        case 'tr':
        case 'blockquote':
        case 'dd':
          vOffset = Math.max(vOffset, vOffset + (this.lineSpacing * line.height));
          line.render(hOffset, vOffset);
          var oldHeight = line.height;
          delete line;
          line = new PoorTextLine()
          line.maxWidth = this.width - this.scrollBarImage.width;
          line.spacing = this.wordSpacing;
          line.fixedWidth = this.fixedWidth;
          
          this.plainText += "\r\n";
          
          // HACK - give blank lines a starting height, so that multiple
          // <br/>'s will be displayed as multiple breaks
          line.height = oldHeight;
          break;
      }
    }
    
    if (this.elements[e].obj != null) {
      if (!line.push(this.elements[e].obj)) {
        vOffset = Math.max(vOffset, vOffset + (this.lineSpacing * line.height));
        line.render(hOffset, vOffset);
        delete line;
        line = new PoorTextLine()
        line.maxWidth = this.width - this.scrollBarImage.width;
        line.spacing = this.wordSpacing;
        line.fixedWidth = this.fixedWidth;
        
        line.push(this.elements[e].obj);
      }
      
      if (this.elements[e].obj.data != null) {
        this.plainText += this.elements[e].obj.data + " ";
      }
    }
  }
  
  if (line.arr.length > 0) {
    vOffset = Math.max(vOffset, vOffset + (this.lineSpacing * line.height));
    line.render(hOffset, vOffset);
    this.totalHeight = vOffset - this.vOffset + line.height;
  } else {
    this.totalHeight = vOffset - this.vOffset;
  }
  
  
  // apply post-rendering modifications
  for (var e in this.elements) {
    if (this.elements[e].obj != null) {
      var element = this.elements[e];
      // set zOrders all the same
      if (e == 0) {
        element.obj.zOrder = this.zOrder - 1;
      } else {
        element.obj.zOrder = this.zOrder;
      }
      var baseOffset = element.inherit('baseOffset');
      if (baseOffset != null) {
        element.obj.vOffset += baseOffset;
      }
    }
  }
  
  this.showScroll(this.scrollbar);
  this.scroll(0);
  
  resumeUpdates();

}

PoorText.prototype.forceSet = function(property, value)
{
  this[property] = value;
  for (var e in this.elements) {
    if (this.elements[e].obj != null) {
      if (property in this.elements[e].obj) {
        this.elements[e].obj[property] = value;
      }
    }
  }
  
  if (property in this.scrollBarImage) {
    this.scrollBarImage[property] = value;
    this.scrollUpImage[property] = value;
    this.scrollDownImage[property] = value;
    this.scrollHandleImage[property] = value;
  }
  
  
}


function PoorText()
{
  // member variables
  this.elements = new Array();
  this.listStack = new Array();
  
  this.parser = new HTMLParser();
  
  this.parser.onStartElement = PoorText.tagStart;
  this.parser.onCharacters = PoorText.tagContents;
  this.parser.onEndElement = PoorText.tagEnd;
  
  this.bg = new TextArea();
  this.bg.data = '';
  this.bg.scrollbar = false;
  this.bg.editable = false;
  
  // Dummy TextArea's so we can reserve two spots in the zOrder
  var t = new TextArea();
  var u = new TextArea();
  this.zOrder = u.zOrder;
  
  
  this.scrollUpTimer = new Timer();
  this.scrollUpTimer.ticking = false;
  this.scrollUpTimer.interval = 0.01;
  this.scrollUpTimer.onTimerFired = this.name + '.scrollUp(5)';
  
  this.scrollDownTimer = new Timer();
  this.scrollDownTimer.ticking = false;
  this.scrollDownTimer.interval = 0.01;
  this.scrollDownTimer.onTimerFired = this.name + '.scrollDown(5)';
  
  this.scrollBarImage = new Image();
  this.scrollBarImage.src = "Resources/PoorText/scroll_bar.png";
  this.scrollBarImage.onMouseEnter = "PoorText.scrollBar_onMouseEnter(" + this.name + ")";
  this.scrollBarImage.onMouseDown = "PoorText.scrollBar_onMouseDown(" + this.name + ")";
  this.scrollBarImage.onMouseMove = "PoorText.scrollBar_onMouseMove(" + this.name + ")";
  this.scrollBarImage.onMouseUp = "PoorText.scrollBar_onMouseUp(" + this.name + ")";
  this.scrollBarImage.onMouseExit = "PoorText.scrollBar_onMouseExit(" + this.name + ")";
  this.scrollBarImage.tracking = "rectangle";
  this.scrollBarImage.opacity = 0;
  
  this.scrollUpImage = new Image();
  this.scrollUpImage.src = "Resources/PoorText/scroll_up.png";
  this.scrollUpImage.onMouseDown = this.name + ".scrollUpTimer.ticking = true";
  this.scrollUpImage.onMouseExit = this.name + ".scrollUpTimer.ticking = false";
  this.scrollUpImage.onMouseUp = this.name + ".scrollUpTimer.ticking = false";
  this.scrollUpImage.opacity = 0;
  
  this.scrollDownImage = new Image();
  this.scrollDownImage.src = "Resources/PoorText/scroll_down.png";
  this.scrollDownImage.onMouseDown = this.name + ".scrollDownTimer.ticking = true;";
  this.scrollDownImage.onMouseExit = this.name + ".scrollDownTimer.ticking = false";
  this.scrollDownImage.onMouseUp = this.name + ".scrollDownTimer.ticking = false";
  this.scrollDownImage.opacity = 0;
  
  this.scrollHandleImage = new Image();
  this.scrollHandleImage.src = "Resources/PoorText/scroll_handle.png";
  this.scrollHandleImage.onMouseEnter = "PoorText.scrollHandle_onMouseEnter(" + this.name + ")";
  this.scrollHandleImage.onMouseDown = "PoorText.scrollHandle_onMouseDown(" + this.name + ")";
  this.scrollHandleImage.onMouseMove = "PoorText.scrollHandle_onMouseMove(" + this.name + ")";
  this.scrollHandleImage.onMouseUp = "PoorText.scrollHandle_onMouseUp(" + this.name + ")";
  this.scrollHandleImage.onMouseExit = "PoorText.scrollHandle_onMouseExit(" + this.name + ")";
  this.scrollHandleImage.opacity = 0;
  
}

