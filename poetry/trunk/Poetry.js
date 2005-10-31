include("JamesMAllen.js");

Konform = new Object();
Konform.ids = new Array();

generic_mouseOver = null;

include("KonformImage.js");

function main_onLoad()
{
  
  var arrContextMenu = new Array();
  arrContextMenu[0] = new MenuItem();
  arrContextMenu[0].title = "About the Author";
  arrContextMenu[0].onSelect = "AboutTheAuthor();";
  arrContextMenu[1] = new MenuItem();
  arrContextMenu[1].title = "Make a Donation";
  arrContextMenu[1].onSelect = "Donate();";
  main.contextMenuItems = arrContextMenu;
  
  kimBackground = new KonformImage();
  kimBackground.set("window", main);
  kimBackground.set("images", "Resources/Background*.png");
  kimBackground.set("hOffset", 0);
  kimBackground.set("vOffset", 0);
  
  kimDivider = new KonformImage();
  kimDivider.set("window", main);
  kimDivider.set("images", "Resources/Divider<.png");
  kimDivider.set("hOffset", 25);
  kimDivider.set("onMouseDown", "kimDivider_onMouseDown()");
  kimDivider.set("onMouseMove", "kimDivider_onMouseMove()");
  kimDivider.set("onMouseUp", "kimDivider_onMouseUp()");
  kimDivider.set("opacity", 0);
  
  intDividerPosition = 0;
  
  anmBackground = null;
  anmDivider = null;
  anmButtons = null;
  
  objDividerGrab = null;
  
  imgTrashButton = new Image();
  imgTrashButton.window = main;
  imgTrashButton.src = "Resources/TrashButton.png";
  imgTrashButton.opacity = 0;
  imgTrashButton.onMouseEnter = "generic_onMouseEnter('imgTrashButton'); imgTrashButton.opacity = 255;";
  imgTrashButton.onMouseExit = "generic_onMouseExit('imgTrashButton'); imgTrashButton.opacity = 127;";
  imgTrashButton.onMouseUp = "generic_onMouseUp('imgTrashButton')";
  imgTrashButton.vAlign = "bottom";
  
  imgAddButton = new Image();
  imgAddButton.window = main;
  imgAddButton.src = "Resources/AddButton.png";
  imgAddButton.opacity = 0;
  imgAddButton.onMouseEnter = "generic_onMouseEnter('imgAddButton'); imgAddButton.opacity = 255;";
  imgAddButton.onMouseExit = "generic_onMouseExit('imgAddButton'); imgAddButton.opacity = 127;";
  imgAddButton.onMouseUp = "generic_onMouseUp('imgAddButton')";
  imgAddButton.hAlign = "right";
  imgAddButton.vAlign = "bottom";
  
  arrWords = new Array();
  
  rzr = new Resizer();
  rzr.img.window = main;
  rzr.onResize = resize;
  rzr.saveWidth = "preferences.width.value";
  rzr.saveHeight = "preferences.height.value";
  
  if (preferences.width.value == "-1" || preferences.height.value == "-1") {
    autoPosition("center");
  } else {
    resize(parseInt(preferences.width.value), parseInt(preferences.height.value));
  }
  
  
  var imgDummy = new Image();
  Word.baseZOrder = imgDummy.zOrder;
  imgDummy = null;
  
  Word.unserialize();
  
  onPreferencesChanged();
  
}

function generic_onMouseEnter(img)
{
  generic_mouseOver = img;
}

function generic_onMouseExit(img)
{
  if (generic_mouseOver == img) {
    generic_mouseOver = null;
  }
}

function generic_onMouseUp(img)
{
  if (generic_mouseOver == img) {
    eval(img + "_onMouseUp()");
  }
}

function imgTrashButton_onMouseUp()
{
  clearTrash();
}

function imgAddButton_onMouseUp()
{
  // popupAddWords();
  var w = new Word();
  arrWords.push(w);
  w.set("data", "foo " + arrWords.length);
  w.align();
}


function clearTrash()
{
  
  
}

function popupAddWords()
{
  
  
}



