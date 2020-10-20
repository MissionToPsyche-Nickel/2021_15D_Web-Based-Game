//TODO: Add Welcome/Instructions screen (should help with loading assets)

//Set the canvas background to be the Space_Background photo
document.getElementById("spaceCanvas").style.background =
  "url('images/Space_Background_V2.png ')";

console.log("Starting...."); //sanity check console log

//GLOBAL VARIABLES:
var asteroids = []; //2D Array of integers (representing asteroids) where "1" is a Valid_Asteroid (Gray) and "-1" is an Error_Asteroid (Red)
var score = 0; //current score
var lives = 3; //remaining lives
var currentPosition = 0; //the robot's current position, 0 is left col, 1 is middle col, 2 is right col

//Populates the asteroids 2D array with data
initializeAsteroids();

//Main Display Function
setTimeout(function() {
  showAsteroids();
  }, 50);

//Create a Keyboard Listener to get user input
document.addEventListener("keydown", handleKeyPress);

//handleKeyPress determines what action to take based on user input
function handleKeyPress(event) {
  //If "Left Arrow" or "A" are pressed
  if (event.keyCode == 37 || event.keyCode == 65) {
    event.preventDefault(); //Disable default keyboard behavior (scrolling)
    console.log("Left/A was pressed"); //Debugging Statement
    if (currentPosition >= 1) currentPosition = currentPosition - 1; //move the robot's current position one column to the left only if it is a valid move
    showRobot(); //updates robot's position
  }
  //If "Right Arrow" or "D" are pressed
  else if (event.keyCode == 39 || event.keyCode == 68) {
    event.preventDefault(); //Disable default keyboard behavior (scrolling)
    console.log("Right/D was pressed"); //Debugging Statement
    if (currentPosition <= 1) currentPosition = currentPosition + 1; //move the robot's current position one column to the right only if it is a valid move
    showRobot(); //updates robot's position
  }

  //If "Up Arrow" or "W" or "Spacebar" are pressed
  else if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87) {
    event.preventDefault(); //Disable default keyboard behavior (scrolling)
    console.log("Space/Up/W was pressed"); //Debugging Statement
    calcJump(); //Calculate Game State after the robot's "jump"
    shiftAsteroidsDown(); //Shifts asteroids down and adds a new row
    showAsteroids(); //Displays new game state
  }
}

function calcJump() {
  if (asteroids[2][currentPosition] == 1) {
    score++;
    document.getElementById("score").innerHTML = "SCORE: " + score;
    console.log("GOOD JUMP!");
  } else {
    lives--;
    console.log("UNSAFE ASTEROID JUMP!");
  }
  if (lives == 0) {
    showHearts();
    setTimeout(function () {
      if (confirm("GAME OVER! Play Again?")) {
        initializeAsteroids();
        document.getElementById("score").innerHTML = "SCORE: " + score;
      } else {
        document.removeEventListener("keydown", handleKeyPress);
      }
    }, 50); //waits 50ms to update heart drawing on canvas before displaying alert
  }
}

function initializeAsteroids() {
  score = 0;
  lives = 3;
  asteroids = [];
  for (var i = 0; i < 3; i++) {
    asteroids.push(getAsteroidRow());
  }
  asteroids.push([1, 1, 1]);
  const canvas = document.getElementById("spaceCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showHearts();
  showAsteroids();
}

function getAsteroidRow() {
  var asteroidRow = [1, 1, 1];
  asteroidRow[getRandomBadAsteroidColumn()] = -1;
  if (Math.random() > 0.5) asteroidRow[getRandomBadAsteroidColumn()] = -1;
  return asteroidRow;
}

function getRandomBadAsteroidColumn() {
  return Math.floor(Math.random() * Math.floor(3));
}

function shiftAsteroidsDown() {
  asteroids[3] = asteroids[2];
  for (let i = 2; i > 0; i--) {
    asteroids[i] = asteroids[i - 1];
  }
  asteroids[0] = getAsteroidRow();
}

function showHearts() {
  const canvas = document.getElementById("heartsCanvas");
  var ctx = canvas.getContext("2d");
  var redHeart = document.getElementById("Red Heart");
  var grayHeart = document.getElementById("Gray Heart");
  ctx.drawImage(grayHeart, 20, 20, 50, 50);
  ctx.drawImage(grayHeart, 80, 20, 50, 50);
  ctx.drawImage(grayHeart, 140, 20, 50, 50);
  if (lives >= 1) ctx.drawImage(redHeart, 20, 20, 50, 50);
  if (lives >= 2) ctx.drawImage(redHeart, 80, 20, 50, 50);
  if (lives >= 3) ctx.drawImage(redHeart, 140, 20, 50, 50);
}

function showAsteroids() {
  showHearts();
  const canvas = document.getElementById("spaceCanvas");
  var ctx = canvas.getContext("2d");

  for (let i = 0; i < asteroids.length; i++) {
    for (let j = 0; j < asteroids[i].length; j++) {
      let x = 300 + j * 200;
      let y = 20 + i * 160;
      cellColor = "#e74c3c";

      if (i == 3) {
        if (asteroids[i][j] === -1) {
          var img = document.getElementById("Faded Error Asteroid");
        } else {
          var img = document.getElementById("Faded Valid Asteroid");
        }
        ctx.drawImage(img, x, y + 100, 100, 100);
      } else {
        if (asteroids[i][j] === -1) {
          var img = document.getElementById("Error Asteroid");
        } else {
          var img = document.getElementById("Valid Asteroid");
        }
        ctx.drawImage(img, x, y, 100, 100);
      }

      if (i == asteroids.length - 1 && j == currentPosition) {
        showRobot(x, y);
      }
    }
  }
}

function showRobot(x, y) {
  const canvas = document.getElementById("robotCanvas");
  var ctx = canvas.getContext("2d");
  var robot = document.getElementById("Character");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentPosition == 0) {
    ctx.drawImage(robot, 300, 500, 100, 100);
  }
  if (currentPosition == 1) {
    ctx.drawImage(robot, 500, 500, 100, 100);
  }
  if (currentPosition == 2) {
    ctx.drawImage(robot, 700, 500, 100, 100);
  }
}
