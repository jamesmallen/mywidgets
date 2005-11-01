/**
 * Resizer.js
 *
 * A window resizer
 */


function Resizer()
{
  this.id = Resizer.ids.length;
  Resizer.ids.push(this);
  
  this.img = new Image();
  this.img.src = "Resources/Resizer.png";
  this.img.hAlign = "right";
  this.img.vAlign = "bottom";
  this.img.opacity = 0;
  this.img.tracking = "rectangle";
  this.img.onMouseDown = "Resizer.ids[" + this.id + "].img_onMouseDown()";
  this.img.onMouseUp = "Resizer.ids[" + this.id + "].img_onMouseUp()";
  this.img.onMouseMove = "Resizer.ids[" + this.id + "].img_onMouseMove()";
  
  this.onResize = null;
  this.dragStart = null;
  this.saveWidth = null;
  this.saveHeight = null;
}

Resizer.ids = new Array();

Resizer.prototype.img_onMouseDown = function()
{
  this.dragStart = new Object();
  this.dragStart.x = this.img.hOffset - system.event.hOffset;
  this.dragStart.y = this.img.vOffset - system.event.vOffset;
}

Resizer.prototype.img_onMouseUp = function()
{
  this.dragStart = null;
  
  if (this.saveWidth) {
    eval(this.saveWidth + " = " + this.img.hOffset);
  }
  
  if (this.saveHeight) {
    eval(this.saveHeight + " = " + this.img.vOffset);
  }
  
  if (this.onResize) {
    this.onResize();
  }
  
  Word.fitOnPage();
}

Resizer.prototype.img_onMouseMove = function()
{
  if (!this.dragStart) {
    this.img_onMouseDown();
  }
  
  var intNewWidth = this.dragStart.x + system.event.hOffset;
  var intNewHeight = this.dragStart.y + system.event.vOffset;
  
  if (this.onResize) {
    this.onResize(intNewWidth, intNewHeight, true);
  }
  
}


