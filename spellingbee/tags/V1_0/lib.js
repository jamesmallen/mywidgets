/**
 * lib.js
 *
 * All of the functions in this file were obtained from freely reusable
 * resources on the Internet, or were written by me and may be freely reused.
 *
 * Specific sources include:
 *  The Unofficial Konfabulator Wiki (UKKI)
 *    http://konfabulator.wikicities.com
 */


function quoteFilename(str)
{
  return "\"" + str.replace(/[\\"]/g, "\\$&") + "\"";
}

function pdump(obj)
{
  print("PDUMP");
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}


function limit(x, min, max)
{
  if (x <= min)
    return min;
  else if (x >= max)
    return max;
  else
    return x;
}


function getExtension(path) {
  var pos = path.lastIndexOf('.');
  return (pos < 0) ? "" : path.substr(pos + 1);
}


function getFilenameWithoutExtension(path) {
  var pos1 = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  var pos2 = path.lastIndexOf('.');
  return (pos2 < pos1) ?
    path.substr(pos1 + 1) : path.substr(pos1 + 1, pos2 - (pos1 + 1));
}


function getFilename(path) {
  var pos = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return path.substr(pos + 1);
}

function donate()
{
  var myWidgetName = system.widgetDataFolder.substring(system.widgetDataFolder.lastIndexOf("/") + 1);
  openURL('https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=' + escape(myWidgetName) + '%20Widget%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
}
