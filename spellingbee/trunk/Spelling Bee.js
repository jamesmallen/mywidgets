/**
 * Spelling Bee
 * by James M. Allen
 * 
 * aspell is an open-source program that is distributed with this Widget in
 * binary form. You can get the source code from http://aspell.net.
 * 
 * Jessica Relitz helped out with dialogue. ;-)
 * nniico helped out with getting aspell compiled and compressed on the Mac.
 * 
 * All other images and code are copyright 2005-2006 James M. Allen, and may
 * not be used without permission.
 */

include("lib.js");
include("KImage.js");


function onLoad()
{
  wndMain.onContextMenu = "main_onContextMenu();";
  
  blockObj = new Object();
  blockObj.aspell = false;
  
  kmgInputBarBG = new KImage();
  kmgInputBarBG.window = wndMain;
  kmgInputBarBG.src = "Resources/InputBarBG<.png";
  // kmgInputBarBG.onDragDrop = "kmgInputBarBG_onDragDrop()";
  // kmgInputBarBG.onDragEnter = "kmgInputBarBG_onDragEnter()";
  // kmgInputBarBG.onDragExit = "kmgInputBarBG_onDragExit()";
  kmgInputBarBG.xHOffset = 51;
  kmgInputBarBG.xVOffset = 63;
  kmgInputBarBG.xWidth = 182;
  kmgInputBarBG.xHeight = 42;
  kmgInputBarBG.xScale = 1.0;
  widgetResize.items.push(kmgInputBarBG);
  
  kmgInputBarGlow = new KImage();
  kmgInputBarGlow.window = wndMain;
  kmgInputBarGlow.src = "Resources/InputBarGlow<.png";
  kmgInputBarGlow.visible = false;
  kmgInputBarGlow.xHOffset = 51;
  kmgInputBarGlow.xVOffset = 59;
  kmgInputBarGlow.xWidth = 182;
  kmgInputBarGlow.xHeight = 44;
  kmgInputBarGlow.xScale = 1.0;
  widgetResize.items.push(kmgInputBarGlow);
  
  kmgInputBar = new KImage();
  kmgInputBar.window = wndMain;
  kmgInputBar.src = "Resources/InputBar<.png";
  kmgInputBar.xHOffset = 51;
  kmgInputBar.xVOffset = 63;
  kmgInputBar.xWidth = 182;
  kmgInputBar.xHeight = 42;
  kmgInputBar.xScale = 1.0;
  widgetResize.items.push(kmgInputBar);
  
  imgDot = new Image();
  imgDot.window = wndMain;
  imgDot.src = "Resources/Dot.png";
  imgDot.hAlign = "center";
  imgDot.vAlign = "center";
  imgDot.xHOffset = 75;
  imgDot.xVOffset = 82;
  imgDot.xWidth = 12;
  imgDot.xHeight = 12;
  imgDot.visible = false;
  imgDot.colorGreen = "#00FF00";
  imgDot.colorYellow = "#EEEE00";
  imgDot.colorRed = "#FF0000";
  widgetResize.items.push(imgDot);
  
  imgBeeShadow = new Image();
  imgBeeShadow.window = wndMain;
  imgBeeShadow.src = "Resources/BeeShadow.png";
  imgBeeShadow.hAlign = "center";
  imgBeeShadow.vAlign = "center";
  imgBeeShadow.xHOffset = 50;
  imgBeeShadow.xVOffset = 106;
  imgBeeShadow.xWidth = 100;
  imgBeeShadow.xHeight = 102;
  imgBeeShadow.visible = false;
  widgetResize.items.push(imgBeeShadow);
  
  imgBee = new Image();
  imgBee.window = wndMain;
  imgBee.src = "Resources/Bee.png";
  imgBee.hAlign = "center";
  imgBee.vAlign = "center";
  imgBee.xHOffset = 50;
  imgBee.xVOffset = 105;
  imgBee.xWidth = 100;
  imgBee.xHeight = 100;
  imgBee.visible = false;
  widgetResize.items.push(imgBee);
  
  txtInput = new TextArea();
  txtInput.window = wndMain;
  txtInput.editable = true;
  txtInput.scrollbar = false;
  txtInput.spellcheck = false;
  switch (system.platform) {
    case "macintosh":
      txtInput.font = "Lucida Grande Bold";
      break;
    case "windows":
      txtInput.font = "Lucida Sans Bold";
      break;
  }
  // txtInput.onKeyDown = "txtInput_onKeyDown();";
  txtInput.onKeyPress = "txtInput_onKeyPress();";
  txtInput.onKeyUp = "txtInput_onKeyUp();";
  txtInput.onMouseDown = "txtInput_onMouseDown();";
  txtInput.onDragDrop = "kmgInputBarBG_onDragDrop()";
  txtInput.onDragEnter = "kmgInputBarBG_onDragEnter()";
  txtInput.onDragExit = "kmgInputBarBG_onDragExit()";
  txtInput.xHOffset = 82;
  txtInput.xVOffset = 73;
  txtInput.xWidth = 128;
  txtInput.xHeight = 22;
  txtInput.xSize = 16;
  widgetResize.items.push(txtInput);
  
  frmBubble = new Frame();
  frmBubble.window = wndMain;
  frmBubble.xHOffset = 50;
  frmBubble.xVOffset = 0;
  frmBubble.xWidth = 182;
  frmBubble.xHeight = 87;
  frmBubble.opacity = 0;
  widgetResize.items.push(frmBubble);
  
  imgBubbleAbove = new Image();
  frmBubble.addSubview(imgBubbleAbove);
  imgBubbleAbove.src = "Resources/BubbleAbove.png";
  imgBubbleAbove.xHOffset = 0;
  imgBubbleAbove.xVOffset = 0;
  imgBubbleAbove.xWidth = 182;
  imgBubbleAbove.xHeight = 87;
  imgBubbleAbove.visible = false;
  imgBubbleAbove.onMouseDown = "hideBubble();";
  widgetResize.items.push(imgBubbleAbove);
  
  imgBubbleBelow = new Image();
  frmBubble.addSubview(imgBubbleBelow);
  imgBubbleBelow.src = "Resources/BubbleBelow.png";
  imgBubbleBelow.xHOffset = 0;
  imgBubbleBelow.xVOffset = 0;
  imgBubbleBelow.xWidth = 182;
  imgBubbleBelow.xHeight = 87;
  imgBubbleBelow.visible = false;
  imgBubbleBelow.onMouseDown = "hideBubble();";
  widgetResize.items.push(imgBubbleBelow);
  
  /*
  imgOveralls = new Image();
  imgOveralls.window = wndMain;
  imgOveralls.src = "Resources/Blank.png";
  imgOveralls.tracking = "rectangle";
  imgOveralls.onDragDrop = "kmgInputBarBG_onDragDrop()";
  imgOveralls.onDragEnter = "kmgInputBarBG_onDragEnter()";
  imgOveralls.onDragExit = "kmgInputBarBG_onDragExit()";
  imgOveralls.xHOffset = 51;
  imgOveralls.xVOffset = 63;
  imgOveralls.xWidth = 182;
  imgOveralls.xHeight = 42;
  imgOveralls.xScale = 1.0;
  widgetResize.items.push(imgOveralls);
  */
  
  
  anmBubble = null;
  
  tmrIdle = new Timer();
  tmrIdle.interval = 0.5;
  tmrIdle.ticking = false;
  tmrIdle.onTimerFired = "tmrIdle_onTimerFired();";
  
  tmrResize = new Timer();
  tmrResize.interval = 0.001;
  tmrResize.ticking = false;
  tmrResize.onTimerFired = "tmrResize_onTimerFired();";
  
  
  onPreferencesChanged();
  
  // Platform-specific things
  switch (system.platform) {
    case "windows":
      aspellExe = system.widgetDataFolder + "/aspell/bin/aspell.exe";
      aspellArgs = "";
      wordListCompressExe = system.widgetDataFolder + "/aspell/bin/word-list-compress.exe";
      break;
    case "macintosh":
      aspellExe = system.widgetDataFolder + "/aspell/bin/aspell";
      aspellArgs = " --data-dir=" + quoteFilename(system.widgetDataFolder + "/aspell/data");
      wordListCompressExe = system.widgetDataFolder + "/aspell/bin/word-list-compress";
      break;
    default:
      aspellExe = "aspell";
      aspellArgs = "";
      wordListCompressExe = "word-list-compress";
  }
  
  print(aspellExe + aspellArgs);
  
  // Initialize
  if (!filesystem.itemExists(aspellExe)) {
    unpackAspell();
  }
  if (!filesystem.itemExists(aspellExe)) {
    aspellExe = "aspell";
    aspellArgs = "";
    wordListCompressExe = "word-list-compress";
  }
  
  refreshDicts(false);
  
}


