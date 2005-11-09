/*
 * --------------------------
 * PoorText v0.8
 * --------------------------
 *   A not-quite-RichText class for Konfabulator 3.
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
 * 0.8 - XX XXX 2005
 * - Modified for Konfabulator 3 - takes advantage of frames
 * - Hopefully loads of bugfixes. ;)
 *
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


function decodehtmlentities(s) {
  var a;
  
  if (s.indexOf("&") < 0) {
    return s;
  }
  
  // pull out html entities in decimal
  while ((a = s.match(decodehtmlentities.dec)) != null) {
    var code = parseInt(a[1], 10);
    if (decodehtmlentities.cp[code]) {
      s = s.replace(new RegExp(a[0], "g"), decodehtmlentities.cp[code]);
    } else {
      s = s.replace(new RegExp(a[0], "g"), String.fromCharCode(code));
    }
  }
  
  // pull out html entities in hex
  while ((a = s.match(decodehtmlentities.hex)) != null) {
    var code = parseInt(a[1], 16);
    if (decodehtmlentities.cp[code]) {
      s = s.replace(new RegExp(a[0], "g"), decodehtmlentities.cp[code]);
    } else {
      s = s.replace(new RegExp(a[0], "g"), String.fromCharCode(code));
    }
  }
  
  // pull out other html entities from tables above
  for (var i = 0; i < decodehtmlentities.html_entities.length; i++) {
    // every 10 iterations, check to see if there are any more entities
    if (i % 10 == 0) {
      if (s.indexOf("&") < 0) {
        return s;
      }
    }
    s = s.replace(decodehtmlentities.html_entities[i], decodehtmlentities.unicode_entities[i]);
  }
  
  return s;
}

decodehtmlentities.cp = {130:"\u201A",131:"\u0192",132:"\u201E",133:"\u2026",134:"\u2020",135:"\u2021",136:"\u02C6",137:"\u2030",138:"\u0160",139:"\u2039",140:"\u0152",141:"",142:"\u017D",143:"",144:"",145:"\u2018",146:"\u2019",147:"\u201C",148:"\u201D",149:"\u2022",150:"\u2013",151:"\u2014",152:"\u02DC",153:"\u2122",154:"\u0161",155:"\u203A",156:"\u0153",157:"",158:"\u017E",159:"\u0178"};
decodehtmlentities.dec = /&#(\d+);/m
decodehtmlentities.hex = /&#x([a-f0-9]+);/mi
decodehtmlentities.html_entities = Array(/&nbsp;/gi,/&iexcl;/gi,/&cent;/gi,/&pound;/gi,/&curren;/gi,/&yen;/gi,/&brvbar;/gi,/&sect;/gi,/&uml;/gi,/&copy;/gi,/&ordf;/gi,/&laquo;/gi,/&not;/gi,/&shy;/gi,/&reg;/gi,/&macr;/gi,/&deg;/gi,/&plusmn;/gi,/&sup2;/gi,/&sup3;/gi,/&acute;/gi,/&micro;/gi,/&para;/gi,/&middot;/gi,/&cedil;/gi,/&sup1;/gi,/&ordm;/gi,/&raquo;/gi,/&frac14;/gi,/&frac12;/gi,/&frac34;/gi,/&iquest;/gi,/&Agrave;/gi,/&Aacute;/gi,/&Acirc;/gi,/&Atilde;/gi,/&Auml;/gi,/&Aring;/gi,/&AElig;/gi,/&Ccedil;/gi,/&Egrave;/gi,/&Eacute;/gi,/&Ecirc;/gi,/&Euml;/gi,/&Igrave;/gi,/&Iacute;/gi,/&Icirc;/gi,/&Iuml;/gi,/&ETH;/gi,/&Ntilde;/gi,/&Ograve;/gi,/&Oacute;/gi,/&Ocirc;/gi,/&Otilde;/gi,/&Ouml;/gi,/&times;/gi,/&Oslash;/gi,/&Ugrave;/gi,/&Uacute;/gi,/&Ucirc;/gi,/&Uuml;/gi,/&Yacute;/gi,/&THORN;/gi,/&szlig;/gi,/&agrave;/gi,/&aacute;/gi,/&acirc;/gi,/&atilde;/gi,/&auml;/gi,/&aring;/gi,/&aelig;/gi,/&ccedil;/gi,/&egrave;/gi,/&eacute;/gi,/&ecirc;/gi,/&euml;/gi,/&igrave;/gi,/&iacute;/gi,/&icirc;/gi,/&iuml;/gi,/&eth;/gi,/&ntilde;/gi,/&ograve;/gi,/&oacute;/gi,/&ocirc;/gi,/&otilde;/gi,/&ouml;/gi,/&divide;/gi,/&oslash;/gi,/&ugrave;/gi,/&uacute;/gi,/&ucirc;/gi,/&uuml;/gi,/&yacute;/gi,/&thorn;/gi,/&yuml;/gi,/&fnof;/gi,/&Alpha;/gi,/&Beta;/gi,/&Gamma;/gi,/&Delta;/gi,/&Epsilon;/gi,/&Zeta;/gi,/&Eta;/gi,/&Theta;/gi,/&Iota;/gi,/&Kappa;/gi,/&Lambda;/gi,/&Mu;/gi,/&Nu;/gi,/&Xi;/gi,/&Omicron;/gi,/&Pi;/gi,/&Rho;/gi,/&Sigma;/gi,/&Tau;/gi,/&Upsilon;/gi,/&Phi;/gi,/&Chi;/gi,/&Psi;/gi,/&Omega;/gi,/&alpha;/gi,/&beta;/gi,/&gamma;/gi,/&delta;/gi,/&epsilon;/gi,/&zeta;/gi,/&eta;/gi,/&theta;/gi,/&iota;/gi,/&kappa;/gi,/&lambda;/gi,/&mu;/gi,/&nu;/gi,/&xi;/gi,/&omicron;/gi,/&pi;/gi,/&rho;/gi,/&sigmaf;/gi,/&sigma;/gi,/&tau;/gi,/&upsilon;/gi,/&phi;/gi,/&chi;/gi,/&psi;/gi,/&omega;/gi,/&thetasym;/gi,/&upsih;/gi,/&piv;/gi,/&bull;/gi,/&hellip;/gi,/&prime;/gi,/&Prime;/gi,/&oline;/gi,/&frasl;/gi,/&weierp;/gi,/&image;/gi,/&real;/gi,/&trade;/gi,/&alefsym;/gi,/&larr;/gi,/&uarr;/gi,/&rarr;/gi,/&darr;/gi,/&harr;/gi,/&crarr;/gi,/&lArr;/gi,/&uArr;/gi,/&rArr;/gi,/&dArr;/gi,/&hArr;/gi,/&forall;/gi,/&part;/gi,/&exist;/gi,/&empty;/gi,/&nabla;/gi,/&isin;/gi,/&notin;/gi,/&ni;/gi,/&prod;/gi,/&sum;/gi,/&minus;/gi,/&lowast;/gi,/&radic;/gi,/&prop;/gi,/&infin;/gi,/&ang;/gi,/&and;/gi,/&or;/gi,/&cap;/gi,/&cup;/gi,/&int;/gi,/&there4;/gi,/&sim;/gi,/&cong;/gi,/&asymp;/gi,/&ne;/gi,/&equiv;/gi,/&le;/gi,/&ge;/gi,/&sub;/gi,/&sup;/gi,/&nsub;/gi,/&sube;/gi,/&supe;/gi,/&oplus;/gi,/&otimes;/gi,/&perp;/gi,/&sdot;/gi,/&lceil;/gi,/&rceil;/gi,/&lfloor;/gi,/&rfloor;/gi,/&lang;/gi,/&rang;/gi,/&loz;/gi,/&spades;/gi,/&clubs;/gi,/&hearts;/gi,/&diams;/gi,/&quot;/gi,/&amp;/gi,/&lt;/gi,/&gt;/gi,/&OElig;/gi,/&oelig;/gi,/&Scaron;/gi,/&scaron;/gi,/&Yuml;/gi,/&circ;/gi,/&tilde;/gi,/&ensp;/gi,/&emsp;/gi,/&thinsp;/gi,/&zwnj;/gi,/&zwj;/gi,/&lrm;/gi,/&rlm;/gi,/&ndash;/gi,/&mdash;/gi,/&lsquo;/gi,/&rsquo;/gi,/&sbquo;/gi,/&ldquo;/gi,/&rdquo;/gi,/&bdquo;/gi,/&dagger;/gi,/&Dagger;/gi,/&permil;/gi,/&lsaquo;/gi,/&rsaquo;/gi,/&euro;/gi);
decodehtmlentities.unicode_entities = Array("\u00A0","\u00A1","\u00A2","\u00A3","\u00A4","\u00A5","\u00A6","\u00A7","\u00A8","\u00A9","\u00AA","\u00AB","\u00AC","\u00AD","\u00AE","\u00AF","\u00B0","\u00B1","\u00B2","\u00B3","\u00B4","\u00B5","\u00B6","\u00B7","\u00B8","\u00B9","\u00BA","\u00BB","\u00BC","\u00BD","\u00BE","\u00BF","\u00C0","\u00C1","\u00C2","\u00C3","\u00C4","\u00C5","\u00C6","\u00C7","\u00C8","\u00C9","\u00CA","\u00CB","\u00CC","\u00CD","\u00CE","\u00CF","\u00D0","\u00D1","\u00D2","\u00D3","\u00D4","\u00D5","\u00D6","\u00D7","\u00D8","\u00D9","\u00DA","\u00DB","\u00DC","\u00DD","\u00DE","\u00DF","\u00E0","\u00E1","\u00E2","\u00E3","\u00E4","\u00E5","\u00E6","\u00E7","\u00E8","\u00E9","\u00EA","\u00EB","\u00EC","\u00ED","\u00EE","\u00EF","\u00F0","\u00F1","\u00F2","\u00F3","\u00F4","\u00F5","\u00F6","\u00F7","\u00F8","\u00F9","\u00FA","\u00FB","\u00FC","\u00FD","\u00FE","\u00FF","\u0192","\u0391","\u0392","\u0393","\u0394","\u0395","\u0396","\u0397","\u0398","\u0399","\u039A","\u039B","\u039C","\u039D","\u039E","\u039F","\u03A0","\u03A1","\u03A3","\u03A4","\u03A5","\u03A6","\u03A7","\u03A8","\u03A9","\u03B1","\u03B2","\u03B3","\u03B4","\u03B5","\u03B6","\u03B7","\u03B8","\u03B9","\u03BA","\u03BB","\u03BC","\u03BD","\u03BE","\u03BF","\u03C0","\u03C1","\u03C2","\u03C3","\u03C4","\u03C5","\u03C6","\u03C7","\u03C8","\u03C9","\u03D1","\u03D2","\u03D6","\u2022","\u2026","\u2032","\u2033","\u203E","\u2044","\u2118","\u2111","\u211C","\u2122","\u2135","\u2190","\u2191","\u2192","\u2193","\u2194","\u21B5","\u21D0","\u21D1","\u21D2","\u21D3","\u21D4","\u2200","\u2202","\u2203","\u2205","\u2207","\u2208","\u2209","\u220B","\u220F","\u2211","\u2212","\u2217","\u221A","\u221D","\u221E","\u2220","\u2227","\u2228","\u2229","\u222A","\u222B","\u2234","\u223C","\u2245","\u2248","\u2260","\u2261","\u2264","\u2265","\u2282","\u2283","\u2284","\u2286","\u2287","\u2295","\u2297","\u22A5","\u22C5","\u2308","\u2309","\u230A","\u230B","\u2329","\u232A","\u25CA","\u2660","\u2663","\u2665","\u2666","\u0022","\u0026","\u003C","\u003E","\u0152","\u0153","\u0160","\u0161","\u0178","\u02C6","\u02DC","\u2002","\u2003","\u2009","\u200C","\u200D","\u200E","\u200F","\u2013","\u2014","\u2018","\u2019","\u201A","\u201C","\u201D","\u201E","\u2020","\u2021","\u2030","\u2039","\u203A","\u20AC");



function trim(str)
{
  if (!str)
    str = "";
  return str.replace(/^\s*|\s*$/g,"");
}




/**
 * closeTags(s)
 * Simple function that closes up commonly left-open HTML tags.
 * Sometimes returns something that might be close to XHTML. ;-)
 * Currently closes open img's, br's, and hr's.
 * Also pulls out cmoments, script, and style tags.
 * @param     s     The HTML string to operate on
 * @returns   The newly XHTML-ized string.
 */
