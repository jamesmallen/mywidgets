/**
 * class KonformButton
 * A button class.
 */
function KonformButton()
{
  KonformObject.apply(this); // inherit KonformObject
  
  this.name = "KonformButton" + this.id;
  
  this.bg = new KonformImage();
  this.labelShadow = new Text();
  this.labelShadow.color = "#000000";
  
  this.label = new Text();
  
  this.highlight = false;
  this.pushed = false;
  this.onClick = "";
  this.enabled = true;
  this.visible = true;
  this.opacity = 255;
  this.disabledOpacity = 127;
  this.set("skin", this.skin);
  this.set("visible", this.visible);
  this.set("enabled", this.enabled);
}
KonformButton.prototype = new KonformObject(); // inherit KonformObject
KonformButton.prototype.constructor = KonformButton; // differentiate KonformButton

/**
 * KonformButton set-able properties:
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
KonformButton.prototype.set = function(property, value)
{
  // print("(KonformButton) " + this.name + ".set(" + property + ", " + value + ")");
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
        this.bg.set("onMouseEnter", "Konform.ids[" + this.id + "].onMouseEnter();");
        this.bg.set("onMouseExit", "Konform.ids[" + this.id + "].onMouseExit();");
        this.bg.set("onMouseDown", "Konform.ids[" + this.id + "].onMouseDown();");
        this.bg.set("onMouseUp", "Konform.ids[" + this.id + "].onMouseUp();");
      } else {
        this.bg.set("onMouseEnter", "");
        this.bg.set("onMouseExit", "");
        this.bg.set("onMouseDown", "");
        this.bg.set("onMouseUp", "");
      }
      break;
    case "height":
      this.bg.set("height", value);
      this.height = this.bg.height;
      this.label.vOffset = this.vOffset + this.height * this.skin.yratios["ButtonLabel"];
      this.labelShadow.vOffset = this.label.vOffset + 1;
      break;
    case "label":
      this.labelShadow.data = this.label.data = value;
      break;
    case "onClick":
      this.onClick = value;
      break;
    case "opacity":
      this.opacity = value;
      if (this.visible) {
        KonformObject.prototype.set.apply(this, ["opacity", this.opacity]);
      }
      if (!this.skin.shadows["ButtonLabel"]) {
        this.labelShadow.opacity = 0;
      }
      break;
    case "size":
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
    case "skin":
      this.skin = value;
      this.bg.set("images", this.skin.paths["Button"]);
      this.label.color = this.skin.colors["ButtonLabel"];
      this.labelShadow.hAlign = this.label.hAlign = this.skin.aligns["ButtonLabel"];
      this.labelShadow.style = this.label.style = "";
      this.labelShadow.font = this.label.font = this.skin.fonts["ButtonLabel"];
      this.labelShadow.size = this.label.size = this.skin.sizes["ButtonLabel"];
      this.set("width", this.bg.width);
      this.set("height", this.bg.height);
      this.set("opacity", this.opacity);
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
      switch (this.skin.aligns["ButtonLabel"]) {
        case "left":
          this.label.hOffset = this.hOffset + this.skin.xratios["ButtonLabel"];
          break;
        case "center":
          this.label.hOffset = this.hOffset + this.width * this.skin.xratios["ButtonLabel"];
          break;
        case "right":
          this.label.hOffset = this.hOffset + this.width - this.skin.xratios["ButtonLabel"];
          break;
      }
      this.labelShadow.hOffset = this.label.hOffset + 1;
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
  }
}


KonformButton.onMouseEnterWrapper = function(id)
{
  Konform.ids[id].onMouseEnter();
}

KonformButton.prototype.onMouseEnter = function()
{
  if (this.pushed) {
    this.bg.set("images", this.skin.paths["ButtonDown"]);
  } else {
    this.bg.set("images", this.skin.paths["ButtonOver"]);
  }
  this.highlight = true;
}

KonformButton.onMouseExitWrapper = function(id)
{
  Konform.ids[id].onMouseExit();
}

KonformButton.prototype.onMouseExit = function()
{
  this.bg.set("images", this.skin.paths["Button"]);
  this.highlight = false;
}

KonformButton.onMouseDownWrapper = function(id)
{
  Konform.ids[id].onMouseDown();
}

KonformButton.prototype.onMouseDown = function()
{
  if (this.highlight && !this.pushed) {
    this.bg.set("images", this.skin.paths["ButtonDown"]);
    this.pushed = true;
  }
}

KonformButton.onMouseUpWrapper = function(id)
{
  Konform.ids[id].onMouseUp();
}

KonformButton.prototype.onMouseUp = function()
{
  if (this.highlight && this.pushed) {
    eval(this.onClick);
  }
  this.pushed = false;
  if (this.highlight) {
    this.bg.set("images", this.skin.paths["ButtonOver"]);
  } else {
    this.bg.set("images", this.skin.paths["Button"]);
  }
}