function tmrIdle_onTimerFired()
{
  tmrIdle.ticking = false;
  if (preferences.autoCheck.value == "1") {
    checkSpelling(txtInput.data);
  }
}

function txtInput_onKeyPress()
{
  var keyCode = system.event.keyString;
  tmrResize.reset();
  tmrResize.ticking = true;
  switch (keyCode) {
    case "Enter":
    case "Return":
    case "Tab":
    case "Space":
      tmrIdle.ticking = false;
      txtInput.rejectKeyPress();
      checkSpelling(txtInput.data);
      break;
    default:
      hideBubble();
      tmrIdle.reset();
      tmrIdle.ticking = true;
      break;
  }
  beeSays.words = new Array();
  imgDot.colorize = imgDot.colorYellow;
  
}

function txtInput_onKeyUp()
{
  var keyCode = system.event.keyString;
  switch (keyCode) {
    case "UpArrow":
    case "DownArrow":
      txtInput.rejectKeyPress();
      if (system.platform != "macintosh") {
        textObjs_onMouseDown(-1, txtInput.hOffset, txtInput.vOffset + txtInput.height);
      }
      return;
      break;
    case "ForwardDelete":
      hideBubble();
      tmrIdle.reset();
      tmrIdle.ticking = true;
      break;
    default:
      tmrResize.reset();
      tmrResize.ticking = true;
      break;
  }
  beeSays.words = new Array();
  imgDot.colorize = imgDot.colorYellow;
}