function closeTags(s)
{
  // pick up img tags
  s = s.replace(/<img([^>]*[^\/])>/gi, "<img$1/>");
  
  // pick up br's
  s = s.replace(/<br>/gi, "<br/>");
  
  // pick up hr's
  s = s.replace(/<hr([^>]*[^\/])>/gi, "<hr$1/>");
  
  // pull out comments
  s = s.replace(/<!--([^-]|-[^-]|--[^>])*-->/g, "")
  
  // pull out script tags
  s = s.replace(/<script[^>]*>([^<]|<[^\/]|<\/[^s]|<\/s[^c]|<\/sc[^r]|<\/scr[^i]|<\/scri[^p]|<\/scrip[^t]|<\/script[^>])*<\/script>/gi, "");
  
  // pull out style tags
  s = s.replace(/<style[^>]*>([^<]|<[\/]|<\/[^s]|<\/s[^t]|<\/st[^y]|<\/sty[^l]|<\/styl[^e]|<\/style[^>])*<\/style>/gi, "");
  
  return s;
}


/**
 * class HTMLParser
 * Internal class to parse html. Attempts to act sort of like an XML parser,
 * but makes no validation.
 */
function HTMLParser(html)
{
  if (html != null) {
    this.HTML = html;
  }
}

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



/**
 * class PoorText
 * A class to handle the display of not-quite-RichText, by rendering strings of
 * words as separate Text() objects.
 */
