const stateCompact    = 0;
const stateExpanded   = 1;
const animDuration    = 300;

var multiplier = 1.0;

function resize()
{
  switch (preferences.size.value) {
    case "Small":
      multiplier = 0.5;
      break;
    case "Medium":
      multiplier = 0.75;
      break;
    case "Large":
    default:
      multiplier = 1.0;
      break;
  }
  
  bed.hOffset = multiplier * 15;
  bed.vOffset = multiplier * 14;

  timeDisplay.hOffset = multiplier * 118; // (main.width - 18)
  timeDisplay.vOffset = multiplier * 32;
  //timeDisplay.size = multiplier * 18;
  timeLeft();
  
  Zs[0].size = multiplier * 19;
  Zs[0].hOffset = multiplier * 17;
  Zs[0].vOffset = multiplier * 59;
  
  Zs[1].size = multiplier * 13;
  Zs[1].hOffset = multiplier * 32;
  Zs[1].vOffset = multiplier * 60;
  
  Zs[2].size = multiplier * 8;
  Zs[2].hOffset = multiplier * 43;
  Zs[2].vOffset = multiplier * 59;
  
  cancel.size = multiplier * 12;
  cancel.hOffset = multiplier * 77;
  cancel.vOffset = multiplier * 60;
  
  reflection.hOffset = 0;
  reflection.vOffset = 0;
  
  bed.width = multiplier * bed.srcWidth;
  bed.height = multiplier * bed.srcHeight;
  
  reflection.width = multiplier * reflection.srcWidth;
  reflection.height = multiplier * reflection.srcHeight;
  bgTopShine.width = bgTop.width = multiplier * bgTop.srcWidth;
  bgTopShine.height = bgTop.height = multiplier * bgTop.srcHeight;
  bgMiddleShine.width = bgMiddle.width = multiplier * bgMiddle.srcWidth;
  bgBottomShine.width = bgBottom.width = multiplier * bgBottom.srcWidth;
  bgBottomShine.height = bgBottom.height = multiplier * bgBottom.srcHeight;
  
  bgTopShine.hOffset = bgTop.hOffset = 0;
  bgTopShine.vOffset = bgTop.vOffset = 0;
  
  bgMiddleShine.hOffset = bgMiddle.hOffset = bgTop.hOffset;
  bgMiddleShine.vOffset = bgMiddle.vOffset = bgTop.vOffset + bgTop.height;
  
  bgBottomShine.hOffset = bgBottom.hOffset = bgMiddle.hOffset;
  bgBottomShine.vOffset = bgBottom.vOffset = bgMiddle.vOffset + bgMiddle.height;
  
  compactHeight = multiplier * 57;
  expandedHeight = multiplier * (bgTop.srcHeight + bgMiddle.srcHeight + bgBottom.srcHeight);
  
  setHeight(compactHeight);
  
}

function Initialize()
{
  switch (system.platform) {
    case "macintosh":
      myFont = "Monaco Bold";
      break;
    case "windows":
    default:
      myFont = "Lucida Sans Unicode Bold";
      break;
  }
  
  alarmTime = null;
  
  expanded = false;
  numZs = 0;
  
  
  bgTop = new Image();
  bgTop.name = "bgTop";
  bgTop.src = "Resources/top.png";
  
  bgMiddle = new Image();
  bgMiddle.name = "bgMiddle";
  bgMiddle.src = "Resources/middle.png";
  
  bgBottom = new Image();
  bgBottom.name = "bgBottom";
  bgBottom.src = "Resources/bottom.png";
  
  bed = new Image();
  bed.name = "bed";
  bed.src = "Resources/bed.png";
  bed.tracking = "rectangle";
  bed.onMouseUp = "bed_onMouseUp()";
  
  timeDisplay = new Text();
  timeDisplay.font = myFont;
  timeDisplay.opacity = 209;
  timeDisplay.color = "#000000";
  timeDisplay.alignment = "right";
  timeDisplay.onMouseUp = "timeDisplay_onMouseUp()";
  
  Zs = new Array();
  Zs[0] = new Text();
  Zs[0].data = "Z";
  Zs[0].font = myFont;
  Zs[0].opacity = 0;
  
  Zs[1] = new Text();
  Zs[1].data = "Z";
  Zs[1].font = myFont;
  Zs[1].opacity = 0;
  
  Zs[2] = new Text();
  Zs[2].data = "Z";
  Zs[2].font = myFont;
  Zs[2].opacity = 0;
  
  cancel = new Text();
  cancel.data = "Cancel";
  cancel.font = myFont;
  cancel.opacity = 0;
  cancel.onMouseUp = "cancel_onMouseUp()";
  
  
  bgTopShine = new Image();
  bgTopShine.name = "bgTopShine";
  bgTopShine.src = "Resources/top_shine.png";
  
  bgMiddleShine = new Image();
  bgMiddleShine.name = "bgMiddleShine";
  bgMiddleShine.src = "Resources/middle_shine.png";
  
  bgBottomShine = new Image();
  bgBottomShine.name = "bgBottomShine";
  bgBottomShine.src = "Resources/bottom_shine.png";
  
  
  reflection = new Image();
  reflection.name = "reflection";
  reflection.src = "Resources/reflection.png";
  
  flashTimer = new Timer();
  flashTimer.ticking = false;
  flashTimer.interval = .5;
  flashTimer.onTimerFired = "flashTimer_onTimerFired()";
  
  resize();
  
  // main.width = bgTop.srcWidth;
  // main.height = expandedHeight;
  
  contextMenuItems = new Array();
  contextMenuItems[0] = new MenuItem();
  contextMenuItems[0].title = "Start";
  contextMenuItems[0].onSelect = "bed_onMouseUp()";
  
  contextMenuItems[1] = new MenuItem();
  contextMenuItems[1].title = "Stop";
  contextMenuItems[1].onSelect = "cancel_onMouseUp()";
  contextMenuItems[1].enabled = false;
  
  contextMenuItems[2] = new MenuItem();
  contextMenuItems[2].title = "-";
  
  contextMenuItems[3] = new MenuItem();
  contextMenuItems[3].title = "Make a Donation";
  contextMenuItems[3].onSelect = "donate();";
  
  main.contextMenuItems = contextMenuItems;
}