function txtInput_onMouseDown()
{
  txtInput.focus();
}


function txtInput_resize()
{
  txtInput.width = -1;
  updateNow();
  txtInput.width = Math.max(txtInput.xWidth * widgetResize.curScale, txtInput.width + txtInput.size * 2);
  kmgInputBarBG.width = kmgInputBarGlow.width = kmgInputBar.width = Math.max((kmgInputBar.xWidth - txtInput.xWidth) * widgetResize.curScale + txtInput.width);
  
  wndMain.width = Math.max(kmgInputBar.hOffset + kmgInputBar.width, frmBubble.hOffset + imgBubbleAbove.width);
  
}

function tmrResize_onTimerFired()
{
  tmrResize.ticking = false;
  txtInput_resize();
}


function kmgInputBarBG_onDragDrop()
{
  var successes = new Array();
  var failures = new Array();
  if (arrDroppedFiles.length > 0) {
    for (var i in arrDroppedFiles) {
      if (!buildDictionary(arrDroppedFiles[i])) {
        failures.push(arrDroppedFiles[i]);
      } else {
        successes.push(arrDroppedFiles[i]);
      }
    }
  }
  
  if (successes.length > 0) {
    beeSays("Dictionaries added. Click here to activate!", false, "refreshDicts(true);");
  } else {
    beeSays("Uh-oh - looks like that didn't work.");
  }
}

function chooseLanguage(dictOptions)
{
  /*
  // OLD METHOD: two screens
  
  var fields = new Array();
  
  fields[0] = new FormField();
  fields[0].type = "popup";
  fields[0].title = "Dictionaries:";
  fields[0].option = dictOptions;
  fields[0].description = "Select a dictionary that you would like to activate or deactivate.";
  
  var formResults = form(fields, "Manage Dictionaries", "Next");
  
  if (!formResults) {
    return;
  }
  
  pdump(formResults);
  
  var curDict = formResults[0];
  
  var fields = new Array();
  fields[0] = new FormField();
  fields[0].type = "checkbox";
  fields[0].title = "Activate dictionary " + curDict + ".";
  if (typeof(activeDicts[curDict]) != "undefined" && activeDicts[curDict]) {
    fields[0].defaultValue = "1";
  } else {
    fields[0].defaultValue = "0";
  }
  
  var formResults = form(fields, "Dictionary " + curDict, "Save");
  
  if (!formResults) {
    return;
  }
  
  if (formResults[0] == "1") {
    activeDicts[curDict] = true;
    if (preferences.tutorial.value == "1") {
      preferences.tutorial.value = "0";
      alert("Now that you've activated a dictionary, select it from the context (right-click) menu to use it.");
    }
  } else {
    if (curDict == unescape(preferences.currentDictionary.value)) {
      beeSays("You can't deactivate the current dictionary!");
    } else {
      activeDicts[curDict] = false;
    }
  }
  
  */
  
  // NEW METHOD: one screen
  var fields = new Array();
  for (var i in dictOptions) {
    fields[i] = new FormField();
    fields[i].type = "checkbox";
    fields[i].title = dictOptions[i];
    if (typeof(activeDicts[dictOptions[i]]) != "undefined" && activeDicts[dictOptions[i]]) {
      fields[i].defaultValue = "1";
    } else {
      fields[i].defaultValue = "0";
    }
  }
  fields[fields.length - 1].description = "Place checks next to the dictionaries that you would like to activate.";
  
  var formResults = form(fields, "Dictionary Management", "Save");
  
  for (var i in formResults) {
    if (formResults[i] == "1") {
      activeDicts[dictOptions[i]] = true;
    } else {
      if (dictOptions[i] == unescape(preferences.currentDictionary.value)) {
        beeSays("You can't deactivate the current dictionary!");
      } else {
        activeDicts[dictOptions[i]] = false;
      }
    }
  }
}