function PoorText()
{
  // member variables
  this.tagStack = null;
  this.listStack = null;
  this.anchors = null;
  
  this.parser = new HTMLParser();
  
  this.parser.onStartElement = PoorText.tagStart;
  this.parser.onCharacters = PoorText.tagContents;
  this.parser.onEndElement = PoorText.tagEnd;
  
  this.frame = new Frame();
  
  this.tagRoot = new Object();
  
  this.zOrder = this.frame.zOrder;
  
  this.scrollBar = new ScrollBar();
  this.scrollBar.hAlign = "right";
  this.frame.vScrollBar = this.scrollBar;
}


// BEGIN READ ONLY VARIABLES
PoorText.prototype.plainText = "";
// END READ ONLY VARIABLES

// When encountering <a href="..."> tags, the url to use as the base for
// relative urls
PoorText.prototype.hrefBase = "";

// If set to true, images will be shown as pop-up links instead of in-line
// images
PoorText.prototype.showImagesAsText = false;

// Callback function for handling href's.
// Set this to something to override the default behavior of opening a new
// browser window. Set to null to do default.
PoorText.prototype.hrefAbsCallback = null;
PoorText.prototype.hrefRelCallback = null;

// PoorText.name - the JavaScript name of the object
//                 (This must be manually set to use multiple PoorText objects)
PoorText.prototype.name = "PoorText.cur";

