/**
 * @module exports the Car class
 */
module.exports = exports = Car;

/**
 * @constructor Car
 * Creates a new car object
 * @param {Postition} position object specifying an x and y
 */
function Car(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 75;
  this.height = 100;
  this.spritesheet  = new Image();
  this.spritesheet.src ='assets/cars_racer.svg';
}

/**
 * @function updates the car object
 */
Car.prototype.update = function() {
  if(this.y < 0) {
    this.y = 500;
  } else {
    this.y -= 1;
  }
}

/**
 * @function renders the car into the provided context
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Car.prototype.render = function(ctx) {
  ctx.drawImage(
    //image
    this.spritesheet,
    //source rectangle
    0, 0, 350, 220,
    //destination rectangle
    this.x, this.y, this.width, this.height
  );
}
