include("Konform.js");


function initialize()
{
  form1 = new Konform();
  form1.set("title", "KonformTest - Default Skin");
  form1.set("resizable", true);
  
  button1 = form1.add(new KonformButton());
  button1.set("label", "Test");
  button1.set("onClick", "alert('clicked!');");
  form1.anchor("bottomright", button1);
  
  /*
  popup1 = form1.add(new KonformPopup());
  popup1.set("hOffset", 30);
  */
  
  
  /*
  scroll1 = form1.add(new KonformScrollbar());
  scroll1.set("hOffset", 40);
  scroll1.set("vOffset", 80);
  */
  
  /*
  label1 = form1.add(new KonformLabel());
  label1.set("hOffset", 145);
  label1.set("vOffset", 100);
  label1.set("label", "Test Button:");
  label1.set("alignment", "right");
  */
  
  
  checkbox1 = form1.add(new KonformCheckbox());
  checkbox1.set("label", "Checkbox");
  checkbox1.set("hOffset", 140);
  checkbox1.set("vOffset", 140);
  checkbox1.set("onClick", "log('Checkbox value is ' + checkbox1.value);");
  
  popup1 = form1.add(new KonformPopup());
  popup1.set("hOffset", 40);
  popup1.set("vOffset", 60);
  popup1.set("options", "English", "Spanish", "French", "Italian", "German", "Latin");
  
  
  
  WindozeSkin = new KonformSkin("Resources/Konform/Windoze/");
  
  form2 = new Konform();
  form2.set("title", "KonformTest - Windoze Skin");
  form2.set("skin", WindozeSkin);
  form2.set("resizable", true);
  
  buttonOK = form2.add(new KonformButton());
  buttonOK.set("label", "OK");
  
  buttonCancel1 = form2.add(new KonformButton());
  buttonCancel1.set("label", "Cancel");
  // form2.snug("bottomright", 10, 10, buttonOK, buttonCancel);
  form2.anchor("bottomright", buttonOK);
  form2.anchor("bottomright", buttonCancel1);
  
  form2.set("liveResize", false);
  
  list1 = form2.add(new KonformList());
  list1.set("hOffset", 40);
  list1.set("vOffset", 80);
  list1.set("options", ["1", "Two", "III", "100", "0x5"]);
  
  AguaSkin = new KonformSkin("Resources/Konform/Agua/");
  
  form3 = new Konform();
  
  form3.set("title", "KonformTest - Agua Skin");
  form3.set("skin", AguaSkin);
  form3.set("resizable", true);
  
  buttonCancel2 = form3.add(new KonformButton());
  buttonCancel2.set("label", "Cancel");
  
  form3.anchor("bottomright", buttonCancel2);
  

  list2 = form3.add(new KonformList());
  list2.set("hOffset", 40);
  list2.set("vOffset", 80);
  list2.set("options", ["1", "Two", "III", "100", "0x5"]);

}










const html_dec = /&#(\d+);/m;
const html_hex = /&#x([a-f0-9]+);/mi;

