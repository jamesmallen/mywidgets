/**
 * class KonformImage
 * A smart-scaling Image wrapper
 * Allows for an image to be specified as a group of images arranged in a
 * pattern, and will only scale certain images in the pattern.
 *
 * Copyright 2005, James M. Allen
 */




/**
 * KonformFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
 *  Works just like FadeAnimation, on a KonformImage.
 *  Should be called with "var a = KonformFadeAnimation(...)",
 *  not "var a = new KonformFadeAnimation(...)".
 */
function KonformFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KonformFadeAnimation.update,
                                KonformFadeAnimation.done);
  
  anm.object = object;
  anm.fromOpacity = object.opacity;
  anm.toOpacity = toOpacity;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KonformFadeAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newOpacity;
  var ret;
  
  if (percent >= 1.0) {
    newOpacity = this.toOpacity;
    ret = false;
  } else {
    newOpacity = animator.ease(this.fromOpacity, this.toOpacity, percent,
                               this.easeType);
    ret = true;
  }
  
  this.object.set("opacity", newOpacity);
  return ret;
}

KonformFadeAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}

 
/**
 * class KonformImage
 *  A feature-rich Image object replacement.
 *  Should support most of the properties that a normal Image supports,
 *  with added functionality of "smart-scaling" images.
 */
