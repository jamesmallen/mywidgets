/**
 * Poetry
 * by James M. Allen
 *
 * Please see the CREDITS.txt file for license and copyright information.
 * You may not redistribute this widget without including the CREDITS.txt file.
 */



include("Lib.js");
include("KImage.js");
include("Word.js");
include("Resizer.js");

generic_mouseOver = null;

function main_onLoad()
{
  strPackageFolder = system.widgetDataFolder + "/Packages";
  
  
  wndMain.onContextMenu = "main_onContextMenu()";
  
  kmgBackground = new KImage();
  kmgBackground.window = wndMain;
  kmgBackground.hOffset = 0;
  kmgBackground.vOffset = 0;
  kmgBackground.src = "Resources/Background*.png";
  
  anmBackground = null;
  anmButtons = null;
  
  imgTrashButton = new Image();
  imgTrashButton.window = wndMain;
  imgTrashButton.src = "Resources/TrashButton.png";
  imgTrashButton.opacity = 0;
  imgTrashButton.onMouseEnter = "generic_onMouseEnter('imgTrashButton'); imgTrashButton.opacity = 255;";
  imgTrashButton.onMouseExit = "generic_onMouseExit('imgTrashButton'); imgTrashButton.opacity = 127;";
  imgTrashButton.onMouseUp = "generic_onMouseUp('imgTrashButton')";
  imgTrashButton.vAlign = "bottom";
  
  imgSaveButton = new Image();
  imgSaveButton.window = wndMain;
  imgSaveButton.src = "Resources/SaveButton.png";
  imgSaveButton.opacity = 0;
  imgSaveButton.onMouseEnter = "generic_onMouseEnter('imgSaveButton'); imgSaveButton.opacity = 255;";
  imgSaveButton.onMouseExit = "generic_onMouseExit('imgSaveButton'); imgSaveButton.opacity = 127;";
  imgSaveButton.onMouseUp = "generic_onMouseUp('imgSaveButton')";
  imgSaveButton.hAlign = "center";
  imgSaveButton.vAlign = "bottom";
  
  
  imgAddButton = new Image();
  imgAddButton.window = wndMain;
  imgAddButton.src = "Resources/AddButton.png";
  imgAddButton.opacity = 0;
  imgAddButton.onMouseEnter = "generic_onMouseEnter('imgAddButton'); imgAddButton.opacity = 255;";
  imgAddButton.onMouseExit = "generic_onMouseExit('imgAddButton'); imgAddButton.opacity = 127;";
  // imgAddButton.onMouseUp = "generic_onMouseUp('imgAddButton')";
  imgAddButton.onMouseDown = "imgAddButton_onMouseDown();";
  imgAddButton.hAlign = "right";
  imgAddButton.vAlign = "bottom";
  
  // arrWords = new Array();
  objFileCache = new Object();;
  
  rzr = new Resizer();
  rzr.img.window = wndMain;
  rzr.onResize = resize;
  rzr.saveWidth = "preferences.width.value";
  rzr.saveHeight = "preferences.height.value";
  rzr.img.zOrder = 1000000;
  
  if (preferences.width.value == "-1" || preferences.height.value == "-1") {
    autoPosition();
  }
  
  resize(parseInt(preferences.width.value), parseInt(preferences.height.value));  
  
  var imgDummy = new Image();
  Word.baseZOrder = imgDummy.zOrder;
  imgDummy = null;
  
  loadPackageFromPrefs();
  
  refreshWordPackages();
  // unserializeWordSources();
  
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
  clearAll();
}

function imgSaveButton_onMouseUp()
{
  
}

function imgAddButton_onMouseDown()
{
  popupAddWords();
}

function clearAll()
{
  var result = alert("Are you sure you want to clear all the words?", "Yes", "No");
  if (result == 1) {
    Word.clearAll();
  }
  savePackageToPrefs();
}

function loadPackageFromPrefs()
{
  Word.unserialize(preferences.wordPositions.value.split("|"));
}

