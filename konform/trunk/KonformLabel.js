/**
 * class KonformLabel
 * A label class.
 */
function KonformLabel()
{
  KonformObject.apply(this);
  
  this.labelShadow = new Text();
  this.labelShadow.color = "#000000";
  
  this.label = new Text();
  
  this.width = -1;
  this.height = -1;
  this.alignment = this.skin.aligns["Label"];
  this.customAlignment = false;
  
  this.set("skin", this.skin);
  this.set("width", this.width);
  this.set("height", this.height);
}
KonformLabel.prototype = new KonformObject();
KonformLabel.prototype.constructor = KonformLabel;

/**
 * KonformLabel set-able properties
 *  alignment - horizontal alignment of the label
 *  height - self-explanatory
 *  label - the text of the label
 *  size - font size of the label
 *  skin - custom skin to use (automatically inherited from window normally)
 *  width - self-explanatory
 */
KonformLabel.prototype.set = function(property, value)
{
  switch (property) {
    case "alignment":
      this.labelShadow.hAlign = this.label.hAlign = this.alignment = value;
      this.customAlignment = true;
      break;
    case "height":
      this.height = value;
      this.label.vOffset = this.vOffset + value * this.skin.yratios["Label"];
      this.labelShadow.vOffset = this.label.vOffset + 1;
      break;
    case "label":
      this.labelShadow.data = this.label.data = value;
      break;
    case "size":
      KonformObject.prototype.set.apply(this, [property, value]);
      break;
    case "skin":
      this.skin = value;
      this.label.color = this.skin.colors["Label"];
      if (!this.customAlignment) {
        this.alignment = this.skin.aligns["Label"];
      }
      this.labelShadow.hAlign = this.label.hAlign = this.alignment;
      this.labelShadow.style = this.label.style = "";
      this.labelShadow.font = this.label.font = this.skin.fonts["Label"];
      this.labelShadow.size = this.label.size = this.skin.sizes["Label"];
      if (this.skin.shadows["ButtonLabel"]) {
        this.labelShadow.opacity = 255;
      } else {
        this.labelShadow.opacity = 0;
      }
      break;
    case "width":
      this.width = value;
      switch (this.skin.aligns["Label"]) {
        case "left":
          this.label.hOffset = this.hOffset + this.skin.xratios["Label"];
          break;
        case "center":
          this.label.hOffset = this.hOffset + this.width * this.skin.xratios["Label"];
          break;
        case "right":
          this.label.hOffset = this.hOffset + this.width - this.skin.xratios["Label"];
          break;
      }
      this.labelShadow.hOffset = this.label.hOffset + 1;
      break;
    default:
      KonformObject.prototype.set.apply(this, [property, value]); // Base class
      break;
  }
}


