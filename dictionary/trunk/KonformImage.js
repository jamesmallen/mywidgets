/**
 * class KImage
 * A smart-scaling Image wrapper
 *  Allows for an image to be specified as a group of images arranged in a
 *  pattern, and will only scale certain images in the pattern.
 *
 * Copyright 2005, James M. Allen
 *
 * Usage example:

      foo = new KImage();
      foo.src = "Resources/Window*.png";
      foo.hOffset = 30;
      foo.vOffset = 30;
      foo.width = 200;
      foo.height = 150;
      
      var anm = KResizeAnimation(foo, 400, 300, animator.kEaseOut, doneFunc);
      animator.start(anm);
  
 *  The above example will create a KImage called foo, that is made up of a
 *  3x3 grid of images (WindowTopLeft.png, WindowTopCenter.png, ...).
 *  It is initially set to a size of (200, 150), and an animation is started
 *  to resize it to (400, 300). Because the image is a 3x3 grid (specified by
 *  the "*" character in the src), the images at the corners will maintain
 *  their original sizes, and the other images will stretch to fill the rest
 *  of the width and the height.
 *
 * Details
 *  The key to specifying a pattern of images is in the src property.
 *  If src contains one of the three special characters (*, <, or |), then
 *  the image will take on a pattern according to the character and look
 *  for images with matching filenames. The patterns are as follows:
 *
 *  3x3 (Specified with "*")
 *    This is a 3x3 pattern. Images in the corners (TopLeft, TopRight,
 *    BottomLeft, and BottomRight) will maintain their original size. Images
 *    on the left and right will maintain their original width, and images
 *    on the top and bottom will maintain their original height.
 *    
 *    If src is specified as "MyImage*.png", you need the following files:
 *    MyImageTopLeft.png      MyImageTopCenter.png      MyImageTopRight.png
 *    MyImageMiddleLeft.png   MyImageMiddleCenter.png   MyImageMiddleRight.png
 *    MyImageBottomLeft.png   MyImageBottomCenter.png   MyImageBottomRight.png
 *
 *  3x1 (Specified with "<")
 *    This is a 3x1 (3 horizontal, 1 vertical) pattern. Images at the left and
 *    right will maintain their original width.
 *    
 *    If src is specified as "MyImage<.png", you need the following files:
 *    MyImageLeft.png         MyImageCenter.png         MyImageRight.png
 *
 *  1x3 (Specified with "|")
 *    This is a 1x3 (1 horizontal, 3 vertical) pattern. Images at the top and
 *    bottom will maintain their original height.
 *    
 *    If src is specified as "MyImage|.png", you need the following files:
 *                            MyImageTop.png
 *                            MyImageMiddle.png
 *                            MyImageBottom.png
 *
 * Animating KImages
 *  The built-in simple Animation functions (FadeAnimation and MoveAnimation)
 *  will not work on KImages. However, you may use the provided
 *  KFadeAnimation, KMoveAnimation, and KResizeAnimation functions to animate
 *  KImages (These will work with regular Image objects, too, in case you
 *  wanted to animate a regular Image resizing).
 *  They are used in much the same way as their built-in counterparts, with
 *  one important difference: they are not called with the "new" keyword.
 *
 *  Refer to example above or the funciton definitions below for more
 *  information.
 *
 *
 */




/**
 * KFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
 *  Works just like FadeAnimation, on a KImage.
 *  Should be called with "var a = KFadeAnimation(...)",
 *  not "var a = new KFadeAnimation(...)".
 */
function KFadeAnimation(object, toOpacity, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KFadeAnimation.update, KFadeAnimation.done);
  
  anm.object = object;
  anm.fromOpacity = object.opacity;
  anm.toOpacity = toOpacity;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KFadeAnimation.update = function()
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
    newOpacity = animator.ease(this.fromOpacity, this.toOpacity, percent, this.easeType);
    ret = true;
  }
  
  this.object.opacity = newOpacity;
  return ret;
}

KFadeAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


/**
 * KMoveAnimation(object, toX, toY, duration, easeType, doneFunc)
 *  Works just like MoveAnimation, on a KImage.
 *  Should be called with "var a = KMoveAnimation(...)",
 *  not "var a = new KMoveAnimation(...)".
 */
