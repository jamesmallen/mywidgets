/**
 * Lib.js
 *
 * All of the functions in this file were obtained from freely reusable
 * resources on the Internet, or were written by me and may be freely reused.
 *
 * Specific sources include:
 *  The Unofficial Konfabulator Wiki (UKKI)
 *    http://konfabulator.wikicities.com
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

function donate()
{
  var myWidgetName = system.widgetDataFolder.substring(system.widgetDataFolder.lastIndexOf("/") + 1);
  openURL('https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=' + escape(myWidgetName) + '%20Widget%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
}

