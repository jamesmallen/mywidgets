/**
 * Word.js
 * Word object for use in Poetry Widget.
 * All code copyright James M. Allen
 */


function Word()
{
  this.id = Word.ids.length;
  Word.ids.push(this);
  
  this.zOrder = Word.zArr.length + Word.baseZOrder;
  Word.zArr.push(this.id);
  
  this.hOffset = 0;
  this.vOffset = 0;
  this.hPadding = 5
  this.vPadding = 2;
  
  this.width = this.hPadding + this.hPadding;
  this.height = this.vPadding + this.vPadding;
  
  this.kmgBg = new KImage();
  this.kmgBg.src = "Resources/Word*.png";
  this.kmgBg.onMouseDown = "Word.ids[" + this.id + "].kmgBg_onMouseDown()";
  this.kmgBg.onMouseMove = "Word.ids[" + this.id + "].kmgBg_onMouseMove()";
  this.kmgBg.onMouseUp = "Word.ids[" + this.id + "].kmgBg_onMouseUp()";
  
  this.kmgBg.zOrder = this.zOrder;
  
  this.txt = new Text();
  this.txt.hAlign = "center";
  this.txt.zOrder = this.zOrder;
  
  this.frame = new Frame();
  this.frame.addSubview(this.kmgBg.frame);
  this.frame.addSubview(this.txt);
}

// Static Properties

Word.ids = new Array();
Word.zArr = new Array();
Word.baseZOrder = 0;

// Static Methods

Word.refresh = function()
{
  for (var i in Word.ids) {
    Word.ids[i].align();
  }
}

Word.clearAll = function()
{
  for (var i in Word.ids) {
    Word.ids[i].clear();
  }
}

Word.reZOrder = function()
{
  for (var i = 0; i < Word.zArr.length; i++) {
    Word.ids[Word.zArr[i]].set("zOrder", i + Word.baseZOrder);
  }
}

Word.serialize = function()
{
  var arrInternal = new Array();
  for (var i in Word.zArr) {
    var arrI = new Array();
    arrI[0] = escape(Word.ids[Word.zArr[i]].txt.data);
    arrI[1] = Word.ids[Word.zArr[i]].hOffset;
    arrI[2] = Word.ids[Word.zArr[i]].vOffset;
    arrInternal.push(arrI.join(","));
  }
  return arrInternal;
}

Word.savePackage = function()
{
  var strFilename;
  var keepTrying = true;
  var tryName = "";
  
  while (keepTrying) {
    var arrFormFields = new Array();
    var ff = new FormField();
    ff.title = "Package name:";
    ff.type = "text";
    ff.value = tryName;
    arrFormFields.push(ff);
    
    var result = form(arrFormFields, "Save package", "Save", "Cancel");
    
    if (!result) {
      return;
    }
    
    tryName = result[0];
    
    var strFilename = system.widgetDataFolder + "/Packages/" + escapeFilename(tryName) + ".txt";
    
    if (filesystem.itemExists(strFilename)) {
      var result = alert("A package with that name already exists. Overwrite?", "Yes", "No", "Cancel");
      switch (result) {
        case 1:
          keepTrying = false;
          break;
        case 2:
          keepTrying = true;
          break;
        case 3:
          return;
          break;
      }
    } else {
      keepTrying = false;
    }
  }
  
  var arrInternal = new Array();
  for (var i in Word.ids) {
    arrInternal.push(Word.ids[i].txt.data);
  }
  
  filesytem.writeFile(strFilename, arrInternal);
}




Word.unserialize = function(arrInternal)
{
  for (var i in arrInternal) {
    var wrd = new Word();
    // arrWords.push(wrd);
    var arrI = arrInternal[i].split(",");
    wrd.set("window", main);
    wrd.set("data", unescape(arrI[0]));
    // wrd.align();
    wrd.set("hOffset", parseInt(arrI[1]));
    wrd.set("vOffset", parseInt(arrI[2]));
    // wrd.align();
  }
  
  Word.fitOnPage();
}

