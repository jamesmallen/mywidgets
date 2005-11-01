/**
 * Word.js
 */



 

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
    this.set("hOffset", this.width / -2);
    this.align();
  }
  
  // off the top
  if ((this.vOffset + this.height / 2) < 0) {
    this.set("vOffset", this.height / -2);
    this.align();
  }
  
  // off the right side
  if ((this.hOffset + this.width / 2) > main.width) {
    this.set("hOffset", main.width - this.width / 2);
    this.align();
  }
  
  // off the bottom
  if ((this.vOffset + this.height / 2) > main.height) {
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