function kimDivider_onMouseDown()
{
  objDividerGrab = new Object();
  objDividerGrab.x = kimDivider.hOffset - system.event.hOffset;
  objDividerGrab.y = kimDivider.vOffset - system.event.vOffset;
}

function kimDivider_onMouseMove()
{
  if (!objDividerGrab) {
    kimDivider_onMouseDown();
  }
  
  var intNewVOffset = objDividerGrab.y + system.event.vOffset;
  var intNewHeight = kimBackground.height - intNewVOffset;
  
  if (intNewVOffset != kimDivider.vOffset) {
    resizeDivider(intNewHeight);
  }
}

function kimDivider_onMouseUp()
{
  var intNewVOffset = objDividerGrab.y + system.event.vOffset;
  var intNewHeight = kimBackground.height - intNewVOffset;
  resizeDivider(intNewHeight, true);
  
  objDividerGrab = null;
}






function autoPosition(spot)
{
  if (typeof(spot) == "undefined") {
    var spot = "";
  }
  
  switch (spot) {
    case "center":
      preferences.width.value = screen.availWidth / 2;
      preferences.height.value = screen.availHeight / 2;
      main.hOffset = screen.availLeft + screen.availWidth / 4;
      main.vOffset = screen.availTop + screen.availHeight / 4;
      break;
    case "tallcenter":
    default:
      preferences.width.value = screen.availWidth / 2;
      preferences.height.value = screen.availHeight;
      main.hOffset = screen.availLeft + screen.availWidth / 4;
      main.vOffset = screen.availTop;
      break;
  }
  
}


function resize(intWidth, intHeight, optimize)
{
  if (typeof(intWidth) != "number") {
    intWidth = parseInt(preferences.width.value);
  }
  if (typeof(intHeight) != "number") {
    intHeight = parseInt(preferences.height.value);
  }
  
  intWidth = Math.max(150, intWidth);
  intHeight = Math.max(150, intHeight);
  
  if (intWidth != main.width) {
    kimBackground.set("width", intWidth);
    kimDivider.set("width", intWidth - 50);
    rzr.img.hOffset = intWidth;
    imgAddButton.hOffset = intWidth;
  }
  if (intHeight != main.height) {
    kimBackground.set("height", intHeight);
    resizeDivider();
    rzr.img.vOffset = intHeight;
    
    imgTrashButton.vOffset = intHeight;
    imgAddButton.vOffset = intHeight;
  }
  
  if (optimize) {
    // optimized resizing - pre-empt big resizes
    // (these should be cleaned up when resizing is done)
    if (intWidth > main.width) {
      main.width = intWidth * 1.25;
    }
    if (intHeight > main.height) {
      main.height = intHeight * 1.25;
    }
  } else {
    main.width = intWidth;
    main.height = intHeight;
  }
  
}

function resizeDivider(intHeight, save) {
  if (typeof(intHeight) != "number") {
    intHeight = parseInt(preferences.dividerHeight.value);
  }
  if (typeof(save) == "undefined") {
    save = false;
  }
  
  intHeight = Math.max(intHeight, 50);
  intHeight = Math.min(intHeight, kimBackground.height - 50);
  
  var intVOffset = kimBackground.height - intHeight;
  
  kimDivider.set("vOffset", intVOffset);
  
  if (save) {
    preferences.dividerHeight.value = intHeight;
  }
  
}



function onPreferencesChanged()
{
  kimBackground.set("opacity", parseInt(preferences.bgOpacity.value));
  kimBackground.set("colorize", preferences.bgColor.value);
  
  for (var i in arrWords) {
    arrWords[i].align();
  }
  
  // I don't think we need to resize here
  // resize();
}


function main_onFirstDisplay()
{
  
}