PoorText.prototype.width = 0;
PoorText.prototype.height = 0;
PoorText.prototype.scrollBarWidth = 10;

PoorText.prototype.hOffset = 0;
PoorText.prototype.vOffset = 0;


// PoorText.lineSpacing - the amount of space between lines - 1 is normal
PoorText.prototype.lineSpacing = 1;

// PoorText.wordSpacing - the amount of space between words - 1 is normal
PoorText.prototype.wordSpacing = 1;
PoorText.fwSpacingMult = 0.565;
PoorText.vwSpacingMult = 0.25;

// Static's

// PoorText.cur - global variable pointing to the current PoorText object -
//                for use in the event-driven XML parser
PoorText.cur = null;
PoorText.fwFont = "Courier";

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
//    trim(a[word]);
    if (a[word] == "") {
      // remove empty words
      a.splice(word, 1);
    }
  }
  return a;
}


PoorText.styleModify = function(curStyle, addStyle, subStyle)
{
  var o = new Object();
  var arr;
  
  if (curStyle) {
    arr = curStyle.split(";");
    for (var i in arr)
      o[arr[i]] = true;
  }
  
  if (addStyle) {
    arr = addStyle.split(";");
    for (var i in arr)
      o[arr[i]] = true;
  }
  
  if (subStyle) {
    arr = subStyle.split(";");
    for (var i in arr)
      o[arr[i]] = false;
  }
  
  arr = new Array();
  for (var i in o) {
    if (o[i])
      arr.push(i);
  }
  
  return arr.join(";");
}