const html_entities = Array(/&nbsp;/g,/&iexcl;/g,/&cent;/g,/&pound;/g,
/&curren;/g,/&yen;/g,/&brvbar;/g,/&sect;/g,/&uml;/g,/&copy;/g,/&ordf;/g,
/&laquo;/g,/&not;/g,/&shy;/g,/&reg;/g,/&macr;/g,/&deg;/g,/&plusmn;/g,
/&sup2;/g,/&sup3;/g,/&acute;/g,/&micro;/g,/&para;/g,/&middot;/g,
/&cedil;/g,/&sup1;/g,/&ordm;/g,/&raquo;/g,/&frac14;/g,/&frac12;/g,
/&frac34;/g,/&iquest;/g,/&Agrave;/g,/&Aacute;/g,/&Acirc;/g,/&Atilde;/g,
/&Auml;/g,/&Aring;/g,/&AElig;/g,/&Ccedil;/g,/&Egrave;/g,/&Eacute;/g,
/&Ecirc;/g,/&Euml;/g,/&Igrave;/g,/&Iacute;/g,/&Icirc;/g,/&Iuml;/g,
/&ETH;/g,/&Ntilde;/g,/&Ograve;/g,/&Oacute;/g,/&Ocirc;/g,/&Otilde;/g,
/&Ouml;/g,/&times;/g,/&Oslash;/g,/&Ugrave;/g,/&Uacute;/g,/&Ucirc;/g,
/&Uuml;/g,/&Yacute;/g,/&THORN;/g,/&szlig;/g,/&agrave;/g,/&aacute;/g,
/&acirc;/g,/&atilde;/g,/&auml;/g,/&aring;/g,/&aelig;/g,/&ccedil;/g,
/&egrave;/g,/&eacute;/g,/&ecirc;/g,/&euml;/g,/&igrave;/g,/&iacute;/g,
/&icirc;/g,/&iuml;/g,/&eth;/g,/&ntilde;/g,/&ograve;/g,/&oacute;/g,
/&ocirc;/g,/&otilde;/g,/&ouml;/g,/&divide;/g,/&oslash;/g,/&ugrave;/g,
/&uacute;/g,/&ucirc;/g,/&uuml;/g,/&yacute;/g,/&thorn;/g,/&yuml;/g,
/&fnof;/g,/&Alpha;/g,/&Beta;/g,/&Gamma;/g,/&Delta;/g,/&Epsilon;/g,
/&Zeta;/g,/&Eta;/g,/&Theta;/g,/&Iota;/g,/&Kappa;/g,/&Lambda;/g,/&Mu;/g,
/&Nu;/g,/&Xi;/g,/&Omicron;/g,/&Pi;/g,/&Rho;/g,/&Sigma;/g,/&Tau;/g,
/&Upsilon;/g,/&Phi;/g,/&Chi;/g,/&Psi;/g,/&Omega;/g,/&alpha;/g,/&beta;/g,
/&gamma;/g,/&delta;/g,/&epsilon;/g,/&zeta;/g,/&eta;/g,/&theta;/g,
/&iota;/g,/&kappa;/g,/&lambda;/g,/&mu;/g,/&nu;/g,/&xi;/g,/&omicron;/g,
/&pi;/g,/&rho;/g,/&sigmaf;/g,/&sigma;/g,/&tau;/g,/&upsilon;/g,/&phi;/g,
/&chi;/g,/&psi;/g,/&omega;/g,/&thetasym;/g,/&upsih;/g,/&piv;/g,
/&bull;/g,/&hellip;/g,/&prime;/g,/&Prime;/g,/&oline;/g,/&frasl;/g,
/&weierp;/g,/&image;/g,/&real;/g,/&trade;/g,/&alefsym;/g,/&larr;/g,
/&uarr;/g,/&rarr;/g,/&darr;/g,/&harr;/g,/&crarr;/g,/&lArr;/g,/&uArr;/g,
/&rArr;/g,/&dArr;/g,/&hArr;/g,/&forall;/g,/&part;/g,/&exist;/g,
/&empty;/g,/&nabla;/g,/&isin;/g,/&notin;/g,/&ni;/g,/&prod;/g,/&sum;/g,
/&minus;/g,/&lowast;/g,/&radic;/g,/&prop;/g,/&infin;/g,/&ang;/g,
/&and;/g,/&or;/g,/&cap;/g,/&cup;/g,/&int;/g,/&there4;/g,/&sim;/g,
/&cong;/g,/&asymp;/g,/&ne;/g,/&equiv;/g,/&le;/g,/&ge;/g,/&sub;/g,
/&sup;/g,/&nsub;/g,/&sube;/g,/&supe;/g,/&oplus;/g,/&otimes;/g,/&perp;/g,
/&sdot;/g,/&lceil;/g,/&rceil;/g,/&lfloor;/g,/&rfloor;/g,/&lang;/g,
/&rang;/g,/&loz;/g,/&spades;/g,/&clubs;/g,/&hearts;/g,/&diams;/g,
/&quot;/g,/&amp;/g,/&lt;/g,/&gt;/g,/&OElig;/g,/&oelig;/g,/&Scaron;/g,
/&scaron;/g,/&Yuml;/g,/&circ;/g,/&tilde;/g,/&ensp;/g,/&emsp;/g,
/&thinsp;/g,/&zwnj;/g,/&zwj;/g,/&lrm;/g,/&rlm;/g,/&ndash;/g,/&mdash;/g,
/&lsquo;/g,/&rsquo;/g,/&sbquo;/g,/&ldquo;/g,/&rdquo;/g,/&bdquo;/g,
/&dagger;/g,/&Dagger;/g,/&permil;/g,/&lsaquo;/g,/&rsaquo;/g,/&euro;/g);