function main_onGainFocus()
{
  var intFadeInTime = 500;
  var intFadeStyle = animator.kEaseInOut;
  
  rzr.img.opacity = 255;
  
  if (anmBackground instanceof CustomAnimation) {
    anmBackground.kill();
    anmBackground = null;
  }
  anmBackground = new KonformFadeAnimation(kimBackground, Math.min(255, parseInt(preferences.bgOpacity.value) + 63), intFadeInTime, intFadeStyle);
  
  if (anmDivider instanceof CustomAnimation) {
    anmDivider.kill();
    anmDivider = null;
  }
  anmDivider = new KonformFadeAnimation(kimDivider, 255, intFadeInTime, intFadeStyle);
  
  if (anmButtons instanceof Array) {
    for (var i in anmButtons) {
      anmButtons[i].kill();
      anmButtons[i] = null;
    }
  }
  anmButtons = new Array();
  anmButtons.push(new FadeAnimation(imgAddButton, 127, intFadeInTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgTrashButton, 127, intFadeInTime, intFadeStyle));
  
  animator.start(anmBackground);
  animator.start(anmDivider);
  animator.start(anmButtons);
}

function main_onLoseFocus()
{
  var intFadeOutTime = 500;
  var intFadeStyle = animator.kEaseOut;
  
  rzr.img.opacity = 0;
  
  if (anmBackground instanceof CustomAnimation) {
    anmBackground.kill();
    anmBackground = null;
  }
  anmBackground = new KonformFadeAnimation(kimBackground, parseInt(preferences.bgOpacity.value), intFadeOutTime, intFadeStyle);
  
  if (anmDivider instanceof CustomAnimation) {
    anmDivider.kill();
    anmDivider = null;
  }
  anmDivider = new KonformFadeAnimation(kimDivider, 0, intFadeOutTime, intFadeStyle);
  
  if (anmButtons instanceof Array) {
    for (var i in anmButtons) {
      anmButtons[i].kill();
      anmButtons[i] = null;
    }
  }
  anmButtons = new Array();
  anmButtons.push(new FadeAnimation(imgAddButton, 0, intFadeOutTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgTrashButton, 0, intFadeOutTime, intFadeStyle));
  
  animator.start(anmBackground);
  animator.start(anmDivider);
  animator.start(anmButtons);
}


function Word()
{
  this.id = Word.ids.length;
  Word.ids.push(this);
  
  this.kim = new KonformImage();
  this.kim.set("images", "Resources/Word*.png");
  
  this.hOffset = 0;
  this.vOffset = 0;
  
  this.txt = new Text();
  
  this.applyPreferences();
}

Word.ids = new Array();


Word.prototype.align = function(quick)
{
  if (typeof(quick) == "undefined") {
    var quick = false;
  }
  
  this.kim.set("hOffset", this.hOffset);
  this.kim.set("vOffset", this.vOffset);
  
  if (!quick) {
    this.kim.set("width", this.txt.width + 18);
    this.kim.set("height", this.txt.height + 18);
  }
  
  this.txt.hOffset = this.hOffset + 9;
  this.txt.vOffset = this.vOffset + this.txt.height - 9 + parseInt(preferences.wordVTweak.value);
  
}


Word.prototype.applyPreferences = function()
{
  this.kim.set("colorize", preference.wordBgColor.value);
  this.txt.color = preferences.wordColor.value;
  this.txt.font = preferences.wordFont.value;
  this.txt.size = parseInt(preferences.wordSize.value);
  
  this.align();
}




function Resizer()
{
  this.id = Resizer.ids.length;
  Resizer.ids.push(this);
  
  this.img = new Image();
  this.img.src = "Resources/Resizer.png";
  this.img.hAlign = "right";
  this.img.vAlign = "bottom";
  this.img.opacity = 0;
  this.img.tracking = "rectangle";
  this.img.onMouseDown = "Resizer.ids[" + this.id + "].img_onMouseDown()";
  this.img.onMouseUp = "Resizer.ids[" + this.id + "].img_onMouseUp()";
  this.img.onMouseMove = "Resizer.ids[" + this.id + "].img_onMouseMove()";
  
  this.onResize = null;
  this.dragStart = null;
  this.saveWidth = null;
  this.saveHeight = null;
}

Resizer.ids = new Array();

Resizer.prototype.img_onMouseDown = function()
{
  this.dragStart = new Object();
  this.dragStart.x = this.img.hOffset - system.event.hOffset;
  this.dragStart.y = this.img.vOffset - system.event.vOffset;
}