/**
 * static PoorText.tagStart(name, atts)
 * SAX-style event handler for startElement
 */
PoorText.tagStart = function(name, atts) {
  // print("\ntagStart - name: " + name);
  
  // push a new tag entry on the tagStack
  var curTag = PoorText.cur.tagStack[PoorText.cur.tagStack.length - 1];
  var newTag = new Object();
  PoorText.cur.tagStack.push(newTag);
  for (var i in curTag) {
    if (i != "special")
      newTag[i] = curTag[i];
  }
  
  switch (name) {
    case "h1":
      newTag.size = PoorText.cur.tagRoot.size * 2;
      break;
    case "h2":
      newTag.size = PoorText.cur.tagRoot.size * 1.5;
      break;
    case "h3":
      newTag.size = PoorText.cur.tagRoot.size * 1.2;
      newTag.style = PoorText.styleModify(newTag.style, "bold");
      break;
    case "b":
    case "strong":
      newTag.style = PoorText.styleModify(newTag.style, "bold");
      break;
    case "i":
    case "em":
      newTag.style = PoorText.styleModify(newTag.style, "italic");
      break;
    case "cite":
    case "address":
      newTag.style = PoorText.styleModify(newTag.style, "italic");
      break;
    case "code":
    case "sample":
    case "tt":
      newTag.font = PoorText.fwFont;
      break;
    case "font":
      if (atts.face) {
        newTag.font = atts.face;
      }
      if (atts.size) {
        if (atts.size.charAt(0) == "-" || atts.size.charAt(0) == "+") {
          if (atts.size.charAt(0) == "-") {
            newTag.size -= parseFloat(atts.size.substr(1));
          } else {
            newTag.size += parseFloat(atts.size.substr(1));
          }
        } else {
          newTag.size = parseFloat(atts.size);
        }
      }
      if (atts.color) {
        newTag.color = atts.color;
      }
      break;
    case "sup":
      newTag.size *= 0.6;
      newTag.baseOffset = newTag.size;
      break;
    case "sub":
      newTag.size *= 0.6;
      newTag.baseOffset = newTag.size * 0.16;
      break;
    case "a":
      if (atts.href) {
        var absHref = PoorText.cur.absUrl(atts.href);
        newTag.color = "#0000FF";
        if (atts.href.charAt(0) == "#") {
          // link to an anchor
          newTag.onMouseUp = PoorText.cur.name + ".scrollBar.value = " + PoorText.cur.name + ".anchors['" + escape(atts.href.substr(1).toLowerCase()) + "']";
          absHref = atts.href.substr(1);
        } else if (/:\/\//.test(atts.href)) {
          // absolute
          if (PoorText.cur.hrefAbsCallback != null) {
            newTag.onMouseUp = PoorText.cur.name + ".hrefAbsCallback('" + singleQuoteEscape(absHref) + "');";
          } else {
            newTag.onMouseUp = "openURL('" + singleQuoteEscape(absHref) + "');";
          }
        } else {
          // relative
          if (atts.href.charAt(0) == "/") {
            if (PoorText.cur.hrefRelCallback != null) {
              newTag.onMouseUp = PoorText.cur.name + ".hrefRelCallback('" + singleQuoteEscape(absHref) + "');";
            } else {
              newTag.onMouseUp = "openURL('" + singleQuoteEscape(absHref) + "');";
            }
          } else {
            newTag.onMouseUp = "openURL('" + singleQuoteEscape(absHref) + "');";
          }
        }
        newTag.tooltip = atts.href;
      } else if (atts.name) {
        PoorText.cur.anchors[escape(atts.name.toLowerCase())] = PoorText.cur.scanVOffset - PoorText.cur.scanHeight;
      }
      break;
    case "br":
      PoorText.cur.doSpecial("linebreak");
      break;
    case "blockquote":
      PoorText.cur.doSpecial("linebreak");
      PoorText.cur.doSpecial("indent");
      break;
    case "tr":
      PoorText.cur.doSpecial("linebreak");
      break;
    case "div":
      PoorText.cur.doSpecial("linebreak");
      break;
    case "ul":
      PoorText.cur.listStack.push("\u2022");
      PoorText.cur.doSpecial("indent");
      break;
    case "ol":
      if (atts.type) {
        PoorText.cur.listStack.push(atts.type);
      } else {
        PoorText.cur.listStack.push("1");
      }
      PoorText.cur.doSpecial("indent");
      break;
    case "li":
      PoorText.cur.doSpecial("linebreak");
      var bullet = PoorText.cur.listStack[PoorText.cur.listStack.length - 1];
      if (/^\d+$/.test(bullet)) {
        // numbered
        PoorText.tagContents(bullet + ".");
        PoorText.cur.listStack[PoorText.cur.listStack.length - 1] = (parseInt(bullet, 10) + 1).toString();
      } else if (/^[a-zA-Z]$/.test(bullet)) {
        // lettered
        PoorText.tagContents(bullet + ".");
        if (bullet == "z" || bullet == "Z") {
          bullet = String.fromCharCode(bullet.charCodeAt(0) - 25);
        } else {
          bullet = String.fromCharCode(bullet.charCodeAt(0) + 1);
        }
        PoorText.cur.listStack[PoorText.cur.listStack.length - 1] = bullet;
      } else {
        // other
        PoorText.tagContents(bullet + " \t");
      }
      break;
    case "img":
      if (PoorText.cur.showImagesAsText) {
        if (atts.alt) {
          PoorText.tagContents("[" + atts.alt + "]");
        } else {
          PoorText.tagContents("[IMAGE]");
        }
      } else if (atts.src) {
        var curImage = new Image();
        PoorText.applyTags(curImage, newTag);
        PoorText.cur.frame.addSubview(curImage);
        curImage.src = PoorText.cur.absUrl(atts.src);
        curImage.vAlign = "bottom";
        if (atts.width && atts.height) {
          PoorText.cur.fitImage(curImage, parseFloat(atts.width), parseFloat(atts.height));
        } else {
          PoorText.cur.fitImage(curImage);
        }
        if ((curImage.width > PoorText.cur.width * 0.5) ||
            (curImage.height > PoorText.cur.scanHeight * 1.25)) {
          PoorText.cur.doSpecial("linebreak");
          curImage.hOffset = PoorText.cur.scanHOffset;
          curImage.vOffset = PoorText.cur.scanVOffset + Math.max(0, curImage.height - PoorText.cur.scanHeight);
          PoorText.cur.scanHeight = Math.max(PoorText.cur.scanHeight, curImage.height);
          PoorText.cur.doSpecial("linebreak");
        } else {
          curImage.hOffset = PoorText.cur.scanHOffset;
          curImage.vOffset = PoorText.cur.scanVOffset + Math.max(0, curImage.height - PoorText.cur.scanHeight);
          PoorText.cur.scanHeight = Math.max(PoorText.cur.scanHeight, curImage.height);
          PoorText.cur.scanHOffset += curImage.width + 2;
        }
      }
      break;
    default:
      break;
  }  
}

