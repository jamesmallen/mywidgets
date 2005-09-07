var backgroundImages = new Array();
var dueList = new Array();
var dueListItemsShadows = new Array();
var dueListDatesShadows = new Array();
var dueListItems = new Array();
var dueListDates = new Array();
var reflectionImages = new Array();
var glowImages = new Array();

var itemHeight = 27;
var itemHOffset = 7;
var itemVOffset = 8;
var textHOffset = 10;
var textVOffset = 16;
var dateHOffset = 10;
var dateVOffset = 16;

var decorationsHeight = 15;

emptyBackground = new Image();
emptyBackground.src = "Resources/GrayBackground.png";
emptyBackground.vOffset = itemVOffset;
emptyBackground.hOffset = itemHOffset;
emptyBackground.opacity = 0;
emptyBackground.tooltip = "Right-click to add new Due items.";
emptyBackground.onContextMenu = "buildContextMenu(-1)";

emptyTextShadow = new Text();
emptyText = new Text();
emptyTextShadow.data = emptyText.data = "Nothing Due!";
emptyTextShadow.hOffset = main.width / 2 + 1;
emptyTextShadow.vOffset = itemVOffset + textVOffset + 1;
emptyText.hOffset = main.width / 2;
emptyText.vOffset = itemVOffset + textVOffset;
emptyTextShadow.alignment = emptyText.alignment = "center";
emptyTextShadow.color = "#000000";
emptyText.color = "#FFFFFF";
emptyTextShadow.font = emptyText.font = preferences.userNormalFont.value;
emptyTextShadow.size = emptyText.size = preferences.userNormalSize.value;
emptyTextShadow.opacity = emptyText.opacity = 0;

emptyReflection = new Image();
emptyReflection.src = "Resources/ClearReflection.png";
emptyReflection.vOffset = itemVOffset;
emptyReflection.hOffset = itemHOffset;
emptyReflection.opacity = 0;





function pad(str, length, pad_char, side)
{
  if (pad_char == null) {
    pad_char = ' ';
  }
  if (side == null) {
    side = "right";
  }
  if (str.length > length) {
    switch(side) {
      case "left":
        return str.substring(length - str.length);
        break;
      case "right":
      default:
        return str.substring(0, length);
        break;
    }
  } else if (str.length == length) {
    return str;
  }
  
  var numPad = length - str.length;
  var padding = "";
  for (var i = 0; i < numPad; i++) {
    padding += pad_char.charAt(i % pad_char.length);
  }
  
  switch(side) {
    case "left":
      return padding + str;
      break;
    case "right":
    default:
      return str + padding;
      break;
  }
  
}


function updateList()
{
  var prefList = preferences.dueListPref.value.split(",");
  if (dueList) {
    delete dueList;
  }
  
  dueList = new Array();
  
  if (preferences.dueListPref.value.length <= 0) {
    return;
  }
  
  for (var i in prefList) {
    dueList[i] = new Object();
    dueList[i].prefLine = prefList[i];
    
    var lineItem = prefList[i].split('|');
    
    var dateParts = escapeItem(lineItem[0]).match(/^(\d{4})(\d{2})(\d{2})$/);
    if (dateParts == null) {
      // badly formed date - skip it
      continue;
    }
    
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    dueList[i].dueDate = new Date(dateParts[1], dateParts[2] - 1, dateParts[3]);
    dueList[i].dueTime = dueList[i].dueDate.getTime();
    dueList[i].warnTime = dueList[i].dueTime - lineItem[1] * 216000000;
    dueList[i].warnDays = lineItem[1];
    
    if (nowTime > dueList[i].dueTime) {
      dueList[i].state = 'overdue';
    } else if (nowTime > dueList[i].warnTime) {
      dueList[i].state = 'soon';
    } else {
      dueList[i].state = 'normal';
    }
    
    dueList[i].text = lineItem[2];
    dueList[i].extra = lineItem[3];
    
    switch (preferences.dateDisplay.value) {
      case 'Month/Date':
        dueList[i].dateString = (dueList[i].dueDate.getMonth() + 1).toString() + '/' + (dueList[i].dueDate.getDate()).toString();
        // dueList[i].longDateString =  dateString + '/' + (dueList[i].dueDate.getFullYear()).toString();
        break;
      case 'Date/Month':
        dueList[i].dateString = (dueList[i].dueDate.getDate()).toString() + '/' + (dueList[i].dueDate.getMonth() + 1).toString();
        // dueList[i].longDateString = (dueList[i].dueDate.getFullYear()).toString() + '/' + dateString;
        break;
    }
  }
  
  dueList.sort(function(a, b)
  {
    if (a.state == b.state) {
      return a.dueTime - b.dueTime;
    } else {
      switch(a.state) {
        case 'overdue': return -1; break;
        case 'soon': if (b.state == 'overdue') return 1; else return -1; break;
        case 'normal': default: return 1; break;
      }
    }
  });
  
  var newPrefList = new Array();
  for (var i in dueList) {
    newPrefList[i] = dueList[i].prefLine;
  }
  
  preferences.dueListPref.value = newPrefList.join(",")
}