function selectDict(dict)
{
  preferences.currentDictionary.value = dict;
  savePreferences();
}


function refreshDicts(chooser)
{
  activeDicts = new Object();
  
  var dictOptions = new Array();
  var arrDicDir = filesystem.getDirectoryContents(system.widgetDataFolder + "/aspell/dict");
  
  var arrSplitPref = preferences.activeDictionaries.value.split(",");
  for (var i in arrSplitPref) {
    arrSplitPref[i] = unescape(arrSplitPref[i]);
  }
  
  for (var i in arrDicDir) {
    if (getExtension(arrDicDir[i]).toLowerCase() == "multi") {
      dictOptions.push(getFilenameWithoutExtension(arrDicDir[i]));
      
      // Verify files in activeDictionaries preference
      for (var j in arrSplitPref) {
        if (arrSplitPref[j] == dictOptions[dictOptions.length - 1]) {
          activeDicts[arrSplitPref[j]] = true;
        }
      }
    }
  }
  
  if (chooser) {
    chooseLanguage(dictOptions);
  }
  
  arrSplitPref = new Array();
  for (var i in activeDicts) {
    if (!activeDicts[i]) {
      delete activeDicts[i];
    } else {
      arrSplitPref.push(escape(i));
    }
  }
  
  preferences.activeDictionaries.value = arrSplitPref.join(",")
  savePreferences();
  
}


function kmgInputBarBG_onDragEnter()
{
  arrDroppedFiles = new Array();
  if (system.event.data[0] == "filenames") {
    for (var i = 1; i < system.event.data.length; i++) {
      var curFile = system.event.data[i];
      if (/\/?aspell[^\/\\]*\.tar\.bz2$/i.test(curFile)) {
        arrDroppedFiles.push(curFile)
      }
    }
  }
  
  if (arrDroppedFiles.length > 0) {
    kmgInputBarGlow.visible = true;
  }
  
}

function kmgInputBarBG_onDragExit()
{
  kmgInputBarGlow.visible = false;
}

function checkSpelling(inputStr)
{
  if (blockObj.aspell) {
    return;
  } else {
    blockObj.aspell = true;
  }
  
  spinBee();
  log("CHECK SPELLING");
  
  var cmdLine = "export ASPELL_CONF=" + quoteFilename("prefix " + system.widgetDataFolder + "/aspell") + "; echo " + quoteFilename(inputStr) + " | " + quoteFilename(aspellExe) + aspellArgs + " -d " + unescape(preferences.currentDictionary.value) + ".multi -a";
  runCommandInBg(cmdLine, "aspell");
}


function unpackAspell()
{
  spinBee();
  beeSays("Initializing aspell...");
  updateNow();
  var cmdOutput;
  switch (system.platform) {
    case "windows":
      cmdOutput = log(runCommand("unzip -o aspell-w32-0.50.3-jma.zip -d " + quoteFilename(system.widgetDataFolder)));
      log(cmdOutput);
      break;
    case "macintosh":
      cmdOutput = log(runCommand("unzip -o aspell-darwin-0.50.5-jma.zip -d " + quoteFilename(system.widgetDataFolder)));
      log(cmdOutput);
      break;
  }
  
  var pwd = runCommand("pwd");
  buildDictionary(pwd + "/aspell-en-0.50-2.tar.bz2");
  
  beeSays("Ready!");
  stopBee();
  
}