Word.fitOnPage = function()
{
  // for (var i in arrWords) {
  for (var i in Word.ids) {
    Word.ids[i].keepOn();
  }
}


Word.prototype.clear = function(cheap)
{
  if (typeof(cheap) == "undefined") {
    cheap = false;
  }
  
  this.kmgBg.removeFromSuperview();
  this.kmgBg = null;
  this.txt.removeFromSuperview();
  this.txt = null;
  
  Word.ids[this.id] = null;
  delete Word.ids[this.id];
  Word.zArr.splice(this.zOrder - Word.baseZOrder, 1);
  
  if (!cheap) {
    Word.reZOrder();
  }
}

Word.prototype.kmgBg_onMouseDown = function()
{
  this.dragStart = new Object();
  this.dragStart.x = this.hOffset - system.event.hOffset;
  this.dragStart.y = this.vOffset - system.event.vOffset;
  
  // resplice zArr
  Word.zArr.splice(this.zOrder - Word.baseZOrder, 1);
  Word.zArr.push(this.id);
  
  Word.reZOrder();
}

Word.prototype.kmgBg_onMouseUp = function()
{
  this.dragStart = null;
  
  if (((this.hOffset + this.width) < 0) || ((this.vOffset + this.height) < 0) || (this.hOffset > main.width) || (this.vOffset > main.height)) {
    // off the edges - destroy this word!
    var i;
    // for (i = 0; i < arrWords.length; i++) {
    for (i in Word.ids) {    
      // if (arrWords[i] == this) {
      if (Word.ids[i] == this) {
        // arrWords.splice(i, 1);
        Word.ids.splice(i, 1);
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

Word.prototype.kmgBg_onMouseMove = function()
{
  if (!this.dragStart) {
    this.kmgBg_onMouseDown();
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
      this.txt.data = value;
      // Call align manually after all changes are done per update cycle
      // this.align();
      break;
    case "hOffset":
    case "vOffset":
    case "window":
    case "zOrder":
      this[property] = value;
      this.frame[property] = value;
      // this[property] = value;
      // Call align manually after all changes are done per update cycle
      // this.align();
      break;
  }
}


Word.prototype.align = function(boolCheap)
{
  if (typeof(boolCheap) == "undefined") {
    boolCheap = false;
  }
  
  
  this.kmgBg.hOffset = 0;
  this.kmgBg.vOffset = 0;
  
  
  if (!boolCheap) {
    this.txt.style = "";
    this.txt.color = preferences.wordColor.value;
    this.txt.font = preferences.wordFont.value;
    this.txt.size = preferences.wordSize.value;
    this.txt.width = -1;
    this.txt.height = -1;
    this.width = this.txt.width + this.hPadding + this.hPadding;
    this.height = this.txt.height + this.vPadding + this.vPadding;
    this.kmgBg.colorize = preferences.wordBgColor.value;
    this.kmgBg.width = this.width;
    this.kmgBg.height = this.height;
		
    this.frame.opacity = parseInt(preferences.wordBgOpacity.value);
  }
  
  this.txt.hOffset = this.width / 2;
  if (this.txt.hOffset == -1) {
    this.txt.hOffset = 0;
  }
  this.txt.vOffset = (this.txt.height * 0.8) + parseFloat(preferences.wordVTweak.value);
  
}

function zArrDump()
{
  for (var i in Word.zArr) {
    print("zArr[" + i + "]: " + ((!Word.ids[Word.zArr[i]].txt) ? "undef" : Word.ids[Word.zArr[i]].txt.data));
  }
}

function idDump()
{
  for (var i in Word.ids) {
    print("ids[" + i + "]: " + (typeof(Word.ids[i].txt) != "object" ? "undef" : Word.ids[i].txt.data));
  }
}