function buildContextMenu(i)
{
  var items = new Array();
  items[0] = new MenuItem();
  items[0].title = "Add Item";
  items[0].onSelect = "editItem(-1)";
  if (i >= 0) {
    items[1] = new MenuItem();
    items[1].title = "Edit Item";
    items[1].onSelect = "editItem(" + i + ")";
    items[2] = new MenuItem();
    items[2].title = "Delete Item";
    items[2].onSelect = "deleteItem(" + i + ")";
  }
  
  main.contextMenuItems = items
}


function buildList()
{
  suppressUpdates();
  itemOffset = 0;

  if (backgroundImages) {
    for (var i in backgroundImages) {
      delete backgroundImages[i];
      delete dueListItemsShadows[i];
      delete dueListDatesShadows[i];
      delete dueListItems[i];
      delete dueListDates[i];
      delete reflectionImages[i];
      delete glowImages[i];
    }
  }
  
  updateList();
  
  if ( dueList.length == 0 ) {
    main.height = itemHeight + decorationsHeight;
    emptyBackground.opacity = preferences.bgOpacity.value;
    emptyText.opacity = 255;
    emptyTextShadow.opacity = 255;
    emptyReflection.opacity = 255;
    resumeUpdates();
  } else {
    emptyBackground.opacity = 0;
    emptyText.opacity = 0;
    emptyTextShadow.opacity = 0;
    emptyReflection.opacity = 0;
    main.height = (itemHeight * dueList.length) + decorationsHeight;
    
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
    
    for (var i in dueList) {
    
      backgroundImages[i] = new Image();
      backgroundImages[i].src = "Resources/GrayBackground.png";
      backgroundImages[i].vOffset = (itemHeight * i) + itemVOffset;
      backgroundImages[i].hOffset = itemHOffset;
      backgroundImages[i].opacity = preferences.bgOpacity.value;
      backgroundImages[i].onContextMenu = "buildContextMenu(" + i + ")";
      backgroundImages[i].tooltip = escapeItem(dueList[i].text, "decode") + "\n" + escapeItem(dueList[i].extra, "decode") + "\nDue " + dueList[i].dueDate.toLocaleDateString() + "\n(Warning " + dueList[i].warnDays + ((dueList[i].warnDays == 1)?" day":" days") + " in advance)";
      
      dueListItemsShadows[i] = new Text();
      dueListDatesShadows[i] = new Text();
      dueListItems[i] = new Text();
      dueListDates[i] = new Text();


      dueListItemsShadows[i].data = dueListItems[i].data = escapeItem(dueList[i].text, "decode");
      dueListItemsShadows[i].hOffset = itemHOffset + textHOffset + 1;
      dueListItemsShadows[i].vOffset = (itemHeight * i) + itemVOffset + textVOffset + 1;
      dueListItems[i].hOffset = itemHOffset + textHOffset;
      dueListItems[i].vOffset = (itemHeight * i) + itemVOffset + textVOffset;
      dueListItemsShadows[i].width = dueListItems[i].width = 180;
      dueListItemsShadows[i].truncation = dueListItems[i].truncation = "end";
      dueListItemsShadows[i].color = "#000000";
      dueListItems[i].color = "#FFFFFF";
      
      dueListDatesShadows[i].data = dueListDates[i].data = dueList[i].dateString;
      dueListDatesShadows[i].hOffset = main.width - itemHOffset - dateHOffset + 1;
      dueListDatesShadows[i].vOffset = (itemHeight * i) + itemVOffset + dateVOffset + 1;
      dueListDatesShadows[i].alignment = dueListDates[i].alignment = 'right';
      dueListDates[i].hOffset = main.width - itemHOffset - dateHOffset;
      dueListDates[i].vOffset = (itemHeight * i) + itemVOffset + dateVOffset;
      dueListDatesShadows[i].width = -1;
      dueListDatesShadows[i].color = "#000000";
      dueListDates[i].color = "#FFFFFF";
      
      
      switch (dueList[i].state) {
        case 'overdue':
          dueListItemsShadows[i].font = dueListDatesShadows[i].font = dueListItems[i].font = dueListDates[i].font = preferences.userOverdueFont.value;
          dueListItemsShadows[i].size = dueListDatesShadows[i].size = dueListItems[i].size = dueListDates[i].size = preferences.userOverdueSize.value;
          backgroundImages[i].colorize = preferences.overdueColor.value;
          if (preferences.overdueDecoration.value == 'Glow') {
            glowImages[i] = new Image();
            glowImages[i].src = "Resources/YellowGlow.png";
            glowImages[i].vOffset = itemHeight * i;
            glowImages[i].hOffset = 0;
          }
          break;
        case 'soon':
          dueListItemsShadows[i].font = dueListDatesShadows[i].font = dueListItems[i].font = dueListDates[i].font = preferences.userSoonFont.value;
          dueListItemsShadows[i].size = dueListDatesShadows[i].size = dueListItems[i].size = dueListDates[i].size = preferences.userSoonSize.value;
          backgroundImages[i].colorize = preferences.soonColor.value;
          if (preferences.soonDecoration.value == 'Glow') {
            glowImages[i] = new Image();
            glowImages[i].src = "Resources/YellowGlow.png";
            glowImages[i].vOffset = itemHeight * i;
            glowImages[i].hOffset = 0;
          }
          break;
        case 'normal':
          dueListItemsShadows[i].font = dueListDatesShadows[i].font = dueListItems[i].font = dueListDates[i].font = preferences.userNormalFont.value;
          dueListItemsShadows[i].size = dueListDatesShadows[i].size = dueListItems[i].size = dueListDates[i].size = preferences.userNormalSize.value;
          backgroundImages[i].colorize = preferences.normalColor.value;
          if (preferences.normalDecoration.value == 'Glow') {
            glowImages[i] = new Image();
            glowImages[i].src = "Resources/YellowGlow.png";
            glowImages[i].vOffset = itemHeight * i;
            glowImages[i].hOffset = 0;
          }
          break;
      }
      
      reflectionImages[i] = new Image();
      reflectionImages[i].src = "Resources/ClearReflection.png";
      reflectionImages[i].vOffset = (itemHeight * i) + itemVOffset;
      reflectionImages[i].hOffset = itemHOffset;
      reflectionImages[i].opacity = 255;
    }
    resumeUpdates();
  }
}

