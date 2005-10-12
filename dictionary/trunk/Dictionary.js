include("PoorText.js");
include("JamesMAllen.js");



const wmCompact         = 0x0000;
const wmWide            = 0x0001;
const wmOpen            = 0x0002;


const stateLoading      = 0x0004;
const stateTrans        = 0x0008;
const stateMouseClick   = 0x0010;
const stateOverCancel   = 0x0020;

var state = 0;
var wm = 0;
var nextWm = 0;
var nextNextWm = 0;

// Widget elements
var defContent;
var extenderCowl;
// var holder;

// Animatable objects
var transObjects = new Object();
var extenderTop;
var extenderMiddle;
var extenderBottom;
var hTopLeft;
var hTopMiddle;
var hTopRight;
var dictionaryTitle;
var throbberStill;
var throbberAnimated;
var searchBar;
var query;
var dropdownButton;
var cancelButton;
var hTopLeftHilite;
var hTopMiddleHilite;
var hTopRightHilite;
var forwardButton;

// Dropdown items
var dropdownMenu = new Array();

var contextMenu = new Array();

var booksArray = new Array();

var booksPrefArray = new Array();

// Other objects
var urlObj;
var urlTimer;
var history = new Array();
var historyIndex = -1;
var defaultColors;

function main_onContextMenu()
{
  if (wm == wmOpen && !(state & stateLoading) && !(state & stateTrans)) {
    contextMenu[0].enabled = true;
  } else {
    contextMenu[0].enabled = false;
  }
  
  main.contextMenuItems = contextMenu;
}

