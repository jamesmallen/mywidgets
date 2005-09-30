function AboutTheAuthor()
{
  if (typeof(authorWindow) == "undefined" || !(authorWindow instanceof Window)) {
    authorWindow = new Window();
    authorWindow.name = "authorWindow";
    authorWindow.title = "About the Author";
    authorWindow.alignment = "left";
    authorWindow.width = 450;
    authorWindow.height = 266;
    
    var authorContextMenu = new Array();
    authorContextMenu[0] = new MenuItem();
    authorContextMenu[0].title = "Make a Donation";
    authorContextMenu[0].onSelect = "Donate();";
    authorWindow.contextMenuItems = authorContextMenu;
    
    authorBg = new Image();
    authorBg.window = authorWindow;
    authorBg.src = "Resources/AboutTheAuthorBG.png";
    authorBg.hOffset = 24;
    authorBg.vOffset = 0;
    authorBg.onMouseUp = "authorWindow.visible = false;";
    
    authorTove = new Image();
    authorTove.window = authorWindow;
    authorTove.src = "Resources/AboutTheAuthorTove.png";
    authorTove.hOffset = 0;
    authorTove.vOffset = 42;
    
    authorText = new Image();
    authorText.window = authorWindow;
    authorText.src = "Resources/AboutTheAuthorText.png";
    authorText.hOffset = 69;
    authorText.vOffset = 21;
  }
  authorWindow.visible = true;
}

function Donate()
{
  var myWidgetName = system.widgetDataFolder.substring(system.widgetDataFolder.lastIndexOf("/") + 1);
  openURL('https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=' + escape(myWidgetName) + '%20Widget%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
}