function KMoveAnimation(object, toX, toY, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KMoveAnimation.update, KMoveAnimation.done);
  
  anm.object = object;
  anm.fromX = object.hOffset;
  anm.fromY = object.vOffset;
  anm.toX = toX;
  anm.toY = toY;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KMoveAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newX;
  var newY;
  var ret;
  
  if (percent >= 1.0) {
    newX = this.toX;
    newY = this.toY;
    ret = false;
  } else {
    newX = animator.ease(this.fromX, this.toX, percent, this.easeType);
    newY = animator.ease(this.fromY, this.toY, percent, this.easeType);
    ret = true;
  }
  
  this.object.hOffset = newX;
  this.object.vOffset = newY;
  return ret;
}

KMoveAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


/**
 * KResizeAnimation(object, toWidth, toHeight, easeType, doneFunc)
 *  Works like MoveAnimation, only it resizes, and works on a KImage.
 *  Should be called with "var a = KResizeAnimation(...)",
 *  not "var a = new KResizeAnimation(...)".
 */
function KResizeAnimation(object, toWidth, toHeight, duration, easeType, doneFunc)
{
  var anm = new CustomAnimation(1, KResizeAnimation.update, KResizeAnimation.done);
  
  anm.object = object;
  anm.fromWidth = object.width;
  anm.fromHeight = object.height;
  anm.toWidth = toWidth;
  anm.toHeight = toHeight;
  anm.duration = duration;
  anm.easeType = easeType;
  anm.doneFunc = doneFunc;
  
  return anm;
}

KResizeAnimation.update = function()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newWidth;
  var newHeight;
  var ret;
  
  if (percent >= 1.0) {
    newWidth = this.toWidth;
    newHeight = this.toHeight;
    ret = false;
  } else {
    newWidth = animator.ease(this.fromWidth, this.toWidth, percent, this.easeType);
    newHeight = animator.ease(this.fromHeight, this.toHeight, percent, this.easeType);
    ret = true;
  }
  
  this.object.width = newWidth;
  this.object.height = newHeight;
  return ret;
}

KResizeAnimation.done = function()
{
  if (typeof(this.doneFunc) == "function") {
    this.doneFunc();
  }
}


/**
 * class KImage
 *  An Image object replacement.
 *  Should support most of the properties that a normal Image supports,
 *  with added functionality of "smart-scaling" images.
 */