function initialize()
{
  if (isNaN(parseInt(preferences.selectedBook.value))) {
    preferences.selectedBook.value = 0;
  }
  
  var mi = new MenuItem();
  mi.title = "Copy";
  mi.enabled = false;
  mi.onSelect = "copy_onSelect()";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "About the Author";
  mi.onSelect = "AboutTheAuthor();";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Make a Donation";
  mi.onSelect = "Donate();";
  contextMenu.push(mi);
  
  main.contextMenuItems = contextMenu;
  main.onContextMenu = "main_onContextMenu()";
  
  extenderBottom = new Image();
  extenderBottom.src = "Resources/ExtenderBottom.png";
  extenderBottom.opacity = 0;
  extenderBottom.hOffset = 0;
  extenderBottom.width = 446;
  extenderBottom.height = 27;
  
  extenderBottom.opacity1 = 0;
  extenderBottom.vOffset1 = 42;
  
  extenderBottom.opacity2 = 255;
  extenderBottom.vOffset2 = 307;
  
  
  extenderMiddle = new Image();
  extenderMiddle.src = "Resources/ExtenderMiddle.png";
  extenderMiddle.opacity = 0;
  extenderMiddle.vOffset = 42;
  extenderMiddle.width = 446;
  
  extenderMiddle.opacity1 = 0;
  extenderMiddle.height1 = 0;
  
  extenderMiddle.opacity2 = 255;
  extenderMiddle.height2 = 265;
  
  
  extenderTop = new Image();
  extenderTop.src = "Resources/ExtenderTop.png";
  extenderTop.opacity = 0;
  extenderTop.hOffset = 0;
  extenderTop.vOffset = 0;
  extenderTop.width = 446;
  extenderTop.height = 42;
  
  extenderTop.opacity1 = 0;
  extenderTop.opacity2 = 255;
  
  
  defContent = new PoorText();
  defContent.name = "defContent";
  defContent.hOffset = 22;
  defContent.vOffset = 60;
  defContent.width = 401;
  defContent.height = 252;
  defContent.scrollbar = true;
  defContent.font = "Lucida Sans Unicode";
  defContent.size = 12;
  
  extenderCowl = new Image();
  extenderCowl.src = "Resources/ExtenderCowl.png";
  extenderCowl.hOffset = 17;
  extenderCowl.vOffset = 42;
  extenderCowl.width = 412;
  extenderCowl.height = 274;
  extenderCowl.opacity = 0;
  
  
  hTopLeft = new Image();
  hTopLeft.src = "Resources/TopLeft.png";
  
  hTopLeft.hOffset0 = 0;
  hTopLeft.vOffset0 = 0;
  hTopLeft.width0 = 28;
  hTopLeft.height0 = 51;
  
  hTopLeft.hOffset1 = 0;
  hTopLeft.vOffset1 = 0;
  hTopLeft.width1 = 28;
  hTopLeft.height1 = 51;
  
  
  hTopMiddle = new Image();
  hTopMiddle.src = "Resources/TopMiddle.png";
  
  hTopMiddle.hOffset0 = 28;
  hTopMiddle.vOffset0 = 0;
  hTopMiddle.width0 = 273;
  hTopMiddle.height0 = 51;
  
  hTopMiddle.hOffset1 = 28;
  hTopMiddle.vOffset1 = 0;
  hTopMiddle.width1 = 390;
  hTopMiddle.height1 = 51;
  
  
  hTopRight = new Image();
  hTopRight.src = "Resources/TopRight.png";
  
  hTopRight.hOffset0 = 301;
  hTopRight.vOffset0 = 0;
  hTopRight.width0 = 28;
  hTopRight.height0 = 51;
  
  hTopRight.hOffset1 = 418;
  hTopRight.vOffset1 = 0;
  hTopRight.width1 = 28;
  hTopRight.height1 = 51;
  
  
  dictionaryTitle = new Image();
  dictionaryTitle.src = "Resources/DictionaryTitle.png";
  dictionaryTitle.hOffset = 18;
  dictionaryTitle.vOffset = 12;
  dictionaryTitle.width = 103;
  dictionaryTitle.height = 24;
  
  throbberStill = new Image();
  throbberStill.src = "Resources/ThrobberStill.png";
  throbberStill.hOffset = 128;
  throbberStill.vOffset = 7;
  throbberStill.width = 32;
  throbberStill.height = 32;
  throbberStill.opacity = 0;
  throbberStill.onMouseUp = "openURL(urlObj.location);";
  throbberStill.tooltip = "Click to open a new browser window.";
  
  throbberStill.opacity1 = 0;
  throbberStill.opacity2 = 255;
  
  throbberAnimated = new Image();
  throbberAnimated.hOffset = 129;
  throbberAnimated.vOffset = 7;
  throbberAnimated.width = 32;
  throbberAnimated.height = 32;
  throbberAnimated.opacity = 0;
  throbberAnimated.tooltip = "Loading...";
  
  throbberAnimated.opacity1 = 0;
  throbberAnimated.opacity2 = 0;
  
  backButton = new Image();
  backButton.src = "Resources/ArrowLeft.png";
  backButton.opacity = 0;
  backButton.hOffset = 198;
  backButton.vOffset = 12;
  backButton.width = 20;
  backButton.height = 20;
  backButton.tracking = "rectangle";
  
  backButton.opacity1 = 0;
  backButton.opacity2 = 90;
  
  forwardButton = new Image();
  forwardButton.src = "Resources/ArrowRight.png";
  forwardButton.opacity = 0;
  forwardButton.hOffset = 222;
  forwardButton.vOffset = 12;
  forwardButton.width = 20;
  forwardButton.height = 20;
  forwardButton.tracking = "rectangle";
  
  forwardButton.opacity1 = 0;
  forwardButton.opacity2 = 90;


  searchBar = new Image();
  searchBar.src = "Resources/SearchBar.png";
  
  searchBar.hOffset0 = 129;
  searchBar.vOffset0 = 10;
  searchBar.width0 = 185;
  searchBar.height0 = 22;
  
  searchBar.hOffset1 = 246;
  searchBar.vOffset1 = 10;
  searchBar.width1 = 185;
  searchBar.height1 = 22;
  
  
  query = new TextArea();
  query.vOffset = 14;
  query.width = 143;
  query.height = 20;
  query.editable = true;
  query.font = "Lucida Sans Unicode";
  query.size = 12;
  query.scrollbar = false;
  query.onKeyPress = "query_onKeyPress()";
  query.onMultiClick = "query_onMultiClick()";
  
  query.hOffset0 = 153;
  query.hOffset1 = 270;

  
  dropdownButton = new Image();
  dropdownButton.src = "Resources/DropdownIcon.png";
  dropdownButton.tracking = "rectangle";
  dropdownButton.onMouseDown = "dropdownButton_onMouseDown();";
  dropdownButton.tooltip = "Click to select a source.";
  
  dropdownButton.hOffset0 = 134;
  dropdownButton.vOffset0 = 15;
  dropdownButton.width0 = 16;
  dropdownButton.height0 = 16;
  
  dropdownButton.hOffset1 = 251;
  dropdownButton.vOffset1 = 15;
  dropdownButton.width1 = 16;
  dropdownButton.height1 = 16;
  
  cancelButton = new Image();
  cancelButton.src = "Resources/CancelIcon.png";
  cancelButton.opacity = 127;
  cancelButton.onMouseEnter = "state = state | stateOverCancel; cancelButton.opacity = 191;";
  cancelButton.onMouseExit = "state = state & ~stateOverCancel; cancelButton.opacity = 127;";
  cancelButton.onMouseDown = "if (state & stateOverCancel) { cancelButton.opacity = 255; }";
  cancelButton.onMouseUp = "cancelButton_onMouseUp()";
  
  cancelButton.hOffset0 = 294;
  cancelButton.vOffset0 = 14;
  cancelButton.width0 = 16;
  cancelButton.height0 = 16;
  
  cancelButton.hOffset1 = 411;
  cancelButton.vOffset1 = 14;
  cancelButton.width1 = 16;
  cancelButton.height1 = 16;
  
  hTopLeftHilite = new Image();
  hTopLeftHilite.src = "Resources/TopLeftHilite.png";
  
  hTopLeftHilite.hOffset0 = 7;
  hTopLeftHilite.vOffset0 = 3;
  hTopLeftHilite.width0 = 21;
  hTopLeftHilite.height0 = 20;
  
  hTopLeftHilite.hOffset1 = 7;
  hTopLeftHilite.vOffset1 = 3;
  hTopLeftHilite.width1 = 21;
  hTopLeftHilite.height1 = 20;
  
  
  hTopMiddleHilite = new Image();
  hTopMiddleHilite.src = "Resources/TopMiddleHilite.png";
  
  hTopMiddleHilite.hOffset0 = 28;
  hTopMiddleHilite.vOffset0 = 3;
  hTopMiddleHilite.width0 = 273;
  hTopMiddleHilite.height0 = 23;
  
  hTopMiddleHilite.hOffset1 = 28;
  hTopMiddleHilite.vOffset1 = 3;
  hTopMiddleHilite.width1 = 390;
  hTopMiddleHilite.height1 = 23;
  
  
  hTopRightHilite = new Image();
  hTopRightHilite.src = "Resources/TopRightHilite.png";
  
  hTopRightHilite.hOffset0 = 301;
  hTopRightHilite.vOffset0 = 3;
  hTopRightHilite.width0 = 22;
  hTopRightHilite.height1 = 20;
  
  hTopRightHilite.hOffset1 = 418;
  hTopRightHilite.vOffset1 = 3;
  hTopRightHilite.width1 = 22;
  hTopRightHilite.height1 = 20;
  
  
  urlTimer = new Timer();
  urlTimer.interval = 0.1;
  urlTimer.ticking = false;
  
  for (var p in this) {
    if (typeof(this[p]) == "object") {
      if (this[p].hOffset0) {
        this[p].hOffset = this[p].hOffset0;
      }
      if (this[p].vOffset0) {
        this[p].vOffset = this[p].vOffset0;
      }
      if (this[p].width0) {
        this[p].width = this[p].width0;
      }
      if (this[p].height0) {
        this[p].height = this[p].height0;
      }
    }
  }
  
  transObjects.extenderTop = extenderTop;
  transObjects.extenderMiddle = extenderMiddle;
  transObjects.extenderBottom = extenderBottom;
  transObjects.hTopLeft = hTopLeft;
  transObjects.hTopMiddle = hTopMiddle;
  transObjects.hTopRight = hTopRight;
  transObjects.dictionaryTitle = dictionaryTitle;
  transObjects.throbberStill = throbberStill;
  transObjects.throbberAnimated = throbberAnimated;
  transObjects.searchBar = searchBar;
  transObjects.query = query;
  transObjects.dropdownButton = dropdownButton;
  transObjects.cancelButton = cancelButton;
  transObjects.hTopLeftHilite = hTopLeftHilite;
  transObjects.hTopMiddleHilite = hTopMiddleHilite;
  transObjects.hTopRightHilite = hTopRightHilite;
  transObjects.backButton = backButton;
  transObjects.forwardButton = forwardButton;
  
  defaultColors = new Array();
  defaultColors.push("#483BAE"); // blue
  defaultColors.push("#CB3434"); // red
  defaultColors.push("#356E25"); // green
  defaultColors.push("#896623"); // orange
  defaultColors.push("#8D306D"); // purple
  defaultColors.push("#111111"); // black
  defaultColors.push("#777777"); // silver
  defaultColors.push("#949513"); // gold
  
  buildBooksArray();
  buildDropdownMenu();
}