Resizer.prototype.img_onMouseUp = function()
{
  this.dragStart = null;
  
  if (this.saveWidth) {
    eval(this.saveWidth + " = " + this.img.hOffset);
  }
  
  if (this.saveHeight) {
    eval(this.saveHeight + " = " + this.img.vOffset);
  }
  
  if (this.onResize) {
    this.onResize();
  }
  
  Word.fitOnPage();
}

Resizer.prototype.img_onMouseMove = function()
{
  if (!this.dragStart) {
    this.img_onMouseDown();
  }
  
  var intNewWidth = this.dragStart.x + system.event.hOffset;
  var intNewHeight = this.dragStart.y + system.event.vOffset;
  
  if (this.onResize) {
    this.onResize(intNewWidth, intNewHeight, true);
  }
  
}


function Word()
{
  this.id = Word.ids.length;
  Word.ids.push(this);
  
  this.zOrder = Word.zArr.length + Word.baseZOrder;
  Word.zArr.push(this);
  
  this.hOffset = 0;
  this.vOffset = 0;
  this.hPadding = 5
  this.vPadding = 2;
  
  this.width = this.hPadding + this.hPadding;
  this.height = this.vPadding + this.vPadding;
  
  this.kimBg = new KonformImage();
  this.kimBg.set("images", "Resources/Word*.png");
  this.kimBg.set("onMouseDown", "Word.ids[" + this.id + "].kimBg_onMouseDown()");
  this.kimBg.set("onMouseMove", "Word.ids[" + this.id + "].kimBg_onMouseMove()");
  this.kimBg.set("onMouseUp", "Word.ids[" + this.id + "].kimBg_onMouseUp()");
  
  this.kimBg.set("zOrder", this.zOrder);
  
  this.txt = new Text();
  this.txt.hAlign = "center";
  this.txt.zOrder = this.zOrder;
}

Word.ids = new Array();
Word.zArr = new Array();
Word.baseZOrder = 0;

Word.reZOrder = function()
{
  for (var i = 0; i < Word.zArr.length; i++) {
    Word.zArr[i].set("zOrder", parseInt(i) + Word.baseZOrder);
  }
}

Word.serialize = function()
{
  var arrInternal = new Array();
  for (var i in Word.zArr) {
    var arrI = new Array();
    arrI[0] = escape(Word.zArr[i].txt.data);
    arrI[1] = Word.zArr[i].hOffset;
    arrI[2] = Word.zArr[i].vOffset;
    arrInternal.push(arrI.join(","));
  }
  preferences.wordPositions.value = arrInternal.join("|");
}

Word.unserialize = function()
{
  for (var i in arrWords) {
    arrWords[i].clear();
  }
  
  arrWords = new Array();
  
  var arrInternal = preferences.wordPositions.value.split("|");
  for (var i in arrInternal) {
    var wrd = new Word();
    arrWords.push(wrd);
    var arrI = arrInternal[i].split(",");
    wrd.set("window", main);
    wrd.set("data", unescape(arrI[0]));
    wrd.align();
    wrd.set("hOffset", parseInt(arrI[1]));
    wrd.set("vOffset", parseInt(arrI[2]));
    wrd.align();
  }
  
  Word.fitOnPage();
}

Word.fitOnPage = function()
{
  for (var i in arrWords) {
    arrWords[i].keepOn();
  }
}


Word.prototype.clear = function(cheap)
{
  if (typeof(cheap) == "undefined") {
    cheap = false;
  }
  
  this.kimBg.clear();
  this.kimBg = null;
  this.txt = null;
  
  // Word.ids.splice(this.id, 1);
  Word.ids[this.id] = null;
  Word.zArr.splice(this.zOrder - Word.baseZOrder, 1);
  
  if (!cheap) {
    Word.reZOrder();
  }
}

Word.prototype.kimBg_onMouseDown = function()
{
  this.dragStart = new Object();
  this.dragStart.x = this.kimBg.hOffset - system.event.hOffset;
  this.dragStart.y = this.kimBg.vOffset - system.event.vOffset;
  
  // resplice zArr
  Word.zArr.splice(this.zOrder - Word.baseZOrder, 1);
  Word.zArr.push(this);
  
  Word.reZOrder();
}

