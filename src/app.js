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
var log = [];
var car = [];
for(var i=0; i < 3; i++) {
  log.push(new Log({
    x: 470,
    y: 100 + 200*i
  }));
  log.push(new Log2({
    x: 550,
    y: 0 + 150*i
  }));
  log.push(new Log({
    x: 630,
    y: 100 + 200*i
  }));
}
for(var i=0; i < 2; i++) {
  car.push(new Car({
    x: 80,
    y: 100 + 300*i
  }));
  car.push(new Car({
    x: 160,
    y: 50 + 350*i
  }));
  car.push(new Car({
    x: 240,
    y: 150 + 350*i
  }));
  car.push(new Car({
    x: 320,
    y: 200 + 300*i
  }));
}
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
  checkForCollision();
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
}

function checkForCollision() {
  var collides;
  if(player.x > 70 && player.x < 400) { //in street
    car.forEach(function(entry) {
      
    });
  }
  if(collides) {
    player.x = 0;
    player.y = 240;
  }
}