function exportBooksArray()
{
  var str;
  if (booksArray.length > 0) {
    str = "";
    for (var i in booksArray) {
      if (i > 0) {
        str += "|";
      }
      str += escape(booksArray[i].name) + "," + escape(booksArray[i].url) + "," + escape(booksArray[i].filter) + "," + escape(booksArray[i].color);
    }
  } else {
    str = preferences.books.defaultValue;
  }
  
  preferences.books.value = str;
}

function buildBooksArray()
{
  var tArr = preferences.books.value.split("|");
  
  booksArray = new Array();
  
  for (var i in tArr) {
    var uArr = tArr[i].split(",");
    var b = new Object();
    b.name = unescape(uArr[0]);
    b.url = unescape(uArr[1]);
    b.filter = unescape(uArr[2]);
    b.color = unescape(uArr[3]);
    booksArray.push(b);
  }
}

function buildDropdownMenu()
{
  var mi;
  dropdownMenu = new Array();
  
  if (preferences.selectedBook.value < 0 || preferences.selectedBook.value > booksArray.length - 1) {
    preferences.selectedBook.value = 0;
  }
  
  for (var i in booksArray) {
    mi = new MenuItem();
    mi.title = booksArray[i].name;
    if (preferences.selectedBook.value == i) {
      mi.checked = true;
      dropdownButton.colorize = booksArray[i].color;
    }
    mi.onSelect = "preferences.selectedBook.value = " + i + "; buildDropdownMenu();";
    dropdownMenu.push(mi);
  }
  
  mi = new MenuItem();
  mi.title = "\u2014\u2014\u2014";
  mi.enabled = false;
  dropdownMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Edit this list...";
  mi.onSelect = "editBooks();";
  dropdownMenu.push(mi);

  defContent.hrefRelCallback = lookup_url;
}


