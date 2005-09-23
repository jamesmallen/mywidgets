include("JamesMAllen.js");

function Initialize()
{
  var contextMenu = new Array();
  contextMenu[0] = new MenuItem();
  contextMenu[0].title = "About the Author";
  contextMenu[0].onSelect = "AboutTheAuthor();";
  contextMenu[1] = new MenuItem();
  contextMenu[1].title = "Make a Donation";
  contextMenu[1].onSelect = "Donate();";
  main.contextMenuItems = contextMenu;
  
  
  stones = new Array();
  stones[6] = new Image();
  stones[6].src = "Resources/Stone6.png";
  stones[5] = new Image();
  stones[5].src = "Resources/Stone5.png";
  stones[4] = new Image();
  stones[4].src = "Resources/Stone4.png";
  stones[3] = new Image();
  stones[3].src = "Resources/Stone3.png";
  stones[2] = new Image();
  stones[2].src = "Resources/Stone2.png";
  stones[1] = new Image();
  stones[1].src = "Resources/Stone1.png";
  stones[0] = new Image();
  stones[0].src = "Resources/Stone0.png";
  
  stoneHolder = new Image();
  stoneHolder.src = "Resources/StoneHolder.png";
  
  curMood = 3.0;
  
  moodDial = new SmoothDial();
  moodDial.forceValue(curMood);
  moodDial.accelBase = 0.005;
  moodDial.maxVelocity = 0.05;
  moodDial.closeEnough = 0.02;
  
  updateTimer = new Timer();
  updateTimer.interval = preferences.moodySensitivity.value;
  updateTimer.onTimerFired = "updateTimer_onTimerFired()";
  updateTimer.ticking = true;
  
  resize();
  
  refreshStones();
  
}

function refreshStones()
{
  if (curMood < 0) {
    curMood = 0;
  } else if (curMood > 5.99) {
    curMood = 5.99;
  }
  var i1 = Math.floor(curMood);
  var i2 = i1 + 1;
  
  var pct = curMood % 1;
  
  suppressUpdates();
  for (var i = 0; i < 7; i++) {
    stones[i].opacity = 0;
  }
  
  stones[i1].opacity = Math.cos(Math.PI / 2 * pct) * 255;
  stones[i2].opacity = Math.sin(Math.PI / 2 * pct) * 255;
  
  resumeUpdates();
  
}

function resize()
{
  suppressUpdates();
  // Off horizontally
  if (main.hOffset + parseInt(preferences.moodySize.value) > screen.availWidth) {
    main.hOffset = screen.availWidth - parseInt(preferences.moodySize.value);
  } else if (main.hOffset < screen.availLeft) {
    main.hOffset = screen.availLeft;
  }
  // Off vertically
  if (main.vOffset + parseInt(preferences.moodySize.value) > screen.availHeight) {
    main.vOffset = screen.availHeight - parseInt(preferences.moodySize.value);
  } else if (main.vOffset < screen.availTop) {
    main.vOffset = screen.availTop;
  }
  
  for (var i in stones) {
    stones[i].width = stones[i].height = parseInt(preferences.moodySize.value);
  }
  stoneHolder.width = stoneHolder.height = parseInt(preferences.moodySize.value);
  resumeUpdates();
}


function getNewMood()
{
  var cpuMood;
  var kernelMood;
  var memMood;
  var batteryMood;
  
  cpuMood = (system.cpu.activity) / 100 * 8;
  
  if (system.cpu.user > (2 * system.cpu.sys)) {
    kernelMood = 4 + Math.random() * 2;
  } else {
    kernelMood = null;
  }
  
  memMood = Math.sin(system.memory.load / 100 * Math.PI / 2) * 7;
  
  if (system.batteryCount > 0 && system.battery[0].isPresent && system.battery[0].currentCapacity < 50) {
    batteryMood = (100 - system.battery[0].currentCapacity) / 100 * 4 + 3;
  } else {
    batteryMood = null;
  }
  
  
  return average(cpuMood, cpuMood, kernelMood, memMood);
}


function average()
{
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    if (typeof(arguments[i]) == "number") {
      sum += arguments[i];
    }
  }
  return sum / arguments.length;
}

function onPreferencesChanged()
{
  resize();
  if (preferences.moodySensitivity.value <= 0.1) {
    preferences.moodySensitivity.value = 0.1;
  }
  updateTimer.interval = preferences.moodySensitivity.value;
  moodDial.accelBase = preferences.moodySensitivity.value / 200;
  moodDial.maxVelocity = preferences.moodySensitivity.value / 100;
  moodDial.closeEnough = preferences.moodySensitivity.value / 100;

}

function updateTimer_onTimerFired()
{
  moodDial.setValue(getNewMood());
  curMood = moodDial.update();
  refreshStones();
}


SmoothDial.prototype.forceValue = function(x)
{
  this.value = this.targetValue = x;
}

SmoothDial.prototype.setValue = function(x)
{
  this.targetValue = x;
}

SmoothDial.prototype.update = function(elTime)
{
  if (this.value == this.targetValue) {
    return this.value;
  }
  
  var direction;
  var accel;
  
  if (typeof(elTime) == "undefined") {
    elTime = 1;
  }
  
  if (this.value > this.targetValue) {
    direction = -1;
  } else {
    direction = 1;
  }
  
  if (this.relAccel) {
    accel = (Math.abs(this.targetValue - this.value)) / 255 * this.accelBase * direction;
  } else {
    accel = this.accelBase * direction;
  }
  
  this.velocity = this.velocity + accel;
  if (this.maxVelocity != 0) {
    if (this.velocity > this.maxVelocity) {
      this.velocity = this.maxVelocity;
    } else if (this.velocity < (0 - this.maxVelocity)) {
      this.velocity = (0 - this.maxVelocity);
    }
  }
  
  this.value += this.velocity;
  
  if ((this.value > this.targetValue && this.velocity > 0) ||
      (this.value < this.targetValue && this.velocity < 0)) {
    this.velocity = 0 - accel;
  }
  
  if (Math.abs(this.targetValue - this.value) < this.closeEnough) {
    this.velocity = 0;
    this.value = this.targetValue;
  }
  
  
  // print("value: " + this.value + "\ntargetValue: " + this.targetValue + "\nvelocity: " + this.velocity);
  
  return this.value;
}


function SmoothDial()
{
  this.value = 0;
  this.targetValue = 0;
  this.velocity = 0;
  this.maxVelocity = 25;
  this.friction = 0;
  this.closeEnough = 1;
  this.relAccel = false;
  this.accelBase = 0.5;
}



Initialize();