PoorText.prototype.absUrl = function(url)
{
  if (/[^\/]*:\/\//.test(url)) {
    // absolute
    return url;
  } else {
    // relative
    if (url.charAt(0) == "/") {
      var result = this.hrefBase.match(/^([^:]*:\/\/[^\/]*)/);
      if (result) {
        return result[1] + url;
      } else {
        return PoorText.cur.hrefBase + url;
      }
    } else {
      return url;
    }
  }
}


PoorText.prototype.fitImage = function(img, width, height, fitBox)
{
  if (!width) {
    width = img.srcWidth;
  }
  if (!height) {
    height = img.srcHeight;
  }
  if (!fitBox) {
    fitBox = 0.9;
  }
  var fitWidth = fitBox * this.activeWidth;
  var fitHeight = fitBox * this.activeHeight;
  var aspectRatio = width / height;
  
  log("width: " + width + ", height: " + height + ", fitWidth: " + fitWidth + ", fitHeight: " + fitHeight + ", aspectRatio: " + aspectRatio);
  shrunkenWidth = Math.min(fitWidth, width);
  log("shrunkenWidth: " + shrunkenWidth);
  shrunkenHeight = Math.min(fitHeight, height, shrunkenWidth / aspectRatio);
  log("shrunkenHeight: " + shrunkenHeight);
  shrunkenWidth = Math.min(aspectRatio * shrunkenHeight, shrunkenWidth);
  log("shrunkenWidth: " + shrunkenWidth);
  
  img.width = shrunkenWidth;
  img.height = shrunkenHeight;
}