function filterOption()
{
  var a = new Array();
  a.push("Dictionary.com");
  a.push("Thesaurus.com");
  a.push("MediaWiki");
  a.push("m-w.com");
  a.push("None");
  return a;
}

function editBook(index)
{
  var prefArray = new Array();
  var bp;
  
  var curBook;
  var formResults;
  
  if (index < 0) {
    curBook = new Object();
    curBook.name = "New Item";
    curBook.url = "http://";
    curBook.filter = "None";
    curBook.color = defaultColors[(booksArray.length) % defaultColors.length];
  } else {
    curBook = booksArray[index];
  }
  
  bp = new FormField();
  bp.name = "bookName";
  bp.title = "Name:";
  bp.type = "text";
  bp.defaultValue = curBook.name;
  prefArray.push(bp);
  
  bp = new FormField();
  bp.name = "bookUrl";
  bp.title = "URL:";
  bp.type = "text";
  bp.defaultValue = curBook.url;
  prefArray.push(bp);
  
  bp = new FormField();
  bp.name = "bookFilter";
  bp.title = "Filter:";
  bp.type = "popup";
  bp.option = filterOption();
  bp.defaultValue = curBook.filter;
  prefArray.push(bp);
  
  bp = new FormField();
  bp.name = "bookColor";
  bp.title = "Color:";
  bp.type = "color";
  bp.defaultValue = curBook.color;
  prefArray.push(bp);
  
  if (index >= 0) {
    bp = new FormField();
    bp.name = "bookDelete";
    bp.title = "Delete this book";
    bp.type = "checkbox";
    bp.defaultValue = false;
    prefArray.push(bp);
    formResults = form(prefArray, "Edit Item", "Save", "Cancel");
  } else {
    formResults = form(prefArray, "New Item", "Save", "Cancel");
  }
  
  if (formResults == null) {
    return false;
  }
  
  if (formResults[4] == true) {
    // delete
    booksArray.splice(index, 1);
  } else {
    curBook.name = formResults[0];
    curBook.url = formResults[1];
    curBook.filter = formResults[2];
    curBook.color = formResults[3];
    if (index < 0) {
      // new
      booksArray.push(curBook);
    } else {
      // modify
      booksArray[index] = curBook;
    }
  }
  return true;
}


