/**
 * Poetry
 * by James M. Allen
 *
 * Please see the CREDITS.txt file for license and copyright information.
 * You may not redistribute this widget without including the CREDITS.txt file.
 */



include("Lib.js");
include("KonformImage.js");
include("JamesMAllen.js");
include("Word.js");
include("Resizer.js");

generic_mouseOver = null;

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
  
  anmBackground = null;
  anmButtons = null;
  
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
  imgAddButton.onContextMenu = "imgAddButton_onContextMenu()";
  imgAddButton.hAlign = "right";
  imgAddButton.vAlign = "bottom";
  
  arrWords = new Array();
  objFileCache = new Object();;
  
  rzr = new Resizer();
  rzr.img.window = main;
  rzr.onResize = resize;
  rzr.saveWidth = "preferences.width.value";
  rzr.saveHeight = "preferences.height.value";
  
  if (preferences.width.value == "-1" || preferences.height.value == "-1") {
    autoPosition();
  }
  
  resize(parseInt(preferences.width.value), parseInt(preferences.height.value));  
  
  var imgDummy = new Image();
  Word.baseZOrder = imgDummy.zOrder;
  imgDummy = null;
  
  Word.unserialize();
  
  unserializeWordSources();
  
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

function imgAddButton_onMouseUp()
{
  addWordsFromAllFiles();
}

function imgAddButton_onContextMenu()
{
  popupAddWords();
}

function clearAll()
{
  var result = alert("Are you sure you want to clear all the words?", "Yes", "No");
  if (result == 1) {
    // Yes
    for (var i in arrWords) {
      arrWords[i].clear();
      arrWords[i] = null;
    }
    
    arrWords = new Array();
  }
  Word.serialize();
}

function serializeWordSources()
{
  var arrCustomFiles = new Array();
  for (var i in arrWordSourceFiles) {
    arrCustomFiles.push(escape(arrWordSourceFiles[i].path));
  }
  preferences.customFiles.value = arrCustomFiles.join(",");
  
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
  arrWordSourceFiles = new Array();
  var customFilePaths = preferences.customFiles.value.split(",");
  for (var i in customFilePaths) {
    var o = new Object();
    o.path = unescape(customFilePaths[i]);
    o.title = getFilename(o.path);
    arrWordSourceFiles.push(o);
  }
  
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
  
  for (var i in arrWordSourceFiles) {
    arrOptions.push(arrWordSourceFiles[i].title);
    arrOptionValues.push("f" + i);
  }
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
      var ff = new FormField();
      ff.title = "Word source:";
      ff.type = "selector";
      ff.style = "open";
      ff.kind = "files";
      arrFormFields.push(ff);
      
      var ff = new FormField();
      ff.type = "checkbox";
      ff.title = "Delete this source";
      ff.defaultValue = 0;
      arrFormFields.push(ff);
      
      var fileIndex;
      var formTitle;
      
      if (result[0].substr(1) == "new") {
        fileIndex = arrWordSourceFiles.length;
        formTitle = "New file";
      } else {
        fileIndex = parseInt(result[0].substr(1));
        arrFormFields[0].value = arrWordSourceFiles[fileIndex].path;
        formTitle = "Editing file";
      }
      
      var result = form(arrFormFields, formTitle, "Save", "Cancel");
      
      if (!result) {
        return;
      }
      
      if (result[1] == 1) {
        arrWordSourceFiles.splice(fileIndex, 1);
      } else {
        o = new Object();
        o.path = result[0];
        o.title = getFilename(o.path);
        arrWordSourceFiles[fileIndex] = o;
      }
      
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



function addWordsFromFile(fileIndex, numWords)
{
  if (typeof(numWords) == "undefined") {
    numWords = parseInt(preferences.wordsPerClick.value);
  }
  
  var path = arrWordSourceFiles[fileIndex].path;
  
  if (typeof(objFileCache[path]) == "undefined" || preferences.doNotCache.value == "1") {
    objFileCache[path] = filesystem.readFile(path, true);
  }
  
  for (var i = 0; i < numWords; i++) {
    addWord(objFileCache[path][random(0, objFileCache[path].length)]);
  }
  
  Word.serialize();
  
}

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
  
  if (arrWordSourceURLs.length > 0) {
    var mi = new MenuItem();
    mi.enabled = false;
    mi.title = "URLs";
    arrPopupMenu.push(mi);
    for (var i in arrWordSourceURLs) {
      var mi = new MenuItem();
      mi.title = arrWordSourceURLs[i].title;
      mi.onSelect = "addWordsFromURL(" + i + ")";
      arrPopupMenu.push(mi);
    }
  }
  
  var mi = new MenuItem();
  mi.title = "-";
  arrPopupMenu.push(mi);
  
  var mi = new MenuItem();
  mi.title = "Edit sources...";
  mi.onSelect = "editWordSources()";
  arrPopupMenu.push(mi);
  
  // popupMenu(arrPopupMenu, system.event.hOffset, system.event.vOffset);
  imgAddButton.contextMenuItems = arrPopupMenu;
  
  
}




function addWord(data)
{
  var w = new Word();
  arrWords.push(w);
  w.set("data", data);
  w.align();
  w.set("hOffset", random(0 + w.width, main.width - w.width));
  w.set("vOffset", random(0 + w.height, main.height - w.height));
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
      main.hOffset = screen.availLeft + screen.availWidth / 2;
      main.vOffset = screen.availTop + screen.availHeight / 4;
      break;
    case "tallcenter":
      preferences.width.value = screen.availWidth / 2;
      preferences.height.value = screen.availHeight;
      main.hOffset = screen.availLeft + screen.availWidth / 4;
      main.vOffset = screen.availTop;
      break;
    default:
      preferences.width.value = 400;
      preferences.height.value = 240;
      main.hOffset = screen.availLeft + screen.availWidth / 2;
      main.vOffset = screen.availTop + screen.availHeight / 4;
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
    rzr.img.hOffset = intWidth;
    imgAddButton.hOffset = intWidth;
  }
  if (intHeight != main.height) {
    kimBackground.set("height", intHeight);
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

function onPreferencesChanged()
{
  if (preferences.revertSources.value == "1") {
    preferences.revertSources.value = "0";
    preferences.customFiles.value = preferences.customFiles.defaultValue;
    preferences.customURLs.value = preferences.customURLs.defaultValue;
    
  }
  
  
  kimBackground.set("opacity", parseInt(preferences.bgOpacity.value));
  kimBackground.set("colorize", preferences.bgColor.value);
  
  for (var i in arrWords) {
    arrWords[i].align();
  }
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
  animator.start(anmButtons);
}





main_onLoad();
