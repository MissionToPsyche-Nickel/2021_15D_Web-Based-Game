//TODO: Add Welcome/Instructions screen (should help with loading assets)
//TODO: Embed Timer in Canvas
//Set the canvas background to be the Space_Background photo
document.getElementById("spaceCanvas").style.background =
  "url('images/Space_Background_V3.png ')";

console.log("Starting...."); //sanity check console log

//GLOBAL VARIABLES:
var asteroids = []; //2D Array of integers (representing asteroids) where "1" is a Valid_Asteroid (Gray) and "-1" is an Error_Asteroid (Red)
var score = 0; //current score
var lives = 3; //remaining lives
var currentPosition = 1; //the robot's current position, 0 is left col, 1 is middle col, 2 is right col
var timeElapsed = 0;
var timerID = -1;

//Starts the game
startGame();

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
    shiftAsteroidsDownAndGetNewRow(); //Shifts asteroids down and adds a new row
    showGame(); //Displays new game state
  }
}

function calcJump() {
  if (asteroids[2][currentPosition] === 1) {
    //check if the asteroid about to be "jumped" to is a valid asteroid
    score++;
    document.getElementById("score").innerHTML = "SCORE: " + score; //refresh the score in the HTML
    console.log("GOOD JUMP!");
  } else {
    //asteroid jumped to an Error Asteroid (NOTE: if adding asteroids of alternate point value, this will need to be reworked)
    lives--;
    console.log("UNSAFE ASTEROID JUMP!");
  }

  //No lives remaining
  if (lives == 0) {
    stop(); //stop the timer
    showHearts(); //refresh hearts
    setTimeout(function () {
      if (confirm("GAME OVER! Play Again?")) {
        //user chose to Play Again
        startGame(); //restart the game
        document.getElementById("score").innerHTML = "SCORE: " + score; //refresh the score in the HTML
      } else {
        //if the user chose not to Play Again, disable robot movement
        document.removeEventListener("keydown", handleKeyPress);
      }
    }, 30); //30ms wait to update hearts on canvas before displaying alert
  }
}

function startGame() {
  score = 0;
  lives = 3;
  currentPosition = 1;
  asteroids = [];
  reset();
  start();
  //Populates the asteroids 2D array with 3 rows of data
  for (var i = 0; i < 3; i++) {
    asteroids.push(getAsteroidRow());
  }

  //start the robot on a row of gray asteroids
  asteroids.push([1, 1, 1]);

  //clear the canvas of any drawings from a previous game
  const canvas = document.getElementById("spaceCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setTimeout(function () {
    showGame();
  }, 30); //30ms timeout to make sure images are loaded
}

//returns a randomly generated integer array of 3 elements, where 1 is a valid asteroid and -1 is an Error Asteroid
function getAsteroidRow() {
  var asteroidRow = [1, 1, 1]; //create a new row with 3 valid asteroids
  asteroidRow[getRandomBadAsteroidColumn()] = -1; //randomly change one column to be an Error Asteroid
  if (Math.random() > 0.5) asteroidRow[getRandomBadAsteroidColumn()] = -1; //50% of the time, attempt to change one column to be an Error Asteroid again
  return asteroidRow;
}

//returns a random number between 0,1,2. This corresponds to the index that will be set to an Error Asteroid
function getRandomBadAsteroidColumn() {
  return Math.floor(Math.random() * Math.floor(3));
}

function shiftAsteroidsDownAndGetNewRow() {
  //Shifts all asteroids down one row
  for (let i = 3; i > 0; i--) {
    asteroids[i] = asteroids[i - 1];
  }
  asteroids[0] = getAsteroidRow(); //sets the top row to a new asteroid row
}