function editBooks()
{
  var formFields = new Array();
  var ff;
  var formResults;
  
  buildBooksArray();
  
  var bookNamesArray = new Array();
  var bookIndicesArray = new Array();
  
  for (var i in booksArray) {
    bookNamesArray.push(booksArray[i].name);
    bookIndicesArray.push(i);
  }
  
  bookNamesArray.push("New...");
  bookIndicesArray.push(-1);
  
  ff = new FormField();
  ff.name = "bookIndex";
  ff.title = "Item:";
  ff.type = "popup";
  ff.option = bookNamesArray;
  ff.optionValue = bookIndicesArray;
  ff.description = "\r\nSelect an item and click \"Next\" to edit or delete that item.\r\nTo add an item, select the \"New...\" item.\r\n";
  formFields.push(ff);
  
  do {
    formResults = form(formFields, "Edit List", "Next", "Cancel");
    
    if (formResults == null) {
      return;
    }
  } while (editBook(formResults[0]) == false);
  
  exportBooksArray();
  buildDropdownMenu();
}


function goBack()
{
  if (historyIndex > 0) {
    historyIndex--;
    defContent.setHtml(history[historyIndex]);
    updateHistoryButtons();
  }
}

function goForward()
{
  if (historyIndex < history.length - 1) {
    historyIndex++;
    defContent.setHtml(history[historyIndex]);
    updateHistoryButtons();
  }
}

function updateHistoryButtons()
{
  if (wm >= wmOpen) {
    if (historyIndex > 0) {
      backButton.opacity = 255;
      backButton.opacity2 = 255;
      backButton.onMouseUp = "goBack()";
    } else {
      backButton.opacity = 90;
      backButton.opacity2 = 90;
      backButton.onMouseUp = "";
    }
    if (historyIndex < history.length - 1) {
      forwardButton.opacity = 255;
      backButton.opacity2 = 255;
      forwardButton.onMouseUp = "goForward()";
    } else {
      forwardButton.opacity = 90;
      backButton.opacity2 = 90;
      forwardButton.onMouseUp = "";
    }
  }
}


function query_onKeyPress()
{
  var keycode = system.event.keyString;
  
  switch(keycode) {
    case "Enter":
    case "Return":
      query.data = query.data.replace(/[\n\r]/g, "");
      lookup_word(query.data);
      break;
    default:
      break;
  }
}

function query_onMultiClick()
{
  query.select(0, -1);
}


function dropdownButton_onMouseDown()
{
  popupMenu(dropdownMenu, dropdownButton.hOffset, dropdownButton.vOffset + dropdownButton.height);
}


function cancelButton_onMouseUp()
{
  cancelButton.opacity = 191;
  if (state & stateOverCancel) {
    if (urlObj) {
      urlObj.cancel();
      state = state & ~stateLoading;
    }
    if (state & stateTrans) {
      state = state | stateCamp;
    } else {
      if (wm == wmCompact) {
        query.data = "";
      } else {
        smoothTransition(wmCompact);
      }
    }
  }
}


function currentURL()
{
  return booksArray[preferences.selectedBook.value].url;
}