function buildDictionary(languageFile)
{
  var cmdOutput;
  
  var myTemporaryFolder = system.temporaryFolder + "/spellingbee";
  
  cmdOutput = runCommand("rm -Rf " + quoteFilename(myTemporaryFolder) + "; mkdir -p " + quoteFilename(myTemporaryFolder) + "; cd " + quoteFilename(myTemporaryFolder) + "; bunzip2 -c " + quoteFilename(languageFile) + " | tar -x");
  log(cmdOutput);
  
  var dirContents = filesystem.getDirectoryContents(myTemporaryFolder, true);
  
  var multiFiles = new Array();
  var cwlFiles = new Array();
  var dataFiles = new Array();
  
  for (var i in dirContents) {
    var curFile = dirContents[i];
    switch (getExtension(curFile)) {
      case "multi":
        multiFiles.push(curFile);
        break;
      case "cwl":
        cwlFiles.push(curFile);
        break;
      case "dat":
        dataFiles.push(curFile);
        break;
    }
  }
  
  if (multiFiles.length < 1 || cwlFiles.length < 1 || dataFiles.length < 1) {
    return false;
  }
  
  var lang = dataFiles[0];
  for (var i = 0; i < dataFiles.length; i++) {
    if (dataFiles[i].length < lang.length) {
      lang = getFilename(dataFiles[i]);
    }
    cmdOutput = runCommand("cp -f " + quoteFilename(myTemporaryFolder + "/" + dataFiles[i]) + " " + quoteFilename(system.widgetDataFolder + "/aspell/data"));
    log(cmdOutput);
  }
  
  lang = getFilenameWithoutExtension(lang);
  
  
  var cwlFilename;
  
  for (var i = 0; i < cwlFiles.length; i++) {
    cwlFilename = getFilenameWithoutExtension(cwlFiles[i]);
    cmdOutput = runCommand("export ASPELL_CONF=" + quoteFilename("prefix " + system.widgetDataFolder + "/aspell") + "; " + quoteFilename(wordListCompressExe) + " d < " + quoteFilename(myTemporaryFolder + "/" + cwlFiles[i]) + " | " + quoteFilename(aspellExe) + aspellArgs + " --lang=" + lang + " create master " + cwlFilename + ".rws");
    log(cmdOutput);
  }
  
  for (var i = 0; i < multiFiles.length; i++) {
    cmdOutput = runCommand("cp -f " + quoteFilename(myTemporaryFolder + "/" + multiFiles[i]) + " " + quoteFilename(system.widgetDataFolder + "/aspell/dict"));
    log(cmdOutput);
  }
  
  return true;
  
}



function showBubble()
{
  if (wndMain.vOffset < screen.availTop) {
    imgBubbleBelow.visible = true;
    imgBubbleAbove.visible = false;
    frmBubble.xVOffset = 82;
  } else {
    imgBubbleBelow.visible = false;
    imgBubbleAbove.visible = true;
    frmBubble.xVOffset = 0;
  }
  objectResize(frmBubble);
  
  if (anmBubble) {
    anmBubble.kill();
  }
  anmBubble = new FadeAnimation(frmBubble, 255, 200, animator.kEaseNone);
  animator.start(anmBubble);
}


function hideBubble()
{
  if (anmBubble) {
    anmBubble.kill();
  }
  anmBubble = new FadeAnimation(frmBubble, 0, 200, animator.kEaseNone);
  animator.start(anmBubble);
}


