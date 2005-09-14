
const animDuration = 300;

const buttonsInnie    = 0x00;
const buttonsOuttie   = 0x01;

const stateTrans      = 0x01;

var state;

var buttonState;
var nextButtonState;
var nextNextButtonState;

var dueList;

var pillArray;
var addButton;
var addButtonBg;

var update

var curDay;
var updateTimer;


function initialize()
{
  state = 0;
  
  buttonState = 0;
  nextButtonState = 0;
  nextNextButtonState = 0;
  
  dueList = new Array();
  pillArray = new Array()
  
  addButtonBg = new Image();
  addButtonBg.src = "Resources/AddButtonBg.png";
  addButtonBg.opacity = 0;
  addButtonBg.alignment = "right";
  addButtonBg.onMouseUp = "editItem(-1)";
  addButtonBg.contextMenuItems = buildContextMenu(-1);
  
  addButton = new Image();
  addButton.src = "Resources/AddButtonTop.png";
  addButton.opacity = 0;
  addButton.alignment = "right";
  
  curDay = getCurrentMonthDay();
  updateTimer = new Timer();
  updateTimer.onTimerFired = "updateNextDay()";
  updateTimer.interval = "5.0";
  updateTimer.ticking = true;
  
}

function updateNextDay()
{
  if (curDay != getCurrentMonthDay()) {
    curDay = getCurrentMonthDay();
    // onLoseFocus();
    // sleep(animDuration);
    onPreferencesChanged();
  }
}


function getCurrentMonthDay()
{
  var d = new Date();
  return pad(d.getMonth() + 1, 2, 0, "left") + pad(d.getDate(), 2, 0, "left");
}

function debugShallow(el)
{
  log("### BEGIN debugShallow() ###");
  for (e in el) {
    if (typeof(el[e]) != "function") {
      log("[" + e + "]:" + el[e]);
    }
  }
  log("### END debugShallow() ###");
}