/**
 * static PoorText.tagContents(data)
 * SAX-style event handler for characters
 */
PoorText.tagContents = function(data) {
  // data = trim(data);
  if (trim(data).length == 0) {
    // print("\ntagContents - [EMPTY]");
    // nothing to be added
  } else {
    // log("tagContents(" + data + ")");
    
    var curTag = PoorText.cur.tagStack[PoorText.cur.tagStack.length - 1];
    
    var words = PoorText.splitWords(data);
    if (words.length == 0)
      return;
    var i = 0;
    var startNewWord = true;
    do {
      if (startNewWord) {
        // log("Adding new word (" + words[i] + ") at " + PoorText.cur.scanHOffset + ", " + PoorText.cur.scanVOffset);
        var curText = new Text();
        PoorText.applyTags(curText, curTag);
        PoorText.cur.frame.addSubview(curText);
        curText.hOffset = PoorText.cur.scanHOffset;
        curText.vOffset = PoorText.cur.scanVOffset;
        startNewWord = false;
      }
      
      var oldData = curText.data;
      var oldWidth = curText.width;
      curText.data = curText.data + words[i] + " \t";
      
      PoorText.cur.scanHeight = Math.max(curText.height, PoorText.cur.scanHeight);
      PoorText.cur.scanHOffset += (curText.width - oldWidth);
      
      if (curText.hOffset + curText.width > PoorText.cur.activeWidth) {
        PoorText.cur.doSpecial("linebreak");
        startNewWord = true;
        if (curText.hOffset == PoorText.indentation) {
          // this was the only word on the line - move on to the next word
          i++;
        } else {
          // wrap this word to the next line
          curText.data = oldData;
        }
      } else {
        i++;
      }
    } while (i < words.length);
    
  }
}


/**
 * static PoorText.tagEnd(name)
 * SAX-style event handler for endElement
 */