function lookup_url(url)
{
  if (!(state & stateLoading)) {
    urlObj = new URL();
    urlObj.location = url;
    state = state | stateLoading;
    urlObj.fetchAsync(url_done);
    throbberAnimated.src = "Resources/ThrobberAnimated.gif";
    throbberAnimated.opacity2 = 255;
    if (!(wm == wmOpen) && !(state & stateTrans)) {
      smoothTransition(wmOpen);
    } else {
      throbberAnimated.opacity = throbberAnimated.opacity2;
    }
  }
}

function lookup_word(query)
{
  lookup_url(currentURL() + escape(query));
}


function pronReplace(str, dict)
{
  if (dict == null) {
    dict = 'dictionary.com';
  }
  
  switch (dict) {
    case 'dictionary.com':
    default:
      const pronTags = [/<img[^>]*abreve.gif[^>]*>/gi, /<img[^>]*amacr.gif[^>]*>/gi, /<img[^>]*ebreve.gif[^>]*>/gi, /<img[^>]*emacr.gif[^>]*>/gi, /<img[^>]*ibreve.gif[^>]*>/gi, /<img[^>]*imacr.gif[^>]*>/gi, /<img[^>]*oobreve.gif[^>]*>/gi, /<img[^>]*oomacr.gif[^>]*>/gi, /<img[^>]*obreve.gif[^>]*>/gi, /<img[^>]*omacr.gif[^>]*>/gi, /<img[^>]*ubreve.gif[^>]*>/gi, /<img[^>]*umacr.gif[^>]*>/gi, /<img[^>]*schwa.gif[^>]*>/gi, /<img[^>]*oelig.gif[^>]*>/gi, /<img[^>]*khsc.gif[^>]*>/gi, /<img[^>]*nsc.gif[^>]*>/gi, /<img[^>]*lprime.gif[^>]*>/gi, /<img[^>]*prime.gif[^>]*>/gi, /<i>(([^<]*))<\/i>/gi];
      const pronStrings = ['\u0103', '\u0101', '\u0115', '\u0113', '\u012d', '\u012b', '\u014f\u014f', '\u014d\u014d', '\u014f', '\u014d', '\u016d', '\u016b', '\u0259', '\u0153', 'KH', 'N', '\u0384', '\u2032', '$1'];
      
      for (var i in pronTags) {
        str = str.replace(pronTags[i], pronStrings[i]);
      }
      
      break;
  }
  
  return str;
}

function thesaurus_com_definition(str)
{
  var result;
  var noResultRE = /no *entry *found/i;
  
  // pre-process
  str = str.replace(/[\r\n]/gm, ' ');
  
  if (noResultRE.test(str)) {
    // find the suggestions
    result = str.match(/(<h2[^>]*>.*)<p>no entry was found/i);
    if (result) {
      return result[1];
    } else {
      return false;
    }
  }
  
  result = str.match(/<h2[^>]*>.*<\/h2>(([^<]|<[^\/]|<\/[^t]|<\/t[^a]|<\/ta[^b]|<\/tab[^l]|<\/tabl[^e]|<\/table[^>])*<\/table>)/i);
  if (result) {
    return result[1];
  } else {
    return str;
  }
  
  
}


function mediawiki_definition(str)
{
  var result;
  
  // pre-process
  str = str.replace(/[\r\n]/gm, ' ');
  
  result = str.match(/<!-- start content -->(.*)<!-- end content -->/);
  
  if (result) {
    str = result[1];
  } else {
    return false;
  }
  
  // pull out table of contents
  str = str.replace(/<table id='toc'[^>]*>([^<]|<[^\/]|<\/[^t]|<\/t[^a]|<\/ta[^b]|<\/tab[^l]|<\/tabl[^e]|<\/table[^>])*<\/table>/gi, "");
  
  return str;
  
}


