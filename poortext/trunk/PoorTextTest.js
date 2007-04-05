include("PoorText.js");

var pt1;
var htmlSource;

var bgSource;
var bgMain;

var sourceContextMenu;

Init();


function Init()
{
  sourceContextMenu = new Array();
  var mi = new MenuItem();
  mi.title = "Update";
  mi.onSelect = "update_onSelect()";
  sourceContextMenu.push(mi);
  sourceWindow.contextMenuItems = sourceContextMenu;
  
  sourceWindow.onLoseFocus = "sourceWindow_onLoseFocus()";
  
  bgSource = new Image();
  bgSource.name = "bgSource";
  bgSource.window = sourceWindow;
  bgSource.src = "Resources/gray.png";
  bgSource.width = sourceWindow.width;
  bgSource.height = sourceWindow.height;
  
  bgMain = new Image();
  bgMain.name = "bgMain";
  bgMain.window = main;
  bgMain.src = "Resources/gray.png";
  bgMain.width = main.width;
  bgMain.height = main.height;
  
  htmlSource = new TextArea();
  htmlSource.window = sourceWindow;
  htmlSource.bgColor = "#FFFFFF";
  htmlSource.bgOpacity = 255;
  htmlSource.editable = true;
  htmlSource.scrollbar = true;
  htmlSource.width = sourceWindow.width - 20;
  htmlSource.height = sourceWindow.height - 20;
  htmlSource.hOffset = 10;
  htmlSource.vOffset = 10;
  htmlSource.data = preferences.html.value;
  
  pt1 = new PoorText();
  pt1.name = "pt1";
  pt1.window = main;
  pt1.width = main.width - 20;
  pt1.height = main.height - 20;
  pt1.hOffset = 10;
  pt1.vOffset = 10;
  pt1.bgColor = "#FFFFFF";
  pt1.bgOpacity = 255;
  pt1.size = 14;
  pt1.font = "Lucida Sans Unicode";
  pt1.scrollbar = true;
}

function sourceWindow_onLoseFocus()
{
  preferences.html.value = htmlSource.data;
  savePreferences();
}

function update_onSelect()
{
  pt1.setHtml(htmlSource.data);
}