function showHearts() {
  var redHeart = document.getElementById("Red Heart"); //red heart image variable
  var grayHeart = document.getElementById("Gray Heart"); //gray heart image variable
  const canvas = document.getElementById("spaceCanvas"); //canvas variable
  var ctx = canvas.getContext("2d"); //ctx is used to access the drawImage() functionality of the canvas

  //The drawImage() method works as following:
  //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)

  //Draw the three Gray Hearts
  ctx.drawImage(grayHeart, 20, 20, 50, 50);
  ctx.drawImage(grayHeart, 80, 20, 50, 50);
  ctx.drawImage(grayHeart, 140, 20, 50, 50);
  //if the robot still has "X" lives, overwrite the gray heart with a red heart
  if (lives >= 1) ctx.drawImage(redHeart, 20, 20, 50, 50);
  if (lives >= 2) ctx.drawImage(redHeart, 80, 20, 50, 50);
  if (lives >= 3) ctx.drawImage(redHeart, 140, 20, 50, 50);
}

function showGame() {
  showHearts(); //display hearts
  showRobot(); //display the robot
  const canvas = document.getElementById("spaceCanvas"); //canvas variable
  var ctx = canvas.getContext("2d"); //ctx is used to access the drawImage() functionality of the canvas

  //iterate through the 2D Array
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = 0; j < asteroids[i].length; j++) {
      let x = 300 + j * 200; //X Coordinate to draw the asteroid, Start 300 to the right, and each column is 200 to the right of the last
      let y = 20 + i * 160; //Y Coordinate to draw the asteroid, Start 20 below the top of the screen, and each row is 160 below the last

      //Drawing the incoming asteroids (rows 0, 1, and 2 )
      if (i != 3) {
        if (asteroids[i][j] === -1) {
          //-1 means Error Asteroid
          var asteroidToDraw = document.getElementById("Error Asteroid");
        } else {
          //Non -1 Value means Valid Asteroid
          var asteroidToDraw = document.getElementById("Valid Asteroid");
        }
        //The drawImage() method works as following:
        //Note that here, x and y change each iteration to display the 2D grid
        //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)
        ctx.drawImage(asteroidToDraw, x, y, 100, 100);
      }

      //Special Case: Drawing the outgoing asteroids using the Faded images
      else {
        if (asteroids[i][j] === -1) {
          //-1 means Error Asteroid
          var asteroidToDraw = document.getElementById("Faded Error Asteroid");
        } else {
          //Non -1 Value means Valid Asteroid
          var asteroidToDraw = document.getElementById("Faded Valid Asteroid");
        }
        //The drawImage() method works as following:
        //Note that here, x and y change each iteration to display the 2D grid
        //An additional 100 is added to y to shift the outgoing asteroids underneath the robot simualting the "jump"
        //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)
        ctx.drawImage(asteroidToDraw, x, y + 100, 100, 100);
      }
    }
  }
}

function showRobot(x, y) {
  const canvas = document.getElementById("robotCanvas"); //the robot lives on a separate canvas since it's position needs to be cleared
  var ctx = canvas.getContext("2d"); //ctx is used to access the drawImage() functionality of the canvas
  var robot = document.getElementById("Character"); //robot image variable
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the robot canvas
  if (currentPosition == 0) {
    //draw the robot in the left col
    //The drawImage() method works as following:
    //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)
    ctx.drawImage(robot, 300, 500, 100, 100);
  }
  if (currentPosition == 1) {
    //draw the robot in the middle col
    //The drawImage() method works as following:
    //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)
    ctx.drawImage(robot, 500, 500, 100, 100);
  }
  if (currentPosition == 2) {
    //draw the robot in the right col
    //The drawImage() method works as following:
    //ctx.drawImage(image to display, x axis positon, y axis position, image width, image height)
    ctx.drawImage(robot, 700, 500, 100, 100);
  }
}

function tick() {
  timeElapsed++;
  document.getElementById("time").innerHTML = "TIMER: " + timeElapsed;
}

function start() {
  if (timerID == -1) {
    timerID = setInterval(tick, 1000);
  }
}

function stop() {
  if (timerID != -1) {
    clearInterval(timerID);
    timerID = -1;
  }
}

function reset() {
  stop();
  timeElapsed = -1;
  tick();
}
