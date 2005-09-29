/**
 * class KonformImage
 * A smart-scaling Image wrapper
 * Allows for an image to be specified as a group of images arranged in a
 * pattern, and will only scale certain images in the pattern
 */


function KonformImage()
{
  Konform.ids.push(this);
  this.id = Konform.ids.length - 1;
  this.name = "KonformImage" + this.id;
  
  this.img = null;
  this.hOffset = 0;
  this.vOffset = 0;
  this.width = -1;
  this.height = -1;
  this.minHeight = 0;
  this.minWidth = 0;
  var placerImage = new Image();
  this.zOrder = placerImage.zOrder;
  this.set("pattern", "1x1");
  delete placerImage;
  
  this.fillmode = "stretch";
  this.onContextMenuEval = "";
  this.onDragDropEval = "";
  this.onDragEnterEval = "";
  this.onDragExitEval = "";
  this.onMouseDownEval = "";
  this.onMouseEnterEval = "";
  this.onMouseExitEval = "";
  this.onMouseMoveEval = "";
  this.onMouseUpEval = "";
  this.onMultiClickEval = "";
  
  this.mouseOverState = 0;
  this.mouseExitTimer = new Timer();
  this.mouseExitTimer.ticking = false;
  this.mouseExitTimer.interval = 0.001;
  this.mouseExitTimer.onTimerFired = "Konform.ids[" + this.id + "].mouseExitChecker()";
  
  this.refresh();
}

KonformImage.prototype.align = function(cheap)
{
  if (!this.img instanceof Array) {
    return;
  }
  
  switch (this.pattern) {
    case "3x3":
      // print("Aligning 3x3");
      if (typeof(cheap) == "undefined" || !cheap) {
        this.img["TopLeft"].hOffset =
            this.img["MiddleLeft"].hOffset = 
            this.img["BottomLeft"].hOffset = 
            this.hOffset;
        this.img["TopCenter"].hOffset = 
            this.img["MiddleCenter"].hOffset = 
            this.img["BottomCenter"].hOffset = 
            this.img["TopLeft"].hOffset + this.img["TopLeft"].width;
        this.img["TopLeft"].vOffset = 
            this.img["TopCenter"].vOffset = 
            this.img["TopRight"].vOffset = 
            this.vOffset;
        this.img["MiddleLeft"].vOffset = 
            this.img["MiddleCenter"].vOffset = 
            this.img["MiddleRight"].vOffset = 
            this.img["TopLeft"].vOffset + this.img["TopLeft"].height;
      }
      
      this.img["TopRight"].hOffset = 
          this.img["MiddleRight"].hOffset = 
          this.img["BottomRight"].hOffset = 
          this.img["TopCenter"].hOffset + this.img["TopCenter"].width;
      this.img["BottomLeft"].vOffset = 
          this.img["BottomCenter"].vOffset = 
          this.img["BottomRight"].vOffset = 
          this.img["MiddleLeft"].vOffset + this.img["MiddleLeft"].height;
      break;
    case "1x3":
      // print("Aligning 1x3");
      if (typeof(cheap) == "undefined" || !cheap) {
        this.img["Top"].hOffset =
            this.img["Middle"].hOffset = 
            this.img["Bottom"].hOffset = 
            this.hOffset;
        this.img["Top"].vOffset = this.vOffset;
        this.img["Middle"].vOffset = 
            this.img["Top"].vOffset + this.img["Top"].height;
      }
      this.img["Bottom"].vOffset = 
          this.img["Middle"].vOffset + this.img["Middle"].height;
      break;
    case "3x1":
      // print("Aligning 3x1");
      if (typeof(cheap) == "undefined" || !cheap) {
        this.img["Left"].hOffset = this.hOffset;
        this.img["Center"].hOffset = 
            this.img["Left"].hOffset + this.img["Left"].width;
        this.img["Left"].vOffset =
            this.img["Center"].vOffset = 
            this.img["Right"].vOffset = 
            this.vOffset;
      }
      this.img["Right"].hOffset = 
          this.img["Center"].hOffset + this.img["Center"].width;
      break;
    
    default:
      // print("Aligning default");
      for (var i in this.img) {
        this.img[i].hOffset = this.hOffset;
        this.img[i].vOffset = this.vOffset;
      }
      break;
  }
}


KonformImage.prototype.clear = function()
{
  for (var i in this.img) {
    delete this.img[i];
  }
  this.img = new Array();
}


KonformImage.prototype.refresh = function()
{
  if (this.window) {
    this.set("window", this.window);
  }
  this.set("zOrder", this.zOrder);
  this.set("tile", this.tile);
  this.set("onContextMenu", this.onContextMenuEval);
  this.set("onMouseDown", this.onMouseDownEval);
  this.set("onMouseMove", this.onMouseMoveEval);
  this.set("onMouseUp", this.onMouseUpEval);
  this.set("onMultiClick", this.onMultiClickEval);
  this.set("onMouseEnter", this.onMouseEnterEval);
  this.set("onMouseExit", this.onMouseExitEval);


}