function startTimer()
{
  alarmTime = new Date().getTime() + (preferences.sleepTime.value * 60000);
  flashTimer.ticking = true;
  
}

function stopTimer()
{
  flashTimer.ticking = false;
  alarmTime = null;
}

function timeDisplay_onMouseUp()
{
  if (!(flashTimer.ticking)) {
    var minutesCycle = new Array(5, 10, 15, 30, 45, 60, 90, 120);
    var foundInCycle = false;
    for (var i in minutesCycle) {
      if (parseFloat(preferences.sleepTime.value) < minutesCycle[i]) {
        preferences.sleepTime.value = minutesCycle[i];
        foundInCycle = true;
        break;
      }
    }
    if (!foundInCycle) {
      preferences.sleepTime.value = minutesCycle[0];
    }
    timeLeft(true);
  }
}

function bed_onMouseUp()
{
  if (!(flashTimer.ticking)) {
    startTimer();
    switchState(true);
  } else {
    switchState();
  }
  contextMenuItems[0].enabled = false;
  contextMenuItems[1].enabled = true;
  main.contextMenuItems = contextMenuItems;
}

function cancel_onMouseUp()
{
  if (flashTimer.ticking) {
    stopTimer();
  }
  switchState(false);
  timeLeft();
  contextMenuItems[0].enabled = true;
  contextMenuItems[1].enabled = false;
  main.contextMenuItems = contextMenuItems;
}

function switchState(open)
{
  if (typeof(open) == "undefined") {
    open = !expanded;
  }
  
  if (typeof(slideAnimation) != "undefined" && slideAnimation != null) {
    slideAnimation.kill();
    delete slideAnimation;
  }
  
  slideAnimation = new CustomAnimation(1, SlideUpdate, SlideDone);
  slideAnimation.duration = animDuration;
  slideAnimation.startHeight = curHeight;
  if (open) {
    slideAnimation.endHeight = expandedHeight;
  } else {
    expanded = false;
    for (var i in Zs) {
      Zs[i].opacity = 0;
    }
    cancel.opacity = 0;
    
    slideAnimation.endHeight = compactHeight;
  }
  animator.start(slideAnimation);
}


function SlideUpdate()
{
  var now = animator.milliseconds;
  var t = Math.max(now - this.startTime, 0);
  var percent = t / this.duration;
  var newHeight;
  var ret;
  
  if (percent >= 1.0) {
    newHeight = this.endHeight;
    ret = false;
  } else {
    newHeight = animator.ease(this.startHeight, this.endHeight, percent, animator.kEaseInOut);
    ret = true;
  }
  
  setHeight(newHeight);
  return ret;
}


function SlideDone()
{
  if (curHeight == expandedHeight) {
    expanded = true;
    cancel.opacity = 209;
  } else {
    expanded = false;
  }
}


