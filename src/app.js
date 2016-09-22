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
