/**
 * class KonformList
 * A list class.
 */
function KonformList()
{
  KonformObject.apply(this); // inherit KonformObject
  
  this.name = "KonformList" + this.id;
  
  this.bg = new KonformImage();
  this.scrollbar = new KonformScrollbar();
  this.scrollbar.set("onScroll", "Konform.ids[" + this.id + "].scrollHandler();");
  this.highlight = new KonformImage();
  this.highlight.set("zOrder", this.bg.zOrder + 1);
  
  this.height = -1;
  this.width = -1;
  this.rows = 0;
  this.rowOffset = 0;
  
  this.minWidth = 0;
  
  this.options = new Array();
  this.optionValues = new Array();
  
  this.texts = new Array();
  this.textShadows = new Array();
  
  this.selectedIndex = 0;
  
  this.value = "";
  
  this.pushed = false;
  this.onChanged = "";
  this.onMouseUp = "";
  this.enabled = true;
  this.visible = true;
  this.opacity = 255;
  this.disabledOpacity = 127;
  this.set("skin", this.skin);
  this.set("visible", this.visible);
  this.set("enabled", this.enabled);
}
KonformList.prototype = new KonformObject(); // inherit KonformObject
KonformList.prototype.constructor = KonformList; // differentiate KonformList

KonformList.prototype.align = function()
{
  this.highlight.set("opacity", 0);
  var curY = this.vOffset + this.skin.yratios["List"];
  var curData = "";
  for (var i = 0; i < this.rows; i++) {
    
    if (i + this.rowOffset >= this.options.length) {
      curData = "";
    } else {
      curData = this.options[i + this.rowOffset];
    }
    this.textShadows[i].data = this.texts[i].data = curData;
    switch (this.skin.aligns["List"]) {
      case "left":
        this.texts[i].hOffset = this.hOffset + this.skin.xratios["List"];
        break;
      case "center":
        this.texts[i].hOffset = this.hOffset + (this.skin.xratios["List"] * this.bg.width);
        break;
      case "right":
        this.texts[i].hOffset = this.hOffset + this.bg.width - this.skin.xratios["List"];
        break;
    }
    this.texts[i].vOffset = curY;
    this.textShadows[i].hOffset = this.texts[i].hOffset + 1;
    this.textShadows[i].vOffset = this.texts[i].vOffset + 1;
    
    if (i + this.rowOffset == this.selectedIndex) {
      this.highlight.set("vOffset", curY + this.skin.yratios["ListHighlight"]);
      if (this.visible) {
        this.highlight.set("opacity", this.opacity);
      }
    }
    
    curY += this.skin.yratios["ListSpacing"];
  }
}


KonformList.prototype.selectHandler = function()
{
  print("selectHandler");
  if (this.options.length <= 0) {
    return;
  }
  
  var curY = system.event.vOffset - this.vOffset - (this.skin.yratios["List"] + this.skin.yratios["ListHighlight"]);
  
  var clickedIndex = Math.floor(curY / this.skin.yratios["ListSpacing"]) + this.rowOffset;
  
  if (clickedIndex >= 0 && clickedIndex < this.options.length) {
    this.set("selectedIndex", clickedIndex);
  }
  
  if (clickedIndex - this.rowOffset < 0) {
    this.scrollbar.scrollToAbs(clickedIndex);
  } else if (clickedIndex - this.rowOffset >= this.rows) {
    this.scrollbar.scrollToAbs(clickedIndex - this.rows + 1);
  }
}


KonformList.prototype.scrollHandler = function()
{
  this.rowOffset = Math.round(this.scrollbar.scrollAbs);
  this.align();
}


KonformList.prototype.refreshValue = function()
{
  if (typeof(this.optionValues[this.selectedIndex]) != "undefined") {
    this.value = this.optionValues[this.selectedIndex];
  } else if (typeof(this.options[this.selectedIndex]) != "undefined") {
    this.value = this.options[this.selectedIndex];
  }
}


