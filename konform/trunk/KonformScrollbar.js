/**
 * class KonformScrollbar
 * A scrollbar class.
 */
function KonformScrollbar()
{
  KonformObject.apply(this); // inherit KonformObject
  
  this.name = "KonformScrollbar" + this.id;
  
  this.bg = new KonformImage();
  this.upButton = new KonformImage();
  this.downButton = new KonformImage();
  this.downButton.set("vAlign", "bottom");
  this.handle = new KonformImage();
  
  this.upPushed = false;
  this.upHighlight = false;
  
  this.downPushed = false;
  this.downHighlight = false;
  
  this.scrollValue = 0;
  this.scrollAbs = 0;
  this.scrollHeight = 1;
  
  this.scrollTimer = new Timer();
  this.scrollTimer.ticking = false;
  this.scrollTimer.interval = 0.4;
  this.scrollTimer.onTimerFired = "Konform.ids[" + this.id + "].scrollTimerFired();";
  
  this.onScroll = "";
  
  this.enabled = true;
  this.visible = true;
  this.opacity = 255;
  this.disabledOpacity = 127;
  this.set("skin", this.skin);
  this.set("visible", this.visible);
  this.set("enabled", this.enabled);
}
KonformScrollbar.prototype = new KonformObject(); // inherit KonformObject
KonformScrollbar.prototype.constructor = KonformScrollbar; // differentiate KonformScrollbar

/**
 * KonformScrollbar set-able properties:
 *  disabledOpacity - integer, 0-255: the opacity of the button when enabled = false
 *      (note: if set() when enabled = false, this means the opacity when enabled = true)
 *  enabled - sets whether the button is enabled (clickable and opaque-ish)
 *  height - self-explanatory
 *  label - the text that is used to label the button
 *  onClick - string that is eval'd when the button is clicked
 *  opacity - opacity of the button elements
 *  size - font size of the label
 *  skin - custom skin to use (automatically inherited from window normally)
 *  visible - if false, hides the button
 *  width - self-explanatory
 */
