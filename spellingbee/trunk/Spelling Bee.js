/**
 * Spelling Bee
 * by James M. Allen
 * 
 * aspell is an open-source program that is distributed with this Widget in
 * binary form. You can get the source code from http://aspell.net.
 * 
 * Jessica Relitz helped out with dialogue. ;-)
 * 
 * All other images and code are copyright 2005-2006 James M. Allen, and may
 * not be used without permission.
 */

include("lib.js");
include("KImage.js");


function onLoad()
{
  // Build contextMenu
  contextMenu = new Array();
  var mi;
  mi = new MenuItem();
  mi.title = "Copy";
  mi.onSelect = "copy_onSelect()";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Paste";
  mi.onSelect = "paste_onSelect()";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "-";
  contextMenu.push(mi);
  
  mi = new MenuItem();
  mi.title = "Make a Donation";
  mi.onSelect = "donate();";
  contextMenu.push(mi);
  
  wndMain.contextMenuItems = contextMenu;
  wndMain.onContextMenu = "main_onContextMenu();";
  
  blockObj = new Object();
  blockObj.aspell = false;
  
  
  kmgInputBar = new KImage();
  kmgInputBar.window = wndMain;
  kmgInputBar.src = "Resources/InputBar<.png";
  kmgInputBar.xHOffset = 51;
  kmgInputBar.xVOffset = 63;
  kmgInputBar.xWidth = 182;
  kmgInputBar.xHeight = 42;
  kmgInputBar.xScale = 1.0;
  widgetResize.items.push(kmgInputBar);
  
  imgBeeShadow = new Image();
  imgBeeShadow.window = wndMain;
  imgBeeShadow.src = "Resources/BeeShadow.png";
  imgBeeShadow.hAlign = "center";
  imgBeeShadow.vAlign = "center";
  imgBeeShadow.xHOffset = 50;
  imgBeeShadow.xVOffset = 106;
  imgBeeShadow.xWidth = 100;
  imgBeeShadow.xHeight = 102;
  widgetResize.items.push(imgBeeShadow);
  
  imgBeeBlur = new Image();
  imgBeeBlur.window = wndMain;
  imgBeeBlur.src = "Resources/BeeBlur.png";
  imgBeeBlur.hAlign = "center";
  imgBeeBlur.vAlign = "center";
  imgBeeBlur.xHOffset = 50;
  imgBeeBlur.xVOffset = 105;
  imgBeeBlur.xWidth = 100;
  imgBeeBlur.xHeight = 100;
  imgBeeBlur.visible = false;
  widgetResize.items.push(imgBeeBlur);
  
  imgBee = new Image();
  imgBee.window = wndMain;
  imgBee.src = "Resources/Bee.png";
  imgBee.hAlign = "center";
  imgBee.vAlign = "center";
  imgBee.xHOffset = 50;
  imgBee.xVOffset = 105;
  imgBee.xWidth = 100;
  imgBee.xHeight = 100;
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
  txtInput.onKeyPress = "txtInput_onKeyPress();";
  txtInput.xHOffset = 82;
  txtInput.xVOffset = 71;
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
  imgBubbleAbove.onMouseUp = "hideBubble();";
  widgetResize.items.push(imgBubbleAbove);
  
  imgBubbleBelow = new Image();
  frmBubble.addSubview(imgBubbleBelow);
  imgBubbleBelow.src = "Resources/BubbleBelow.png";
  imgBubbleBelow.xHOffset = 0;
  imgBubbleBelow.xVOffset = 0;
  imgBubbleBelow.xWidth = 182;
  imgBubbleBelow.xHeight = 87;
  imgBubbleBelow.visible = false;
  imgBubbleBelow.onMouseUp = "hideBubble();";
  widgetResize.items.push(imgBubbleBelow);
  
  anmBubble = null;
  
  tmrIdle = new Timer();
  tmrIdle.interval = 0.5;
  tmrIdle.ticking = false;
  tmrIdle.onTimerFired = "tmrIdle_onTimerFired();";
  
  onPreferencesChanged();
  
  // Platform-specific things
  switch (system.platform) {
    case "windows":
      aspellExe = system.widgetDataFolder + "/aspell/bin/aspell.exe";
      wordListCompressExe = system.widgetDataFolder + "/aspell/bin/word-list-compress.exe";
      break;
    case "macintosh":
      aspellExe = system.widgetDataFolder + "/aspell/bin/aspell";
      wordListCompressExe = system.widgetDataFolder + "/aspell/bin/word-list-compress";
      break;
    default:
      aspellExe = "aspell";
      wordListCompressExe = "word-list-compress";
  }
  
  // Initialize
  if (!filesystem.itemExists(aspellExe)) {
    unpackAspell();
  }
  if (!filesystem.itemExists(aspellExe)) {
    aspellExe = "aspell";
    wordListCompressExe = "word-list-compress";
  }
  
}


