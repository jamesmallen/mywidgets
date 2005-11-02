include("JamesMAllen.js");

function Initialize()
{
  
  var contextMenu = new Array();
  contextMenu[0] = new MenuItem();
  contextMenu[0].title = "About the Author";
  contextMenu[0].onSelect = "AboutTheAuthor();";
  contextMenu[1] = new MenuItem();
  contextMenu[1].title = "Make a Donation";
  contextMenu[1].onSelect = "Donate();";
  main.contextMenuItems = contextMenu;
  
  background = new Image();
  background.window = main;
  background.src = "Resources/Background.png";
  background.onDragDrop = "background_onDragDrop();";
  background.onDragEnter = "background_onDragEnter();";
  background.onDragExit = "background_onDragExit();";
  
  background.scaleHOffset = 0;
  background.scaleVOffset = 0;
  background.scaleWidth = 250;
  background.scaleHeight = 300;
  
  pearl = new Image();
  pearl.window = main;
  pearl.src = "Resources/GrayPearl.png";
  pearl.hAlign = "center";
  pearl.vAlign = "bottom";
  pearl.scaleHOffset = 125;
  pearl.scaleVOffset = 222;
  pearl.scaleWidth = 64;
  pearl.scaleHeight = 64;
  pearl.opacity = 0;
  
  pearlA = new Array();
  
  shrinkButton = new Image();
  shrinkButton.window = main;
  shrinkButton.src = "Resources/ShrinkButtonRed.png";
  shrinkButton.scaleWidth = shrinkButton.srcWidth;
  shrinkButton.scaleHeight = shrinkButton.srcHeight;
  shrinkButton.scaleHOffset = 31;
  shrinkButton.scaleVOffset = 253;
  shrinkButton.opacity = 0;
  
  growButton = new Image();
  growButton.window = main;
  growButton.src = "Resources/GrowButtonRed.png";
  growButton.scaleWidth = growButton.srcWidth;
  growButton.scaleHeight = growButton.srcHeight;
  growButton.scaleHOffset = 186;
  growButton.scaleVOffset = 253;
  growButton.opacity = 0;
  
  iconsArray = new Array();
  for (var i = 0; i < 6; i++) {
    iconsArray[i] = new Image();
    iconsArray[i].window = main;
    iconsArray[i].hAlign = "center";
    iconsArray[i].vAlign = "bottom";
    iconsArray[i].src = "Resources/DocumentIcon.png";
    iconsArray[i].scaleWidth = 64;
    iconsArray[i].scaleHeight = 64;
    iconsArray[i].scaleHOffset = 0;
    iconsArray[i].scaleVOffset = 0;
  }
  
  documentShadow = new Image();
  documentShadow.window = main;
  documentShadow.src = "Resources/DocumentShadow.png"
  documentShadow.hAlign = "center";
  documentShadow.vAlign = "bottom";
  documentShadow.scaleWidth = 97;
  documentShadow.scaleHeight = 36;
  documentShadow.scaleHOffset = 125;
  documentShadow.scaleVOffset = 222;
  documentShadow.opacity = 0;
  
  glowOverlay = new Image();
  glowOverlay.window = main;
  glowOverlay.src = "Resources/GlowOverlay.png";
  glowOverlay.opacity = 0;
  glowOverlay.scaleHOffset = 0;
  glowOverlay.scaleVOffset = 0;
  glowOverlay.scaleWidth = 250;
  glowOverlay.scaleHeight = 300;

  smartObjects = new Array();
  smartObjects.push(background);
  smartObjects.push(pearl);
  smartObjects.push(shrinkButton);
  smartObjects.push(growButton);
  smartObjects.push(documentShadow);
  smartObjects.push(glowOverlay);
  
  clearTimer = new Timer();
  clearTimer.ticking = false;
  clearTimer.interval = 15.0;
  clearTimer.onTimerFired = "hideResults(); clearTimer.ticking = false;";
  
  bgBlock = false;
  
  resize();
  
  main.visible = true;
  
}

