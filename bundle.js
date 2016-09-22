(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Log = require('./log.js');
const Log2 = require('./log2.js');
const Car = require('./car.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var background = new Image();
background.src = 'assets/background.png';
var lives = 3;
var log = [];
var car = [];
for(var i=0; i < 3; i++) {
  log.push(new Log({
    x: 460,
    y: 100 + 250*i
  }));
  log.push(new Log2({
    x: 540,
    y: 0 + 150*i
  }));
  log.push(new Log({
    x: 620,
    y: 100 + 200*i
  }));
}
for(var i=0; i < 2; i++) {
  car.push(new Car({
    x: 80,
    y: 0 + 320*i
  }));
  car.push(new Car({
    x: 240,
    y: 0 + 320*i
  }));
}

car.push(new Car({
  x: 160,
  y: 250
}));

car.push(new Car({
  x: 315,
  y: 300
}));

window.onkeydown = function(event) {
  event.preventDefault();
  console.log(event);
  switch(event.keyCode) {
    // RIGHT
    case 39:
    case 68:
      if(player.state == "idle") {
        player.state = "right";
        player.frame = -1;
      }
      break;
    // LEFT
    case 37:
    case 65:
      if(player.state == "idle") {
        player.state = "left";
        player.frame = -1;
      }
      break;
    // DOWN
    case 40:
    case 83:
      if(player.state == "idle") {
        player.state = "down";
        player.frame = -1;
      }
      break;
    // UP
    case 38:
    case 87:
      if(player.state == "idle") {
        player.state = "up";
        player.frame = -1;
      }
      break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  // TODO: Update the game objects
  log.forEach(function(log) { log.update();});
  car.forEach(function(car) { car.update();});
  for(var i = 0; i < car.length; i ++){
    car[i].speed = player.score/100;
  }
  for(var i = 0; i < log.length; i++){
    log[i].speed = player.score/100;
  }
  if(player.x > 70 && player.x < 375) {
    car.forEach(checkForCarCrash);
  } else if (player.x > 455 && player.x < 680) {
    var onLog = log.some(checkOnLog);
    if(!onLog) {
      player.x = 0;
      player.y = 240;
      player.frame = 0;
      player.state = "idle";
      player.position = 0;
      lives --;
      if(lives == 0) {
        game.gameOver = true;
      }
    }
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  log.forEach(function(log){log.render(ctx);});
  car.forEach(function(car){car.render(ctx);});
  player.render(elapsedTime, ctx);
  ctx.fillStyle = "yellow";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Score: " + player.score, 0, 15);
  ctx.fillStyle = "yellow";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Lives: " + lives, 1, 30);
  if(game.gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Game Over", 760/2 - 90, 480/2);
  }
}

function checkForCarCrash(car) {
  var collides = !(player.x + player.width < car.x ||
                  player.x > car.x + car.width ||
                  player.y + player.height < car.y ||
                  player.y > car.y + car.height);
  if(collides) {
    player.x = 0;
    player.y = 240;
    player.frame = 0;
    player.state = "idle";
    player.position = 0;
    lives --;
    if(lives == 0) {
      game.gameOver = true;
    }
  }
}

function checkOnLog(log) {
  var collides = !(player.x + player.width < log.x ||
                  player.x > log.x + log.width ||
                  player.y + player.height < log.y ||
                  player.y > log.y + log.height);
  return collides;
}

},{"./car.js":2,"./game.js":3,"./log.js":4,"./log2.js":5,"./player.js":6}],2:[function(require,module,exports){
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
  this.width  = 60;
  this.height = 80;
  this.spritesheet  = new Image();
  this.spritesheet.src ='assets/cars_racer.svg';
  this.speed = 0;
}

/**
 * @function updates the car object
 */
Car.prototype.update = function() {
  if(this.y < 0) {
    this.y = 500;
  } else {
    this.y -= (1 + this.speed);
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
    0, 0, 220, 450,
    //destination rectangle
    this.x, this.y, this.width, this.height
  );
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
  this.gameOver = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  if(this.gameOver == false) {
    var elapsedTime = newTime - this.oldTime;
    this.oldTime = newTime;

    if(!this.paused) this.update(elapsedTime);
    this.render(elapsedTime, this.frontCtx);

    // Flip the back buffer
    this.frontCtx.drawImage(this.backBuffer, 0, 0);
  }
}

},{}],4:[function(require,module,exports){
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
  if(this.y > 480) {
    this.y = -110;
  } else {
    this.y += (1 + this.speed);
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}]},{},[1]);