function m_w_com_definition(str)
{
  var result;
  
  // pre-process
  str = str.replace(/[\r\n]/gm, ' ');
  
  result = str.match(/((Main Entry:|Entry Word:)([^<]|<[^\/]|<\/[^t]|<\/t[^a]|<\/ta[^b]|<\/tab[^l]|<\/tabl[^e]|<\/table[^>])*)<\/table>/i);
  
  if (result) {
    str = result[1];
  } else {
    result = str.match(/<table cellpadding="5" width="400">([^<]|<[^\/]|<\/[^t]|<\/t[^a]|<\/ta[^b]|<\/tab[^l]|<\/tabl[^e]|<\/table[^>])*<\/table>/);
    if (result) {
      str = result[1];
    } else {
      return false;
    }
  }
  
  return str;
}

function dictionary_com_definition(str)
{
  var sections = new Array();
  var result;
  var noResultRE = /no *entry *found/i;
  var newStr = "";
  
  // pre-process
  str = str.replace(/[\r\n]/gm, ' ');
  
  if (noResultRE.test(str)) {
    // find the suggestions
    result = str.match(/(<h2[^>]*>.*)<p>no entry was found/i);
    if (result) {
      return result[1];
    } else {
      return false;
    }
  }
  
  var i = 0;
  while (result = /<!-- begin (.+) -->(([^<]|<[^!]|<![^-]|<!-[^-]|<!--[^ ]|<!-- [^e]|<!-- e[^n]|<!-- en[^d])+)<!-- end \1 -->/gm.exec(str)) {
    sections[i] = new Object();
    sections[i].title = result[1];
    sections[i].content = result[2];
    i++;
  }
  
  if (i == 0) {
    return str;
  }
  
  // TODO: select a "preferred" dictionary
  // Current simple algorithm: the first one returned!
  i = 0;
  
  // Reformat slightly
  if (sections[i].title == 'ahd4') {
    sections[i].content = sections[i].content.replace(/<b>([^<]*)<\/b>/i, "<font size='16'><b>$1</b></font><br/>");
  }
  
  return pronReplace(sections[i].content, "dictionary.com")
}


function showError(str, extra)
{
  var html = ''
            +'<html><font size="16"><b>Error</b></font><br/>'
            +'<b>' + str + '</b><br/>';
  
  if (extra != null) {
    html += 'More information:<table>';
    
    for (var p in extra) {
      html += '<tr><td><b>' + p + ':</b></td><td>' + extra[p] + '</td></tr>';
    }
    html += '</table>';
  }
  html += '</html>';
  
  defContent.setHtml(html);
  
  historyIndex++;
  history.splice(historyIndex, history.length - historyIndex, html);
  updateHistoryButtons();
  
}


function show_definition(str)
{
  switch(booksArray[preferences.selectedBook.value].filter) {
    case "Dictionary.com":
      str = dictionary_com_definition(str);
      break;
    case "Thesaurus.com":
      str = thesaurus_com_definition(str);
      break;
    case "MediaWiki":
      str = mediawiki_definition(str);
      break;
    case "m-w.com":
      str = m_w_com_definition(str);
      break;
    default:
      break;
  }
  
  if (str == null || str == false) {
    str = "No entry found for <b>" + query.data + "</b>";
    return;
  }
  
  var curHref = currentURL();
  defContent.hrefBase = curHref.substring(0, curHref.lastIndexOf('/') + 1);
  
  var html = closeTags(str);
  
  defContent.setHtml(html);
  
  historyIndex++;
  history.splice(historyIndex, history.length - historyIndex, html);
  updateHistoryButtons();
}


function url_done(url)
{
  throbberAnimated.src = "";
  throbberAnimated.opacity = 0;
  throbberAnimated.opacity2 = 0;
  urlTimer.ticking = false;
  if (url == null) {
    url = urlObj;
  }
  if (state & stateTrans) {
    // wait until we're done extending
    urlTimer.onTimerFired = "url_done(null)";
    urlTimer.ticking = true;
    return;
  } else if (wm != wmOpen) {
    // we've been closed - cancel
    urlObj = null;
    return;
  }
  state = state & ~stateLoading;
  if (url.response == 200) {
    show_definition(url.result);
  } else {
    showError('HTTP Error - server may be down, or connection may be lost.', url);
  }
}