function scaleIcons(level)
{
  baseHOffset = 125;
  baseVOffset = 200;
  
  for (var i in iconsArray) {
    if (iconsArray[i].opacity == 0) {
      continue;
    }
    iconsArray[i].hOffset = scale * (baseHOffset - (baseHOffset - iconsArray[i].scaleHOffset) * level);
    iconsArray[i].vOffset = scale * (baseVOffset - (baseVOffset - iconsArray[i].scaleVOffset) * level);
    iconsArray[i].width = scale * (iconsArray[i].scaleWidth * level);
    iconsArray[i].height = scale * (iconsArray[i].scaleHeight * level);
  }
  
}

function killSizeAnimations()
{
  if (typeof(sizeA) != "undefined") {
    sizeA.kill();
  }
}

function killPearlAnimations()
{
  for (var i in pearlA) {
    if (typeof(pearlA[i]) != "undefined") {
      pearlA[i].kill();
    }
    delete pearlA[i];
  }
}

function killFadeAnimations()
{
  if (typeof(buttonFadeA) != "undefined") {
    buttonFadeA.kill();
  }
  shrinkButton.onMouseEnter = "";
  shrinkButton.onMouseExit = "";
  shrinkButton.onMouseUp = "";
  growButton.onMouseEnter = "";
  growButton.onMouseExit = "";
  growButton.onMouseUp = "";
}

function size_update()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newLevel;
  var ret;
  
  if (percent >= 1.0) {
    newLevel = this.endLevel;
    ret = false;
  } else {
    newLevel = animator.ease(this.startLevel, this.endLevel, percent, animator.kEaseInOut);
    ret = true;
  }
  
  scaleIcons(newLevel);
  return ret;
  
}

function buttonFade_update()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newShrink;
  var newGrow;
  var ret;
  
  if (typeof(this.shrinkStart) == "undefined") {
    this.shrinkStart = shrinkButton.opacity;
  }
  if (typeof(this.growStart) == "undefined") {
    this.growStart = growButton.opacity;
  }
  
  if (percent >= 1.0) {
    newShrink = this.shrinkEnd;
    newGrow = this.growEnd;
    ret = false;
  } else {
    newShrink = animator.ease(this.shrinkStart, this.shrinkEnd, percent, animator.kEaseInOut);
    newGrow = animator.ease(this.growStart, this.growEnd, percent, animator.kEaseInOut);
    ret = true;
  }
  
  shrinkButton.opacity = newShrink;
  growButton.opacity = newGrow;
  
  return ret;
}

function zapper_update()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  if (t >= this.duration && this.duration >= 0) {
    glowOverlay.opacity = 0;
    return false;
  }
  
  if (glowOverlay.opacity == 0) {
    glowOverlay.opacity = 255;
  } else {
    glowOverlay.opacity = 0;
  }
  this.interval = Math.ceil(Math.random() * 200) + 50;
  if (t + this.interval > this.duration && this.duration >= 0) {
    this.interval = Math.max(this.duration - t, 50);
  }
  return true;
}


function shrink()
{
  killSizeAnimations();
  sizeA = new CustomAnimation(1, size_update, shrink_done);
  sizeA.duration = 1500;
  sizeA.startLevel = 1.0;
  sizeA.endLevel = 0.25;
  animator.start(sizeA);
}

function shrink_done()
{
  unblock();
  killPearlAnimations();
  pearlA[0] = new FadeAnimation(pearl, 255, 500, animator.kEaseOut);
  for (var i in iconsArray) {
    if (iconsArray[i].opacity != 0) {
      pearlA.push(new FadeAnimation(iconsArray[i], 0, 500, animator.kEaseOut));
    } else {
      break;
    }
  }
  animator.start(pearlA);
}

function hideResults()
{
  killPearlAnimations();
  if (pearl.opacity != 0) {
    pearl.onMouseUp = "";
    pearlA[0] = new FadeAnimation(pearl, 0, 1000, animator.kEaseIn);
  }
  if (iconsArray[0].opacity != 0) {
    iconsArray[0].onMouseUp = "";
    pearlA[1] = new FadeAnimation(iconsArray[0], 0, 1000, animator.kEaseIn);
  }
  animator.start(pearlA);
}


function grow()
{
  arrangeIcons();
  scaleIcons(0.25);
  iconsArray[0].opacity = 0;
  
  killPearlAnimations();
  pearlA[0] = new FadeAnimation(pearl, 0, 500, animator.kEaseIn, grow_done);
  pearlA[1] = new FadeAnimation(iconsArray[0], 255, 500, animator.kEaseIn);
  animator.start(pearlA);
}