KonformScrollbar.prototype.set = function(property, value)
{
  print("(KonformScrollbar) " + this.name + ".set(" + property + ", " + value + ")");
  switch (property) {
    case "disabledOpacity":
      this.disabledOpacity = value;
      break;
    case "enabled":
      if ((!this.enabled && value) || (this.enabled && !value)) {
        var newOpacity = this.disabledOpacity;
        this.disabledOpacity = this.opacity;
        this.set("opacity", newOpacity);
        this.enabled = value;
      }
      if (this.enabled) {
        this.bg.set("onMouseEnter", "Konform.ids[" + this.id + "].bg_onMouseEnter();");
        this.bg.set("onMouseExit", "Konform.ids[" + this.id + "].bg_onMouseExit();");
        this.bg.set("onMouseDown", "Konform.ids[" + this.id + "].bg_onMouseDown();");
        this.bg.set("onMouseUp", "Konform.ids[" + this.id + "].bg_onMouseUp();");
        this.upButton.set("onMouseEnter", "Konform.ids[" + this.id + "].upButton_onMouseEnter();");
        this.upButton.set("onMouseExit", "Konform.ids[" + this.id + "].upButton_onMouseExit();");
        this.upButton.set("onMouseDown", "Konform.ids[" + this.id + "].upButton_onMouseDown();");
        this.upButton.set("onMouseUp", "Konform.ids[" + this.id + "].upButton_onMouseUp();");
        this.downButton.set("onMouseEnter", "Konform.ids[" + this.id + "].downButton_onMouseEnter();");
        this.downButton.set("onMouseExit", "Konform.ids[" + this.id + "].downButton_onMouseExit();");
        this.downButton.set("onMouseDown", "Konform.ids[" + this.id + "].downButton_onMouseDown();");
        this.downButton.set("onMouseUp", "Konform.ids[" + this.id + "].downButton_onMouseUp();");
        this.handle.set("onMouseDown", "Konform.ids[" + this.id + "].handle_onMouseDown();");
        this.handle.set("onMouseUp", "Konform.ids[" + this.id + "].handle_onMouseUp();");
        this.handle.set("onMouseMove", "Konform.ids[" + this.id + "].handle_onMouseMove();");
      } else {
        this.bg.set("onMouseEnter", "");
        this.bg.set("onMouseExit", "");
        this.bg.set("onMouseDown", "");
        this.bg.set("onMouseUp", "");
        this.upButton.set("onMouseEnter", "");
        this.upButton.set("onMouseExit", "");
        this.upButton.set("onMouseDown", "");
        this.upButton.set("onMouseUp", "");
        this.downButton.set("onMouseEnter", "");
        this.downButton.set("onMouseExit", "");
        this.downButton.set("onMouseDown", "");
        this.downButton.set("onMouseUp", "");
        this.handle.set("onMouseDown", "");
        this.handle.set("onMouseUp", "");
        this.handle.set("onMouseMove", "");
      }
      break;
    case "height":
      this.bg.set("height", value);
      this.height = this.bg.height;
      this.downButton.set("vOffset", this.vOffset + this.height);
      this.availableHeight = this.height - (this.upButton.height + this.downButton.height + this.handle.height);
      if (this.availableHeight <= 0) {
        this.availableHeight = 0;
        print("setting opacity...");
        this.handle.set("opacity", 0);
      } else {
        this.handle.set("opacity", this.opacity);
      }
      this.scrollTo(this.scrollValue);
      break;
    case "onScroll":
      this.onScroll = value;
      break;
    case "opacity":
      this.opacity = value;
      if (this.visible) {
        KonformObject.prototype.set.apply(this, ["opacity", this.opacity]);
      }
      if (this.availableHeight <= 0) {
        this.availableHeight = 0;
        print("setting opacity...");
        this.handle.set("opacity", 0);
      }
      break;
    case "scrollHeight":
      this.scrollHeight = value;
      break;
    case "skin":
      this.skin = value;
      this.bg.set("images", this.skin.paths["ScrollBG"]);
      
      this.upButton.set("images", this.skin.paths["ScrollUp"]);
      this.downButton.set("images", this.skin.paths["ScrollDown"]);
      this.handle.set("images", this.skin.paths["ScrollHandle"]);
      
      this.scrollTop = this.upButton.height;
      
      this.set("opacity", this.opacity);
      this.set("width", this.bg.width);
      this.set("height", this.bg.height);
      break;
    case "visible":
      this.visible = value;
      if (this.visible) {
        KonformObject.prototype.set.apply(this, ["opacity", this.opacity]);
      } else {
        KonformObject.prototype.set.apply(this, ["opacity", 0]);
      }
      break;
    case "width":
      this.bg.set("width", value);
      this.width = this.bg.width;
      this.upButton.set("width", this.width);
      this.downButton.set("width", this.width);
      this.handle.set("width", this.width);
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
  }
}


KonformScrollbar.prototype.scrollTo = function(y)
{
  if (y < 0) {
    y = 0;
  }
  if (y > this.availableHeight) {
    y = this.availableHeight;
  }
  this.scrollValue = y;
  if (this.availableHeight > 0) {
    this.scrollAbs = y / this.availableHeight * this.scrollHeight;
  } else {
    this.scrollAbs = 0;
  }
  this.handle.set("vOffset", this.vOffset + this.scrollTop + this.scrollValue);
  if (typeof(this.onScroll) == "function") {
    this.onScroll(this.scrollAbs);
  } else {
    eval(this.onScroll);
  }
}

KonformScrollbar.prototype.scrollToAbs = function(y)
{
  if (y < 0) {
    y = 0;
  }
  if (y > this.scrollHeight) {
    y = this.scrollHeight;
  }
  if (this.scrollHeight > 0) {
    this.scrollValue = Math.round(y / this.scrollHeight * this.availableHeight);
  } else {
    this.scrollValue = 0;
  }
  this.scrollAbs = y;
  this.handle.set("vOffset", this.vOffset + this.scrollTop + this.scrollValue);
  if (typeof(this.onScroll) == "function") {
    this.onScroll(this.scrollAbs);
  } else {
    eval(this.onScroll);
  }
}


