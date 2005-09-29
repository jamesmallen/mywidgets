/*
 * --------------------------
 * Konform v0.3
 * --------------------------
 *   A skinnable "forms" engine for Konfabulator.
 * 
 * By James M. Allen (james.m.allen@gmail.com)
 *
 * You must e-mail the author and obtain permission to produce derivative
 * works. The author will almost certainly give permission, but asks that you
 * e-mail him so he is able to keep track of usage.
 *
 * ---------------
 * Release History
 * ---------------
 * 0.3 - [DATE]
 * - Initial release
 *
 *
 * If you like Konform and want to support its development, you can donate
 * to me via PayPal. Please use the following link to do so:
 * https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=Konform%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8
 */



Konform.ids = new Array();


/**
 * pdump(obj)
 * Debugging function - prints non-"function" type properties
 * of an object.
 */
function pdump(obj)
{
  print("PDUMP");
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}


include("KonformImage.js");
include("KonformSkin.js");
include("KonformObject.js");
include("KonformButton.js");
include("KonformCheckbox.js");
include("KonformLabel.js");


/**
 * class Konform
 * 
 * useWindow option - if set to a valid Window object, Konform hijacks
 *    the given window and makes it its own.
 */
function Konform(useWindow)
{
  if (useWindow instanceof Window) {
    this.hWnd = useWindow;
  } else {
    this.hWnd = new Window();
    this.hWnd.shadow = false;
  }
  
  Konform.ids.push(this);
  this.id = Konform.ids.length - 1;
  this.name = "KonformObject" + this.id;
  
  this.liveResize = true;
  this.resizable = false;
  
  this.hOffset = this.hWnd.hOffset;
  this.vOffset = this.hWnd.vOffset;
  
  this.skin = Konform.defaultSkin;
  
  this.bgColor = new KonformImage();
  this.bg = new KonformImage();
  
  this.windowTitleShadow = new Text();
  this.windowTitleShadow.color = "#000000";
  this.windowTitle = new Text();
  
  this.resizerButton = new Image();
  this.resizerButton.hAlign = "right";
  this.resizerButton.vAlign = "bottom";
  this.resizerButton.tracking = "rectangle";
  this.resizerButton.onMouseDown = "Konform.resizerButton_onMouseDownWrapper(" + this.id + ")";
  this.resizerButton.onMouseUp = "Konform.resizerButton_onMouseUpWrapper(" + this.id + ")";
  this.resizerButton.onMouseMove = "Konform.resizerButton_onMouseMoveWrapper(" + this.id + ")";
  
  this.lightResize = new KonformImage();
  this.lightResize.set("pattern", "3x3");
  this.lightResize.set("images", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/DarkPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png", "Resources/Konform/LightPx.png");
  this.lightResize.set("opacity", 0);
  
  this.anchors = new Object();
  this.anchors["topleft"] = new Array();
  this.anchors["top"] = new Array();
  this.anchors["topright"] = new Array();
  this.anchors["left"] = new Array();
  this.anchors["center"] = new Array();
  this.anchors["right"] = new Array();
  this.anchors["bottomleft"] = new Array();
  this.anchors["bottom"] = new Array();
  this.anchors["bottomright"] = new Array();
  
  this.set("window", this.hWnd);
  this.set("skin", this.skin);
  
}

Konform.resizerButton_onMouseDownWrapper = function(id)
{
  Konform.ids[id].resizerButton_onMouseDown();
}

Konform.prototype.resizerButton_onMouseDown = function()
{
  this.dragStart = new Object();
  this.dragStart.x = this.width - system.event.hOffset;
  this.dragStart.y = this.height - system.event.vOffset;
  if (!this.liveResize) {
    // calculate new zOrder
    var placeholder = new Image();
    this.lightResize.set("zOrder", placeholder.zOrder);
    delete placeHolder;
    this.lightResize.set("opacity", 255);
  }
}

Konform.resizerButton_onMouseUpWrapper = function(id)
{
  Konform.ids[id].resizerButton_onMouseUp();
}

Konform.prototype.resizerButton_onMouseUp = function()
{
  if (!this.liveResize) {
    this.liveResize = true;
    this.resizerButton_onMouseMove();
    this.liveResize = false;
    this.lightResize.set("opacity", 0);
  }
  // clear dragStart
  this.dragStart = new Object();
}


Konform.resizerButton_onMouseMoveWrapper = function(id)
{
  Konform.ids[id].resizerButton_onMouseMove();
}

Konform.prototype.resizerButton_onMouseMove = function()
{
  if (typeof(this.dragStart) != "object" || typeof(this.dragStart.x) == "undefined" || typeof(this.dragStart.y) == "undefined") {
    log("Whoa - we got a MouseMove without a MouseDown!");
    this.dragStart = new Object();
    this.dragStart.x = this.width - system.event.hOffset;
    this.dragStart.y = this.height - system.event.vOffset;
  }
  
  var newWidth = this.dragStart.x + system.event.hOffset;
  var newHeight = this.dragStart.y + system.event.vOffset;
  
  if (newWidth < this.minWidth) {
    newWidth = this.minWidth;
  }
  if (newHeight < this.minHeight) {
    newHeight = this.minHeight;
  }
  if (this.maxWidth >= 0 && newWidth > this.maxWidth) {
    newWidth = this.maxWidth;
  }
  if (this.maxHeight >= 0 && newHeight > this.maxHeight) {
    newHeight = this.maxHeight;
  }
  
  if (this.liveResize) {
    // full mode
    if (newWidth != this.width) {
      this.set("width", newWidth);
    }
    
    if (newHeight != this.height) {
      this.set("height", newHeight);
    }
  } else {
    // preview mode
    if (this.hWnd.width < newWidth) {
      // resize window
      this.hWnd.width *= 1.25;
    }
    if (this.hWnd.height < newHeight) {
      // resize window
      this.hWnd.height *= 1.25;
    }
    
    if (newWidth != this.lightResize.width) {
      this.lightResize.set("width", newWidth);
    }
    
    if (newHeight != this.lightResize.height) {
      this.lightResize.set("height", newHeight);
    }
    
    this.resizerButton.hOffset = this.lightResize.width;
    this.resizerButton.vOffset = this.lightResize.height;
    
  }
}


/**
 * Konform.clear()
 * Deletes all the KonformObjects inside a window, to get it ready for
 * disposal
 */
Konform.prototype.clear = function()
{
  for (var i in this) {
    if (this[i] instanceof KonformObject) {
      this[i].clear();
    } else {
      delete this[i];
    }
  }
}


/**
 * Konform set-able properties:
 *  height - self-explanatory
 *  hOffset - hOffset of the window
 *  onClick - string that is eval'd when the button is clicked
 *  opacity - opacity of the button elements
 *  resizable - shows a resizer in the lower right-hand corner
 *  shadow - shadow of the window
 *  skin - custom skin to use (will be applied to all child objects automatically)
 *  title - the title text for the window
 *  visible - visible of the window
 *  vOffset - vOffset of the window
 *  width - self-explanatory
 *  window - The window that this form belongs to - this will hijack the window
 */
Konform.prototype.set = function(property, value)
{
  if (property == "hWnd") {
    property = "window";
  }
  if (property == "window") {
    this.hWnd = value;
  }
  
  switch (property) {
    case "bgColor":
      if (this.skin.options["AllowWindowColor"]) {
        this.bgColor.set("colorize", value);
      }
      break;
    case "bgOpacity":
      if (this.skin.options["AllowWindowColor"]) {
        this.bgColor.set("opacity", value);
      }
      break;
    case "height":
      this.height = value;
      if (this.height < this.minHeight) {
        this.height = this.minHeight;
      }
      if (this.maxHeight >= 0 && this.height > this.maxHeight) {
        this.height = this.maxHeight;
      }
      this.bg.set("height", this.height);
      if (this.skin.options["AllowWindowColor"]) {
        this.bgColor.set("height", this.height);
      } 
      this.hWnd.height = this.height;
      switch (this.bg.pattern) {
        case "3x3":
        case "1x3":
          this.windowTitle.vOffset = this.skin.yratios["WindowTitle"];
          break;
        default:
          this.windowTitle.vOffset = this.height * this.skin.yratios["WindowTitle"];
          break;
      }
      this.windowTitleShadow.vOffset = this.windowTitle.vOffset + 1;
      this.resizerButton.vOffset = this.height;
      
      this.snug("bottomleft", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["bottomleft"]);
      this.snug("bottom", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["bottom"]);
      this.snug("bottomright", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["bottomright"]);
      
      break;
    case "hOffset":
      this.hWnd.hOffset = value;
      break;
    case "liveResize":
      this.liveResize = value;
      break;
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
      this[property] = value;
      this.set("width", this.width);
      this.set("height", this.height);
      break;
    case "opacity":
      this.hWnd.opacity = value;
      break;
    case "resizable":
      if (value) {
        this.resizerButton.src = this.skin.paths["Resizer"];
      } else {
        this.resizerButton.src = "";
      }
      this.resizable = value;
      break;
    case "shadow":
      this.hWnd.shadow = value;
    case "title":
      this.windowTitleShadow.data = this.windowTitle.data = this.hWnd.title = value;
      break;
    case "visible":
      this.hWnd.visible = value;
      break;
    case "vOffset":
      this.hWnd.vOffset = value;
      break;
    case "width":
      this.width = value;
      if (this.width < this.minWidth) {
        this.width = this.minWidth;
      }
      if (this.maxWidth >= 0 && this.width > this.maxWidth) {
        this.width = this.maxWidth;
      }
      this.bg.set("width", this.width);
      if (this.skin.options["AllowWindowColor"]) {
        this.bgColor.set("width", this.width);
      }
      this.hWnd.width = this.width;
      switch (this.skin.aligns["WindowTitle"]) {
        case "left":
          this.windowTitle.hOffset = this.skin.xratios["WindowTitle"];
          break;
        case "right":
          this.windowTitle.hOffset = this.width - this.skin.xratios["WindowTitle"];
          break;
        case "center":
        default:
          this.windowTitle.hOffset = this.width * this.skin.xratios["WindowTitle"];
          break;
      }
      this.windowTitleShadow.hOffset = this.windowTitle.hOffset + 1;
      this.resizerButton.hOffset = this.width;
      
      this.snug("topright", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["topright"]);
      this.snug("right", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["right"]);
      this.snug("bottomright", this.skin.options["AnchorIndent"], this.skin.options["AnchorSpacing"], this.anchors["bottomright"]);
      
      break;
    default:
      for (var i in this) {
        if (this[i] instanceof KonformObject || this[i] instanceof KonformImage) {
          this[i].set(property, value);
        } else if (typeof(this[i]) == "object" && this[i] != null && typeof(this[i][property]) != "undefined") {
          this[i][property] = value;
        }
      }
      break;
  }
  
  if (property == "skin") {
    this.skin = value;
    if (this.skin.options["AllowWindowColor"]) {
      this.bgColor.set("images", this.skin.paths["WindowColor"]);
      this.bgColor.set("window", this.hWnd);
      this.bgColor.set("tile", this.skin.options["TileBG"]);
    } else {
      this.bgColor.clear();
    }
    this.bg.set("images", this.skin.paths["Window"]);
    this.bg.set("window", this.hWnd);
    this.bg.set("tile", this.skin.options["TileBG"]);
    this.windowTitle.color = this.skin.colors["WindowTitle"];
    this.windowTitleShadow.hAlign = this.windowTitle.hAlign = this.skin.aligns["WindowTitle"];
    this.windowTitleShadow.style = this.windowTitle.style = "";
    this.windowTitleShadow.font = this.windowTitle.font = this.skin.fonts["WindowTitle"];
    this.windowTitleShadow.size = this.windowTitle.size = this.skin.sizes["WindowTitle"];
    if (this.skin.shadows["WindowTitle"]) {
      this.windowTitleShadow.opacity = 255;
    } else {
      this.windowTitleShadow.opacity = 0;
    }
    
    this.width = this.bg.width;
    this.height = this.bg.height;
    
    this.minWidth = this.width;
    this.minHeight = this.height;
    this.maxWidth = -1;
    this.maxHeight = -1;
    
    this.set("width", this.width);
    this.set("height", this.height);
    this.set("resizable", this.resizable);
  }

}

/**
 * Adds a KonformObject to this Konform
 */
Konform.prototype.add = function(obj)
{
  obj.set("window", this.hWnd);
  obj.set("skin", this.skin);
  this[obj.name] = obj;
  return this[obj.name];
}

/**
 * Calls .moveTo() of the window
 */
Konform.prototype.moveTo = function(x, y)
{
  this.hWnd.moveTo(x, y);
}

/**
 * Helper function - centers an object on this Konform.
 */
Konform.prototype.center = function(obj)
{
  obj.set("hOffset", (this.bg.width - obj.width) / 2);
}
  

Konform.prototype.anchor = function(corner, obj)
{
  
  for (var i in this.anchors) {
    for (var j in this.anchors[i]) {
      if (this.anchors[i][j] == obj) {
        // print("anchor already exists for obj in " + i + " - deleting");
        this.anchors[i][j] = null;
        delete this.anchors[i][j];
      }
    }
  }
  
  switch (corner) {
    case "topleft":
    case "top":
    case "topright":
    case "left":
    case "center":
    case "right":
    case "bottomleft":
    case "bottom":
    case "bottomright":
      // print("anchoring obj to " + corner);
      this.anchors[corner].push(obj);
      break;
    default:
      // print("invalid corner!");
      break;
  }
  
  this.set("width", this.width);
  this.set("height", this.height);
}


/**
 * Konform.snug(corner, spacing, indent, object[, object...])
 * Moves one or more objects to a corner/side of the form.
 * corner must be one of:
 *  "topleft", "top", "topright",
 *  "left", "center", "right", (these don't change the vOffset)
 *  "bottomleft", "bottom", "bottomright"
 * spacing is the amount of space to put between each object (if there is
 * more than one)
 * indent is the amount of spacing to add from the side and top/bottom
 */
Konform.prototype.snug = function(corner, indent, spacing)
{
  if (arguments.length < 4) {
    return;
  }
  
  var obj;
  if (arguments[3] instanceof Array) {
    obj = arguments[3];
  } else {
    obj = new Array();
    for (var i = 3; i < arguments.length; i++) {
      obj.push(arguments[i]);
    }
  }
  
  var widths = new Array();
  for (var i in obj) {
    widths.push(obj[i].width);
  }
  
  var totalWidth = eval(widths.join("+spacing+"));
  var startingPoint;
  switch (corner) {
    case "topleft":
    case "left":
    case "bottomleft":
      startingPoint = 0 + indent;
      break;
    case "top":
    case "center":
    case "bottom":
      startingPoint = (this.width - totalWidth) / 2;
      break;
    case "topright":
    case "right":
    case "bottomright":
      startingPoint = this.width - indent - totalWidth;
      break;
  }
  
  var curHOffset = startingPoint;
  
  for (var i in obj) {
    obj[i].set("hOffset", curHOffset);
    curHOffset += (obj[i].width + spacing);
  }
  
  switch (corner) {
    case "topleft":
    case "top":
    case "topright":
      var newVOffset = this.height * this.skin.yratios["WindowTitle"] + indent;
      for (var i in obj) {
        obj[i].set("vOffset", newVOffset);
      }
      break;
    case "bottomleft":
    case "bottom":
    case "bottomright":
      var newVOffset = this.height - indent;
      for (var i in obj) {
        obj[i].set("vOffset", newVOffset - obj[i].height);
      }
      break;
  }
}



Konform.defaultSkin = new KonformSkin("Resources/Konform/DimPlastic/");