/**
 * KonformList set-able properties:
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
KonformList.prototype.set = function(property, value)
{
  // print("(KonformList) " + this.name + ".set(" + property + ", " + value + ")");
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
        this.bg.set("onMouseDown", "Konform.ids[" + this.id + "].selectHandler();");
        this.bg.set("onMouseMove", "Konform.ids[" + this.id + "].selectHandler();");
        this.bg.set("onMouseUp", "Konform.ids[" + this.id + "].bg_onMouseUp();");
      } else {
        this.bg.set("onMouseDown", "");
        this.bg.set("onMouseMove", "");
        this.bg.set("onMouseUp", "");
      }
      break;
    case "height":
      if (value == -1) {
        this.set("rows", -1);
        break;
      }
      this.scrollbar.set("height", value);
      this.height = this.scrollbar.height;
      this.bg.set("height", this.height);
      this.rows = Math.floor((this.height - this.skin.yratios["List"]) / this.skin.yratios["ListSpacing"]);
      
      for (var i in this.texts) {
        delete this.texts[i];
        delete this.textShadows[i];
      }
      
      this.texts = new Array();
      this.textShadows = new Array();
      
      for (var i = 0; i < this.rows; i++) {
        this.textShadows[i] = new Text();
        this.texts[i] = new Text();
        if (this.window != null) {
          this.textShadows[i].window = this.texts[i].window = this.window;
        }
        this.textShadows[i].zOrder = this.bg.zOrder + 2;
        this.texts[i].zOrder = this.textShadows[i].zOrder + 1;
        this.texts[i].color = this.skin.colors["List"];
        this.textShadows[i].color = "#000000";
        this.textShadows[i].font = this.texts[i].font = this.skin.fonts["List"];
        this.textShadows[i].size = this.texts[i].size = this.skin.sizes["List"];
        this.textShadows[i].hAlign = this.texts[i].hAlign = this.skin.aligns["List"];
        if (!this.skin.shadows["List"]) {
          this.textShadows[i].opacity = 0;
        } else {
          this.textShadows[i].opacity = this.opacity;
        }
        this.texts[i].opacity = this.opacity;
      }
      
      this.scrollbar.set("scrollHeight", Math.max(0, this.options.length - this.rows));
      
      this.align();
      
      break;
    case "rows":
      print("rows, " + value);
      if (value == -1) {
        value = this.options.length;
      }
      this.set("height", value * this.skin.yratios["ListSpacing"] + this.skin.yratios["List"]);
      break;
    case "width":
      this.width = Math.max(this.minWidth, value);
      // this.bg.set("width", this.width - this.scrollbar.width + this.skin.yratios["ListScrollbar"]);
      this.bg.set("width", this.width - this.scrollbar.width - this.skin.yratios["ListScrollbar"]);
      this.highlight.set("width", this.bg.width);
      this.scrollbar.set("hOffset", this.hOffset + this.bg.width + this.skin.yratios["ListScrollbar"]);
      break;
    case "onChanged":
      this.onChanged = value;
      break;
    case "onMouseUp":
      this.onMouseUp = value;
      break;
    case "opacity":
      this.opacity = value;
      if (this.visible) {
        KonformObject.prototype.set.apply(this, ["opacity", this.opacity]);
      }
      for (var i in this.texts) {
        this.texts[i].opacity = this.opacity;
      }
      if (this.skin.shadows["List"]) {
        for (var i in this.textShadows) {
          this.textShadows[i].opacity = this.opacity;
        }
      }
      break;
    case "options":
      if (value instanceof Array) {
        this.options = new Array();
        for (var i in value) {
          this.options.push(value[i]);
        }
      } else {
        this.options = new Array();
        for (var i = 1; i < arguments.length; i++) {
          this.options.push(arguments[i]);
        }
      }
      var newMinWidth = 0;
      var tempText = new Text();
      tempText.font = this.skin.fonts["List"];
      tempText.size = this.skin.sizes["List"];
      for (var i in this.options) {
        tempText.data = this.options[i];
        newMinWidth = Math.max(newMinWidth, tempText.width);
      }
      delete tempText;
      this.minWidth = newMinWidth + this.skin.yratios["ListPadding"];
      this.set("width", -1);
      
      this.scrollbar.set("scrollHeight", Math.max(0, this.options.length - this.rows));
      
      this.refreshValue();
      
      this.align();
      break;
    case "optionValues":
      if (value instanceof Array) {
        this.optionValues = new Array();
        for (var i in value) {
          this.optionValues.push(value[i]);
        }
      } else {
        this.optionValues = new Array();
        for (var i = 1; i < arguments.length; i++) {
          this.optionValues.push(arguments[i]);
        }
      }
      this.refreshValue();
      break;
    case "selectedIndex":
      this.selectedIndex = value;
      this.refreshValue();
      this.align();
      eval(this.onChanged);
      break;
    case "size":
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
    case "skin":
      this.skin = value;
      this.scrollbar.set("skin", this.skin);
      this.bg.set("images", this.skin.paths["List"]);
      this.highlight.set("images", this.skin.paths["ListSelection"]);
      
      for (var i in this.texts) {
        this.texts[i].color = this.skin.colors["List"];
        this.textShadows[i].hAlign = this.texts[i].hAlign = this.skin.aligns["List"];
        this.textShadows[i].style = this.texts[i].style = "";
        this.textShadows[i].font = this.texts[i].font = this.skin.fonts["List"];
        this.textShadows[i].size = this.texts[i].size = this.skin.sizes["List"];
        if (!this.skin.shadows["List"]) {
          this.textShadows[i].opacity = 0;
        }
      }
      this.set("width", this.width);
      this.set("rows", this.rows);
      this.set("opacity", this.opacity);
      this.set("value", this.value);
      break;
    case "value":
      if (typeof(value) == "number") {
        this.select(value);
      } else {
        var found = false;
        for (var i in this.optionValues) {
          if (this.optionValues[i] == value) {
            found = true;
            this.set("selectedIndex", i);
            break;
          }
        }
        if (!found) {
          for (var i in this.options) {
            if (this.options[i] == value) {
              found = true;
              this.set("selectedIndex", i);
              break;
            }
          }
        }
      }
      if (found) {
        return true;
      } else {
        return false;
      }
      break;
    case "visible":
      this.visible = value;
      if (this.visible) {
        var newOpacity = this.opacity;
      } else {
        var newOpacity = 0;
      }
        KonformObject.prototype.set.apply(this, ["opacity", newOpacity]);
        for (var i in this.texts) {
          this.texts[i].opacity = newOpacity;
        }
        if (this.skin.shadows["List"]) {
          for (var i in this.textShadows) {
            this.textShadows[i].opacity = newOpacity;
          }
        }
      break;
    case "hOffset":
    case "vOffset":
      KonformObject.prototype.set.apply(this, [property, value]);
      this.align();
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]);
      for (var i in this.texts) {
        if (typeof(this.texts[i][property]) != "undefined") {
          this.textShadows[i][property] = this.texts[i][property] = value;
        }
      }
      break;
  }
}


KonformList.prototype.bg_onMouseUp = function()
{
  eval(this.onMouseUp);
}