KonformScrollbar.prototype.bg_onMouseEnter = function()
{
  
}

KonformScrollbar.prototype.bg_onMouseExit = function()
{
}

KonformScrollbar.prototype.bg_onMouseDown = function()
{
  this.scrollTo(system.event.y - this.scrollTop + this.handle.height / 2);
}

KonformScrollbar.prototype.bg_onMouseUp = function()
{
}







KonformScrollbar.prototype.upButton_onMouseEnter = function()
{
  if (this.upPushed) {
    this.upButton.set("images", this.skin.paths["ScrollUpDown"]);
    this.scrollTimer.ticking = true;
  } else {
    this.upButton.set("images", this.skin.paths["ScrollUpOver"]);
  }
  this.upHighlight = true;
}

KonformScrollbar.prototype.upButton_onMouseExit = function()
{
  this.upButton.set("images", this.skin.paths["ScrollUp"]);
  this.upHighlight = false;
}

KonformScrollbar.prototype.upButton_onMouseDown = function()
{
  if (this.upHighlight && !this.upPushed) {
    this.upButton.set("images", this.skin.paths["ScrollUpDown"]);
    this.upPushed = true;
    this.scrollTimerFired();
    this.scrollTimer.interval = 0.4;
    this.scrollTimer.ticking = true;
  }
}

KonformScrollbar.prototype.upButton_onMouseUp = function()
{
  this.upPushed = false;
  if (this.upHighlight) {
    this.upButton.set("images", this.skin.paths["ScrollUpOver"]);
  } else {
    this.upButton.set("images", this.skin.paths["ScrollUp"]);
  }
}



KonformScrollbar.prototype.scrollTimerFired = function()
{
  if (!this.downPushed && !this.upPushed) {
    this.scrollTimer.ticking = false;
    return;
  } else {
    this.scrollTimer.interval = .1;
  }
  if (this.downPushed && !this.upPushed) {
    this.scrollToAbs(this.scrollAbs + 1);
  } else if (this.upPushed && !this.downPushed) {
    this.scrollToAbs(this.scrollAbs - 1);
  }
}


KonformScrollbar.prototype.downButton_onMouseEnter = function()
{
  if (this.downPushed) {
    this.downButton.set("images", this.skin.paths["ScrollDownDown"]);
    this.scrollTimer.ticking = true;
  } else {
    this.downButton.set("images", this.skin.paths["ScrollDownOver"]);
  }
  this.downHighlight = true;
}

KonformScrollbar.prototype.downButton_onMouseExit = function()
{
  this.downButton.set("images", this.skin.paths["ScrollDown"]);
  this.downHighlight = false;
}

KonformScrollbar.prototype.downButton_onMouseDown = function()
{
  if (this.downHighlight && !this.downPushed) {
    this.downButton.set("images", this.skin.paths["ScrollDownDown"]);
    this.downPushed = true;
    this.scrollTimerFired();
    this.scrollTimer.interval = 0.4;
    this.scrollTimer.ticking = true;
  }
}

KonformScrollbar.prototype.downButton_onMouseUp = function()
{
  this.downPushed = false;
  if (this.downHighlight) {
    this.downButton.set("images", this.skin.paths["ScrollDownOver"]);
  } else {
    this.downButton.set("images", this.skin.paths["ScrollDown"]);
  }
}





KonformScrollbar.prototype.handle_onMouseDown = function()
{
  this.dragStart = this.scrollValue - system.event.vOffset;
}

KonformScrollbar.prototype.handle_onMouseUp = function()
{
  // clear dragStart
  this.dragStart = null;
}


KonformScrollbar.prototype.handle_onMouseMove = function()
{
  if (typeof(this.dragStart) != "number") {
    log("Whoa - we got a MouseMove without a MouseDown!");
    this.dragStart = this.scrollValue - system.event.vOffset;
  }
  
  var newY = this.dragStart + system.event.vOffset;
  if (newY != this.scrollValue) {
    this.scrollTo(newY);
  }
}