function KImage()
{
  this.id = KImage.ids.length;
  KImage.ids.push(this);
  
  // PRIVATE VARIABLES
  var frame = new Frame();
  var img = new Array();
  for (var i = 0; i < 9; i++) {
    var curI = new Image();
    img.push(curI);
    curI.visible = false;
    curI.src = "Resources/Blank.png";
    curI.width = -1;
    curI.height = -1;
    frame.addSubview(curI);
  }
  var pattern = null;
  
  var self = this;
  
  
  
  // PRIVATE METHODS
  // Privileged proxy
  var setSrcProxy = function(prop, oldval, newval)
  {
    return this.setSrc(prop, oldval, newval);
  }
  this.setSrc = function(prop, oldval, newval)
  {
    return setSrc(prop, oldval, newval);
  }
  var setSrc = function(prop, oldval, newval)
  {
    for (var i in img) {
      img[i].visible = false;
      img[i].src = "Resources/Blank.png";
      img[i].width = -1;
      img[i].height = -1;
    }
    
    if (!newval || typeof(newval) != "string") {
      self.unwatch("minHeight");
      self.unwatch("minWidth");
      self.unwatch("srcHeight")
      self.unwatch("srcWidth");
      self.minWidth = 0;
      self.minHeight = 0;
      self.srcWidth = 0;
      self.srcHeight = 0;
      self.watch("minHeight", setReadOnly);
      self.watch("minWidth", setReadOnly);
      self.watch("srcHeight", setReadOnly);
      self.watch("srcWidth", setReadOnly);
      return "";
    }
    
    if (newval.indexOf("*") != -1) {
      // log("  pattern = 3x3");
      pattern = "3x3";
      img[KImage.kTopLeft].src = newval.replace("*", "TopLeft");
      img[KImage.kTopCenter].src = newval.replace("*", "TopCenter");
      img[KImage.kTopRight].src = newval.replace("*", "TopRight");
      img[KImage.kMiddleLeft].src = newval.replace("*", "MiddleLeft");
      img[KImage.kMiddleCenter].src = newval.replace("*", "MiddleCenter");
      img[KImage.kMiddleRight].src = newval.replace("*", "MiddleRight");
      img[KImage.kBottomLeft].src = newval.replace("*", "BottomLeft");
      img[KImage.kBottomCenter].src = newval.replace("*", "BottomCenter");
      img[KImage.kBottomRight].src = newval.replace("*", "BottomRight");
      for (var i = 0; i < 9; i++) {
        img[i].visible = true;
      }
    } else if (newval.indexOf("<") != -1) {
      // log("  pattern = 3x1");
      pattern = "3x1";
      img[KImage.kLeft].src = newval.replace("<", "Left");
      img[KImage.kCenter].src = newval.replace("<", "Center");
      img[KImage.kRight].src = newval.replace("<", "Right");
      for (var i = 0; i < 3; i++) {
        img[i].visible = true;
      }
    } else if (newval.indexOf("|") != -1) {
      // log("  pattern = 1x3");
      pattern = "1x3";
      img[KImage.kTop].src = newval.replace("|", "Top");
      img[KImage.kMiddle].src = newval.replace("|", "Middle");
      img[KImage.kBottom].src = newval.replace("|", "Bottom");
      for (var i = 0; i < 3; i++) {
        img[i].visible = true;
      }
    } else {
      // log("  pattern = 1x1");
      pattern = "1x1";
      img[0].src = newval;
      img[0].visible = true;
    }
    
    /*
    log("  img dump");
    for (var i in img) {
      self.idump(img[i]);
    }
    */
    
    self.unwatch("minHeight");
    self.unwatch("minWidth");
    self.unwatch("srcHeight")
    self.unwatch("srcWidth");
    
    self.minWidth = 0;
    self.minHeight = 0;
    
    switch (pattern) {
      case "3x3":
        self.minHeight = img[KImage.kTopLeft].srcHeight + img[KImage.kBottomLeft].srcHeight;
        self.minWidth = img[KImage.kTopLeft].srcWidth + img[KImage.kTopRight].srcWidth;
        self.srcWidth = self.minWidth + img[KImage.kTopCenter].srcWidth;
        self.srcHeight = self.minHeight + img[KImage.kMiddleLeft].srcHeight;
        break;
      case "1x3":
        self.minHeight = img[KImage.kTop].srcHeight + img[KImage.kBottom].srcHeight;
        self.srcWidth = img[KImage.kTop].srcWidth;
        self.srcHeight = self.minHeight + img[KImage.kMiddle].srcHeight;
        break;
      case "3x1":
        self.minWidth = img[KImage.kLeft].srcWidth + img[KImage.kRight].srcWidth;
        self.srcWidth = self.minWidth + img[KImage.kCenter].srcWidth;
        self.srcHeight = img[KImage.kLeft].srcHeight;
        break;
      default:
        self.srcWidth = img[0].srcWidth;
        self.srcHeight = img[0].srcHeight;
        break;
    }
    
    self.watch("minHeight", setReadOnly);
    self.watch("minWidth", setReadOnly);
    self.watch("srcHeight", setReadOnly);
    self.watch("srcWidth", setReadOnly);
    
    /*
    if (self.width < 0) {
      self.width = this.srcWidth;
    }
    if (self.height < 0) {
      self.height = this.srcHeight;
    }
    */
    resize(false);
    return newval;
  }
  
  
  
  var resize = function(cheap)
  {
    var tHeight;
    var tWidth;
    if (self.height < 0 || !self.height) {
      tHeight = self.srcHeight;
    } else {
      tHeight = self.height;
    }
    if (self.width < 0) {
      tWidth = self.srcWidth;
    } else {
      tWidth = self.width;
    }
    
    switch (pattern) {
      case "3x3":
        if (!cheap) {
          img[KImage.kTopLeft].hOffset =
            img[KImage.kMiddleLeft].hOffset = 
            img[KImage.kBottomLeft].hOffset = 0;
          img[KImage.kTopCenter].hOffset = 
            img[KImage.kMiddleCenter].hOffset = 
            img[KImage.kBottomCenter].hOffset = img[KImage.kTopLeft].width;
          img[KImage.kTopLeft].vOffset = 
            img[KImage.kTopCenter].vOffset = 
            img[KImage.kTopRight].vOffset = 0;
          img[KImage.kMiddleLeft].vOffset = 
            img[KImage.kMiddleCenter].vOffset = 
            img[KImage.kMiddleRight].vOffset = img[KImage.kTopLeft].height;
        }
        img[KImage.kTopCenter].width = 
          img[KImage.kMiddleCenter].width =
          img[KImage.kBottomCenter].width = tWidth - self.minWidth;
        img[KImage.kTopRight].hOffset = 
          img[KImage.kMiddleRight].hOffset = 
          img[KImage.kBottomRight].hOffset = img[KImage.kTopCenter].hOffset + img[KImage.kTopCenter].width;
        img[KImage.kMiddleLeft].height = 
          img[KImage.kMiddleCenter].height =
          img[KImage.kMiddleRight].height = tHeight - self.minHeight;
        img[KImage.kBottomLeft].vOffset = 
          img[KImage.kBottomCenter].vOffset = 
          img[KImage.kBottomRight].vOffset = img[KImage.kMiddleLeft].vOffset + img[KImage.kMiddleLeft].height;
        break;
      case "1x3":
        if (!cheap) {
          img[KImage.kTop].hOffset =
            img[KImage.kMiddle].hOffset = 
            img[KImage.kBottom].hOffset = 0;
          img[KImage.kTop].vOffset = 0;
          img[KImage.kMiddle].vOffset = img[KImage.kTop].height;
        }
        img[KImage.kTop].width =
          img[KImage.kMiddle].width =
          img[KImage.kBottom].width = self.width;
        img[KImage.kMiddle].height = tHeight - self.minHeight;
        img[KImage.kBottom].vOffset = img[KImage.kMiddle].vOffset + img[KImage.kMiddle].height;
        break;
      case "3x1":
        if (!cheap) {
          img[KImage.kLeft].hOffset = 0;
          img[KImage.kCenter].hOffset = img[KImage.kLeft].width;
          img[KImage.kLeft].vOffset =
            img[KImage.kCenter].vOffset = 
            img[KImage.kRight].vOffset = 0;
        }
        img[KImage.kCenter].width = tWidth - self.minWidth;
        img[KImage.kLeft].height =
          img[KImage.kCenter].height =
          img[KImage.kRight].height = self.height;
        img[KImage.kRight].hOffset = img[KImage.kCenter].hOffset + img[KImage.kCenter].width;
        break;
      default:
        for (var i in img) {
          if (!cheap) {
            img[i].hOffset = 0;
            img[i].vOffset = 0;
          }
          img[i].width = tWidth;
          img[i].height = tHeight;
        }
        break;
    }
  }
  
  // Setters  
  var setAlignmentProxy = function(prop, oldval, newval)
  {
    return this.setAlignment(prop, oldval, newval);
  }
  this.setAlignment = function(prop, oldval, newval)
  {
    return setAlignment(prop, oldval, newval);
  }
  var setAlignment = function(prop, oldval, newval)
  {
    log("setAlignment(" + newval + ")");
    return self.setToFrame("hAlign", oldval, newval)
  }
  
  
  var setHeightProxy = function(prop, oldval, newval)
  {
    return this.setHeight(prop, oldval, newval);
  }
  this.setHeight = function(prop, oldval, newval)
  {
    return setHeight(prop, oldval, newval);
  }
  var setHeight = function(prop, oldval, newval)
  {
    log("setHeight(" + newval + ")");
    if (newval < 0) {
      newval = self.srcHeight;
    }
    if (newval == oldval) {
      print("  Value hasn't changed - doing nothing!");
      return newval;
    } else {
      // Height needs to be set before calling resize()
      self.height = Math.max(newval, self.minHeight);
      resize(true);
      return self.height;
    }
  }
  
  var setWidthProxy = function(prop, oldval, newval)
  {
    return this.setWidth(prop, oldval, newval);
  }
  this.setWidth = function(prop, oldval, newval)
  {
    return setWidth(prop, oldval, newval);
  }
  var setWidth = function(prop, oldval, newval)
  {
    log("setWidth(" + newval + ")");
    if (newval < 0) {
      newval = self.srcWidth;
    }
    if (newval == oldval) {
      print("  Value hasn't changed - doing nothing!");
      return newval;
    } else {
      // Width needs to be set before calling resize()
      self.width = Math.max(newval, self.minWidth);
      resize();
      return self.width;
    }
  }
  
  /**
   * setToImages
   *  Special-case watcher for properties that should be applied to all images.
   */
  var setToImagesProxy = function(prop, oldval, newval)
  {
    return this.setToImages(prop, oldval, newval);
  }
  this.setToImages = function(prop, oldval, newval)
  {
    return setToImages(prop, oldval, newval);
  }
  var setToImages = function(prop, oldval, newval)
  {
    try {
      log("setToImages(" + prop + ", " + newval + ")");
      for (var i in img) {
        img[i][prop] = newval;
      }
      // this[prop] is set implicitly
      return newval;
    } catch (ex) {
      log("EXCEPTION");
      pdump(ex);
    }
  }
  
  /**
   * setToFrame
   *  Special-case watcher for properties that should be applied to frame.
   */
  var setToFrameProxy = function(prop, oldval, newval)
  {
    return this.setToFrame(prop, oldval, newval);
  }
  this.setToFrame = function(prop, oldval, newval)
  {
    return setToFrame(prop, oldval, newval);
  }
  var setToFrame = function(prop, oldval, newval)
  {
    log("setToFrame(" + prop + ", " + newval + ")");
    frame[prop] = newval;
    // this[prop] is set implicitly
    return newval;
  }
  
  /**
   * setReadOnly
   *  Special-case watcher for any properties that are "read-only".
   */
  var setReadOnly = function(prop, oldval, newval)
  {
    return oldval;
  }
  
  
  this.idump = function(prop)
  {
    pdump(eval(prop));
  }
  
  this.iset = function(prop, value)
  {
    eval(prop + " = " + value);
  }
  
  this.ieval = function(str)
  {
    eval(str);
  }
  
  
  var _width = -1;
  
  
  // WATCHERS
  // READ-ONLY PUBLIC PROPERTIES
  this.srcHeight = 0;
  this.srcWidth = 0;
  this.minWidth = 0;
  this.minHeight = 0;
  
  this.watch("minHeight", setReadOnly);
  this.watch("minWidth", setReadOnly);
  this.watch("srcHeight", setReadOnly);
  this.watch("srcWidth", setReadOnly);
  
  
  
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
  this.name = "KImage" + this.id;
  this.onContextMenu = "";
  this.onDragDrop = "";
  this.onDragEnter = "";
  this.onDragExit = "";
  this.onMouseDown = "";
  this.onMouseEnter = "";
  this.onMouseExit = "";
  this.onMouseMove = "";
  this.onMouseUp = "";
  this.onMouseWheel = "";
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
  // this.width = -1;
  
  this.watch("alignment", setAlignmentProxy);
  this.watch("colorize", setToImagesProxy);
  this.watch("contextMenuItems", setToImagesProxy);
  this.watch("fillMode", setToImagesProxy);
  this.watch("height", setHeightProxy);
  this.watch("hAlign", setToFrameProxy);
  this.watch("hOffset", setToFrameProxy);
  this.watch("hslAdjustment", setToImagesProxy);
  this.watch("hslTinting", setToImagesProxy);
  this.watch("onContextMenu", setToFrameProxy);
  this.watch("onDragDrop", setToFrameProxy);
  this.watch("onDragEnter", setToFrameProxy);
  this.watch("onDragExit", setToFrameProxy);
  this.watch("onMouseDown", setToFrameProxy);
  this.watch("onMouseEnter", setToFrameProxy);
  this.watch("onMouseExit", setToFrameProxy);
  this.watch("onMouseMove", setToFrameProxy);
  this.watch("onMouseUp", setToFrameProxy);
  this.watch("onMouseWheel", setToFrameProxy);
  this.watch("onMultiClick", setToFrameProxy);
  this.watch("opacity", setToFrameProxy);
  this.watch("src", setSrcProxy);
  this.watch("tileOrigin", setToImagesProxy);
  this.watch("tooltip", setToImagesProxy);
  this.watch("vOffset", setToFrameProxy);
  this.watch("vAlign", setToFrameProxy);
  // this.watch("width", setWidthProxy);
  this.__defineSetter__("width", function(newval)
  {
    log("setWidth(" + newval + ")");
    if (newval < 0) {
      newval = this.srcWidth;
    }
    if (newval == _width) {
      print("  Value hasn't changed - doing nothing!");
    } else {
      // Width needs to be set before calling resize()
      print("setting width");
      _width = Math.max(newval, this.minWidth);
      print("calling resize()");
      resize();
      print("returned from resize()");
      // return self.width;
    }
  });
  this.__defineGetter__("width", function() { return _width; });
  this.watch("window", setToFrameProxy);
  this.watch("zOrder", setToFrameProxy);
  
  // Create a dummy image to get default values in current context
  var placerImage = new Image();
  this.zOrder = placerImage.zOrder;
  this.window = placerImage.window;
  placerImage = null;
  
  
}