function grow_done()
{
  unblock();
  killSizeAnimations();
  sizeA = new CustomAnimation(1, size_update);
  sizeA.duration = 1500;
  sizeA.startLevel = 0.25;
  sizeA.endLevel = 1.0;
  animator.start(sizeA);
}

function zapper(duration)
{
  if (typeof(zapperA) != "undefined") {
    zapperA.kill();
  }
  if (typeof(duration) == "undefined") {
    var duration = 1500;
  }
  zapperA = new CustomAnimation(1, zapper_update);
  zapperA.duration = duration;
  animator.start(zapperA);
}


function clearButtons(done_func)
{
  killFadeAnimations();
  if (typeof(done_func) == "undefined") {
    buttonFadeA = new CustomAnimation(1, buttonFade_update);
  } else {
    buttonFadeA = new CustomAnimation(1, buttonFade_update, done_func);
  }
  buttonFadeA.duration = 100;
  buttonFadeA.growEnd = 0;
  buttonFadeA.shrinkEnd = 0;
  animator.start(buttonFadeA);
}

function clearIcons()
{
  for (var i in iconsArray) {
    iconsArray[i].opacity = 0;
  }
}



function readyForShrink()
{
  clearButtons(readyForShrink_done);
}


function readyForShrink_done()
{
  killFadeAnimations();
  shrinkButton.src = "Resources/ShrinkButtonGreen.png";
  shrinkButton.onMouseEnter = "shrinkButton.opacity = 255; shrinkButtonOver = true;";
  shrinkButton.onMouseExit = "shrinkButton.opacity = 200; shrinkButtonOver = false;";
  shrinkButton.onMouseUp = "if (shrinkButtonOver) { doShrink(); }";
  growButton.src = "Resources/GrowButtonRed.png";
  buttonFadeA = new CustomAnimation(1, buttonFade_update);
  buttonFadeA.duration = 200;
  buttonFadeA.shrinkEnd = 200;
  buttonFadeA.growEnd = 127;
  animator.start(buttonFadeA);
}


function doShrink()
{
  if (bgBlock) {
    return;
  } else {
    bgBlock = true;
  }
  
  outputFilename = calcOutputFilename();
  if (outputFilename == null) {
    cancelOperation();
    return;
  }
  
  clearButtons();
  zapper(-1);
  
  var commandLine;
  
  var quotedFilesArray = new Array();
  if (dirFullArray.length > 1) {
    for (var i in filesArray) {
      quotedFilesArray.push(quoteFilename(filesArray[i]));
    }
  } else {
    for (var i in filesArray) {
      quotedFilesArray.push(quoteFilename(getFilename(filesArray[i])));
    }
  }
  
  switch (preferences.shrinkFormat.value) {
    case "zip":
      if (dirFullArray.length > 1) {
        commandLine = "zip -rj " + quoteFilename(outputFilename) + " " + quotedFilesArray.join(" ");
      } else {
        commandLine = "cd " + quoteFilename(dirFullArray[0]) + "; zip -r " + quoteFilename(outputFilename) + " " + quotedFilesArray.join(" ");
      }
      log(commandLine);
      runCommandInBg(commandLine, "zipResult");
      break;
    case "gz":
      if (filesArray.length > 1 || filesystem.isDirectory(filesArray[0])) {
        commandLine = "tar --create " + quotedFilesArray.join(" ") + " | gzip -c > " + quoteFilename(outputFilename);
      } else {
        commandLine = "gzip -c " + quotedFilesArray[0] + " > " + quoteFilename(outputFilename);
      }
      
      if (dirFullArray.length > 1) {
        commandLine = "cd " + quoteFilename(getFolder(outputFilename)) + "; " + commandLine;
      } else {
        commandLine = "cd " + quoteFilename(dirFullArray[0]) + "; " + commandLine;
      } 
      
      log(commandLine);
      runCommandInBg(commandLine, "gzipResult");
      break;
    case "bz2":
      if (filesArray.length > 1 || filesystem.isDirectory(filesArray[0])) {
        commandLine = "tar --create " + quotedFilesArray.join(" ") + " | bzip2 -c > " + quoteFilename(outputFilename);
      } else {
        commandLine = "bzip2 -c " + quotedFilesArray[0] + " > " + quoteFilename(outputFilename);
      }

      if (dirFullArray.length > 1) {
        commandLine = "cd " + quoteFilename(getFolder(outputFilename)) + "; " + commandLine;
      } else {
        commandLine = "cd " + quoteFilename(dirFullArray[0]) + "; " + commandLine;
      } 

      log(commandLine);
      runCommandInBg(commandLine, "bzip2Result");
      break;
  }
  
}

