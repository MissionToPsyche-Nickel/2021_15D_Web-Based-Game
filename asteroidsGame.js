//TODO: Add Welcome/Instructions screen (should help with loading assets)
//TODO: Embed Timer in Canvas
//Set the canvas background to be the Space_Background photo


console.log("Starting...."); //sanity check console log

//GLOBAL VARIABLES:
var asteroids = []; //2D Array of integers (representing asteroids) where "1" is a Valid_Asteroid (Gray) and "-1" is an Error_Asteroid (Red)
var score = 0; //current score
var lives = 3; //remaining lives
var currentPosition = 1; //the robot's current position, 0 is left col, 1 is middle col, 2 is right col
var correctAnswerPos = -1;
var correctAnswerStr = ""
var timeElapsed = 0;
var timerID = -1;
var questionMode = false;
var mySound;
var answered = false;
mySound = new sound("sound/Robot.m4a");

var questionsDict = generateQuestionDict();


//Starts the game
startGame();

//Create a Keyboard Listener to get user input
document.addEventListener("keydown", handleKeyPress);

//handleKeyPress determines what action to take based on user input
function handleKeyPress(event) {
  //If "Left Arrow" or "A" are pressed

  if(questionMode == false){
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
      mySound.play();
      calcJump(); //Calculate Game State after the robot's "jump"
      shiftAsteroidsDownAndGetNewRow(); //Shifts asteroids down and adds a new row
      if(questionMode == false){
        showGame(); //Displays new game state
      }
    }
  }
  else{
    event.preventDefault(); //Disable default keyboard behavior (scrolling)

    var optionSelected = -1;

    if(event.keyCode >=49 && event.keyCode <= 52){ //selected between 1 and 4
       optionSelected = event.keyCode - 48
       answered = true;
       if(optionSelected == correctAnswerPos){
        document.getElementById("questions").innerHTML = "CORRECT! No Lives Lost! Jump to continue!"
       }
       else{
        lives--;
        if(lives != 0){
          correctAnswerStr += "<br><br>Jump to continue!"
        }
        document.getElementById("questions").innerHTML = "INCORRECT! 1 Life Lost! <br> <br> The correct answer was:<br>" + correctAnswerStr
        checkForZeroLives();
       }
       
    }

    if (answered && (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87)) {
      questionMode = false;
      answered = false;
      console.log("RETURNING TO GAME!");
      document.getElementById("questions").innerHTML = "";
      document.getElementById("spaceCanvas").style.background = "url('images/Space_Background.png')";
      showGame(); //Displays new game state
    }
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
    console.log("UNSAFE ASTEROID JUMP!");
    prompt_question();
  }
  checkForZeroLives();
}

function checkForZeroLives(){
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
  document.getElementById("questions").innerHTML = "";
  document.getElementById("spaceCanvas").style.background =
  "url('images/Space_Background.png')";
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

function prompt_question(){
  //clear the canvas of any drawings from a previous game
  var canvas = document.getElementById("spaceCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas = document.getElementById("robotCanvas");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("spaceCanvas").style.background =
  "url('images/askQuestion.gif')";
  document.getElementById("questions").innerHTML = getQuestionString();
  questionMode = true;
}

function getQuestionString(){
  questionIndex = Math.floor(Math.random() * Math.floor(3));
  return shuffleQuestionAnswers(questionsDict[questionIndex])
}

function shuffleQuestionAnswers(questionObj){
  questionString = questionObj.question + "<br>";
  randomIndex = Math.floor(Math.random() * Math.floor(10));

  for(var i = 1; i <= 4; i++){
    console.log(randomIndex + i)
     if((randomIndex + i) % 4 == 0){
      correctAnswerPos = i;
      correctAnswerStr = questionObj.correctAnswer
      questionString += i + ") " + questionObj.correctAnswer + "<br><br>" 
     }
     if((randomIndex + i) % 4 == 1){
      questionString += i + ") " + questionObj.incorrectAnswer1 + "<br><br>" 
     }
     if((randomIndex + i) % 4 == 2){
      questionString += i + ") " + questionObj.incorrectAnswer2 + "<br><br>" 
     }
     if((randomIndex + i) % 4 == 3){
      questionString += i + ") " + questionObj.incorrectAnswer3 + "<br><br>" 
     }
  }
  return questionString;
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


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}


function generateQuestionDict(){
  questionsDict = {};
  questionsDict[0] = new Object();
  questionsDict[0].question = "WHEN WAS THE PSYCHE ASTEROID DISCOVERED?";
  questionsDict[0].correctAnswer = "1852";
  questionsDict[0].incorrectAnswer1 = "1801";
  questionsDict[0].incorrectAnswer2 = "1953";
  questionsDict[0].incorrectAnswer3 = "1733";
  
  questionsDict[1] = new Object();
  questionsDict[1].question = "WHO DISCOVERED THE PSYCHE ASTEROID?"
  questionsDict[1].correctAnswer = "ANNIBALE DE GASPARIS"
  questionsDict[1].incorrectAnswer1 = "NEIL ARMSTRONG"
  questionsDict[1].incorrectAnswer2 = "GALILEO GALILEI"
  questionsDict[1].incorrectAnswer3 = "MICHAEL COLLINS"
  
  questionsDict[2] = new Object();
  questionsDict[2].question = "WHERE IS THE PSYCHE ASTEROID?"
  questionsDict[2].correctAnswer = "BETWEEN MARS AND JUPITER"
  questionsDict[2].incorrectAnswer1 = "BETWEEN SATURN AND URANUS"
  questionsDict[2].incorrectAnswer2 = "OUTSIDE THE MILKY WAY"
  questionsDict[2].incorrectAnswer3 = "BETWEEN URANUS AND NEPTUNE"
  
  return questionsDict;
}