/**
 * KonformImage set-able properties:
 *  height - self-explanatory
 *  hOffset - hOffset of the window
 *  images - takes an array of image file names, or a "special" filename
 *           "special" file names automatically set the pattern
 *           There are 3 ways to specify a special file name:
 *           | (Filename|.ext) - specifies a 1x3 pattern, where the | will be 
 *              replaced with "Top", "Middle", and "Bottom"
 *           < (Filename<.ext) - specifies a 3x1 pattern, where the < will be
 *              replaced with "Left", "Center", and "Right"
 *           * (Filename*.ext) - specifies a 3x3 pattern, where the * will be
 *              replaced with "TopLeft", "TopCenter", "TopRight",
 *                            "MiddleLeft", "MiddleCenter", "MiddleRight",
 *                            "BottomLeft", "BottomCenter", and "BottomRight"
 *  vOffset - vOffset of the window
 *  width - self-explanatory
 */
KonformImage.prototype.set = function(property, value)
{
  // print("(KonformImage).set(" + property + ", " + value + ")");
  switch (property) {
    case "height":
      switch (this.pattern) {
        case "3x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img["MiddleLeft"].height = middleHeight;
          this.img["MiddleCenter"].height = middleHeight;
          this.img["MiddleRight"].height = middleHeight;
          this.height = this.minHeight + middleHeight;
          break;
        case "1x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img["Middle"].height = middleHeight;
          this.height = this.minHeight + middleHeight;
          break;
        default:
          for (var i in this.img) {
            this.img[i].height = value;
          }
          this.height = value;
          break;
      }
      this.align(true);
      break;
    case "hOffset":
      this.hOffset = value;
      this.align();
      break;
    case "image":
    case "images":
      if (this.img) {
        for (var i in this.img) {
          this.img[i].src = "";
        }
      }
      
      if (value instanceof Array) {
        var tArr = value;
        for (var i in tArr) {
          arguments[i + 1] = tArr[i];
        }
      }
      
      if (value.indexOf("*") != -1) {
        this.set("pattern", "3x3");
        for (var i in this.img) {
          this.img[i].src = value.replace("*", i);
        }
      } else if (value.indexOf("<") != -1) {
        this.set("pattern", "3x1");
        for (var i in this.img) {
          this.img[i].src = value.replace("<", i);
        }
      } else if (value.indexOf("|") != -1) {
        this.set("pattern", "1x3");
        for (var i in this.img) {
          this.img[i].src = value.replace("|", i);
        }
      } else {
        if (arguments.length == 2) {
          this.set("pattern", "1x1");
        } else if (arguments.length == 10) {
          this.set("pattern", "3x3");
        }
        switch (this.pattern) {
          case "3x3":
            this.img["TopLeft"].src = arguments[1];
            this.img["TopCenter"].src = arguments[2];
            this.img["TopRight"].src = arguments[3];
            this.img["MiddleLeft"].src = arguments[4];
            this.img["MiddleCenter"].src = arguments[5];
            this.img["MiddleRight"].src = arguments[6];
            this.img["BottomLeft"].src = arguments[7];
            this.img["BottomCenter"].src = arguments[8];
            this.img["BottomRight"].src = arguments[9];
            break;
          case "1x3":
            this.img["Top"].src = arguments[1];
            this.img["Middle"].src = arguments[2];
            this.img["Bottom"].src = arguments[3];
            break;
          case "3x1":
            this.img["Left"].src = arguments[1];
            this.img["Center"].src = arguments[2];
            this.img["Right"].src = arguments[3];
            break;
          default:
            this.img[0].src = arguments[1];
            break;
        }
      }
      
      this.minWidth = 0;
      this.minHeight = 0;
      
      switch (this.pattern) {
        case "3x3":
          this.minHeight = this.img["TopLeft"].srcHeight + this.img["BottomLeft"].srcHeight;
          this.minWidth = this.img["TopLeft"].srcWidth + this.img["TopRight"].srcWidth;
          this.width = this.minWidth + this.img["TopCenter"].width;
          this.height = this.minHeight + this.img["MiddleLeft"].height;
          break;
        case "1x3":
          this.minHeight = this.img["Top"].srcHeight + this.img["Bottom"].srcHeight;
          this.width = this.img["Top"].srcWidth;
          this.height = this.minHeight + this.img["Middle"].srcHeight;
          break;
        case "3x1":
          this.minWidth = this.img["Left"].srcWidth + this.img["Right"].srcWidth;
          this.width = this.minWidth + this.img["Center"].srcWidth;
          this.height = this.img["Left"].srcHeight;
          break;
        default:
          this.width = this.img[0].srcWidth;
          this.height = this.img[0].srcHeight;
          break;
      }
      this.align();
      break;
    case "onContextMenu":
    case "onMouseDown":
    case "onMouseMove":
    case "onMouseUp":
    case "onMultiClick":
      this[property + "Eval"] = value;
      for (var i in this.img) {
        this.img[i][property] = value;
      }
      break;
    case "onMouseEnter":
    case "onMouseExit":
      this[property + "Eval"] = value;
      if (this.onMouseEnterEval || this.onMouseExitEval) {
        for (var i in this.img) {
          var indexStr = "";
          if (typeof(i) == "number") {
            indexStr = i;
          } else {
            indexStr = '"' + escape(i) + '"';
          }
          this.img[i].onMouseEnter = "Konform.ids[" + this.id + "].onMouseEnter(" + indexStr + ");";
          this.img[i].onMouseExit = "Konform.ids[" + this.id + "].onMouseExit(" + indexStr + ");";
        }
      } else {
        for (var i in this.img) {
          this.img[i].onMouseEnter = "";
          this.img[i].onMouseExit = "";
        }
      }
      break;
    case "pattern":
      if (this.pattern == value) {
        break;
      }
      this.pattern = value;
      this.clear();
      switch (value) {
        case "3x3":
          this.img["TopLeft"] = new Image();
          this.img["TopCenter"] = new Image();
          this.img["TopRight"] = new Image();
          this.img["MiddleLeft"] = new Image();
          this.img["MiddleCenter"] = new Image();
          this.img["MiddleRight"] = new Image();
          this.img["BottomLeft"] = new Image();
          this.img["BottomCenter"] = new Image();
          this.img["BottomRight"] = new Image();
          break;
        case "1x3":
          this.img["Top"] = new Image();
          this.img["Middle"] = new Image();
          this.img["Bottom"] = new Image();
          break;
        case "3x1":
          this.img["Left"] = new Image();
          this.img["Center"] = new Image();
          this.img["Right"] = new Image();
          break;
        default:
          this.img[0] = new Image();
          break;
      }
      this.refresh();
      break;
    case "tile":
      this.tile = value;
      var fillMode = this.tile ? "tile" : "stretch";
      for (var i in this.img) {
        this.img[i].fillMode = fillMode;
      }
      break;
    case "vOffset":
      this.vOffset = value;
      this.align();
      break;
    case "width":
      switch (this.pattern) {
        case "3x3":
          var middleWidth = Math.max(value - this.minWidth, 0);
          this.img["TopCenter"].width = middleWidth;
          this.img["MiddleCenter"].width = middleWidth;
          this.img["BottomCenter"].width = middleWidth;
          this.width = this.minWidth + middleWidth;
          break;
        case "3x1":
          var centerWidth = Math.max(value - this.minWidth, 0);
          this.img["Center"].width = centerWidth;
          this.width = this.minWidth + centerWidth;
          break;
        default:
          for (var i in this.img) {
            this.img[i].width = value;
          }
          this.width = value;
          break;
      }
      this.align(true);
      break;
    case "window":
      this.window = value;
      for (var i in this.img) {
        this.img[i].window = value;
      }
      break;
    default:
      if (typeof(this[property]) != "undefined") {
        this[property] = value;
      }
      for (var i in this.img) {
        if (typeof(this.img[i][property]) != "undefined") {
          this.img[i][property] = value;
        }
      }
      break;
  }
  
}

KonformImage.onMouseEnterWrapper = function(id, indexStr)
{
  print("onMouseExitWrapper(" + id + ", " + indexStr);
  Konform.ids[id].onMouseEnter(indexStr);
}

KonformImage.prototype.onMouseEnter = function(indexStr)
{
  if (typeof(indexStr) == "string") {
    indexStr = unescape(indexStr);
  }
  
  if (this.mouseOverState == 0) {
    eval(this.onMouseEnterEval);
  }
  
  this.mouseOverState = 2;
  
}

KonformImage.prototype.mouseExitChecker = function()
{
  if (this.mouseOverState < 2) {
    eval(this.onMouseExitEval);
    this.mouseOverState = 0;
  }
  this.mouseExitTimer.ticking = false;
}


KonformImage.onMouseExitWrapper = function(id, indexStr)
{
  Konform.ids[id].onMouseExit(indexStr);
}

KonformImage.prototype.onMouseExit = function(indexStr)
{
  if (typeof(indexStr) == "string") {
    indexStr = unescape(indexStr);
  }
  
  this.mouseOverState = 1;
  this.mouseExitTimer.ticking = true;
}