function cancelOperation()
{
  hidePearl();
  bgBlock = false;
}


function calcOutputFilename()
{
  var ret;
  var outputDirectory;
  var dirArray = new Array();
  
  var dirObj = new Object();
  var dirArray = new Array();
  dirFullArray = new Array();
  for (var i in filesArray) {
    var curFullDir = getFolder(filesArray[i]);
    if (curFullDir.length > 0 && typeof(dirObj[curFullDir]) == "undefined") {
      dirObj[curFullDir] = "";
      var curDir = getParent(filesArray[i]);
      dirArray.push(curDir);
      dirFullArray.push(curFullDir);
    }
  }
  
  if (filesArray.length == 1) {
    if (filesystem.isDirectory(filesArray[0])) {
      ret = getFilename(filesArray[0]);
    } else {
      if (preferences.namingScheme.value == "ext.zip") {
        ret = getFilename(filesArray[0]);
      } else {
        ret = getFilenameWithoutExtension(filesArray[0]);
      }
    }
  } else {
    var dirString = dirArray.join(", ");
    ret = "Files from " + dirString;
  }
  
  switch (preferences.shrinkOutputFolder.value) {
    case "ask":
      outputDirectory = chooseFolder();
      if (!outputDirectory) {
        return null;
      }
      break;
    case "desktop":
      outputDirectory = system.desktopFolder + "/";
      break;
    case "documents":
      outputDirectory = system.userDocumentsFolder + "/";
      break;
    case "containing":
    default:
      if (dirArray.length > 1) {
        
        dirArray.push("Desktop");
        dirFullArray.push(system.desktopFolder + "/");
        dirArray.push("My Documents");
        dirFullArray.push(system.userDocumentsFolder + "/");
        
        var formFields = new Array();
        formFields[0] = new FormField();
        formFields[0].name = "directory";
        formFields[0].type = "popup";
        formFields[0].title = "Output folder:";
        formFields[0].description = "Files from more than one folder were selected. Please select an output folder from the list above.";
        formFields[0].option = dirArray;
        formFields[0].optionValue = dirFullArray;
        formFields[0].defaultValue = system.desktopFolder + "/";
        
        result = form(formFields, "Choose output folder");
        
        if (!result) {
          return null;
        } else {
          outputDirectory = result[0];
        }
      } else {
        outputDirectory = dirFullArray[0];
      }
      break;
  }
  
  print("outputDirectory:" + outputDirectory);
  
  var filename = outputDirectory + ret + currentExtension()
  if (filesystem.itemExists(filename)) {
    switch (preferences.shrinkExistsAction.value) {
      case "unique":
        for (var i = 1; filesystem.itemExists(filename); i++) {
          filename = outputDirectory + ret + " (" + i + ")" + currentExtension();
        }
        break;
      case "overwrite":
        break;
      case "ask":
      default:
        var ret = saveAs();
        if (!ret) {
          return null;
        }
        if (isCompressedExtension(getExtension(ret))) {
          return ret;
        } else {
          return ret + currentExtension();
        }
        break;
    }
  }
  return filename;
}


function readyForGrow()
{
  clearButtons(readyForGrow_done);
}

function readyForGrow_done()
{
  killFadeAnimations();
  shrinkButton.src = "Resources/ShrinkButtonRed.png";
  growButton.src = "Resources/GrowButtonGreen.png";
  growButton.onMouseEnter = "growButton.opacity = 255; growButtonOver = true;";
  growButton.onMouseExit = "growButton.opacity = 200; growButtonOver = false;";
  growButton.onMouseUp = "if (growButtonOver) { doGrow(); }";
  buttonFadeA = new CustomAnimation(1, buttonFade_update);
  buttonFadeA.duration = 200;
  buttonFadeA.shrinkEnd = 127;
  buttonFadeA.growEnd = 200;
  animator.start(buttonFadeA);
}