function savePackageToPrefs()
{
  preferences.wordPositions.value = Word.serialize().join("|");
}

/*
function serializeWordSources()
{
  var arrCustomURLs = new Array();
  for (var i in arrWordSourceURLs) {
    var arrCurURL = new Array();
    arrCurURL.push(escape(arrWordSourceURLs[i].path));
    arrCurURL.push(escape(arrWordSourceURLs[i].title));
    arrCustomURLs.push(arrCurURL.join(","));
  }
  preferences.customURLs.value = arrCustomURLs.join("|");
}

function unserializeWordSources()
{
  refreshWordPackages();
  
  arrWordSourceURLs = new Array();
  var customURLPaths = preferences.customURLs.value.split("|");
  for (var i in customURLPaths) {
    var curURL = customURLPaths[i].split(",");
    var o = new Object();
    o.path = unescape(curURL[0]);
    o.title = unescape(curURL[1]);
    arrWordSourceURLs.push(o);
  }
}



function editWordSources()
{
  var arrOptions = new Array();
  var arrOptionValues = new Array();
  
  for (var i in arrWordSourceURLs) {
    arrOptions.push(arrWordSourceURLs[i].title);
    arrOptionValues.push("u" + i);
  }
  
  arrOptions.push("New file...");
  arrOptionValues.push("fnew");
  
  arrOptions.push("New URL...");
  arrOptionValues.push("unew");
  
  var arrFormFields = new Array();
  var ff = new FormField();
  ff.title = "Source:";
  ff.type = "popup";
  ff.option = arrOptions;
  ff.optionValue = arrOptionValues;
  ff.description = "Select a source and click Next to edit or delete that item.";
  arrFormFields.push(ff);
  
  var result = form(arrFormFields, "Edit word sources", "Next", "Cancel");
  
  if (!result) {
    return;
  }
  
  var arrFormFields = new Array();
  
  switch (result[0].charAt(0)) {
    case "f":
      var ff;
      ff = new FormField();
      ff.title = "Word source:";
      ff.type = "selector";
      ff.style = "open";
      ff.kind = "files";
      arrFormFields.push(ff);
      
      var fileIndex;
      var formTitle;
      
      fileIndex = arrWordSourceFiles.length;
      formTitle = "New file";
      
      var result = form(arrFormFields, formTitle, "Save", "Cancel");
      
      if (!result) {
        return;
      }
      
      runCommand("cp -f " + quoteFilename(result[0]) + " " + quoteFilename(strPackageFolder + "/"));
      refreshWordPackages();
      
      break;
    case "u":
      var ff = new FormField();
      ff.title = "Name:";
      ff.type = "text";
      arrFormFields.push(ff);
      
      var ff = new FormField();
      ff.title = "URL:";
      ff.type = "text";
      arrFormFields.push(ff);
      
      var ff = new FormField();
      ff.type = "checkbox";
      ff.title = "Delete this source";
      ff.defaultValue = 0;
      arrFormFields.push(ff);
      
      var urlIndex;
      var formTitle;
      
      if (result[0].substr(1) == "new") {
        urlIndex = arrWordSourceURLs.length;
        formTitle = "New URL";
      } else {
        urlIndex = parseInt(result[0].substr(1));
        arrFormFields[0].defaultValue = arrWordSourceURLs[urlIndex].title;
        arrFormFields[1].defaultValue = arrWordSourceURLs[urlIndex].path;
        formTitle = "Editing URL";
      }
      
      var result = form(arrFormFields, formTitle, "Save", "Cancel");
      
      if (!result) {
        return;
      }
      
      if (result[1] == 1) {
        arrWordSourceURLs.splice(urlIndex, 1);
      } else {
        o = new Object();
        o.title = result[0];
        o.path = result[1];
        arrWordSourceURLs[urlIndex] = o;
      }
      
      break;
  }
  
  serializeWordSources();
  
}
*/

