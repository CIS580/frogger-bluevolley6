/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new log object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 115;
  this.spritesheet  = new Image();
  this.spritesheet.src ='assets/log.png';
  this.speed = 0;
}

/**
 * @function updates the log object
 */
Log.prototype.update = function() {
  if(this.y < 0) {
    this.y = 500;
  } else {
    this.y -= (1 + this.speed);
  }
}

/**
 * @function renders the log into the provided context
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function(ctx) {
  ctx.drawImage(
    //image
    this.spritesheet,
    //source rectangle
    0, 0, 40, 115,
    //destination rectangle
    this.x, this.y, this.width, this.height
  );
}
