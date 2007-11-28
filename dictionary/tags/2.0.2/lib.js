/**
 * Library functions
 * $Id$
 */

function addSlashes(str) {
	return str.replace(/(['"\\])/g, '\\$1');
}


function pdump(obj)
{
  print("PDUMP of " + obj);
  for (var i in obj) {
    if (typeof(obj[i]) != "function") {
      print("  [" + i + "]: " + obj[i]);
    }
  }
}

function domdump(obj, level)
{
	if (!level) {
		print('DOMDUMP');
		print(obj.name);
		level = 0;
	} else if (level > 5) {
		return;
	}
	
	var indent = '';
	for (var i = 0; i < level; i++) {
		indent += '  ';
	}
	
	for (var i = obj.firstChild; i != null; i = i.nextSibling) {
		print(indent + '  ' + i.name);
		if (i.firstChild) {
			domdump(i, level + 1);
		}
	}
	
}

function ddump(obj, level)
{
	if (!level) {
		print('DDUMP');
		level = 0;
	} else if (level > 3) {
		return;
	}
	var indent = '';
	for (var i = 0; i < level; i++) {
		indent += '  ';
	}
  for (var i in obj) {
		if (typeof(obj[i]) == 'object') {
			print(indent + '  [' + i + ']: OBJECT');
			ddump(obj[i], level + 1);
		} else if (typeof(obj[i]) != "function") {
      print(indent + "  [" + i + "]: " + obj[i]);
    }
  }
}


function donate()
{
	if (1 == alert('If you like this Widget, the author would appreciate a PayPal donation of any amount. Would you like to be taken to a website where you can help him out and contribute to the development of future Widgets?', 'Yes', 'No')) {
		
	  var myWidgetName = widget.name;
	  openURL('https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=' + escape(myWidgetName) + '%20Widget%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
	}
}