function smoothTransition(mode)
{
  if (state & stateTrans) {
    return;
  }
  
  switch (wm) {
    case wmCompact:
      switch (mode) {
        case wmCompact:
          return;
          break;
        case wmWide:
          nextWm = nextNextWm = wmWide;
          break;
        case wmOpen:
          nextWm = wmWide;
          nextNextWm = wmOpen;
          break;
      }
      break;
    case wmWide:
      switch (mode) {
        case wmCompact:
          nextWm = nextNextWm = wmCompact;
          break;
        case wmWide:
          return;
          break;
        case wmOpen:
          nextWm = nextNextWm = wmOpen;
          break;
      }
      break;
    case wmOpen:
      switch (mode) {
        case wmCompact:
          nextWm = wmWide;
          nextNextWm = wmCompact;
          break;
        case wmWide:
          nextWm = nextNextWm = wmWide;
          break;
        case wmOpen:
          return;
          break;
      }
      break;
  }
  
  startTransition();
}

function startTransition()
{

  query.editable = false;

  switch (wm) {
    case wmOpen:
      extenderCowl.opacity = 0;
      defContent.opacity = 0;
      defContent.setHtml("");
      history = new Array();
      historyIndex = -1;
      break;
  }
  
  var slide_time = 750;
  
  state = state | stateTrans;
  
  animatorA = new CustomAnimation(15, TransitionAnimationUpdate, endTransition);
  animatorA.duration = slide_time;
  animatorA.easeType = animator.kEaseInOut;
  
  animatorA.objects = new Array();
  
  for (var i in transObjects) {
    var keep = false;
    var o = new Object();
    o.begin = new Object();
    o.end = new Object();
    for (var j in transObjects[i]) {
      if (j.substring(j.length - 1) == wm) {
        o.begin[j.substring(0, j.length - 1)] = transObjects[i][j];
      }
      if (j.substring(j.length - 1) == nextWm) {
        o.end[j.substring(0, j.length - 1)] = transObjects[i][j];
      }
    }
    
    for (var j in o.begin) {
      if (o.end[j] == null) {
        delete o.begin[j];
      } else {
        keep = true;
      }
    }
    for (var j in o.end) {
      if (o.begin[j] == null) {
        delete o.end[j];
      } else {
        keep = true;
      }
    }
    
    if (keep == true) {
      o.obj = transObjects[i];
      animatorA.objects.push(o);
    }
  }
  
  animator.start(animatorA);
}


function endTransition()
{
  wm = nextWm;
  nextWm = nextNextWm;
  
  query.editable = true;
  
  switch (wm) {
    case wmCompact:
    case wmWide:
      query.select(-1, -1);
      break;
    case wmOpen:
      extenderCowl.opacity = 255;
      defContent.opacity = 255;
      if (state & stateLoading) {
        defContent.setHtml("<html><font size='20'>Loading...</font></html>");
      }
      break;
  }
  
  if (wm == nextWm) {
    state = state & ~stateTrans;
  } else {
    startTransition();
  }
}





function limit(x, min, max)
{
  if (x <= min)
    return min;
  else if (x >= max)
    return max;
  else
    return x;
}


function TransitionAnimationUpdate()
{
  var now = animator.milliseconds;
  var t = limit(now - this.startTime, 0, this.duration);
  var percent = t / this.duration;
  
  if (animator.milliseconds >= (this.startTime + this.duration)) {
    for (var i in this.objects) {
      for (var j in this.objects[i].end) {
        this.objects[i].obj[j] = this.objects[i].end[j];
      }
    }
    return false;
  } else {
    for (var i in this.objects) {
      for (var j in this.objects[i].end) {
        this.objects[i].obj[j] = animator.ease(this.objects[i].begin[j], this.objects[i].end[j], percent, this.easeType);
      }
    }
    return true;
  }
}




function onWillChangePreferences()
{
  
}


function onPreferencesChanged()
{
  if (preferences.revertToDefaults.value == true) {
    preferences.books.value = preferences.books.defaultValue;
    preferences.selectedBook.value = preferences.selectedBook.defaultValue;
    preferences.revertToDefaults.value = false;
  }
  
  buildBooksArray();
  buildDropdownMenu();
}


function copy_onSelect()
{
  system.clipboard = defContent.plainText;
}


initialize();