function setHeight(y)
{
  suppressUpdates();
  
  curHeight = y;
  
  y -= (bgTop.height + bgBottom.height);
  if (y < 0) {
    y = 0;
  }
  
  bgMiddleShine.height = bgMiddle.height = y;
  bgBottomShine.vOffset = bgBottom.vOffset = bgMiddle.vOffset + bgMiddle.height;
  
  resumeUpdates();
}


function flashTimer_onTimerFired()
{
  numZs++;
  if (numZs > 7) {
    numZs = 0;
  }
  if (expanded) {
    var ZsToShow = Math.floor(numZs / 2);
    var i;
    for (i = 0; i < ZsToShow; i++) {
      Zs[i].opacity = 209;
    }
    for (; i < 3; i++) {
      Zs[i].opacity = 0;
    }
  }
  
  if (numZs % 2 == 1) {
    timeLeft(true);
  } else {
    timeLeft(false);
  }
  
  if (new Date().getTime() > alarmTime) {
    stopTimer();
    goToSleep();
  }
  
}


function goToSleep()
{
  var cmd;
  switch (system.platform) {
    case "macintosh":
      switch (preferences.sleepType.value) {
        case "Sleep":
          cmd = "osascript -e 'tell application \"System Events\" to sleep'";
          break;
        case "Shut Down":
          cmd = "osascript -e 'tell application \"System Events\" to shut down'";
          break;
        case "Restart":
          cmd = "osascript -e 'tell application \"System Events\" to restart'";
          break;
        case "Log Off":
          cmd = "osascript -e 'tell application\"System Events\" to log out'";
      }
      break;
    case "windows":
      switch (preferences.sleepType.value) {
        case "Sleep":
          cmd = "rundll32.exe PowrProf.dll,SetSuspendState";
          break;
        case "Shut Down":
          runCommandInBg("cscript.exe Shutdown.vbs", "shutdownData");
          cmd = "shutdown.exe -s -t 0 -c \"Shutdown forced by SleepTimer\"";
          break;
        case "Restart":
          runComandInBg("cscript.exe Restart.vbs", "restartData");
          cmd = "shutdown.exe -r -t 0 -c \"Restart forced by SleepTimer\"";
          break;
        case "Log Off":
          cmd = "shutdown.exe -l -t 0 -c \"Log Off forced by SleepTimer\"";
      }
      break;
  }
  
  runCommand(cmd);
  cancel_onMouseUp();
}


function onWillChangePreferences()
{
  cancel_onMouseUp();
}

function onPreferencesChanged()
{
  resize();
  if (isNaN(parseFloat(preferences.sleepTime.value))) {
    preferences.sleepTime.value = "5";
  }
  timeLeft();
}

function onWakeFromSleep()
{
  cancel_onMouseUp();
}


function timeLeft(showColon)
{
  var timeStr = "";
  if (typeof(showColon) == "undefined") {
    showColon = true;
  }
  if (alarmTime == null || !(flashTimer.ticking)) {
    var minutesLeft = (Math.floor(parseFloat(preferences.sleepTime.value))).toString()
    var secondsLeft = (Math.floor(parseFloat(preferences.sleepTime.value) * 60) % 60).toString();
    if (secondsLeft.length == 1) {
      secondsLeft = "0" + secondsLeft;
    }
    timeStr += minutesLeft;
    timeStr += secondsLeft;
  } else {
    var timeLeft = alarmTime - new Date().getTime();
    if (timeLeft < 0) {
      timeStr += "000";
    } else {
      var minutesLeft = (Math.floor(timeLeft / 60000)).toString();
      var secondsLeft = (Math.floor(timeLeft / 1000) % 60).toString();
      if (secondsLeft.length == 1) {
        secondsLeft = "0" + secondsLeft;
      }
      timeStr += minutesLeft;
      timeStr += secondsLeft;
    }
  }
  
  if (showColon) {
    timeStr = timeStr.substring(0, timeStr.length - 2) + ":" + timeStr.substring(timeStr.length - 2, timeStr.length);
  } else {
    timeStr = timeStr.substring(0, timeStr.length - 2) + " " + timeStr.substring(timeStr.length - 2, timeStr.length);
  }
  
  timeDisplay.size = multiplier * 18;
  timeDisplay.data = timeStr;
  timeDisplay.width = -1;
  if (timeDisplay.width > multiplier * 65) {
    timeDisplay.size = Math.floor(multiplier * 100 / timeStr.length);
  }
  
}


function donate()
{
  var myWidgetName = system.widgetDataFolder.substring(system.widgetDataFolder.lastIndexOf("/") + 1);
  openURL('https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=james%2em%2eallen%40gmail%2ecom&item_name=' + escape(myWidgetName) + '%20Widget%20Donation&no_shipping=1&cn=Comments%3a&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
}



Initialize();