function tmrIdle_onTimerFired()
{
  tmrIdle.ticking = false;
  checkSpelling(txtInput.data);
}

function txtInput_onKeyPress()
{
  var keyCode = system.event.keyString;
  
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
  
  txtInput_resize();
}


function txtInput_resize()
{
  txtInput.width = -1;
  updateNow();
  txtInput.width = Math.max(txtInput.xWidth * widgetResize.curScale, txtInput.width);
  kmgInputBar.width = Math.max((kmgInputBar.xWidth - txtInput.xWidth) * widgetResize.curScale + txtInput.width);
  
  wndMain.width = Math.max(kmgInputBar.hOffset + kmgInputBar.width, frmBubble.hOffset + imgBubbleAbove.width);
  
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
  
  // var cmdLine = "export DICTIONARY=" + quoteFilename(dictionaryFile) + "; echo " + quoteFilename(inputStr) + " | " + quoteFilename(ispellExe) + " -a";
  var cmdLine = "export ASPELL_CONF=" + quoteFilename("prefix " + system.widgetDataFolder + "/aspell") + "; echo " + quoteFilename(inputStr) + " | " + quoteFilename(aspellExe) + " -d " + unescape(preferences.currentLanguage.value) + ".multi -a";
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
      // TODO: get a MacOS aspell binary!
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
    cmdOutput = runCommand("export ASPELL_CONF=" + quoteFilename("prefix " + system.widgetDataFolder + "/aspell") + "; " + quoteFilename(wordListCompressExe) + " d < " + quoteFilename(myTemporaryFolder + "/" + cwlFiles[i]) + " | " + quoteFilename(aspellExe) + " --lang=" + lang + " create master " + cwlFilename + ".rws");
    log(cmdOutput);
  }
  
  for (var i = 0; i < multiFiles.length; i++) {
    cmdOutput = runCommand("cp -f " + quoteFilename(myTemporaryFolder + "/" + multiFiles[i]) + " " + quoteFilename(system.widgetDataFolder + "/aspell/dict"));
    log(cmdOutput);
  }
  
  
  
  /*
  
  if (!language || language == "all") {
    for (var i in buildDictionary.languages) {
      buildDictionary(buildDictionary.languages[i]);
    }
  } else {
    var srcFiles;
    var affFile;
    var wordsFilename;
    var cmdLine;
    
    var hashFilename;
    
    var str;
    
    switch (language) {
      case "british":
        srcFiles = ["dic/english.0", "dic/english.1", "dic/english.2", "dic/british.0", "dic/british.1", "dic/british.2"];
        affFile = "dic/english.aff";
        break;
      case "american":
      default:
        srcFiles = ["dic/english.0", "dic/english.1", "dic/english.2", "dic/american.0", "dic/american.1", "dic/american.2"];
        affFile = "dic/english.aff";
        break;
    }
    
    wordsFilename = system.widgetDataFolder + "/" + language + ".words";
    cmdLine = "sort -u -t/ +0f -1 +0 -o " + quoteFilename(wordsFilename);
    for (var i in srcFiles) {
      cmdLine += (" " + quoteFilename(srcFiles[i]));
    }
    str = runCommand(cmdLine);
    log(str);
    
    hashFilename = system.widgetDataFolder + "/" + language + ".hash";
    cmdLine = quoteFilename(buildhashExe) + " " + quoteFilename(wordsFilename) + " " + quoteFilename(affFile) + " " + quoteFilename(hashFilename);
    str = runCommand(cmdLine);
    log(str);
  }
  
  */
}