function escapeItem(theString, whichOne)
{
  if ( whichOne == "decode" )
  {
    theString = theString.replace(/%%1/g, "|")
    theString = theString.replace(/%%2/g, ",")
  }
  else
  {
    theString = theString.replace(/\|/g, "%%1")
    theString = theString.replace(/\,/g, "%%2")
  }
  return theString;
}

EditForm.prototype = Array.prototype;

function EditForm()
{
  var arr = new Array();
  
  var d = new Date();
  var thisYear = d.getFullYear();
  
  arr[0] = new FormField();
  arr[0].name = "text";
  arr[0].type = "text";
  arr[0].title = "Item:";
  arr[0].defaultValue = "Name of Item";

  arr[1] = new FormField();
  arr[1].name = "dueyear";
  arr[1].title = "Due Year:";
  arr[1].type = "popup";
  arr[1].option = new Array();
  for (var i = 0; i < 3; i++) {
    arr[1].option[i] = (thisYear + i).toString();
  }
  arr[1].defaultValue = thisYear.toString();
  
  arr[2] = new FormField();
  arr[2].name = "month";
  arr[2].title = "Month:";
  arr[2].type = "popup";
  arr[2].option = new Array();
  for (var i = 1; i <= 12; i++) {
    arr[2].option[i - 1] = i.toString();
  }
  arr[2].defaultValue = (d.getMonth() + 1).toString();
  
  arr[3] = new FormField();
  arr[3].name = "date";
  arr[3].title = "Date:";
  arr[3].type = "popup";
  arr[3].option = new Array();
  for (var i = 1; i <= 31; i++) {
    arr[3].option[i - 1] = i.toString();
  }
  arr[3].defaultValue = (d.getDate()).toString();
  
  arr[4] = new FormField();
  arr[4].name = "warn";
  arr[4].title = "Warn Days:";
  arr[4].type = "text";
  arr[4].defaultValue = "1";
  
  arr[5] = new FormField();
  arr[5].name = "extra";
  arr[5].title = "Extra:";
  arr[5].type = "text";
  arr[5].defaultValue = "Extra Information";
  
  arr[5].description = "Name your item, specify a due date, set the number of days you want to be warned about the item, and enter any extra information into the \"Extra\" field.";
  
  return arr;
  
}