/*
function addWordsFromAllFiles(numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = parseInt(preferences.wordsPerClick.value);
  }
  
  var modValue = 0;
  var lens = new Array();
  for (var i = 0; i < arrWordSourceFiles.length; i++) {
    addWordsFromFile(i, 0);
    lens[i] = objFileCache[arrWordSourceFiles[i].path].length;
    modValue += lens[i];
  }
  
  if (numWords < 0) {
    numWords = 10;
  }
  
  for (var i = 0; i < numWords; i++) {
    var wordIndex = random(0, modValue);
    var lenSum = 0;
    for (var j = 0; j < lens.length; j++) {
      lenSum += lens[j];
      if (wordIndex < lenSum) {
        addWordsFromFile(j, 1);
        break;
      }
    }
  }
  
}
*/

/*
function addWordsFromFile(fileIndex, numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = parseInt(preferences.wordsPerClick.value);
  }
  
  var path = arrWordSourceFiles[fileIndex].path;
  
  if (typeof(objFileCache[path]) == "undefined" || preferences.doNotCache.value == "1") {
    objFileCache[path] = filesystem.readFile(path, true);
  }
  
  if (numWords < 0) {
    for (var i = 0; i < objFileCache[path].length; i++) {
      addWord(objFileCache[path][i]);
    }
  } else {
    for (var i = 0; i < numWords; i++) {
      addWord(objFileCache[path][random(0, objFileCache[path].length)]);
    }
  }
  
  savePackageToPrefs();
  
}
*/


function importFile()
{
  var arrFormFields = new Array();
  var ff = new FormField();
  ff.title = "File:";
  ff.type = "selector";
  ff.style = "open";
  ff.extension = [".txt"];
  ff.defaultValue = preferences.recentFile.value;
  arrFormFields.push(ff);
  
  var ff = new FormField();
  ff.title = "# of words to add:";
  ff.type = "popup";
  ff.option = ["All", "1", "5", "10", "20", "50"];
  ff.optionValue = ["-1", "1", "5", "10", "20", "50"];
  ff.defaultValue = preferences.wordsPerClick.value;
  arrFormFields.push(ff);
  
  var result = form(arrFormFields, "Import file", "OK", "Cancel");
  
  if (!result) {
    return;
  }
  
  addWordsFromFile(result[0], result[1]);
  
  preferences.recentFile.value = result[0];
  preferences.wordsPerClick.value = result[1];
  
}

function addWordsFromFile(path, numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = -1;
  }
  
  arrFile = filesystem.readFile(path, true);
  pdump(arrFile);
  
  if (numWords < 0) {
    for (var i = 0; i < arrFile.length; i++) {
      addWord(arrFile[i]);
      
      if (i % 10 == 0) {
        updateNow();
      }
    }
  } else {
    for (var i = 0; i < numWords; i++) {
      addWord(arrFile[random(0, arrFile.length)]);
    }
  }
  
  savePackageToPrefs();
}

function importURL()
{
  var arrFormFields = new Array();
  var ff = new FormField();
  ff.title = "URL:";
  ff.type = "text";
  ff.defaultValue = preferences.recentURL.value;
  arrFormFields.push(ff);
  
  var ff = new FormField();
  ff.title = "# of words to add:";
  ff.type = "popup";
  ff.option = ["All", "1", "5", "10", "20", "50"];
  ff.optionValue = ["-1", "1", "5", "10", "20", "50"];
  ff.defaultValue = preferences.wordsPerClick.value;
  arrFormFields.push(ff);
  
  var result = form(arrFormFields, "Import URL", "OK", "Cancel");
  
  if (!result) {
    return;
  }
  
  addWordsFromUrl(result[0], result[1]);
  
  preferences.recentURL.value = result[0];
  preferences.wordsPerClick.value = result[1];
  
}


function addWordsFromUrl(url, numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = -1;
  }
  
  var url = new URL();
  url.location = url;
  url.numWords = numWords;
  url.fetchAsync(addWordsFromUrl_done);
}

