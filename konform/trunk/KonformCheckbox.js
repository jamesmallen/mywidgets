/**
 * class KonformCheckbox
 * A checkbox class.
 */
function KonformCheckbox()
{
  KonformObject.apply(this); // inherit KonformObject
  
  this.name = "KonformCheckbox" + this.id;
  
  this.bg = new KonformImage();
  this.check = new KonformImage();
  this.labelShadow = new Text();
  this.labelShadow.color = "#000000";
  
  this.label = new Text();
  
  this.value = false;
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
KonformCheckbox.prototype = new KonformObject(); // inherit KonformObject
KonformCheckbox.prototype.constructor = KonformCheckbox; // differentiate KonformCheckbox

/**
 * KonformCheckbox set-able properties:
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
KonformCheckbox.prototype.set = function(property, value)
{
  // print("(KonformCheckbox) " + this.name + ".set(" + property + ", " + value + ")");
  switch (property) {
    case "checked":
    case "value":
      this.value = value;
      if (this.value) {
        this.check.set("images", this.skin.paths["CheckboxCheck"]);
      } else {
        this.check.set("images", "");
      }
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
      // this.bg.set("height", value);
      this.height = value;
      this.label.vOffset = this.vOffset + this.height * this.skin.yratios["CheckboxLabel"];
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
      this.bg.set("images", this.skin.paths["Checkbox"]);
      this.check.set("images", this.skin.paths["CheckboxCheck"]);
      this.label.color = this.skin.colors["CheckboxLabel"];
      this.labelShadow.hAlign = this.label.hAlign = this.skin.aligns["CheckboxLabel"];
      this.labelShadow.style = this.label.style = "";
      this.labelShadow.font = this.label.font = this.skin.fonts["CheckboxLabel"];
      this.labelShadow.size = this.label.size = this.skin.sizes["CheckboxLabel"];
      this.set("width", this.bg.width);
      this.set("height", this.bg.height);
      this.set("opacity", this.opacity);
      this.set("value", this.value);
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
      // this.bg.set("width", value);
      this.width = value;
      switch (this.skin.aligns["CheckboxLabel"]) {
        case "left":
          this.label.hOffset = this.hOffset + this.skin.xratios["CheckboxLabel"];
          break;
        case "center":
          this.label.hOffset = this.hOffset + this.width * this.skin.xratios["CheckboxLabel"];
          break;
        case "right":
          this.label.hOffset = this.hOffset + this.width - this.skin.xratios["CheckboxLabel"];
          break;
      }
      this.labelShadow.hOffset = this.label.hOffset + 1;
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
  }
}


KonformCheckbox.onMouseEnterWrapper = function(id)
{
  Konform.ids[id].onMouseEnter();
}

KonformCheckbox.prototype.onMouseEnter = function()
{
  if (this.pushed) {
    this.bg.set("images", this.skin.paths["CheckboxDown"]);
  } else {
    this.bg.set("images", this.skin.paths["CheckboxOver"]);
  }
  this.highlight = true;
}

KonformCheckbox.onMouseExitWrapper = function(id)
{
  Konform.ids[id].onMouseExit();
}

KonformCheckbox.prototype.onMouseExit = function()
{
  this.bg.set("images", this.skin.paths["Checkbox"]);
  this.highlight = false;
}

KonformCheckbox.onMouseDownWrapper = function(id)
{
  Konform.ids[id].onMouseDown();
}

KonformCheckbox.prototype.onMouseDown = function()
{
  if (this.highlight && !this.pushed) {
    this.bg.set("images", this.skin.paths["CheckboxDown"]);
    this.pushed = true;
  }
}

KonformCheckbox.onMouseUpWrapper = function(id)
{
  Konform.ids[id].onMouseUp();
}

KonformCheckbox.prototype.onMouseUp = function()
{
  if (this.highlight && this.pushed) {
    this.set("value", !this.value);
    eval(this.onClick);
  }
  this.pushed = false;
  if (this.highlight) {
    this.bg.set("images", this.skin.paths["CheckboxOver"]);
  } else {
    this.bg.set("images", this.skin.paths["Checkbox"]);
  }
}

