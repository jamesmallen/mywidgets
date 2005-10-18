/**
 * class KonformSkin
 * A skin class
 * Handles INI parsing, as well
 */


function KonformSkin(path)
{
  this.reset();
  
  if (typeof(path) != "undefined") {
    this.setPath(path);
  }
}

KonformSkin.prototype.reset = function()
{
  if (Konform.defaultSkin instanceof KonformSkin) {
    for (var i in Konform.defaultSkin) {
      if (Konform.defaultSkin[i] instanceof Array) {
        this[i] = new Array();
        for (var j in Konform.defaultSkin[i]) {
          this[i][j] = Konform.defaultSkin[i][j];
        }
      }
    }
  } else {
    this.options = new Array();
    this.paths = new Array();
    this.fonts = new Array();
    this.colors = new Array();
    this.shadows = new Array();
    this.sizes = new Array();
    this.aligns = new Array();
    this.widths = new Array();
    this.heights = new Array();
    this.xratios = new Array();
    this.yratios = new Array();
  }
}

KonformSkin.prototype.setPath = function(str)
{
  if (filesystem.itemExists(str + "Skin.ini")) {
    this.parseIni(str);
  }
}

KonformSkin.prototype.parseIni = function(iniPath)
{
  var lines = filesystem.readFile(iniPath + "Skin.ini", true);
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
        value = result[1];
      } else {
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          value = numValue;
        }
      }
      if (curArray == "paths") {
        value = iniPath + value;
      }
      if (key.toLowerCase() == "default") {
        for (var j in this[curArray]) {
          this[curArray][j] = value;
        }
      } else {
        this[curArray][key] = value;
      }
    }
  }
}


Konform.defaultSkin = new KonformSkin("Resources/Konform/DimPlastic/");

