"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite0.png');
  this.timer = 0;
  this.frame = 0;
  this.position = 0;
  this.score = 0;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    // TODO: Implement your player's update by state
    case "right":
      this.timer += time;
      var temp = this.x + 2.1;
      if(temp > 760) {
        this.x = 0;
        this.y = 240;
        this.position = 0;
        this.score += 100;
        this.frame = 0;
        this.state = "idle";
      } else {
        this.x += 2.1;
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3) {
            this.position++;
            this.x = 78 * this.position;
            this.frame = 0;
            this.state = "idle";
          }
        }
      }
      break;
    case "left":
      this.timer += time;
      var temp = this.x - 2.1;
      if(temp < 0) {
        this.x = 0;
        this.frame = 0;
        this.state = "idle";
        this.position = 0;
      } else {
        this.x -= 2.1;
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3) {
            this.position --;
            this.x = 78 * this.position;
            this.frame = 0;
            this.state = "idle";
          }
        }
      }
      break;
    case "down":
      this.timer += time;
      var temp = this.y + 2;
      if(temp < 480) {
        this.y += 2;
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3) {
            this.frame = 0;
            this.state = "idle";
          }
        }
      }
      break;
    case "up":
      this.timer += time;
      var temp = this.y - 2;
      if(temp > 0) {
        this.y -= 2;
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3) {
            this.frame = 0;
            this.state = "idle";
          }
        }
      }
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 70, 64, 64,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "right":
    case "left":
    case "down":
    case "up":
      ctx.drawImage(
        //image
        this.spritesheet,
        //source rectangle
        this.frame * 64, 0, 64, 64,
        //destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
  }
}
