/**
 * class KonformObject
 * Base class for any objects that are to appear inside Konforms.
 * (See KonformButton for an example of deriving)
 */
function KonformObject()
{
  this.opacity = 255;
  this.hOffset = 0;
  this.vOffset = 0;
  this.height = 0;
  this.width = 0;
  this.skin = Konform.defaultSkin;
  Konform.ids.push(this);
  this.id = Konform.ids.length - 1;
  this.name = "KonformObject" + this.id;
  this.window = null;
}

/**
 * KonformObject.set(property, value)
 * Generic property setter - applies properties to all members of an object.
 * Always use .set on an object to set properties of the KonformObject.
 * (Override if necessary)
 */
KonformObject.prototype.set = function(property, value)
{
  // print("BASE: " + this.name + ".set(" + property + ", " + value + ")");
  
  if (property == "opacity") {
    this.opacity = value;
  }
    
  if (property == "window") {
    this.window = value;
  }
  
  switch (property) {
    case "hOffset":
    case "vOffset":
      value = parseInt(value);
      for (var i in this) {
        if (i == "window") {
          continue;
        } else if (this[i] instanceof KonformObject || this[i] instanceof KonformImage) {
          if (typeof(this[i][property]) != "undefined") {
            this[i].set(property, this[i][property] + (value - this[property]));
          } else {
            this[i].set(property, value);
          }
        } else if (typeof(this[i]) == "object" && this[i] != null && typeof(this[i][property]) != "undefined") {
          this[i][property] += (value - this[property]);
        }
      }
      this[property] = value;
      break;
    default:
      for (var i in this) {
        if (i == "window") {
          continue;
        } else if (this[i] instanceof KonformObject || this[i] instanceof KonformImage) {
          this[i].set(property, value);
        } else if (typeof(this[i]) == "object" && this[i] != null && typeof(this[i][property]) != "undefined") {
          this[i][property] = value;
        }
      }
      break;
  }
}

/**
 * KonformObject.clear()
 * Generic clear - deletes all the members of an object.
 * (Override if necessary)
 */
KonformObject.prototype.clear = function()
{
  for (var i in this) {
    if (i == "window")
      continue;
    delete this[i];
  }
}