//buildDictionary.languages = ["american", "british"];

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


function beeSays(str, autoLink, onMouseUp)
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
      if (onMouseUp) {
        beeSays.textObjs[i].bgOpacity = 1;
        beeSays.textObjs[i].onMouseUp = onMouseUp;
      } else if (autoLink) {
        beeSays.textObjs[i].bgOpacity = 1;
        beeSays.textObjs[i].onMouseUp = "textObjs_onMouseUp(" + i + ");";
      } else {
        beeSays.textObjs[i].bgOpacity = 0;
        beeSays.textObjs[i].onMouseUp = null;
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
            beeSays.textObjs[i - 1].onMouseUp = "textObjs_onMouseUp(-1);";
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


function textObjs_onMouseUp(idx)
{
  if (idx < 0) {
    var arrMenu = new Array();
    var mi;
    for (var i = 0; i < beeSays.words.length; i++) {
      if (beeSays.words[i]) {
        var word = beeSays.words[i];
      } else {
        var word = beeSays.textObjs[i].data;
        word = word.replace(/^(\s+)|[^\w\ \-\']|(\s+)$/g, "");
      }
      mi = new MenuItem();
      mi.title = word;
      mi.onSelect = "textObjs_onMouseUp(" + i + ");";
      arrMenu.push(mi);
    }
    
    popupMenu(arrMenu, system.event.hOffset, system.event.vOffset);
    
  } else {
    if (beeSays.words[idx]) {
      var word = beeSays.words[idx];
    } else {
      var word = beeSays.textObjs[idx].data;
      word = word.replace(/^(\s+)|[^\w\ \-\']|(\s+)$/g, "");
    }
    
    hideBubble();
    
    txtInput.data = word;
    
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
  var endTime = 60000 / spinBee.rpm;
  if (t >= endTime && this.lastOne) {
    imgBeeShadow.rotation = 0;
    imgBeeBlur.rotation = 0;
    imgBeeBlur.visible = false;
    imgBee.rotation = 0;
    this.finished = true;
    return false;
  } else {
    this.newStartTime += (endTime * Math.floor(t / endTime));
    t = Math.max(0, now - this.newStartTime);
    var pct = t / endTime;
    var rot = animator.ease(0, -360, pct, animator.kEaseNone);
    imgBeeShadow.rotation = rot;
    imgBeeBlur.rotation = rot;
    imgBee.rotation = rot;
    if (!imgBeeBlur.visible && rot <= -15) {
      imgBeeBlur.visible = true;
    }
    return true;
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
  wndMain.contextMenuItems = contextMenu;
}






function onWillChangePreferences()
{
  hideBubble();
}


function onPreferencesChanged()
{
  widgetResize(preferences.widgetSize.value / 100.0);
  
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
        break;
      } else if (/can not be opened/im.test(resultsStr)) {
        errorMessage = "Dictionary not found.";
        beeSays(errorMessage, false, "configureDictionaries();");
        pass = false;
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
      }
      // pdump(suggestions);
      
      stopBee();
      break;
    default:
      log("Unexpected onRunCommandInBgComplete Event");
      log(tag + " = " + eval(tag));
      break;
  }
  
}

function copy_onSelect()
{
  system.clipboard = txtInput.data;
}


function paste_onSelect()
{
  txtInput.data = system.clipboard;
  hideBubble();
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