/*
function addWordsFromUrl(urlIndex, numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = parseInt(preferences.wordsPerClick.value);
  }
  
  var url = new URL();
  url.location = arrWordSourceURLs[urlIndex].path;
  url.numWords = numWords;
  url.fetchAsync(addWordsFromUrl_done);
  
  
}
*/

function addWordsFromUrl_done(url)
{
  if (url.response > 400) {
    return;
  }
  
  var str = url.result;
  str = str.replace(/<script>[^<]*<\/script>/g, " ");
  str = str.replace(/<[^>]*>/g, " ");
  str = str.replace(/\&.{1,5};/g, " ");
  
  var arrUrl = str.match(/\w+/g);
  
  if (url.numWords < 0) {
    for (var i = 0; i < arrUrl.length; i++) {
      addWord(arrUrl[i]);
    }
  } else {
    for (var i = 0; i < url.numWords; i++) {
      addWord(arrUrl[random(0, arrUrl.length)]);
    }
  }
  
  savePackageToPrefs();
}


/*
function addWordsFromUrl_done(url)
{
  if (url.response > 400) {
    return;
  }
  
  var str = url.result;
  str = str.replace(/<script>[^<]*<\/script>/g, " ");
  str = str.replace(/<[^>]*>/g, " ");
  str = str.replace(/\&.{1,5};/g, " ");
  
  var wordArray = str.match(/\w+/g);
  
  if (url.numWords < 0) {
    for (var i = 0; i < wordArray.length; i++) {
      addWord(wordArray[i]);
    }
  } else {
    for (var i = 0; i < url.numWords; i++) {
      addWord(wordArray[random(0, wordArray.length)]);
    }
  }
  
  savePackageToPrefs();
  

}
*/


function popupAddWords()
{
  var arrPopupMenu = new Array();
  
  if (arrWordSourceFiles.length > 0) {
    var mi = new MenuItem();
    mi.enabled = false;
    mi.title = "Files";
    arrPopupMenu.push(mi);
    for (var i in arrWordSourceFiles) {
      var mi = new MenuItem();
      mi.title = arrWordSourceFiles[i].title;
      mi.onSelect = "addWordsFromFile(" + i + ")";
      arrPopupMenu.push(mi);
    }
  }
  
  var mi = new MenuItem();
  mi.title = "-";
  arrPopupMenu.push(mi);
  
  var mi = new MenuItem();
  mi.title = "Import from URL...";
  mi.onSelect = "importURL();";
  arrPopupMenu.push(mi);
  
  var mi = new MenuItem();
  mi.title = "Import from file...";
  mi.onSelect = "importFile();";
  arrPopupMenu.push(mi);
  
  var mi = new MenuItem();
  mi.title = "Single word...";
  mi.onSelect = "addCustomWord();";
  arrPopupMenu.push(mi);
  
  popupMenu(arrPopupMenu, system.event.hOffset, system.event.vOffset);
}


function addCustomWord()
{
  var arrFormFields = new Array();
  var ff = new FormField();
  ff.title = "Word:";
  ff.type = "text";
  arrFormFields.push(ff);
  
  var result = form(arrFormFields, "Custom word", "Add", "Cancel");
  
  if (!result) {
    return;
  }
  
  addWord(result[0]);
}