function doGrow()
{
  if (bgBlock) {
    return;
  } else {
    bgBlock = true;
  }
  
  clearButtons();
  zapper(-1);
  
  
  var commandLine;
  
  outputFilename = calcGrowFilename();
  
  commandLine = "mkdir -p " + quoteFilename(outputFilename) + "; cd " + quoteFilename(outputFilename) + "; ";
  
  if (/\.tar\.gz$|\.tgz$|\.tar\.gzip$/.test(filesArray[0])) {
    commandLine += "gunzip -c " + quoteFilename(filesArray[0]) + " | tar -x";
    log(commandLine);
    runCommandInBg(commandLine, "gunzipResult");
  } else if (/\.tar\.bz2$|\.tar\.bzip2$|\.tbz2$|\.tbz$/.test(filesArray[0])) {
    commandLine += "bunzip2 -c " + quoteFilename(filesArray[0]) + " | tar -x";
    log(commandLine);
    runCommandInBg(commandLine, "bunzip2Result");
  } else if (/\.tar$/.test(filesArray[0])) {
    commandLine += "tar -x < " + quoteFilename(filesArray[0]);
    log(commandLine);
    runCommandInBg(commandLine, "untarResult");
  } else if (/\.gz$|\.gzip$/.test(filesArray[0])) {
    commandLine += "gunzip < " + quoteFilename(filesArray[0]) + " > " + quoteFilename(getFilenameWithoutExtension(filesArray[0]));
    log(commandLine);
    runCommandInBg(commandLine, "gunzipResult");
  } else if (/\.bz2$|\.bzip2$/.test(filesArray[0])) {
    commandLine += "bunzip2 < " + quoteFilename(filesArray[0]) + " > " + quoteFilename(getFilenameWithoutExtension(filesArray[0]));
    log(commandLine);
    runCommandInBg(commandLine, "bunzip2Result");
  } else if (/\.zip$/.test(filesArray[0])) {
    commandLine += "unzip -o " + quoteFilename(filesArray[0]) + " -d " + quoteFilename(outputFilename);
    log(commandLine);
    runCommandInBg(commandLine, "unzipResult");
  } else {
    // WTF?
    log("WTF?");
  }
  
}


function calcGrowFilename()
{
  var outputFolder;
  var ret;
  
  switch (preferences.growOutputFolder.value) {
    case "desktop":
      outputFolder = system.desktopFolder + "/";
      break;
    case "documents":
      outputFolder = system.userDocumentsFolder + "/";
      break;
    case "ask":
      outputFolder = saveAs();
      if (!outputFolder) {
        return null;
      }
      break;
    case "containing":
    default:
      outputFolder = getFolder(filesArray[0]);
      break;
  }
  
  ret = outputFolder;
  
  if (preferences.growExistsAction.value != "overwrite") {
    ret = outputFolder = outputFolder + getFilenameWithoutExtension(filesArray[0]);
    for (var i = 1; filesystem.itemExists(ret); i++) {
      ret = outputFolder + " (" + i + ")";
    }
  }
  
  return ret;
}

function background_onDragEnter()
{
  if (system.event.data[0] == "filenames") {
    clearButtons();
    clearIcons();
    documentShadow.opacity = 255;
  }
}

function background_onDragExit()
{
  documentShadow.opacity = 0;
}

function background_onDragDrop()
{
  if (bgBlock) {
    log("Unable to drop files - blocking operation in progress");
    return;
  }
  if (system.event.data[0] != "filenames") {
    log("Non-files dropped - taking no action");
    return;
  } else {
    log("Files dropped");
  }
  
  killPearlAnimations();
  killSizeAnimations();
  pearl.opacity = 0;
  for (var i in iconsArray) {
    iconsArray[i].opacity = 0;
  }
  
  filesArray = new Array();
  for (var i = 1; i < system.event.data.length; i++) {
    filesArray.push(system.event.data[i]);
  }
  
  if (filesArray.length == 1 && isCompressedExtension(getExtension(filesArray[0]))) {
    // One compressed file - shows up as a pearl
    pearl.opacity = 255;
    for (var i in iconsArray) {
      iconsArray[i].opacity = 0;
    }
    readyForGrow();
  } else {
    pearl.opacity = 0;
    arrangeIcons(filesArray);
    readyForShrink();
  }
  
}