const unicode_entities = Array('\u00A0','\u00A1','\u00A2','\u00A3','\u00A4',
'\u00A5','\u00A6','\u00A7','\u00A8','\u00A9','\u00AA','\u00AB','\u00AC',
'\u00AD','\u00AE','\u00AF','\u00B0','\u00B1','\u00B2','\u00B3','\u00B4',
'\u00B5','\u00B6','\u00B7','\u00B8','\u00B9','\u00BA','\u00BB','\u00BC',
'\u00BD','\u00BE','\u00BF','\u00C0','\u00C1','\u00C2','\u00C3','\u00C4',
'\u00C5','\u00C6','\u00C7','\u00C8','\u00C9','\u00CA','\u00CB','\u00CC',
'\u00CD','\u00CE','\u00CF','\u00D0','\u00D1','\u00D2','\u00D3','\u00D4',
'\u00D5','\u00D6','\u00D7','\u00D8','\u00D9','\u00DA','\u00DB','\u00DC',
'\u00DD','\u00DE','\u00DF','\u00E0','\u00E1','\u00E2','\u00E3','\u00E4',
'\u00E5','\u00E6','\u00E7','\u00E8','\u00E9','\u00EA','\u00EB','\u00EC',
'\u00ED','\u00EE','\u00EF','\u00F0','\u00F1','\u00F2','\u00F3','\u00F4',
'\u00F5','\u00F6','\u00F7','\u00F8','\u00F9','\u00FA','\u00FB','\u00FC',
'\u00FD','\u00FE','\u00FF','\u0192','\u0391','\u0392','\u0393','\u0394',
'\u0395','\u0396','\u0397','\u0398','\u0399','\u039A','\u039B','\u039C',
'\u039D','\u039E','\u039F','\u03A0','\u03A1','\u03A3','\u03A4','\u03A5',
'\u03A6','\u03A7','\u03A8','\u03A9','\u03B1','\u03B2','\u03B3','\u03B4',
'\u03B5','\u03B6','\u03B7','\u03B8','\u03B9','\u03BA','\u03BB','\u03BC',
'\u03BD','\u03BE','\u03BF','\u03C0','\u03C1','\u03C2','\u03C3','\u03C4',
'\u03C5','\u03C6','\u03C7','\u03C8','\u03C9','\u03D1','\u03D2','\u03D6',
'\u2022','\u2026','\u2032','\u2033','\u203E','\u2044','\u2118','\u2111',
'\u211C','\u2122','\u2135','\u2190','\u2191','\u2192','\u2193','\u2194',
'\u21B5','\u21D0','\u21D1','\u21D2','\u21D3','\u21D4','\u2200','\u2202',
'\u2203','\u2205','\u2207','\u2208','\u2209','\u220B','\u220F','\u2211',
'\u2212','\u2217','\u221A','\u221D','\u221E','\u2220','\u2227','\u2228',
'\u2229','\u222A','\u222B','\u2234','\u223C','\u2245','\u2248','\u2260',
'\u2261','\u2264','\u2265','\u2282','\u2283','\u2284','\u2286','\u2287',
'\u2295','\u2297','\u22A5','\u22C5','\u2308','\u2309','\u230A','\u230B',
'\u2329','\u232A','\u25CA','\u2660','\u2663','\u2665','\u2666','\u0022',
'\u0026','\u003C','\u003E','\u0152','\u0153','\u0160','\u0161','\u0178',
'\u02C6','\u02DC','\u2002','\u2003','\u2009','\u200C','\u200D','\u200E',
'\u200F','\u2013','\u2014','\u2018','\u2019','\u201A','\u201C','\u201D',
'\u201E','\u2020','\u2021','\u2030','\u2039','\u203A','\u20AC');

function decodeHtmlEntities(s) {
  var a;
  
  if (s.indexOf('&') < 0) {
    return s;
  }
  
  // pull out html entities in decimal
  while ((a = s.match(html_dec)) != null) {
    s = s.replace(new RegExp(a[0]), String.fromCharCode(parseInt(a[1], 10)));
  }
  
  // pull out html entities in hex
  while ((a = s.match(html_hex)) != null) {
    s = s.replace(new RegExp(a[0]), String.fromCharCode(parseInt(a[1], 16)));
  }
  
  // pull out other html entities from tables above
  for (var i = 0; i < html_entities.length; i++) {
    // every 10 iterations, check to see if there are any more entities
    if (i % 10 == 0) {
      if (s.indexOf('&') < 0) {
        return s;
      }
    }
    s = s.replace(html_entities[i], unicode_entities[i]);
  }
  
  return s;
}


















initialize();