function addWord(data)
{
  var w = new Word();
  w.set("window", wndMain);
  w.set("data", data);
  w.set("hOffset", random(0 + w.width, wndMain.width - w.width));
  w.set("vOffset", random(0 + w.height, wndMain.height - w.height));
  w.align();
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
      wndMain.hOffset = screen.availLeft + screen.availWidth / 2;
      wndMain.vOffset = screen.availTop + screen.availHeight / 4;
      break;
    case "tallcenter":
      preferences.width.value = screen.availWidth / 2;
      preferences.height.value = screen.availHeight;
      wndMain.hOffset = screen.availLeft + screen.availWidth / 4;
      wndMain.vOffset = screen.availTop;
      break;
    default:
      preferences.width.value = 400;
      preferences.height.value = 240;
      wndMain.hOffset = screen.availLeft + screen.availWidth / 2;
      wndMain.vOffset = screen.availTop + screen.availHeight / 4;
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
  
  if (intWidth != wndMain.width) {
    kmgBackground.width = intWidth;
    rzr.img.hOffset = intWidth;
    imgSaveButton.hOffset = intWidth / 2;
    imgAddButton.hOffset = intWidth;
  }
  if (intHeight != wndMain.height) {
    kmgBackground.height = intHeight;
    rzr.img.vOffset = intHeight;
    
    imgTrashButton.vOffset = intHeight;
    imgSaveButton.vOffset = intHeight;
    imgAddButton.vOffset = intHeight;
  }
  
  if (optimize) {
    // optimized resizing - pre-empt big resizes
    // (these should be cleaned up when resizing is done)
    if (intWidth > wndMain.width) {
      wndMain.width = intWidth * 1.25;
    }
    if (intHeight > wndMain.height) {
      wndMain.height = intHeight * 1.25;
    }
  } else {
    wndMain.width = intWidth;
    wndMain.height = intHeight;
  }
  
}

function onPreferencesChanged()
{
  if (preferences.revertSources.value == "1") {
    preferences.revertSources.value = "0";
    intWordPackages();
  }
  
  
  kmgBackground.opacity = parseInt(preferences.bgOpacity.value);
  kmgBackground.colorize = preferences.bgColor.value;
  
  Word.reAlign();
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
  anmBackground = new KFadeAnimation(kmgBackground, Math.min(255, parseInt(preferences.bgOpacity.value) + 63), intFadeInTime, intFadeStyle);
    
  if (anmButtons instanceof Array) {
    for (var i in anmButtons) {
      anmButtons[i].kill();
      anmButtons[i] = null;
    }
  }
  anmButtons = new Array();
  anmButtons.push(new FadeAnimation(imgAddButton, 127, intFadeInTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgSaveButton, 127, intFadeInTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgTrashButton, 127, intFadeInTime, intFadeStyle));
  
  animator.start(anmBackground);
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
  anmBackground = new KFadeAnimation(kmgBackground, parseInt(preferences.bgOpacity.value), intFadeOutTime, intFadeStyle);
  
  if (anmButtons instanceof Array) {
    for (var i in anmButtons) {
      anmButtons[i].kill();
      anmButtons[i] = null;
    }
  }
  anmButtons = new Array();
  anmButtons.push(new FadeAnimation(imgAddButton, 0, intFadeOutTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgSaveButton, 0, intFadeOutTime, intFadeStyle));
  anmButtons.push(new FadeAnimation(imgTrashButton, 0, intFadeOutTime, intFadeStyle));
  
  animator.start(anmBackground);
  animator.start(anmButtons);
}


function main_onContextMenu()
{
  // Build contextMenu
  var contextMenu = new Array();
  var mi;
  
  mi = new MenuItem();
  mi.title = "Make a Donation";
  mi.onSelect = "donate();";
  contextMenu.push(mi);
  
  wndMain.contextMenuItems = contextMenu;
}

function saveWordPackage()
{
  savePackage();
  refreshWordPackages();
}


function initWordPackages()
{
  runCommand("mkdir -p " + quoteFilename(strPackageFolder));
  runCommand("cp -f Packages/* " + quoteFilename(strPackageFolder + "/"));
}


function refreshWordPackages()
{
  if (!filesystem.isDirectory(strPackageFolder)) {
    initWordPackages();
  }
  
  arrWordSourceFiles = new Array();
  var packageFiles = filesystem.getDirectoryContents(strPackageFolder);
  var packageFilePaths = new Array();
  for (var i in packageFiles) {
    packageFilePaths[i] = strPackageFolder + "/" + packageFiles[i];
    packageFiles[i] = getFilenameWithoutExtension(packageFiles[i]);
  }
  for (var i in packageFilePaths) {
    var o = new Object();
    o.path = packageFilePaths[i];
    o.title = packageFiles[i];
    arrWordSourceFiles.push(o);
  }
  
}


main_onLoad();