function editItem(i)
{
  var formResults;
  var dueListPrefArray;
  if (preferences.dueListPref.value.length > 0) {
    dueListPrefArray = preferences.dueListPref.value.split(',');
  } else {
    dueListPrefArray = new Array();
  }
  
  if (i < 0) {
    formResults = form(EditForm(), 'New Due Item', 'Add');
  } else {
    var tForm = EditForm();
    var tArr = dueListPrefArray[i].split('|');
    tForm[1].defaultValue = tArr[0].substring(0, 4);
    tForm[2].defaultValue = parseInt(tArr[0].substring(4, 6), 10).toString();
    tForm[3].defaultValue = parseInt(tArr[0].substring(6, 8), 10).toString();
    tForm[4].defaultValue = tArr[1];
    tForm[0].defaultValue = escapeItem(tArr[2], "decode");
    tForm[5].defaultValue = escapeItem(tArr[3], "decode");
    
    formResults = form(tForm, 'Edit Due Item', 'Modify');
  }
  
  if (formResults == null)
  {
    return;
  }
  
  
  if (i < 0) {
    i = dueListPrefArray.length;
  }
  
  var tArr = new Array();
  
  tArr[0] = formResults[1] + pad(formResults[2], 2, "0", "left") + pad(formResults[3], 2, "0", "left");
  tArr[1] = parseInt(formResults[4], 10).toString();
  if (isNaN(parseInt(tArr[1], 10))) {
    tArr[1] = '0';
  }
  tArr[2] = escapeItem(formResults[0], "encode");
  tArr[3] = escapeItem(formResults[5], "encode");
  
  dueListPrefArray[i] = tArr.join('|');
  
  if (dueListPrefArray.length > 1) {
    preferences.dueListPref.value = dueListPrefArray.join(',');
  } else {
    preferences.dueListPref.value = dueListPrefArray[i];
  }
  
  updateList();
  savePreferences();
  buildList();
  
}


function deleteItem(i)
{
  var confirm = alert("Really delete the item \"" + dueListItems[i].data + "\"?", "Delete", "Cancel");
  if (confirm == 0) {
    return;
  }
  var dueListPrefArray = preferences.dueListPref.value.split(',');
  if (dueListPrefArray.length == 1) {
    preferences.dueListPref.value = "";
  } else {
    dueListPrefArray.splice(i, 1);
    preferences.dueListPref.value = dueListPrefArray.join(',');
  }
  
  updateList();
  savePreferences();
  buildList();
}



buildList();

main.visible = true;
// windowMovement();
windowActive = 0;