PoorText.tagEnd = function(name) {
  // print("\ntagEnd - name: " + name);
  
  switch (name) {
    case "blockquote":
      PoorText.cur.doSpecial("linebreak");
      PoorText.cur.doSpecial("outdent");
      break;
    case "ol":
    case "ul":
      PoorText.cur.doSpecial("outdent");
      PoorText.cur.doSpecial("linebreak");
      PoorText.cur.listStack.pop();
      break;
    case "table":
    case "dl":
    case "h1":
    case "h2":
    case "h3":
    case "p":
    case "div":
      PoorText.cur.doSpecial("linebreak");
      break;
  }
  
  PoorText.cur.tagStack.pop();
}


/**
 * static PoorText.applyTags(obj, tags)
 * Applies tags from a tag object to any other type of object
 */
PoorText.applyTags = function(obj, tags) {
  for (var i in tags) {
    if (typeof(obj[i]) != "undefined") {
      obj[i] = tags[i];
    }
  }
}


function recursiveRemoveSubviews(frame) {
  if (frame.subviews instanceof Array) {
    var subviews = frame.subviews.slice();
  } else {
    return;
  }
  for (var i in subviews) {
    var view = subviews[i];
    if (view instanceof Frame)
      recursiveRemoveSubviews(view);
    if (view.removeFromSuperview)
      view.removeFromSuperview();
    // The next line shouldn't do anything, but it might be required to make
    // the JavaScript engine think the view has gone out of scope...
    // view = null;
  }
}


PoorText.prototype.clear = function()
{
  recursiveRemoveSubviews(this.frame);
  
  this.indentation = 0;
  this.scanHOffset = this.indentation;
  this.scanVOffset = 24;
  this.scanHeight = 1;
  
  this.activeWidth = this.width - this.scrollBar.width;
  this.activeHeight = this.height;

  this.frame.window = this.window;
  this.frame.hOffset = this.hOffset;
  this.frame.vOffset = this.vOffset;
  this.frame.width = this.activeWidth;
  this.frame.height = this.activeHeight;
  
  this.scrollBar.window = this.window;
  this.scrollBar.hOffset = this.hOffset + this.width;
  this.scrollBar.vOffset = this.vOffset + 5;
  this.scrollBar.height = this.height - 10;
  this.plainText = "";
  
  this.tagStack = new Array();
  var newTag = new Object();
  for (var i in this.tagRoot) {
    newTag[i] = this.tagRoot[i];
  }
  this.tagStack.push(newTag);
  
  this.listStack = new Array();
  this.anchors = new Object();
  
}

PoorText.prototype.doSpecial = function(spec)
{
  switch (spec) {
    case "linebreak":
      this.scanHOffset = this.indentation;
      this.scanVOffset += PoorText.cur.scanHeight;
      this.scanHeight = this.tagRoot.size;
      break;
    case "indent":
      this.indentation = Math.min(this.width / 2, this.indentation + 10);
      this.scanHOffset = Math.max(this.indentation, this.scanHOffset);
      break;
    case "outdent":
      this.indentation = Math.max(0, this.indentation - 10);
      this.scanHOffset = Math.max(this.indentation, this.scanHOffset - 10);
  }
}


PoorText.prototype.setHtml = function(html)
{
  PoorText.cur = this;
  this.clear();
  
  // check for opening/closing tags
  if (!(/<html>/.test(html))) {
    html = "<html>" + html;
  }
  if (!(/<\/html>/.test(html))) {
    html += "</html>";
  }
  
  html = closeTags(html);
  
  this.parser.parse(html);
  
  // home
  this.scrollBar.value = this.scrollBar.min;
}


function stackDump()
{
  for (var i = PoorText.cur.tagStack.length - 1; i >= 0; i--) {
    var tag = PoorText.cur.tagStack[i];
    print("tagStack[" + i + "]");
    for (var j in tag) {
      print("  " + j + ":" + tag[j]);
    }
  }
  
}

function singleQuoteEscape(str)
{
  return str.replace(/\\|'/g, "\\$&");
}

function doubleQuoteEscape(str)
{
  return str.replace(/\\|"/g, "\\$&");
}
