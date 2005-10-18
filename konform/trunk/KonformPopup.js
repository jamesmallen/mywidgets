/**
 * class KonformPopup
 * A Popup class.
 */
function KonformPopup()
{
  KonformObject.apply(this); // inherit KonformObject
  
  this.name = "KonformPopup" + this.id;
  
  this.bg = new KonformImage();
  this.textShadow = new Text();
  this.text = new Text();
  this.button = new KonformButton();
  
  this.list = null;
  
  this.options = new Array();
  this.optionValues = new Array();
  
  this.option = "";
  this.value = "";
  this.expanded = false;
  
  this.rows = -1;
  
  this.onChanged = "";
  this.enabled = true;
  this.visible = true;
  this.opacity = 255;
  this.disabledOpacity = 127;
  this.set("skin", this.skin);
  this.set("visible", this.visible);
  this.set("enabled", this.enabled);
}
KonformPopup.prototype = new KonformObject(); // inherit KonformObject
KonformPopup.prototype.constructor = KonformPopup; // differentiate KonformPopup

/**
 * KonformPopup set-able properties:
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
KonformPopup.prototype.set = function(property, value)
{
  // print("(KonformPopup) " + this.name + ".set(" + property + ", " + value + ")");
  switch (property) {
    case "rows":
      if (this.list != null) {
        this.list.set("rows", value);
        this.rows = this.list.rows;
      } else {
        this.rows = value;
      }
      break;
    case "value":
      if (this.list != null) {
        this.list.set("value", value);
        this.value = this.list.value;
      } else {
        this.value = value;
      }
      this.textShadow.data = this.text.data = this.value;
      break;
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
        this.button.set("onClick", "Konform.ids[" + this.id + "].button_onClick();");
      } else {
        this.button.set("onClick", "");
      }
      break;
    case "height":
      if (this.list != null) {
        this.list.set("height", value);
        this.height = this.list.height;
      } else {
        this.height = value;
      }
      this.text.vOffset = this.skin.yratios["Popup"];
      this.textShadow.vOffset = this.text.vOffset + 1;
      break;
    case "onChanged":
      this.onChanged = value;
      break;
    case "opacity":
      this.opacity = value;
      if (this.visible) {
        KonformObject.prototype.set.apply(this, ["opacity", this.opacity]);
      }
      if (!this.skin.shadows["List"]) {
        this.textShadow.opacity = 0;
      }
      break;
    case "options":
    case "optionValues":
      
      if (!(value instanceof Array)) {
        var newValue = new Array();
        for (var i = 1; i < arguments.length; i++) {
          newValue.push(arguments[i]);
        }
        value = newValue;
      }
      if (this.list != null) {
        this.list.set(property, value);
      } else {
        this[property] = value;
        if (!this.value && value.length > 0) {
          this.set("value", value[0]);
        }
      }
      break;
    case "size":
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
    case "skin":
      this.skin = value;
      this.bg.set("images", this.skin.paths["Popup"]);
      this.button.set("buttonSize", "small");
      this.button.set("picture", this.skin.paths["ArrowDown"]);
      
      this.text.color = this.skin.colors["Popup"];
      this.textShadow.color = "#000000";
      this.textShadow.hAlign = this.text.hAlign = this.skin.aligns["Popup"];
      this.textShadow.style = this.text.style = "";
      this.textShadow.font = this.text.font = this.skin.fonts["Popup"];
      this.textShadow.size = this.text.size = this.skin.sizes["Popup"];
      
      this.set("width", this.bg.width);
      this.set("height", this.bg.height);
      this.set("opacity", this.opacity);
      this.set("value", this.value);
      this.set("rows", this.rows);
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
      if (this.list != null) {
        this.list.set("width", this.width);
      }
      this.button.set("hOffset", this.hOffset + this.width + this.skin.xratios["PopupButton"]);
      switch (this.skin.aligns["Popup"]) {
        case "left":
          this.text.hOffset = this.hOffset + this.skin.xratios["Popup"];
          break;
        case "center":
          this.text.hOffset = this.hOffset + this.width * this.skin.xratios["Popup"];
          break;
        case "right":
          this.text.hOffset = this.hOffset + this.width - this.skin.xratios["Popup"];
          break;
      }
      this.textShadow.hOffset = this.text.hOffset + 1;
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
  }
}


KonformPopup.prototype.button_onClick = function()
{
  if (this.list == null) {
    // build list
    this.list = new KonformList();
    this.list.set("window", this.window);
    this.list.set("skin", this.skin);
    this.list.set("hOffset", this.hOffset + this.skin.xratios["PopupList"]);
    this.list.set("vOffset", this.vOffset + this.skin.yratios["PopupList"]);
    this.list.set("options", this.options);
    this.list.set("optionValues", this.optionValues);
    this.list.set("onChanged", "Konform.ids[" + this.id + "].list_onChanged();");
    this.list.set("onMouseUp", "Konform.ids[" + this.id + "].list_onMouseUp();");
    this.list.set("value", this.value);
    this.value = this.list.value;
    // this.list.set("visible", false);
    this.set("width", this.width);
    this.set("rows", this.rows);
  } else {
    this.list.set("visible", !this.list.visible);
  }
}


KonformPopup.prototype.list_onChanged = function()
{
  this.value = this.list.value;
  this.textShadow.data = this.text.data = this.value;
  eval(this.onChanged);
}

KonformPopup.prototype.list_onMouseUp = function()
{
  this.button_onClick();
}