function KonformImage()
{
  this.id = KonformImage.ids.length;
  KonformImage.ids.push(this);
  
  // PRIVATE VARIABLES
  var frame = null;
  var img = null;
  var pattern = null;
  var mouseOverState = 0;
  var mouseExitTimer = new Timer();
  mouseExitTimer.ticking = false;
  mouseExitTimer.interval = 0.001;
  mouseExitTimer.onTimerFired = "KonformImage.ids[" + this.id + "].__mouseExitChecker()";
  
  
  
  // PUBLIC PROPERTIES
  this.alignment = "left";
  // this.clipRect = null;
  this.colorize = null;
  this.contextMenuItems = null;
  this.fillMode = "stretch";
  this.height = -1;
  this.hAlign = "left";
  this.hOffset = 0;
  // this.hRegistrationPoint = null;
  this.hslAdjustment = null;
  this.hslTinting = null;
  this.name = "KonformImage" + this.id;
  this.onContextMenu = "";
  this.onDragDrop = "";
  this.onDragEnter = "";
  this.onDragExit = "";
  this.onMouseDown = "";
  this.onMouseEnter = "";
  this.onMouseExit = "";
  this.onMouseMove = "";
  this.onMouseUp = "";
  this.onMultiClick = "";
  this.opacity = 255;
  // this.rotation = 0;
  this.src = null;
  this.tileOrigin = "topLeft";
  this.tooltip = "";
  this.tracking = "opacity";
  // this.useFileIcon = false;
  this.vOffset = 0;
  this.vAlign = "top";
  // this.vRegistrationPoint = null;
  this.width = -1;
  this.minWidth = 0;
  this.minHeight = 0;
  
  // Create a dummy image to get default values in current context
  var placerImage = new Image();
  this.zOrder = placerImage.zOrder;
  this.window = placerImage.window;
  placerImage = null;
  
  
  
  // READ-ONLY PUBLIC PROPERTIES
  this.srcHeight = 0;
  this.srcWidth = 0;
  
  
  // PRIVATE METHODS
  function applyToImages(property, value)
  {
    for (var i in img) {
      img[i][property] = value;
    }
  }
  
  
  // PRIVILEGED METHODS
  
  // Setters
  
  
  
  this.setHAlign = function(prop, oldval, newval)
  {
    switch (newval) {
      case "left":
      case "center":
      case "right":
        this.alignment = this.hAlign = newval;
        this.align();
        return newval;
        break;
      default:
        return oldval;
        break;
    }
  }
  
  this.setToImages = function(prop, oldval, newval)
  {
    this[prop] = newval;
    applyToImages(prop, newval);
    return newval;
  }
  
  this.setHeight = function(prop, oldval, newval)
  {
    if (newval < 0) {
      newval = this.srcHeight;
    }
    this.align();
  }
  
  this.setHOffset = function(prop, oldval, 
  
  
  // WATCHERS
  this.watch("alignment", this.setHAlign);
  this.watch("colorize", this.setToImages);
  this.watch("contextMenuItems", this.setToImages);
  this.watch("fillMode", this.setToImages);
  this.watch("height", this.setHeight);
  this.watch("hAlign", this.setHAlign);
  this.hOffset = 0;
  // this.hRegistrationPoint = null;
  this.hslAdjustment = null;
  this.hslTinting = null;
  this.name = "KonformImage" + this.id;
  this.onContextMenu = "";
  this.onDragDrop = "";
  this.onDragEnter = "";
  this.onDragExit = "";
  this.onMouseDown = "";
  this.onMouseEnter = "";
  this.onMouseExit = "";
  this.onMouseMove = "";
  this.onMouseUp = "";
  this.onMultiClick = "";
  this.opacity = 255;
  // this.rotation = 0;
  this.src = null;
  this.tileOrigin = "topLeft";
  this.tooltip = "";
  this.tracking = "opacity";
  // this.useFileIcon = false;
  this.vOffset = 0;
  this.vAlign = "top";
  // this.vRegistrationPoint = null;
  this.width = -1;
  this.minWidth = 0;
  this.minHeight = 0;
  
  // Create a dummy image to get default values in current context
  var placerImage = new Image();
  this.zOrder = placerImage.zOrder;
  this.window = placerImage.window;
  placerImage = null;
  
  
  
  // READ-ONLY PUBLIC PROPERTIES
  this.srcHeight = 0;
  this.srcWidth = 0;
  
  /**
   * __mouseExitChecker()
   */
  this.__mouseExitChecker = function()
  {
    if (mouseOverState < 2) {
      eval(this.onMouseExit);
      mouseOverState = 0;
    }
    mouseExitTimer.ticking = false;
  }
  
  /**
   * KonformImage.align([cheap])
   *  Realigns the image(s). Call this when the
   */
  this.align = function(cheap)
  {
    if (!this.img instanceof Array) {
      return;
    }
    
    var tHOffset;
    var tVOffset;
    switch (this.hAlign) {
      case "right":
        tHOffset = this.hOffset - this.width;
        break;
      case "center":
        tHOffset = this.hOffset - (this.width / 2);
        break;
      case "left":
      default:
        tHOffset = this.hOffset;
        break;
    }
    
    switch (this.vAlign) {
      case "bottom":
        tVOffset = this.vOffset - this.height;
        break;
      case "middle":
        tVOffset = this.vOffset - (this.height / 2);
        break;
      case "top":
      default:
        tVOffset = this.vOffset;
        break;
    }
    
    switch (this.pattern) {
      case "3x3":
        if (!cheap) {
          this.img[KonformImage.kTopLeft].hOffset =
            this.img[KonformImage.kMiddleLeft].hOffset = 
            this.img[KonformImage.kBottomLeft].hOffset = 
            tHOffset;
          this.img[KonformImage.kTopCenter].hOffset = 
            this.img[KonformImage.kMiddleCenter].hOffset = 
            this.img[KonformImage.kBottomCenter].hOffset = 
            this.img[KonformImage.kTopLeft].hOffset + this.img[KonformImage.kTopLeft].width;
          this.img[KonformImage.kTopLeft].vOffset = 
            this.img[KonformImage.kTopCenter].vOffset = 
            this.img[KonformImage.kTopRight].vOffset = 
            tVOffset;
          this.img[KonformImage.kMiddleLeft].vOffset = 
            this.img[KonformImage.kMiddleCenter].vOffset = 
            this.img[KonformImage.kMiddleRight].vOffset = 
            this.img[KonformImage.kTopLeft].vOffset + this.img[KonformImage.kTopLeft].height;
        }
        this.img[KonformImage.kTopRight].hOffset = 
          this.img[KonformImage.kMiddleRight].hOffset = 
          this.img[KonformImage.kBottomRight].hOffset = 
          this.img[KonformImage.kTopCenter].hOffset + this.img[KonformImage.kTopCenter].width;
        this.img[KonformImage.kBottomLeft].vOffset = 
          this.img[KonformImage.kBottomCenter].vOffset = 
          this.img[KonformImage.kBottomRight].vOffset = 
          this.img[KonformImage.kMiddleLeft].vOffset + this.img[KonformImage.kMiddleLeft].height;
        break;
      case "1x3":
        if (!cheap) {
          this.img[KonformImage.kTop].hOffset =
            this.img[KonformImage.kMiddle].hOffset = 
            this.img[KonformImage.kBottom].hOffset = 
            tHOffset;
          this.img[KonformImage.kTop].vOffset = tVOffset;
          this.img[KonformImage.kMiddle].vOffset = 
            this.img[KonformImage.kTop].vOffset + this.img[KonformImage.kTop].height;
        }
        this.img[KonformImage.kBottom].vOffset = 
          this.img[KonformImage.kMiddle].vOffset + this.img[KonformImage.kMiddle].height;
        break;
      case "3x1":
        if (!cheap) {
          this.img[KonformImage.kLeft].hOffset = tHOffset;
          this.img[KonformImage.kCenter].hOffset = 
            this.img[KonformImage.kLeft].hOffset + this.img[KonformImage.kLeft].width;
          this.img[KonformImage.kLeft].vOffset =
            this.img[KonformImage.kCenter].vOffset = 
            this.img[KonformImage.kRight].vOffset = 
            tVOffset;
        }
        this.img[KonformImage.kRight].hOffset = 
          this.img[KonformImage.kCenter].hOffset + this.img[KonformImage.kCenter].width;
        break;
      default:
        for (var i in this.img) {
          this.img[i].hOffset = tHOffset;
          this.img[i].vOffset = tVOffset;
        }
        break;
    }
  }
  

  this.refresh();
}

/**
 * static KonformImage.ids
 *  Array of all KonformImage objects - used for event-handling.
 */
KonformImage.ids = new Array();

KonformImage.kTop = 0;
KonformImage.kMiddle = 1;
KonformImage.kBottom = 2;

KonformImage.kLeft = 0;
KonformImage.kCenter = 1;
KonformImage.kRight = 2;

KonformImage.kTopLeft = 0;
KonformImage.kTopCenter = 1;
KonformImage.kTopRight = 2;
KonformImage.kMiddleLeft = 3;
KonformImage.kMiddleCenter = 4;
KonformImage.kMiddleRight = 5;
KonformImage.kBottomLeft = 6;
KonformImage.kBottomCenter = 7;
KonformImage.kBottomRight = 8;

KonformImage.prototype.resetMouseActions = function()
{
  this.set("onDragDrop", this.onDragDropEval);
  this.set("onDragEnter", this.onDragEnterEval);
  this.set("onDragExit", this.onDragExitEval);
  this.set("onMouseDown", this.onMouseDownEval);
  this.set("onMouseEnter", this.onMouseEnterEval);
  this.set("onMouseExit", this.onMouseExitEval);
  this.set("onMouseMove", this.onMouseMoveEval);
  this.set("onMouseUp", this.onMouseUpEval);
  this.set("onMultiClick", this.onMultiClickEval);
  
}




KonformImage.prototype.clear = function()
{
  for (var i in this.img) {
    this.img[i] = null;
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
  this.set("opacity", this.opacity);
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
  
  if (property == "opacity") {
    this.opacity = value;
  }
  
  switch (property) {
    case "alignment":
    case "hAlign":
      switch (value) {
        case "right":
          this.hAlign = "right";
          break;
        case "center":
        case "middle":
          this.hAlign = "center";
          break;
        case "left":
        default:
          this.hAlign = "left";
          break;
      }
      this.align();
      break;
    case "vAlign":
      switch (value) {
        case "bottom":
          this.vAlign = "bottom";
          break;
        case "center":
        case "middle":
          this.vAlign = "middle";
          break;
        case "top":
        default:
          this.vAlign = "top";
          break;
      }
      this.align();
      break;
    case "height":
      if (value == -1) {
        this.set("height", this.srcHeight);
        break;
      }
      switch (this.pattern) {
        case "3x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img[KonformImage.kMiddleLeft].height = middleHeight;
          this.img[KonformImage.kMiddleCenter].height = middleHeight;
          this.img[KonformImage.kMiddleRight].height = middleHeight;
          this.height = this.minHeight + middleHeight;
          break;
        case "1x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img[KonformImage.kMiddle].height = middleHeight;
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
      // print("Setting Images of KonformImage.ids[" + this.id + "] to...");
      // for (var i = 1; i < arguments.length; i++) {
      //   print("  " + arguments[i]);
      // }
      
      // print("IMG before");
      // pdump(this.img);
      
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
        // print("IMG middle");
        // pdump(this.img);
        this.set("pattern", "3x3");
        for (var i in this.img) {
          this.img[i].src = value.replace("*", i);
        }
        // print("IMG after");
        // pdump(this.img);
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
        if (arguments.length == 10) {
          this.set("pattern", "3x3");
          this.img[KonformImage.kTopLeft].src = arguments[1];
          this.img[KonformImage.kTopCenter].src = arguments[2];
          this.img[KonformImage.kTopRight].src = arguments[3];
          this.img[KonformImage.kMiddleLeft].src = arguments[4];
          this.img[KonformImage.kMiddleCenter].src = arguments[5];
          this.img[KonformImage.kMiddleRight].src = arguments[6];
          this.img[KonformImage.kBottomLeft].src = arguments[7];
          this.img[KonformImage.kBottomCenter].src = arguments[8];
          this.img[KonformImage.kBottomRight].src = arguments[9];
        } else {
          this.set("pattern", "1x1");
          this.img[0].src = arguments[1];
        }
      }
      
      this.minWidth = 0;
      this.minHeight = 0;
      
      switch (this.pattern) {
        case "3x3":
          // pdump(this);
          // pdump(this.img);
          this.minHeight = this.img[KonformImage.kTopLeft].srcHeight + this.img[KonformImage.kBottomLeft].srcHeight;
          this.minWidth = this.img[KonformImage.kTopLeft].srcWidth + this.img[KonformImage.kTopRight].srcWidth;
          this.srcWidth = this.minWidth + this.img[KonformImage.kTopCenter].srcWidth;
          this.srcHeight = this.minHeight + this.img[KonformImage.kMiddleLeft].srcHeight;
          break;
        case "1x3":
          this.minHeight = this.img[KonformImage.kTop].srcHeight + this.img[KonformImage.kBottom].srcHeight;
          this.srcWidth = this.img[KonformImage.kTop].srcWidth;
          this.srcHeight = this.minHeight + this.img[KonformImage.kMiddle].srcHeight;
          break;
        case "3x1":
          this.minWidth = this.img[KonformImage.kLeft].srcWidth + this.img[KonformImage.kRight].srcWidth;
          this.srcWidth = this.minWidth + this.img[KonformImage.kCenter].srcWidth;
          this.srcHeight = this.img[KonformImage.kLeft].srcHeight;
          break;
        default:
          this.srcWidth = this.img[0].srcWidth;
          this.srcHeight = this.img[0].srcHeight;
          break;
      }
      
      if (this.width < 0) {
        this.width = this.srcWidth;
      }
      if (this.height < 0) {
        this.height = this.srcHeight;
      }
      
      this.align();
      this.refresh();
      // print("IMG last");
      // pdump(this.img);
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
          this.img[i].onMouseEnter = "KonformImage.ids[" + this.id +
                                     "].onMouseEnter(" + indexStr + ");";
          this.img[i].onMouseExit = "KonformImage.ids[" + this.id +
                                     "].onMouseExit(" + indexStr + ");";
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
      switch (this.pattern) {
        case "3x3":
          this.img[KonformImage.kTopLeft] = new Image();
          this.img[KonformImage.kTopCenter] = new Image();
          this.img[KonformImage.kTopRight] = new Image();
          this.img[KonformImage.kMiddleLeft] = new Image();
          this.img[KonformImage.kMiddleCenter] = new Image();
          this.img[KonformImage.kMiddleRight] = new Image();
          this.img[KonformImage.kBottomLeft] = new Image();
          this.img[KonformImage.kBottomCenter] = new Image();
          this.img[KonformImage.kBottomRight] = new Image();
          break;
        case "1x3":
          this.img[KonformImage.kTop] = new Image();
          this.img[KonformImage.kMiddle] = new Image();
          this.img[KonformImage.kBottom] = new Image();
          break;
        case "3x1":
          this.img[KonformImage.kLeft] = new Image();
          this.img[KonformImage.kCenter] = new Image();
          this.img[KonformImage.kRight] = new Image();
          break;
        default:
          this.img[0] = new Image();
          break;
      }
      this.resetMouseActions();
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
      if (value == -1) {
        this.set("width", this.srcWidth);
        break;
      }
      switch (this.pattern) {
        case "3x3":
          var middleWidth = Math.max(value - this.minWidth, 0);
          this.img[KonformImage.kTopCenter].width = middleWidth;
          this.img[KonformImage.kMiddleCenter].width = middleWidth;
          this.img[KonformImage.kBottomCenter].width = middleWidth;
          this.width = this.minWidth + middleWidth;
          break;
        case "3x1":
          var centerWidth = Math.max(value - this.minWidth, 0);
          this.img[KonformImage.kCenter].width = centerWidth;
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
  // print("onMouseExitWrapper(" + id + ", " + indexStr);
  KonformImage.ids[id].onMouseEnter(indexStr);
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


KonformImage.onMouseExitWrapper = function(id, indexStr)
{
  KonformImage.ids[id].onMouseExit(indexStr);
}

KonformImage.prototype.onMouseExit = function(indexStr)
{
  if (typeof(indexStr) == "string") {
    indexStr = unescape(indexStr);
  }
  
  this.mouseOverState = 1;
  this.mouseExitTimer.ticking = true;
}