/**
 * static KImage.ids
 *  Array of all KImage objects - used for event-handling.
 */
KImage.ids = new Array();

/**
 * KImage constants
 *  Constants for array indices of images in particular positions.
 */
KImage.kTop = 0;
KImage.kMiddle = 1;
KImage.kBottom = 2;

KImage.kLeft = 0;
KImage.kCenter = 1;
KImage.kRight = 2;

KImage.kTopLeft = 0;
KImage.kTopCenter = 1;
KImage.kTopRight = 2;
KImage.kMiddleLeft = 3;
KImage.kMiddleCenter = 4;
KImage.kMiddleRight = 5;
KImage.kBottomLeft = 6;
KImage.kBottomCenter = 7;
KImage.kBottomRight = 8;



/**
 * KImage set-able properties:
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
 /*
KImage.prototype.set = function(property, value)
{
  // print("(KImage).set(" + property + ", " + value + ")");
  
  if (property == "opacity") {
    this.opacity = value;
  }
  
  switch (property) {
    case "height":
      if (value == -1) {
        this.set("height", this.srcHeight);
        break;
      }
      switch (this.pattern) {
        case "3x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img[KImage.kMiddleLeft].height = middleHeight;
          this.img[KImage.kMiddleCenter].height = middleHeight;
          this.img[KImage.kMiddleRight].height = middleHeight;
          this.height = this.minHeight + middleHeight;
          break;
        case "1x3":
          var middleHeight = Math.max(value - this.minHeight, 0);
          this.img[KImage.kMiddle].height = middleHeight;
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
      // print("Setting Images of KImage.ids[" + this.id + "] to...");
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
          this.img[KImage.kTopLeft].src = arguments[1];
          this.img[KImage.kTopCenter].src = arguments[2];
          this.img[KImage.kTopRight].src = arguments[3];
          this.img[KImage.kMiddleLeft].src = arguments[4];
          this.img[KImage.kMiddleCenter].src = arguments[5];
          this.img[KImage.kMiddleRight].src = arguments[6];
          this.img[KImage.kBottomLeft].src = arguments[7];
          this.img[KImage.kBottomCenter].src = arguments[8];
          this.img[KImage.kBottomRight].src = arguments[9];
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
          this.minHeight = this.img[KImage.kTopLeft].srcHeight + this.img[KImage.kBottomLeft].srcHeight;
          this.minWidth = this.img[KImage.kTopLeft].srcWidth + this.img[KImage.kTopRight].srcWidth;
          this.srcWidth = this.minWidth + this.img[KImage.kTopCenter].srcWidth;
          this.srcHeight = this.minHeight + this.img[KImage.kMiddleLeft].srcHeight;
          break;
        case "1x3":
          this.minHeight = this.img[KImage.kTop].srcHeight + this.img[KImage.kBottom].srcHeight;
          this.srcWidth = this.img[KImage.kTop].srcWidth;
          this.srcHeight = this.minHeight + this.img[KImage.kMiddle].srcHeight;
          break;
        case "3x1":
          this.minWidth = this.img[KImage.kLeft].srcWidth + this.img[KImage.kRight].srcWidth;
          this.srcWidth = this.minWidth + this.img[KImage.kCenter].srcWidth;
          this.srcHeight = this.img[KImage.kLeft].srcHeight;
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
          this.img[i].onMouseEnter = "KImage.ids[" + this.id +
                                     "].onMouseEnter(" + indexStr + ");";
          this.img[i].onMouseExit = "KImage.ids[" + this.id +
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
          this.img[KImage.kTopLeft] = new Image();
          this.img[KImage.kTopCenter] = new Image();
          this.img[KImage.kTopRight] = new Image();
          this.img[KImage.kMiddleLeft] = new Image();
          this.img[KImage.kMiddleCenter] = new Image();
          this.img[KImage.kMiddleRight] = new Image();
          this.img[KImage.kBottomLeft] = new Image();
          this.img[KImage.kBottomCenter] = new Image();
          this.img[KImage.kBottomRight] = new Image();
          break;
        case "1x3":
          this.img[KImage.kTop] = new Image();
          this.img[KImage.kMiddle] = new Image();
          this.img[KImage.kBottom] = new Image();
          break;
        case "3x1":
          this.img[KImage.kLeft] = new Image();
          this.img[KImage.kCenter] = new Image();
          this.img[KImage.kRight] = new Image();
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
          this.img[KImage.kTopCenter].width = middleWidth;
          this.img[KImage.kMiddleCenter].width = middleWidth;
          this.img[KImage.kBottomCenter].width = middleWidth;
          this.width = this.minWidth + middleWidth;
          break;
        case "3x1":
          var centerWidth = Math.max(value - this.minWidth, 0);
          this.img[KImage.kCenter].width = centerWidth;
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
*/