function beeSays(str, autoLink, onMouseDown)
{
  var startVOffset = 15;
  var wordsArray;
  
  if (str instanceof Array) {
    wordsArray = new Array();
    beeSays.words = new Array();
    for (var i = 0; i < str.length - 1; i++) {
      wordsArray.push(str[i] + ", ");
      beeSays.words.push(str[i]);
    }
    wordsArray.push(str[i]);
    str = wordsArray.join("");
  } else {
    wordsArray = str.match(/[\w\'\"]*[^\w\'\"]{0,2}/g);
    beeSays.words = new Array();
    for (var i = 0; i < wordsArray.length; i++) {
      beeSays.words.push(wordsArray[i]);
    }
  }
  
  if (wordsArray && wordsArray.length > 0) {
    
    // resize array if necessary
    for (var i = beeSays.textObjs.length; i < wordsArray.length; i++) {
      beeSays.textObjs[i] = new Text();
      frmBubble.addSubview(beeSays.textObjs[i]);
      beeSays.textObjs[i].font = "Lucida Sans";
    }
    // hide extra ones at the end
    for (var i = wordsArray.length; i < beeSays.textObjs.length; i++) {
      beeSays.textObjs[i].visible = false;
    }
    
    for (var i = 0 ; i < wordsArray.length; i ++) {
      beeSays.textObjs[i].visible = true;
      beeSays.textObjs[i].size = 14 * widgetResize.curScale;
      switch (system.platform) {
        case "windows":
          beeSays.textObjs[i].data = wordsArray[i] + "\t";
          break;
        case "macintosh":
        default:
          beeSays.textObjs[i].data = wordsArray[i];
          break;
      }
      if (onMouseDown) {
        beeSays.textObjs[i].bgOpacity = 1;
        beeSays.textObjs[i].onMouseDown = onMouseDown +";hideBubble();";
      } else if (autoLink) {
        beeSays.textObjs[i].bgOpacity = 1;
        beeSays.textObjs[i].onMouseDown = "textObjs_onMouseDown(" + i + ");";
      } else {
        beeSays.textObjs[i].bgOpacity = 0;
        beeSays.textObjs[i].onMouseDown = null;
        beeSays.textObjs[i].tooltip = "";
      }
      objectResize(beeSays.textObjs[i]);
    }
    
    var curLineNumber = 0;
    if (str.length < 40) {
      curLineNumber++;
    }
    var curLineWidth = 0;
    var lineSpacing = beeSays.textObjs[0].height * 1.1;
    
    var lineWidths = [71, 145, 154, 102];
    var lineVOffsets = [17, 33, 49, 65];
    var lineHOffset = 91 * widgetResize.curScale;
    
    for (var i = 0; i < lineVOffsets.length; i++) {
      if (wndMain.vOffset < screen.availTop) {
      lineVOffsets[i] += 9;
      }
      lineWidths[i] *= widgetResize.curScale;
      lineVOffsets[i] *= widgetResize.curScale;
    }
    
    var arrCurLine = new Array();
    
    for (var i = 0; i < wordsArray.length; i++) {
      if (curLineWidth + beeSays.textObjs[i].width >= lineWidths[curLineNumber]) {
        alignAndDistributeCenter(arrCurLine, lineHOffset, lineVOffsets[curLineNumber], 0);
        curLineNumber++;
        if (curLineNumber >= lineVOffsets.length) {
          beeSays.textObjs[i - 1].data = ". . . ";
          if (autoLink) {
            beeSays.textObjs[i - 1].onMouseDown = "textObjs_onMouseDown(-1);";
          } else {
            beeSays.textObjs[i - 1].tooltip = str;
          }
          for (var j = i; j < wordsArray.length; j++) {
            beeSays.textObjs[j].visible = false;
          }
          break;
        }
        curLineWidth = 0;
        arrCurLine = new Array();
      }
      curLineWidth += beeSays.textObjs[i].width;
      arrCurLine.push(beeSays.textObjs[i]);
    }
    
    if (curLineNumber < lineVOffsets.length) {
      alignAndDistributeCenter(arrCurLine, lineHOffset, lineVOffsets[curLineNumber], 0);
    }
    
  } else {
    
  }
  
  showBubble();
  
}
beeSays.textObjs = new Array();
beeSays.words = new Array();


function textObjs_onMouseDown(idx, popupx, popupy)
{
  if (idx < 0) {
    var arrMenu = new Array();
    var mi;
    var numWords = Math.min(beeSays.words.length, 15);
    for (var i = 0; i < numWords; i++) {
      if (beeSays.words[i]) {
        var word = beeSays.words[i];
      } else {
        var word = beeSays.textObjs[i].data;
        word = word.replace(/^(\s+)|[^\w\ \-\']|(\s+)$/g, "");
      }
      mi = new MenuItem();
      mi.title = word;
      mi.onSelect = "textObjs_onMouseDown(" + i + ");";
      arrMenu.push(mi);
    }
    
    if (typeof(popupx) == "undefined") {
      popupx = system.event.hOffset;
      popupy = system.event.vOffset;
    }
    
    popupMenu(arrMenu, popupx, popupy);
    
  } else {
    if (beeSays.words[idx]) {
      var word = beeSays.words[idx];
    } else {
      var word = beeSays.textObjs[idx].data;
      word = word.replace(/^(\s+)|[^\w\ \-\']|(\s+)$/g, "");
    }
    
    hideBubble();
    
    txtInput.data = word;
    imgDot.colorize = imgDot.colorGreen;
    
    beeSays.words = new Array();
    
    if (preferences.autoCopy.value == "1") {
      copy_onSelect();
    }
  }
}



function alignAndDistributeCenter(arrObj, hOffset, vOffset, spacing)
{
  var tWidth = 0;
  
  if (isNaN(parseFloat(spacing))) {
    spacing = 0;
  } else {
    spacing = parseFloat(spacing);
  }
  
  for (var i = 0; i < arrObj.length; i++) {
    tWidth += arrObj[i].width;
  }
  
  var curHOffset = hOffset - (tWidth / 2);
  for (var i = 0; i < arrObj.length; i++) {
    arrObj[i].hOffset = curHOffset;
    arrObj[i].vOffset = vOffset;
    curHOffset += (arrObj[i].width + spacing);
  }
}

function spinBee()
{
  if (spinBee.anm && !spinBee.anm.finished) {
    return;
  }
  spinBee.anm = new CustomAnimation(33, spinBee.updateFunc, spinBee.doneFunc);
  animator.start(spinBee.anm);
}
spinBee.updateFunc = function()
{
  if (!this.newStartTime) {
    this.newStartTime = this.startTime;
  }
  var now = animator.milliseconds;
  var t = Math.max(0, now - this.newStartTime);
  switch (preferences.uiStyle.value) {
    case "bee":
      var endTime = 60000 / spinBee.rpm;
      if (t >= endTime && this.lastOne) {
        imgBeeShadow.rotation = 0;
        imgBee.rotation = 0;
        this.finished = true;
        return false;
      } else {
        this.newStartTime += (endTime * Math.floor(t / endTime));
        t = Math.max(0, now - this.newStartTime);
        var pct = t / endTime;
        var rot = animator.ease(0, -360, pct, animator.kEaseNone);
        imgBeeShadow.rotation = rot;
        imgBee.rotation = rot;
        return true;
      }
      break;
    
    case "corporate":
      if (this.lastOne) {
        this.finished = true;
        return false;
      }
      break;
  }
}
spinBee.doneFunc = function()
{
  if (spinBee.doneEval) {
    eval(spinBee.doneEval);
    spinBee.doneEval = null;
  }
}
spinBee.doneEval = null;
spinBee.rpm = 74;
spinBee.anm = null;



function stopBee(doneEval)
{
  if (doneEval) {
    spinBee.doneEval = doneEval;
  }
  if (spinBee.anm) {
    spinBee.anm.lastOne = true;
  } else {
    spinBee.doneFunc();
  }
}




function widgetResize(scale)
{
  if (!isNaN(parseFloat(scale))) {
    widgetResize.curScale = parseFloat(scale);
  }
  
  for (var i in widgetResize.items) {
    var curI = widgetResize.items[i];
    for (var j in widgetResize.attributes) {
      var srcAtt = j;
      var dstAtt = widgetResize.attributes[j];
      
      if (typeof(curI[srcAtt]) != "undefined") {
        curI[dstAtt] = curI[srcAtt] * widgetResize.curScale;
      }
    }
  }
}
widgetResize.curScale = 1.0;
widgetResize.items = new Array();
widgetResize.attributes = new Object();
widgetResize.attributes["xHOffset"] = "hOffset";
widgetResize.attributes["xVOffset"] = "vOffset";
widgetResize.attributes["xWidth"] = "width";
widgetResize.attributes["xHeight"] = "height";
widgetResize.attributes["xScale"] = "scale";
widgetResize.attributes["xSize"] = "size";

function objectResize(obj, scale)
{
  if (isNaN(parseFloat(scale))) {
    scale = widgetResize.curScale;
  } else {
    scale = parseFloat(scale);
  }
  
  for (var i in widgetResize.attributes) {
    var srcAtt = i;
    var dstAtt = widgetResize.attributes[i];
    
    if (typeof(obj[srcAtt]) != "undefined") {
      obj[dstAtt] = obj[srcAtt] * scale;
    }
  }
  
}


function main_onContextMenu()
{
  hideBubble();
  // Build contextMenu
  var contextMenu = new Array();
  var mi;
  
  mi = new MenuItem();
  mi.title = "Copy";
  if (txtInput.data.length > 0) {
    mi.onSelect = "copy_onSelect()";
  }
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Paste";
  mi.onSelect = "paste_onSelect()";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "-";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Manage Dictionaries...";
  mi.onSelect = "dictionaries_onSelect();";
  contextMenu.push(mi);
  
  for (var i in activeDicts) {
    mi = new MenuItem();
    mi.title = i;
    mi.onSelect = "selectDict(\"" + escape(i) + "\");";
    if (i == unescape(preferences.currentDictionary.value)) {
      mi.checked = true;
    }
    contextMenu.push(mi);
  }
  
  mi = new MenuItem();
  mi.title = "-";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Make a Donation";
  mi.onSelect = "donate();";
  contextMenu.push(mi);
  
  wndMain.contextMenuItems = contextMenu;
}






function onWillChangePreferences()
{
  hideBubble();
}


function onPreferencesChanged()
{
  if (preferences.reset.value == "1") {
    var pArr = ["uiStyle", "widgetSize", "bgColor", "reset"];
    pdump(pArr);
    for (var p in pArr) {
      preferences[pArr[p]].value = preferences[pArr[p]].defaultValue;
    }
  }
  
  kmgInputBarBG.colorize = preferences.bgColor.value;
  
  widgetResize(preferences.widgetSize.value / 100.0);
  
  imgBee.visible = false;
  imgBeeShadow.visible = false;
  imgDot.visible = false;
  imgDot.colorize = imgDot.colorGreen;
  switch (preferences.uiStyle.value) {
    case "bee":
      imgBee.visible = true;
      imgBeeShadow.visible = true;
      break;
    case "corporate":
      imgDot.visible = true;
      break;
  }
  if (spinBee.anm) {
    spinBee.anm.kill();
    spinBee.anm = null;
  }
  
  txtInput_resize();
  
  tmrIdle.interval = 0.5;
}


function onRunCommandInBgComplete()
{
  var tag = system.event.data;
  switch (tag) {
    case "aspell":
      var resultsStr = eval(tag);
      var errorMessage = "";
      var pass = true;
      
      log(resultsStr);
      
      blockObj.aspell = false;
      
      if (/command not found|no such file or directory/im.test(resultsStr)) {
        errorMessage = "Aspell not found. Click to re-initialize.";
        beeSays(errorMessage, false, "unpackAspell();");
        stopBee();
        imgDot.colorize = imgDot.colorRed;
        break;
      } else if (/can not be opened/im.test(resultsStr)) {
        errorMessage = "Dictionary not found.";
        beeSays(errorMessage, false, "configureDictionaries();");
        stopBee();
        imgDot.colorize = imgDot.colorRed;
        break;
      } else if (/^error/im.test(resultsStr)) {
        errorMessage = resultsStr;
        pass = false;
      } else {
      
        var results = resultsStr.split(/\r\n?|\n/); // Thanks Harry Whitfield!
        
        var suggestions = new Array();
        var reResult;
        
        // Skip the first line (aspell version identification)
        for (var i = 1; i < results.length; i++) {
          var symbol = results[i].charAt(0);
          var line = results[i];
          if (line.length == 0) {
            continue;
          }
          switch (symbol) {
            // exact match found
            case "*":
            case "+":
            case "-":
              break;
            case "&":
            case "?":
              reResult = line.match(/([\&\?])\s+(\w+)\s+(\d+)\s+(\d+)\:\s+([^\s].*)/);
              if (reResult) {
                var curSuggestions = reResult[5].split(", ");
                for (var j in curSuggestions) {
                  suggestions.push(curSuggestions[j]);
                }
              }
              pass = false;
              break;
            // no hits at all
            case "#":
            default:
              pass = false;
              break;
          }
        }
      }
      
      if (pass) {
        log("CORRECT SPELLING");
        imgDot.colorize = imgDot.colorGreen;
      } else {
        if (errorMessage) {
          log("ERROR");
          beeSays(errorMessage);
        } else {
          log("INCORRECT SPELLING");
          if (suggestions.length > 0) {
            beeSays(suggestions, true);
          } else {
            beeSays(unknownPhrase());
          }
        }
        imgDot.colorize = imgDot.colorRed;
      }
      
      stopBee();
      break;
    default:
      log("Unexpected onRunCommandInBgComplete Event");
      log(tag + " = " + eval(tag));
      break;
  }
  
}

function dictionaries_onSelect()
{
  refreshDicts(true);
}


function copy_onSelect()
{
  system.clipboard = txtInput.data;
}


function paste_onSelect()
{
  txtInput.data = system.clipboard;
  hideBubble();
  checkSpelling(txtInput.data);
  txtInput.focus();
}


function unknownPhrase()
{
  if (unknownPhrase.curIndex >= unknownPhrase.randomIndex) {
    return unknownPhrase.phrases[random(0, unknownPhrase.phrases.length)];
  } else {
    return unknownPhrase.phrases[unknownPhrase.curIndex++];
  }
}
unknownPhrase.phrases = [
  "I can't tell what you meant.",
  "Nooo idea.",
  "I... I don't know!",
  "That word is bee-yond me.",
  "I'm not sure what you meant. Pleazzz try again.",
  "Buzz me up, Scotty.",
  "Try the buzzer again.",
  "Don't bee so random!",
  "Do plus-size bees have to visit bigger flowers?",
  "Oh, buzz off.",
  "I'm just not feeling that.",
  "To bee or not to bee...",
  "Bzzt - wrong answer."
];
unknownPhrase.curIndex = 0;
unknownPhrase.randomIndex = 5;

onLoad();