function debugElement(el, elStr, d)
{
  if (elStr == undefined)
    elStr = "";
  if (d == undefined)
    d = 0;
  if (d == 0)
    log("### BEGIN debugElement() ###");
  log(elStr + "[" + (typeof el) + "]=" + el);
  for (e in el) {
    if (String(typeof el[e]).toLowerCase() == "object" &&
        el[e] != el)
      debugElement(el[e], elStr + "." + e, d + 1);
    else
      log(elStr + "." + e + "[" + (typeof el[e]) + "]=" + el[e]);
  }
  if (d==0)
    log("### END debugElement() ###");
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

function moveAddButton()
{
  var scale = pillArray[0].height / 27;
  addButtonBg.width = scale * addButtonBg.srcWidth;
  addButtonBg.height = scale * addButtonBg.srcHeight;
  addButton.width = scale * addButton.srcWidth;
  addButton.height = scale * addButton.srcHeight;

  addButtonBg.hOffset = main.width;
  addButtonBg.vOffset = main.height - addButton.height;
  addButton.hOffset = main.width;
  addButton.vOffset = main.height - addButton.height;
}


function onGainFocus()
{
  if (preferences.dueListPref.value.length > 0) {
    showButtons(true);
  }
  
  moveAddButton();
  var anim1 = new FadeAnimation(addButtonBg, parseInt(preferences.bgOpacity.value), animDuration * 2, animator.kEaseInOut);
  var anim2 = new FadeAnimation(addButton, 255, animDuration * 2, animator.kEaseInOut);
  animator.start(anim1);
  animator.start(anim2);
}

function onLoseFocus()
{
  if (preferences.dueListPref.value.length > 0) {
    showButtons(false);
  }
  
  var anim1 = new FadeAnimation(addButtonBg, 0, animDuration * 2, animator.kEaseInOut);
  var anim2 = new FadeAnimation(addButton, 0, animDuration * 2, animator.kEaseInOut);
  animator.start(anim1);
  animator.start(anim2);
}




function showButtons(b)
{
  if (state & stateTrans) {
    if (b == true) {
      nextNextButtonState = buttonsOuttie;
    } else {
      nextNextButtonState = buttonsInnie;
    }
    return;
  } else {
    if (b == true) {
      nextNextButtonState = buttonsOuttie;
      nextButtonState = buttonsOuttie;
    } else {
      nextNextButtonState = buttonsInnie;
      nextButtonState = buttonsInnie;
    }
    transition();
  }
}

function transition()
{
  if (buttonState == nextButtonState) {
    return;
  }
  state = state | stateTrans;
  if (nextButtonState == buttonsOuttie) {
    var a = new CustomAnimation(1, slide, startFadeIn);
    a.startWidth = 0;
    a.endWidth = pillArray[0].modifyButton.width + pillArray[0].deleteButton.width + (pillArray[0].modifyButton.width * 0.25);
    a.duration = animDuration;
    
    main.width = pillArray[0].width + a.endWidth;
    animator.start(a);
  } else {
    for (var i in pillArray) {
      pillArray[i].showButtons = false;
    }
    // fade out and slide in
    // buttonsShowing = false;
    var a = new CustomAnimation(1, fadeButtons, startSlideIn);
    a.startOpacity = 255;
    a.endOpacity = 0;
    a.duration = animDuration;
    animator.start(a);
  }
  
}


function slide()
{
  var now = animator.milliseconds;
  var t = limit(now - this.startTime, 0, this.duration);
  var percent = t / this.duration;
  
  var newWidth;
  var ret;
  
  if (percent >= 1.0) {
    newWidth = this.endWidth;
    ret = false;
  } else {
    newWidth = animator.ease(this.startWidth, this.endWidth, percent, animator.kEaseInOut);
    ret = true;
  }
  
  for (var i in pillArray) {
    pillArray[i].setExtWidth(newWidth);
  }
  
  return ret;
}


function fadeButtons()
{
  var now = animator.milliseconds;
  var t = limit(now - this.startTime, 0, this.duration);
  var percent = t / this.duration;
  
  var newOpacity;
  var ret;
  
  if (percent >= 1.0) {
    newOpacity = this.endOpacity;
    ret = false;
  } else {
    newOpacity = animator.ease(this.startOpacity, this.endOpacity, percent, animator.kEaseInOut);
    ret = true;
  }
  
  for (var i in pillArray) {
    pillArray[i].modifyButton.opacity = newOpacity;
    pillArray[i].deleteButton.opacity = newOpacity;
  }
  
  return ret;
}


function startFadeIn()
{
  for (var i in pillArray) {
    pillArray[i].showButtons = true;
    pillArray[i].alignLayers();
    pillArray[i].resizeText();
  }
  
  var a = new CustomAnimation(1, fadeButtons, doneShowButtons);
  a.startOpacity = 0;
  a.endOpacity = 255;
  a.duration = animDuration;
  animator.start(a);
}

function startSlideIn()
{
  var a = new CustomAnimation(1, slide, doneShowButtons);
  a.startWidth = pillArray[0].modifyButton.width + pillArray[0].deleteButton.width + (pillArray[0].modifyButton.width * 0.25);
  a.endWidth = 0;
  a.duration = animDuration;
  animator.start(a);
}

function doneShowButtons()
{
  if (buttonState == buttonsInnie) {
    for (var i in pillArray) {
      pillArray[i].resizeText();
    }
  }
  main.width = pillArray[0].width + pillArray[0].extWidth;
  
  buttonState = nextButtonState;
  if (nextNextButtonState != nextButtonState) {
    nextButtonState = nextNextButtonState;
    transition();
  } else {
    state = state & ~stateTrans;
  }
}











Pill.prototype.setBgOpacity = function(o)
{
  this.backgroundLeft.opacity = o;
  this.backgroundMiddle.opacity = o;
  this.backgroundRight.opacity = o;
}


Pill.prototype.setOpacity = function(o)
{
  this.hiliteLeft.opacity = o;
  this.hiliteMiddle.opacity = o;
  this.hiliteRight.opacity = o;
  this.text.opacity = o;
  this.textShadow.opacity = o;
  this.date.opacity = o;
  this.dateShadow.opacity = o;
  if (this.showButtons) {
    this.modifyButton.opacity = o;
    this.deleteButton.opacity = o;
  }
}

Pill.prototype.setHOffset = function(x)
{
  for (o in this) {
    if (typeof(this[o]) == "object" && typeof(this[o].hOffset) != "undefined") {
      this[o].hOffset += (x - this.hOffset);
    }
  }
  
  this.hOffset = x;
}

Pill.prototype.setVOffset = function(y)
{
  for (o in this) {
    if (typeof(this[o]) == "object" && typeof(this[o].vOffset) != "undefined") {
      this[o].vOffset += (y - this.vOffset);
    }
  }
  
  this.vOffset = y;
}

Pill.prototype.setExtWidth = function(x)
{
  this.extWidth = x;
  this.setWidth(this.width, true);
}

Pill.prototype.setWidth = function(x, holdStill)
{
  if (x < this.backgroundLeft.srcWidth + this.backgroundRight.srcWidth) {
    this.backgroundLeft.width = x/2;
    this.backgroundRight.width = x - this.backgroundLeft.width;
    this.backgroundMiddle.width = 0;
    this.backgroundMiddle.hOffset = this.backgroundLeft.width;
    this.backgroundRight.hOffset = this.backgroundLeft.hOffset + this.backgroundLeft.width;
  } else {
    this.backgroundLeft.width = this.backgroundLeft.srcWidth;
    this.backgroundRight.width = this.backgroundRight.srcWidth;
    this.backgroundMiddle.width = x + this.extWidth - this.backgroundLeft.width - this.backgroundRight.width;
    this.backgroundMiddle.hOffset = this.backgroundLeft.width;
    this.backgroundRight.hOffset = this.backgroundMiddle.hOffset + this.backgroundMiddle.width;
  }
  
  this.width = x;
  
  this.cover();
  if (typeof(holdStill) == "undefined" || holdStill == false) {
    this.alignLayers();
  }
}

Pill.prototype.setHeight = function(y, holdStill)
{
  this.backgroundLeft.height = y;
  this.backgroundMiddle.height = y;
  this.backgroundRight.height = y;
  
  this.height = y;
  
  this.cover();
  if (typeof(holdStill) == "undefined" || holdStill == false) {
    this.alignLayers();
  }
}

Pill.prototype.cover = function()
{
  this.hiliteLeft.width = this.backgroundLeft.width;
  this.hiliteRight.width = this.backgroundRight.width;
  this.hiliteMiddle.width = this.backgroundMiddle.width;
  this.hiliteLeft.height = this.backgroundLeft.height;
  this.hiliteRight.height = this.backgroundRight.height;
  this.hiliteMiddle.height = this.backgroundMiddle.height;
  this.hiliteMiddle.hOffset = this.backgroundMiddle.hOffset;
  this.hiliteRight.hOffset = this.backgroundRight.hOffset;
  this.hiliteLeft.vOffset = this.backgroundLeft.vOffset;
  this.hiliteMiddle.vOffset = this.backgroundMiddle.vOffset;
  this.hiliteRight.vOffset = this.backgroundRight.vOffset;
}


Pill.prototype.alignLayers = function()
{
  var scale = this.height / 27;
  this.modifyButton.width = this.modifyButton.srcWidth * scale;
  this.modifyButton.height = this.modifyButton.srcHeight * scale;
  this.deleteButton.width = this.deleteButton.srcWidth * scale;
  this.deleteButton.height = this.deleteButton.srcHeight * scale;
  
  this.text.hOffset = this.hOffset + this.backgroundLeft.width;
  this.text.vOffset = this.vOffset + ((this.height + this.text.height) / 2) - (this.text.size * 0.2) - (this.height * 0.08);
  
  this.modifyButton.hOffset = this.backgroundRight.hOffset - (this.modifyButton.width + this.deleteButton.width);
  this.deleteButton.hOffset = this.backgroundRight.hOffset - this.deleteButton.width;
  
  this.modifyButton.vOffset = this.backgroundLeft.vOffset + scale * 5;
  this.deleteButton.vOffset = this.backgroundLeft.vOffset + scale * 5;
  
  /*
  if (this.showButtons == true) {
    this.date.hOffset = this.modifyButton.hOffset - this.modifyButton.width * 0.25;
  } else {
  */
  this.date.hOffset = this.hOffset + this.width - this.backgroundRight.width;
  /*
  }
  */
  this.date.vOffset = this.text.vOffset;
  
  
  this.textShadow.hOffset = this.text.hOffset + 1;
  this.textShadow.vOffset = this.text.vOffset + 1;
  this.dateShadow.hOffset = this.date.hOffset + 1;
  this.dateShadow.vOffset = this.date.vOffset + 1;
  
}



Pill.prototype.resizeText = function()
{
  if (this.text.data == null) {
    return;
  }
  this.alignLayers();
  if (this.fitData == true) {
    this.text.width = -1;
    this.text.height = -1;
    this.date.width = -1;
    this.date.height = -1;
    var height = this.text.height + 13;
    this.setHeight(height);
    var width = this.backgroundLeft.width + this.text.width + this.date.width + this.backgroundRight.width;
    this.text.truncation = "none";
    this.textShadow.truncation = "none";
    this.setWidth(width);
  } else {
    this.date.width = -1;
    var width = this.width - (this.backgroundLeft.width + this.date.width + this.backgroundRight.width);
    this.text.truncation = "end";
    this.textShadow.truncation = "end";
    this.text.width = width;
    this.textShadow.width = width;
  }
}

Pill.prototype.setAutosize = function(a)
{
  if (a == true) {
    this.fitData = true;
  } else {
    this.fitData = false;
  }
  
  this.resizeText();
}

Pill.prototype.setText = function(str)
{
  this.text.data = str;
  this.textShadow.data = str;
  
  this.resizeText();
}

Pill.prototype.setDate = function(str)
{
  // Add two spaces of padding
  this.date.data = "  " + str;
  this.dateShadow.data = "  " + str;
  
  this.resizeText();
}

Pill.prototype.setBgColor = function(c)
{
  this.backgroundLeft.colorize = c;
  this.backgroundMiddle.colorize = c;
  this.backgroundRight.colorize = c;
}

Pill.prototype.setColor = function(c)
{
  this.text.color = c;
  this.date.color = c;
}


Pill.prototype.setFont = function(f)
{
  this.textShadow.font = f;
  this.dateShadow.font = f;
  this.text.font = f;
  this.date.font = f;
  
  this.resizeText();
}


Pill.prototype.setSize = function(s)
{
  this.textShadow.size = s;
  this.dateShadow.size = s;
  this.text.size = s;
  this.date.size = s;
  
  this.resizeText();
}


Pill.prototype.setTooltip = function(t)
{
  this.backgroundMiddle.tooltip = t;
}

Pill.prototype.updateFromPrefs = function()
{
  this.setColor(preferences.userColor.value);
  this.setFont(preferences.userFont.value);
  this.setSize(preferences.userSize.value);
  this.setBgOpacity(preferences.bgOpacity.value);
}

Pill.prototype.setIndex = function(i)
{
  this.modifyButton.onMouseUp = "editItem(" + i + ")";
  this.deleteButton.onMouseUp = "deleteItem(" + i + ")";
  this.backgroundMiddle.contextMenuItems = buildContextMenu(i);
}


function Pill()
{
  this.hOffset = 0;
  this.vOffset = 0;
  this.opacity = 255;
  
  this.fitData = true;
  this.showButtons = false;
  this.showAddButton = false;
  
  this.backgroundLeft = new Image();
  this.backgroundLeft.src = "Resources/GrayBackgroundLeft.png";
  this.backgroundLeft.hOffset = 0;
  this.backgroundLeft.vOffset = 0;
  
  this.backgroundMiddle = new Image();
  this.backgroundMiddle.src = "Resources/GrayBackgroundMiddle.png";
  this.backgroundMiddle.hOffset = this.backgroundLeft.hOffset + this.backgroundLeft.srcWidth;
  this.backgroundMiddle.vOffset = this.backgroundLeft.vOffset;
  this.backgroundMiddle.width = 0;
  
  this.backgroundRight = new Image();
  this.backgroundRight.src = "Resources/GrayBackgroundRight.png";
  this.backgroundRight.hOffset = this.backgroundMiddle.hOffset;
  this.backgroundRight.vOffset = this.backgroundMiddle.vOffset;
  
  this.width = this.backgroundLeft.width + this.backgroundRight.width;
  this.height = this.backgroundLeft.height;
  
  this.extWidth = 0;
  
  this.textShadow = new Text();
  this.textShadow.alignment = "left";
  
  this.dateShadow = new Text();
  this.dateShadow.alignment = "right";
  
  this.text = new Text();
  this.text.alignment = "left";
  
  this.date = new Text();
  this.date.alignment = "right";
  
  this.modifyButton = new Image();
  this.modifyButton.src = "Resources/ModifyButton.png";
  this.modifyButton.opacity = 0;
  
  this.deleteButton = new Image();
  this.deleteButton.src = "Resources/DeleteButton.png"
  this.deleteButton.opacity = 0;
  
  this.hiliteLeft = new Image();
  this.hiliteLeft.src = "Resources/ClearReflectionLeft.png";
  
  this.hiliteMiddle = new Image();
  this.hiliteMiddle.src = "Resources/ClearReflectionMiddle.png";
  
  this.hiliteRight = new Image();
  this.hiliteRight.src = "Resources/ClearReflectionRight.png";
  
  this.updateFromPrefs();
  
  this.cover();
  this.alignLayers();
}



function pad(str, length, pad_char, side)
{
  if (pad_char == null) {
    pad_char = ' ';
  }
  if (side == null) {
    side = "right";
  }
  if (str.length > length) {
    switch(side) {
      case "left":
        return str.substring(length - str.length);
        break;
      case "right":
      default:
        return str.substring(0, length);
        break;
    }
  } else if (str.length == length) {
    return str;
  }
  
  var numPad = length - str.length;
  var padding = "";
  for (var i = 0; i < numPad; i++) {
    padding += pad_char.charAt(i % pad_char.length);
  }
  
  switch(side) {
    case "left":
      return padding + str;
      break;
    case "right":
    default:
      return str + padding;
      break;
  }
  
}


function updateList()
{
  var prefList = preferences.dueListPref.value.split(",");
  
  for (var i in dueList) {
    delete dueList[i];
  }
  
  dueList = new Array();
  
  if (preferences.dueListPref.value.length <= 0) {
    return;
  }
  
  for (var i in prefList) {
    dueList[i] = new Object();
    dueList[i].prefLine = prefList[i];
    
    var lineItem = prefList[i].split('|');
    
    dueList[i].text = escapeItem(lineItem[2], "decode");
    dueList[i].extra = escapeItem(lineItem[3], "decode");
    
    var dateParts = escapeItem(lineItem[0]).match(/^(\d{4})(\d{2})(\d{2})$/);
    if (lineItem[0].length != 8 || (dateParts = escapeItem(lineItem[0]).match(/^(\d{4})(\d{2})(\d{2})$/)) == null) {
      // no due date
      dueList[i].dueDate = null;
      dueList[i].dueTime = Number.MAX_VALUE;
      dueList[i].warnTime = 0;
      dueList[i].warnDays = 0;
      dueList[i].state = "normal";
      dueList[i].dateString = "";
      continue;
    }
    
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    dueList[i].dueDate = new Date(dateParts[1], dateParts[2] - 1, dateParts[3]);
    dueList[i].dueTime = dueList[i].dueDate.getTime();
    dueList[i].warnTime = dueList[i].dueTime - lineItem[1] * 86400000;
    dueList[i].warnDays = lineItem[1];
    
    if (nowTime > dueList[i].dueTime) {
      dueList[i].state = "overdue";
    } else if (nowTime > dueList[i].warnTime) {
      dueList[i].state = "soon";
    } else {
      dueList[i].state = "normal";
    }
    
    switch (preferences.dateDisplay.value) {
      case "Month/Date":
        dueList[i].dateString = (dueList[i].dueDate.getMonth() + 1).toString() + "/" + (dueList[i].dueDate.getDate()).toString();
        // dueList[i].longDateString =  dateString + '/' + (dueList[i].dueDate.getFullYear()).toString();
        break;
      case "Date/Month":
        dueList[i].dateString = (dueList[i].dueDate.getDate()).toString() + "/" + (dueList[i].dueDate.getMonth() + 1).toString();
        // dueList[i].longDateString = (dueList[i].dueDate.getFullYear()).toString() + '/' + dateString;
        break;
      case "Days Until Warning":
        dueList[i].dateString = Math.ceil((dueList[i].warnTime - nowTime) / 86400000);
        break;
      case "Days Until Due":
        dueList[i].dateString = Math.ceil((dueList[i].dueTime - nowTime) / 86400000);
        // dueList[i].longDateString = dueList[i].dateString;
        break;
      default:
        dueList[i].dateString = "";
        break;
    }
  }
  
  dueList.sort(function(a, b)
  {
    if (a.state == b.state) {
      return a.dueTime - b.dueTime;
    } else {
      switch (a.state) {
        case "overdue": return -1; break;
        case "soon": if (b.state == "overdue") return 1; else return -1; break;
        case "normal": default: return 1; break;
      }
    }
  });
  
  var newPrefList = new Array();
  for (var i in dueList) {
    newPrefList[i] = dueList[i].prefLine;
  }
  
  preferences.dueListPref.value = newPrefList.join(",")
}

function buildContextMenu(i)
{
  var items = new Array();
  
  var item = new MenuItem();
  item.title = "Add Item";
  item.onSelect = "editItem(-1)";
  items.push(item);
  
  if (i >= 0) {
    item = new MenuItem();
    item.title = "Edit Item";
    item.onSelect = "editItem(" + i + ")";
    items.push(item);
    item = new MenuItem();
    item.title = "Delete Item";
    item.onSelect = "deleteItem(" + i + ")";
    items.push(item);
  }
  
  item = new MenuItem();
  item.title = "Reload";
  item.onSelect = "reloadWidget()";
  items.push(item);
  
  return items;
}


function buildList()
{
  suppressUpdates();
  
  for (var i in pillArray) {
    delete pillArray[i];
  }
  
  pillArray = new Array();
  
  updateList();
  
  if ( dueList.length == 0 ) {
    var p = new Pill();
    p.setText("Nothing Due!");
    p.setIndex(-1);
    pillArray.push(p);
  } else {
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    
    for (var i in dueList) {
      
      var p = new Pill();
      p.setIndex(i);
      p.setText(dueList[i].text);
      p.setDate(dueList[i].dateString);
      var tooltip = dueList[i].text;
      if (dueList[i].extra.length > 0) {
        tooltip += "\n" + dueList[i].extra;
      }
      if (dueList[i].dueDate != null) {
        tooltip += "\n" + dueList[i].dueDate.toLocaleDateString();
      }
      if (dueList[i].warnDays != 0) {
        tooltip += "\n(Warning " + dueList[i].warnDays + ((dueList[i].warnDays == 1)?" day":" days") + " in advance)";
      }
      p.setTooltip(tooltip);
      
      switch(dueList[i].state) {
        case "overdue":
          p.setBgColor(preferences.overdueColor.value);
          break;
        case "soon":
          p.setBgColor(preferences.soonColor.value);
          break;
        case "normal":
          p.setBgColor(preferences.normalColor.value);
          break;
      }
      
      pillArray.push(p);
    }
    
  }
  
  alignList();
  
  for (var i in pillArray) {
    pillArray[i].resizeText();
  }
  
  resumeUpdates();
  
  if (buttonState == buttonsOuttie) {
    buttonState = buttonsInnie;
    state = 0;
    onGainFocus();
  } else {
    buttonState = buttonsInnie;
    state = 0;
  }
  
}

function alignList()
{
  var maxWidth = 0;
  if (preferences.itemWidth.value >= 350) {
    for (var i in pillArray) {
      pillArray[i].setAutosize(true);
      maxWidth = Math.max(maxWidth, pillArray[i].width);
    }
  } else {
    maxWidth = parseInt(preferences.itemWidth.value);
  }
  
  var curVOffset = 0;
  for (var i in pillArray) {
    pillArray[i].setVOffset(curVOffset);
    curVOffset += pillArray[i].height;
  }
  
  for (var i in pillArray) {
    pillArray[i].setAutosize(false);
    pillArray[i].setWidth(maxWidth, false);
  }
  
  var scale = pillArray[0].height / 27;
  
  main.height = curVOffset + scale * addButton.srcHeight;
  main.width = maxWidth + pillArray[0].extWidth;
  
}

function escapeItem(theString, direction)
{
  switch (direction) {
    case "decode":
      theString = theString.replace(/%%1/g, "|")
      theString = theString.replace(/%%2/g, ",")
      break;
    case "encode":
      theString = theString.replace(/\|/g, "%%1")
      theString = theString.replace(/\,/g, "%%2")
      break;
  }
  return theString;
}


function EditForm()
{
  var arr = new Array();
  var ff;
  
  var d = new Date();
  var thisYear = d.getFullYear();
  
  ff = new FormField();
  ff.name = "text";
  ff.type = "text";
  ff.title = "Name:";
  ff.defaultValue = "Due Item";
  arr.push(ff);
  
  ff = new FormField();
  ff.name = "description";
  ff.title = "Description:";
  ff.type = "text";
  ff.defaultValue = "Extra Information";
  arr.push(ff);
  
  ff = new FormField();
  ff.name = "hasDueDate";
  ff.title = "Has Due Date:";
  ff.type = "popup";
  ff.option = new Array("Yes", "No");
  ff.defaultValue = "Yes";
  ff.description = "If your item has a due date, select \"Yes\" and set the date below.\nOtherwise, select \"No\" and ignore fields below.";
  arr.push(ff);

  ff = new FormField();
  ff.name = "dueyear";
  ff.title = "Due Year:";
  ff.type = "popup";
  ff.option = new Array();
  for (var i = 0; i < 3; i++) {
    ff.option[i] = (thisYear + i).toString();
  }
  ff.defaultValue = thisYear.toString();
  arr.push(ff);

  ff = new FormField();
  ff.name = "month";
  ff.title = "Month:";
  ff.type = "popup";
  ff.option = new Array();
  for (var i = 1; i <= 12; i++) {
    ff.option[i - 1] = i.toString();
  }
  ff.defaultValue = (d.getMonth() + 1).toString();
  arr.push(ff);
  
  ff = new FormField();
  ff.name = "date";
  ff.title = "Date:";
  ff.type = "popup";
  ff.option = new Array();
  for (var i = 1; i <= 31; i++) {
    ff.option[i - 1] = i.toString();
  }
  ff.defaultValue = (d.getDate()).toString();
  arr.push(ff);
  
  ff = new FormField();
  ff.name = "warn";
  ff.title = "Warn Days:";
  ff.type = "text";
  ff.defaultValue = "1";
  arr.push(ff);
  
  return arr;
  
}

function editItem(i)
{
  var formResults;
  var dueListPrefArray;
  if (preferences.dueListPref.value.length > 0) {
    dueListPrefArray = preferences.dueListPref.value.split(',');
  } else {
    dueListPrefArray = new Array();
  }
  
  if (i < 0) {
    // onLoseFocus();
    formResults = form(EditForm(), 'New Due Item', 'Add');
  } else {
    var tForm = EditForm();
    var tArr = dueListPrefArray[i].split('|');
    if (tArr[0].length == 8) {
      tForm[2].defaultValue = "Yes";
      tForm[3].defaultValue = tArr[0].substring(0, 4);
      tForm[4].defaultValue = parseInt(tArr[0].substring(4, 6), 10).toString();
      tForm[5].defaultValue = parseInt(tArr[0].substring(6, 8), 10).toString();
      tForm[6].defaultValue = tArr[1];
    } else {
      tForm[2].defaultValue = "No";
    }
    tForm[0].defaultValue = escapeItem(tArr[2], "decode");
    tForm[1].defaultValue = escapeItem(tArr[3], "decode");
    
    // onLoseFocus();
    formResults = form(tForm, 'Edit Due Item', 'Modify');
  }
  
  if (formResults == null)
  {
    return;
  }
  
  
  if (i < 0) {
    i = dueListPrefArray.length;
  }
  
  var tArr = new Array();
  
  if (formResults[2] == "Yes") {
    tArr[0] = formResults[3] + pad(formResults[4], 2, "0", "left") + pad(formResults[5], 2, "0", "left");
    tArr[1] = parseInt(formResults[6], 10).toString();
    if (isNaN(parseInt(tArr[1], 10))) {
      tArr[1] = "1";
    }
  } else {
    tArr[0] = "0";
    tArr[1] = "0";
  }
  tArr[2] = escapeItem(formResults[0], "encode");
  tArr[3] = escapeItem(formResults[1], "encode");
  dueListPrefArray[i] = tArr.join('|');
  
  if (dueListPrefArray.length > 1) {
    preferences.dueListPref.value = dueListPrefArray.join(',');
  } else {
    preferences.dueListPref.value = dueListPrefArray[i];
  }
  
  updateList();
  savePreferences();
  buildList();
  moveAddButton();
  
}


function deleteItem(i)
{
  // onLoseFocus();
  var confirm = alert("Really delete \"" + pillArray[i].text.data + "\"?", "Delete", "Cancel");
  if (confirm != 1) {
    return;
  }
  var dueListPrefArray = preferences.dueListPref.value.split(',');
  if (dueListPrefArray.length == 1) {
    preferences.dueListPref.value = "";
  } else {
    dueListPrefArray.splice(i, 1);
    preferences.dueListPref.value = dueListPrefArray.join(',');
  }
  
  updateList();
  savePreferences();
  buildList();
  moveAddButton();
}


function onWillChangePreferences()
{
  // onLoseFocus();
}

function onPreferencesChanged()
{
  buildList();
  moveAddButton();
}


initialize();


buildList();
moveAddButton();