function main_onFirstDisplay()
{
  if (system.platform == "macintosh") {
    preferences.useFileIcons.value = 1;
  }
}


function arrangeIcons(arr)
{
  print("Running arrangeIcons");
  
  if (typeof(arr) == "undefined") {
    icon = iconsArray[0];
    /*
    if (extractType == "folder") {
      icon.src = "Resources/FolderIcon.png";
    } else {
      icon.src = "Resources/DocumentIcon.png";
    }
    */
    icon.src = "Resources/DocumentIcon.png";
    icon.opacity = 255;
    
    for (var i = 1; i < iconsArray.length; i++) {
      iconsArray[i].opacity = 0;
    }
    
    numIcons = 1;
    newSize = 128;
  } else {
    for (var i = 0; i < iconsArray.length; i++) {
      if (i < arr.length) {
        icon = iconsArray[i];
        if (preferences.useFileIcons.value == "1") {
          icon.useFileIcon = true;
          icon.src = arr[i];
        } else {
          if (filesystem.isDirectory(arr[i])) {
            icon.src = "Resources/FolderIcon.png";
          } else {
            icon.src = "Resources/DocumentIcon.png";
          }
        }
        icon.opacity = 255;
      } else {
        iconsArray[i].opacity = 0;
      }
    }
    
    var numIcons = Math.min(arr.length, iconsArray.length);
    
    if (system.platform == "windows") {
      var newSize = 64;
    } else {
      var newSize = 128 * Math.sqrt(numIcons) / numIcons;
    }
  
  }
  
  for (var i in iconsArray) {
    iconsArray[i].scaleWidth = iconsArray[i].scaleHeight = newSize;
  }
  
  switch (numIcons) {
    case 1:
      iconsArray[0].scaleHOffset = 125;
      iconsArray[0].scaleVOffset = 227;
      break;
    case 2:
      iconsArray[0].scaleHOffset = 93;
      iconsArray[0].scaleVOffset = 214;
      iconsArray[1].scaleHOffset = 157;
      iconsArray[1].scaleVOffset = 214;
      break;
    case 3:
      iconsArray[0].scaleHOffset = 125;
      iconsArray[0].scaleVOffset = 181;
      iconsArray[1].scaleHOffset = 97;
      iconsArray[1].scaleVOffset = 218;
      iconsArray[2].scaleHOffset = 153;
      iconsArray[2].scaleVOffset = 218;
      break;
    case 4:
      iconsArray[0].scaleHOffset = 125;
      iconsArray[0].scaleVOffset = 177;
      iconsArray[1].scaleHOffset = 99;
      iconsArray[1].scaleVOffset = 203;
      iconsArray[2].scaleHOffset = 151;
      iconsArray[2].scaleVOffset = 203;
      iconsArray[3].scaleHOffset = 125;
      iconsArray[3].scaleVOffset = 229;
      break;
    case 5:
      iconsArray[0].scaleHOffset = 104;
      iconsArray[0].scaleVOffset = 181;
      iconsArray[1].scaleHOffset = 146;
      iconsArray[1].scaleVOffset = 181;
      iconsArray[2].scaleHOffset = 90;
      iconsArray[2].scaleVOffset = 209;
      iconsArray[3].scaleHOffset = 160;
      iconsArray[3].scaleVOffset = 209;
      iconsArray[4].scaleHOffset = 125;
      iconsArray[4].scaleVOffset = 221;
      break;
    case 6:
    default:
      iconsArray[0].scaleHOffset = 125;
      iconsArray[0].scaleVOffset = 170;
      iconsArray[1].scaleHOffset = 104;
      iconsArray[1].scaleVOffset = 197;
      iconsArray[2].scaleHOffset = 146;
      iconsArray[2].scaleVOffset = 197;
      iconsArray[3].scaleHOffset = 90;
      iconsArray[3].scaleVOffset = 219;
      iconsArray[4].scaleHOffset = 125;
      iconsArray[4].scaleVOffset = 219;
      iconsArray[5].scaleHOffset = 160;
      iconsArray[5].scaleVOffset = 219;
      break;
  }
  
  resize();
  
}