Word.prototype.kimBg_onMouseUp = function()
{
  this.dragStart = null;
  
  if (((this.hOffset + this.width) < 0) || ((this.vOffset + this.height) < 0) || (this.hOffset > main.width) || (this.vOffset > main.height)) {
    // off the edges - destroy this word!
    var i;
    for (i = 0; i < arrWords.length; i++) {
      if (arrWords[i] == this) {
        print("destroying index " + i);
        arrWords.splice(i, 1);
        break;
      }
    }
    this.clear();
  } else {
    this.keepOn();
  }
  
  Word.serialize();
  savePreferences();
}

Word.prototype.kimBg_onMouseMove = function()
{
  if (!this.dragStart) {
    this.kimBg_onMouseDown();
  }
  
  var intNewHOffset = this.dragStart.x + system.event.hOffset;
  var intNewVOffset = this.dragStart.y + system.event.vOffset;
  
  this.set("hOffset", intNewHOffset);
  this.set("vOffset", intNewVOffset);
  
  this.align(true);
}


Word.prototype.keepOn = function()
{
  // off the left side
  if ((this.hOffset + this.width / 2) < 0) {
    print("left");
    this.set("hOffset", this.width / -2);
    this.align();
  }
  
  // off the top
  if ((this.vOffset + this.height / 2) < 0) {
    print("top");
    this.set("vOffset", this.height / -2);
    this.align();
  }
  
  // off the right side
  if ((this.hOffset + this.width / 2) > main.width) {
    print("right");
    this.set("hOffset", main.width - this.width / 2);
    this.align();
  }
  
  // off the bottom
  if ((this.vOffset + this.height / 2) > main.height) {
    print("bottom");
    this.set("vOffset", main.height - this.height / 2);
    this.align();
  }
}


Word.prototype.set = function(property, value)
{
  switch (property) {
    case "data":
      this.txt[property] = value;
      // Call align manually after all changes are done per update cycle
      // this.align();
      break;
    case "hOffset":
    case "vOffset":
      this[property] = value;
      // Call align manually after all changes are done per update cycle
      // this.align();
      break;
    case "window":
      this.kimBg.set(property, value);
      this.txt[property] = value;
      break;
    case "zOrder":
      this.zOrder = value;
      this.kimBg.set("zOrder", this.zOrder);
      this.txt.zOrder = this.zOrder;
      break;
  }
}


Word.prototype.align = function(boolCheap)
{
  if (typeof(boolCheap) == "undefined") {
    boolCheap = false;
  }
  
  this.kimBg.set("hOffset", this.hOffset);
  this.kimBg.set("vOffset", this.vOffset);
  
  if (!boolCheap) {
    this.txt.style = "";
    this.txt.color = preferences.wordColor.value;
    this.txt.font = preferences.wordFont.value;
    this.txt.size = preferences.wordSize.value;
    this.txt.width = -1;
    this.txt.height = -1;
    this.width = this.txt.width + this.hPadding + this.hPadding;
    this.height = this.txt.height + this.vPadding + this.vPadding;
    this.kimBg.set("opacity", parseInt(preferences.wordBgOpacity.value));
    this.kimBg.set("colorize", preferences.wordBgColor.value);
    this.kimBg.set("width", this.width);
    this.kimBg.set("height", this.height);
  }
  
  this.txt.hOffset = this.hOffset + this.width / 2;
  if (this.txt.hOffset == -1) {
    this.txt.hOffset = 0;
  }
  this.txt.vOffset = this.vOffset + (this.txt.height * 0.8) + parseFloat(preferences.wordVTweak.value);
  
}

function zArrDump()
{
  for (var i in Word.zArr) {
    print("zArr[" + i + "]: " + ((!Word.zArr[i].txt) ? "undef" : Word.zArr[i].txt.data));
  }
}

function idDump()
{
  for (var i in Word.ids) {
    print("ids[" + i + "]: " + (typeof(Word.ids[i].txt) != "object" ? "undef" : Word.ids[i].txt.data));
  }
}

function pdump(obj)
{
  print("PDUMP");
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}




main_onLoad();
