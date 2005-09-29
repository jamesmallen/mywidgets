/**
 * class KonformSkin
 * A skin class
 * Handles INI parsing, as well
 */


function KonformSkin(path)
{
  this.reset();
  
  if (typeof(path) != "undefined") {
    this.setPrefix(path);
  }
}

KonformSkin.prototype.reset = function()
{
  this.options = new Array();
  this.options["AnchorIndent"] = 16;
  this.options["AnchorSpacing"] = 16;
  this.options["TileBG"] = 0;
  this.options["AllowWindowColor"] = 0;
  
  this.paths = new Array();
  this.paths["Window"] = "Window.png";
  this.paths["WindowColor"] = "WindowColor.png";
  this.paths["ButtonBG"] = "Button.png";
  this.paths["ButtonBGDown"] = "ButtonDown.png";
  this.paths["ButtonBGOver"] = "ButtonOver.png";
  this.paths["Checkbox"] = "Checkbox.png";
  this.paths["CheckboxDown"] = "CheckboxDown.png";
  this.paths["CheckboxOver"] = "CheckboxOver.png";
  this.paths["CheckboxCheck"] = "CheckboxCheck.png";
  this.paths["Resizer"] = "Resizer.png";
  
  this.fonts = new Array();
  this.fonts["WindowTitle"] = "";
  this.fonts["ButtonLabel"] = "";
  this.fonts["CheckboxLabel"] = "";
  this.fonts["Label"] = "";
  this.fonts["Default"] = "";
  
  this.colors = new Array();
  this.colors["WindowTitle"] = "";
  this.colors["ButtonLabel"] = "";
  this.colors["CheckboxLabel"] = "";
  this.colors["Label"] = "";
  this.colors["Default"] = "";
  
  this.shadows = new Array();
  this.shadows["WindowTitle"] = 1;
  this.shadows["ButtonLabel"] = 1;
  this.shadows["CheckboxLabel"] = 1;
  this.shadows["Label"] = 1;
  this.shadows["Default"] = 0;
  
  this.sizes = new Array();
  this.sizes["WindowTitle"] = 20;
  this.sizes["ButtonLabel"] = 14;
  this.sizes["CheckboxLabel"] = 14;
  this.sizes["Label"] = 14;
  this.sizes["Default"] = 12;
  
  this.xratios = new Array();
  this.xratios["WindowTitle"] = 0.5
  this.xratios["ButtonLabel"] = 0.5;
  this.xratios["CheckboxLabel"] = 20;
  this.xratios["Label"] = 0;
  this.xratios["Default"] = 0.5;
  
  this.yratios = new Array();
  this.yratios["WindowTitle"] = 0.5;
  this.yratios["ButtonLabel"] = 0.5;
  this.yratios["CheckboxLabel"] = 0.5;
  this.yratios["Label"] = 0;
  this.yratios["Default"] = 0.5;
  
  this.aligns = new Array();
  this.aligns["WindowTitle"] = "center";
  this.aligns["ButtonLabel"] = "center";
  this.aligns["CheckboxLabel"] = "left";
  this.aligns["Label"] = "left";
  this.aligns["Default"] = "center";
}

KonformSkin.prototype.setPrefix = function(str)
{
  if (filesystem.itemExists(str + "Skin.ini")) {
    this.parseIni(str + "Skin.ini");
  }
  
  for (var i in this.paths) {
    this.paths[i] = str + this.paths[i];
  }
}

KonformSkin.prototype.parseIni = function(iniPath)
{
  var lines = filesystem.readFile(iniPath, true);
  var curArray = "";
  
  for (var i in lines) {
    // Section Header
    var result = lines[i].match(/\[([^\]]*)\]/);
    if (result) {
      curArray = result[1].toLowerCase();
      continue;
    }
    if (curArray == "") {
      continue;
    }
    
    // Content
    result = lines[i].match(/([^=\s;]*)\s*=\s*(([^;]|"[^"]*")*)$/);
    if (result) {
      var key = result[1];
      var value = result[2];
      result = value.match(/"(([^"]|\\")*)"/);
      if (result) {
        this[curArray][key] = result[1];
      } else {
        var numValue = parseFloat(value);
        if (isNaN(numValue)) {
          this[curArray][key] = value;
        } else {
          this[curArray][key] = numValue;
        }
      }
    }
  }
}