function resize()
{
  scale = parseInt(preferences.tismSize.value);
  if (!scale) {
    scale = preferences.tismSize.value = preferences.tismSize.defaultValue;
  }
  
  scale = scale * 0.01;
  
  var newWidth = scale * 250;
  var newHeight = scale * 300;
  
  // Off horizontally
  if (main.hOffset + newWidth > screen.availWidth) {
    main.hOffset = screen.availWidth - newWidth;
  } else if (main.hOffset < screen.availLeft) {
    main.hOffset = screen.availLeft;
  }
  // Off vertically
  if (main.vOffset + newHeight > screen.availHeight) {
    main.vOffset = screen.availHeight - newHeight;
  } else if (main.vOffset < screen.availTop) {
    main.vOffset = screen.availTop;
  }
  
  main.width = newWidth;
  main.height = newHeight;
  
  for (var i in smartObjects) {
    smartObjects[i].hOffset = scale * smartObjects[i].scaleHOffset;
    smartObjects[i].vOffset = scale * smartObjects[i].scaleVOffset;
    smartObjects[i].width = scale * smartObjects[i].scaleWidth;
    smartObjects[i].height = scale * smartObjects[i].scaleHeight;
  }
  
  for (var i in iconsArray) {
    iconsArray[i].hOffset = scale * iconsArray[i].scaleHOffset;
    iconsArray[i].vOffset = scale * iconsArray[i].scaleVOffset;
    iconsArray[i].width = scale * iconsArray[i].scaleWidth;
    iconsArray[i].height = scale * iconsArray[i].scaleHeight;
  }

  pearl.colorize = preferences.pearlColor.value;
  glowOverlay.colorize = preferences.rayColor.value;
  
}


function onPreferencesChanged()
{
  resize();
}


function onRunCommandInBgComplete()
{
  var result;
  var success = false;
  eval("result = " + system.event.data + ";");
  
  log(result);
  
  switch (system.event.data) {
    case "zipResult":
    case "gzipResult":
    case "bzip2Result":
      zapper();
      shrink();
      pearl.onMouseUp = "filesystem.reveal(outputFilename);";
      break;
    case "unzipResult":
    case "gunzipResult":
    case "bunzip2Result":
    case "untarResult":
      zapper();
      grow();
      iconsArray[0].onMouseUp = "filesystem.reveal(outputFilename);";
      break;
  }
  
  success = true;
  
  clearTimer.reset();
  clearTimer.ticking = true;
}

function getFilename(path) {
  var pos = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return path.substr(pos + 1);
}

function getExtension(path) {
  var pos = path.lastIndexOf('.');
  return (pos < 0) ? "" : path.substr(pos + 1);
}

function getFilenameWithoutExtension(path) {
  var pos1 = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  var pos2 = path.lastIndexOf('.');
  return (pos2 < pos1) ?
    path.substr(pos1 + 1) : path.substr(pos1 + 1, pos2 - (pos1 + 1));
}

function getFolder(path) {
  var pos = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return path.substr(0, pos + 1);
}

function getParent(path) {
  path = path.substr(0, path.length - 1); // chop off any trailing slash
  path = getFolder(path);
  var result = path.match(/[^\/\\]+/g);
  return result[result.length - 1];
}


function isCompressedExtension(ext)
{
  ext = ext.toLowerCase();
  if (ext == "tar" || ext == "gz" || ext == "tgz" || ext == "gzip" || ext == "bz2" || ext == "bzip2" || ext == "tbz2" || ext == "tbz" || ext == "zip") {
    return true;
  } else {
    return false;
  }
}

function currentExtension()
{
  switch (preferences.shrinkFormat.value) {
    case "zip":
      return ".zip";
      break;
    case "gz":
      if (filesArray.length > 1 || filesystem.isDirectory(filesArray[0])) {
        return ".tar.gz";
      } else {
        return ".gz";
      }
      break;
    case "bz2":
      if (filesArray.length > 1 || filesystem.isDirectory(filesArray[0])) {
        return ".tar.bz2";
      } else {
        return ".bz2";
      }
      break;
  }
}

function unblock()
{
  bgBlock = false;
}


function quoteFilename(str)
{
  return "\"" + str.replace(/[\\"]/g, "\\$&") + "\"";
}


Initialize();



