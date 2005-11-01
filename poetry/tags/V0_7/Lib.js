/**
 * Lib.js
 *
 * Extra, widget-independent functions.
 *
 */


function pdump(obj)
{
  print("PDUMP");
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}

function getFilename(path) {
  var pos = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return path.substr(pos + 1);
}

