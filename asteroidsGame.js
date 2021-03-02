//TODO: Make T/F Questions only present those two options, add T/F Attirbute probably


console.log("Starting...."); //sanity check console log

//GLOBAL VARIABLES:
var gameMode = -1;
var asteroids = []; //2D Array of integers (representing asteroids) where "1" is a Valid_Asteroid (Gray) and "-1" is an Error_Asteroid (Red)
var score = 0; //current score
var lives = 3; //remaining lives
var currentPosition = 1; //the robot's current position, 0 is left col, 1 is middle col, 2 is right col
var correctAnswerPos = -1; //since the correct answer is always shuffled, this stores the correct index for comparision
var correctAnswerStr = "" //stores the correct answer 
var timeElapsed = 60;
var timerID = -1;
var gameMode = 1 //1 = Jump to Psyche, 2 = Time Attack
var keyboardMode = 1; //1 = MainMenu; 2 = Normal Gameplay; 3 = Question Mode; 4 = Study Mode
var answered = false;
var isATrueFalseQuestion = false;
var studyModeIndex = 0;
var mySound;
var studyModeDefTitle = "<br><br>WELCOME TO STUDY MODE!<br> USE THE ARROW KEYS TO CYCLE BETWEEN TRIVIA!<br>PRESS Q/ESCAPE TO RETURN TO THE MAIN MENU!<br><br>";
var instructionsString = "*TODO:*<br><br> Use the arrow keys or WASD to move.<br><br>You can also press space to jump.<br><br> Q/Esc returns you to main menu";
mySound = new sound("sound/Robot.m4a");

var questionsDict = generateQuestionDict();


//Starts the game
mainMenu();

//Create a Keyboard Listener to get user input
document.addEventListener("keydown", handleKeyPress);

//handleKeyPress determines what action to take based on user input
function handleKeyPress(event) {
  
  if (event.keyCode == 81 || event.keyCode == 27) {//If Q or Escape are pressed
    document.getElementById("studymodeinstructions").innerHTML = "";
    document.getElementById("studymodequestions").innerHTML = "";
    document.getElementById("studymodeanswers").innerHTML = "";
    keyboardMode = 1;
    mainMenu();
  }

  if(keyboardMode == 1){
    event.preventDefault();
    if((event.keyCode >=49 && event.keyCode <= 52) 
    ||  event.keyCode >=97 && event.keyCode <= 100){ //selected between 1 and 4
       if(event.keyCode >= 49 && event.keyCode <= 52){ //number row
          gameModeSelected = event.keyCode - 48
       }
       else{
         gameModeSelected =  event.keyCode - 96
       }
    if (gameModeSelected == 1){
      keyboardMode = 2;
      gameMode = 1;
      timeElapsed = 0;
      startGame();
    }
    if (gameModeSelected == 2){
      keyboardMode == 4
      studyMode()
    }
    if(gameModeSelected == 3){
      keyboardMode = -1;
      instructions();
    }
    if(gameModeSelected == 4){
      timeElapsed = 60;
      keyboardMode = 2;
      gameMode = 2;
      startGame();
    }

  }
}

  else if(keyboardMode == 2){
    if (event.keyCode == 37 || event.keyCode == 65) {//If "Left Arrow" or "A" are pressed
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
      if(keyboardMode == 2){
        showGame(); //Displays new game state
      }
    }
  }
  
  else if(keyboardMode == 3){
    event.preventDefault(); //Disable default keyboard behavior (scrolling)

    var optionSelected = -1;

    if((isATrueFalseQuestion && ((event.keyCode >=49 && event.keyCode <= 50) ||  (event.keyCode >=97 && event.keyCode <= 98))) //selected between 1 and 2 for a T/F 
     ||(!isATrueFalseQuestion && ((event.keyCode >=49 && event.keyCode <= 52) ||  (event.keyCode >=97 && event.keyCode <= 100))) //selected between 1 and 4 for a normal question
     ){ 
 
       if(event.keyCode >= 49 && event.keyCode <= 52){ //number row
          optionSelected = event.keyCode - 48
       }
       else{ //keypad
        optionSelected = event.keyCode - 96
       }
       if(!answered){
       if(optionSelected == correctAnswerPos){
        document.getElementById("questions").innerHTML = "CORRECT! No Lives Lost! Jump to continue!"
       }
       else{
        lives--;
        if(lives != 0){
          correctAnswerStr += "<br><br>Jump to continue!"
        }
        document.getElementById("questions").innerHTML = "INCORRECT! 1 Life Lost! <br> <br> The correct answer was:<br>" + correctAnswerStr
      }
        answered = true;
        checkForZeroLives();
       }
       
    }

    if (answered && (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 87)) { //jump buttons
      keyboardMode = 2;
      answered = false;
      console.log("RETURNING TO GAME!");
      document.getElementById("questions").innerHTML = "";
      document.getElementById("spaceCanvas").style.background = "url('images/Space_Background.png')";
      showGame(); //Displays new game state
    }
  }

  else if(keyboardMode == 4){ //Study Mode!
    event.preventDefault(); //Disable default keyboard behavior (scrolling)
    if (event.keyCode == 37) {//If "Left Arrow" or "A" are pressed
     if(studyModeIndex == 0){
       studyModeIndex = questionsDict.length-1;
     }
     else{
       studyModeIndex--;
     }
    }
    else if (event.keyCode == 39){
      if(studyModeIndex == questionsDict.length-1){
        studyModeIndex = 0;
      }
      else{
        studyModeIndex++;
      }

    }
    document.getElementById("studymodequestions").innerHTML = questionsDict[studyModeIndex].question ;
    document.getElementById("studymodeanswers").innerHTML =  questionsDict[studyModeIndex].correctAnswer;
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


function mainMenu(){
  stop();
  reset();
  document.getElementById("score").innerHTML = ""
  document.getElementById("time").innerHTML = ""
  var canvas = document.getElementById("spaceCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas = document.getElementById("robotCanvas");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
   document.getElementById("spaceCanvas").style.background =
   "url('images/talking_animation.gif')";
   document.getElementById("questions").innerHTML = "<br><br><br><br>CHOOSE A GAME MODE!<br><br>1) Jump to Psyche!<br><br>2) Study Mode!<br><br> 3) View Instructions!<br><br> 4) Time  Attack";
}


function instructions(){
  document.getElementById("spaceCanvas").style.background =
  "url('images/talking_animation.gif')";
  document.getElementById("questions").innerHTML = instructionsString;
}

function studyMode(){
  keyboardMode = 4;
  document.getElementById("questions").innerHTML = "";
  document.getElementById("spaceCanvas").style.background =
  "url('images/Study_Mode.png')";
  document.getElementById("studymodeinstructions").innerHTML = studyModeDefTitle
  document.getElementById("studymodequestions").innerHTML = questionsDict[studyModeIndex].question ;
  document.getElementById("studymodeanswers").innerHTML =  questionsDict[studyModeIndex].correctAnswer;
}

function startGame() {
  document.getElementById("questions").innerHTML = "";
  document.getElementById("spaceCanvas").style.background =
  "url('images/Space_Background.png')";
  document.getElementById("score").innerHTML = "SCORE: 0"
  if(gameMode == 1)
    document.getElementById("time").innerHTML = "TIMER: 0"
  if(gameMode == 2)
    document.getElementById("time").innerHTML = "TIMER: 60"
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
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the robot canvas

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
  "url('images/talking_animation.gif')";
  document.getElementById("questions").innerHTML = getQuestionString();
  keyboardMode = 3;
}

function getQuestionString(){
  questionIndex = Math.floor(Math.random() * Math.floor(26));
  return shuffleQuestionAnswers(questionsDict[questionIndex])
}

function shuffleQuestionAnswers(questionObj){
  questionString = questionObj.question + "<br><br>";


  if(!questionObj.isTrueFalse){
    isATrueFalseQuestion = false;
    randomIndex = Math.floor(Math.random() * Math.floor(10));
    for(var i = 1; i <= 4; i++){
      console.log(randomIndex + i);
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
}

else{
  isATrueFalseQuestion = true;
  questionString += 1 + ") TRUE " + "<br><br>" ;
  questionString += 2 + ") FALSE " + "<br><br>" ;
  correctAnswerPos = questionObj.correctTFAnsPos;
  correctAnswerStr = (questionObj.correctTFAnsPos == 1) ? "TRUE" : "FALSE";
}
  return questionString;
}


function tick() {
  
  if(gameMode == 1){
    timeElapsed++;
  }
  if(gameMode == 2){
    timeElapsed--;
    if(timeElapsed == 0){
      stop();
    }
  }
  document.getElementById("time").innerHTML = "TIMER: " + timeElapsed;
}

function start() {
  if (timerID == -1) {
    if(gameMode == 1){
      timeElapsed = 0
      timerID = setInterval(tick, 1000);
    }
    if(gameMode == 2){
      timeElapsed = 60
      timerID = setInterval(tick, 1000);
    }
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
  timeElapsed = 0;
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
  questionsDict = [];
  questionsDict[0] = new Object();
  questionsDict[0].question = "WHEN WAS THE PSYCHE ASTEROID DISCOVERED?";
  questionsDict[0].correctAnswer = "1852";
  questionsDict[0].incorrectAnswer1 = "1801";
  questionsDict[0].incorrectAnswer2 = "1953";
  questionsDict[0].incorrectAnswer3 = "1733";
  questionsDict[0].isTrueFalse = false;
  
  questionsDict[1] = new Object();
  questionsDict[1].question = "WHO DISCOVERED THE PSYCHE ASTEROID?";
  questionsDict[1].correctAnswer = "ANNIBALE DE GASPARIS";
  questionsDict[1].incorrectAnswer1 = "NEIL ARMSTRONG";
  questionsDict[1].incorrectAnswer2 = "GALILEO GALILEI";
  questionsDict[1].incorrectAnswer3 = "MICHAEL COLLINS";
  questionsDict[1].isTrueFalse = false;
  
  questionsDict[2] = new Object();
  questionsDict[2].question = "WHERE IS THE PSYCHE ASTEROID?";
  questionsDict[2].correctAnswer = "BETWEEN MARS AND JUPITER";
  questionsDict[2].incorrectAnswer1 = "BETWEEN SATURN AND URANUS";
  questionsDict[2].incorrectAnswer2 = "OUTSIDE THE MILKY WAY";
  questionsDict[2].incorrectAnswer3 = "BETWEEN URANUS AND NEPTUNE";
  questionsDict[2].isTrueFalse = false;
  
  questionsDict[3] = new Object();
  questionsDict[3].question = "WHAT IS THE PSYCHE ASTEROID MADE OF?";
  questionsDict[3].correctAnswer = "IT IS LIKELY MADE OF A MIXTURE OF ROCK AND METAL";
  questionsDict[3].incorrectAnswer1 = "WATER";
  questionsDict[3].incorrectAnswer2 = "GAS";
  questionsDict[3].incorrectAnswer3 = "CRYSTALS";
  questionsDict[3].isTrueFalse = false;

  questionsDict[4] = new Object();
  questionsDict[4].question = "HOW LONG IS A DAY ON PSYCHE?";
  questionsDict[4].correctAnswer = "ABOUT 4 HOURS AND 12 MINUTES";
  questionsDict[4].incorrectAnswer1 = "24 HOURS";
  questionsDict[4].incorrectAnswer2 = "3 MINUTES";
  questionsDict[4].incorrectAnswer3 = "72 HOURS";
  questionsDict[4].isTrueFalse = false;

  questionsDict[5] = new Object();
  questionsDict[5].question = "HOW LONG IS A YEAR ON PSYCHE?";
  questionsDict[5].correctAnswer = "ABOUT FIVE EARTH YEARS (ABOUT 1,828 EARTH DAYS)";
  questionsDict[5].incorrectAnswer1 = "365 DAYS";
  questionsDict[5].incorrectAnswer2 = "12 DAYS";
  questionsDict[5].incorrectAnswer3 = "720 DAYS";
  questionsDict[5].isTrueFalse = false;

  questionsDict[6] = new Object();
  questionsDict[6].question = "HOW FAR IS THE PSYCHE ASTEROID FROM THE SUN?";
  questionsDict[6].correctAnswer = "AN AVERAGE DISTANCE OF 3 ASTRONOMICAL UNITS";
  questionsDict[6].incorrectAnswer1 = "15.2 ASTRONOMICAL UNITS";
  questionsDict[6].incorrectAnswer2 = "71 ASTRONOMICAL UNITS";
  questionsDict[6].incorrectAnswer3 = "1 ASTRONOMICAL UNIT";
  questionsDict[6].isTrueFalse = false;

  questionsDict[7] = new Object();
  questionsDict[7].question = "HOW BIG IS THE PSYCHE ASTEROID?";
  questionsDict[7].correctAnswer = "IT IS 279 X 232 X 189 KILOMETERS (173 X 144 X 117 MILES)";
  questionsDict[7].incorrectAnswer1 = "5 KILOMETERS LONG";
  questionsDict[7].incorrectAnswer2 = "1500 KILOMETER RADIUS";
  questionsDict[7].incorrectAnswer3 = "42 METERS";
  questionsDict[7].isTrueFalse = false;

  questionsDict[8] = new Object();
  questionsDict[8].question = "WHAT LAUNCH VEHICLE WILL THE PSYCHE MISSION USE?";
  questionsDict[8].correctAnswer = "SPACEX OF HAWTHORNE, CALIFORNIA";
  questionsDict[8].incorrectAnswer1 = "CAPE CANAVERAL AIRFORCE STATION";
  questionsDict[8].incorrectAnswer2 = "KENNEDY SPACE CENTER";
  questionsDict[8].incorrectAnswer3 = "VANDENBERG AIR FORCE BASE";
  questionsDict[8].isTrueFalse = false;

  questionsDict[9] = new Object();
  questionsDict[9].question = "HOW FAR WILL THE PSYCHE SPACECRAFT TRAVEL?";
  questionsDict[9].correctAnswer = "~1.5 BILLION MILES";
  questionsDict[9].incorrectAnswer1 = "~1.5 MILLION MILES";
  questionsDict[9].incorrectAnswer2 = "~13.1 BILLION MILES";
  questionsDict[9].incorrectAnswer3 = "~4.2 TRILLION MILES";
  questionsDict[9].isTrueFalse = false;

  questionsDict[10] = new Object();
  questionsDict[10].question = "HOW MUCH RAW DATA DOES THE PSYCHE MISSION EXPECT TO DELIVER OVER ITS LIFETIME?";
  questionsDict[10].correctAnswer = "620 GIGABYTES";
  questionsDict[10].incorrectAnswer1 = "55 GIGABYTES";  
  questionsDict[10].incorrectAnswer2 = "62 GIGABYTES";
  questionsDict[10].incorrectAnswer3 = "74600 GIGABYTES";
  questionsDict[10].isTrueFalse = false;

  questionsDict[11] = new Object();
  questionsDict[11].question = "TRUE OR FALSE: THE PSYCHE MISSION WILL TEST A SOPHISTICATED NEW LASER COMMUNICATION TECHNOLOGY THAT ENCODES DATA IN PHOTONS, RATHER THAN RADIO WAVES, TO COMMUNICATE BETWEEN A PROBE IN DEEP SPACE AND EARTH.";
  questionsDict[11].correctAnswer = "TRUE";
  questionsDict[11].incorrectAnswer1 = "FALSE";
  questionsDict[11].incorrectAnswer2 = "N/A";
  questionsDict[11].incorrectAnswer3 = "N/A";
  questionsDict[11].isTrueFalse = true;
  questionsDict[11].correctTFAnsPos = 1;

  questionsDict[12] = new Object();
  questionsDict[12].question = "TRUE OR FALSE: USING LIGHT INSTEAD OF RADIO ALLOWS THE SPACECRAFT TO COMMUNICATE MORE DATA IN A GIVEN AMOUNT OF TIME.";
  questionsDict[12].correctAnswer = "TRUE";
  questionsDict[12].incorrectAnswer1 = "FALSE";
  questionsDict[12].incorrectAnswer2 = "N/A";
  questionsDict[12].incorrectAnswer3 = "N/A";
  questionsDict[12].isTrueFalse = true;
  questionsDict[12].correctTFAnsPos = 1;

  questionsDict[13] = new Object();
  questionsDict[13].question = "WHAT IS PSYCHE?";
  questionsDict[13].correctAnswer = "PSYCHE IS THE NAME OF AN ASTEROID ORBITING THE SUN BETWEEN MARS AND JUPITER AND THE NAME OF A NASA SPACE MISSION TO VISIT THAT ASTEROID, LED BY ASU.";
  questionsDict[13].incorrectAnswer1 = "A TYPE OF PROPULSION";
  questionsDict[13].incorrectAnswer2 = "THE NAME OF THE ASTRONAUT GOING TO THE ASTEROID";
  questionsDict[13].incorrectAnswer3 = "A SPACE MISSION LED BY UNIVERSITY OF ARIZONA";
  questionsDict[13].isTrueFalse = false;

  questionsDict[14] = new Object();
  questionsDict[14].question = "WHAT KIND OF MISSION IS PSYCHE?";
  questionsDict[14].correctAnswer = "PSYCHE IS THE 14TH MISSION SELECTED FOR NASA’S DISCOVERY PROGRAM: A SERIES OF RELATIVELY LOW-COST MISSIONS TO SOLAR SYSTEM TARGETS.";
  questionsDict[14].incorrectAnswer1 = "A MISSION TO FIND ALIENS";
  questionsDict[14].incorrectAnswer2 = "A MISSION TO INHABIT THE ASTEROID";
  questionsDict[14].incorrectAnswer3 = "A COMPETITION BETWEEN SPACE EXPLORATION COMPANIES";
  questionsDict[14].isTrueFalse = false;

  questionsDict[15] = new Object();
  questionsDict[15].question = "HOW MUCH DOES THE PSYCHE MISSION COST?";
  questionsDict[15].correctAnswer = "APPROXIMATELY $850 MILLION";
  questionsDict[15].incorrectAnswer1 = "APPROXIMATELY $10 MILLION";
  questionsDict[15].incorrectAnswer2 = "APPROXIMATELY $25 BILLION";
  questionsDict[15].incorrectAnswer3 = "APPROXIMATELY $44 TRILLION";
  questionsDict[15].isTrueFalse = false;

  questionsDict[16] = new Object();
  questionsDict[16].question = "WHO IS BUILDING THE PSYCHE MISSION?";
  questionsDict[16].correctAnswer = "THE MISSION IS LED BY ARIZONA STATE UNIVERSITY. NASA’S JET PROPULSION LABORATORY IS RESPONSIBLE FOR MISSION MANAGEMENT, OPERATIONS AND NAVIGATION.";
  questionsDict[16].incorrectAnswer1 = "UNIVERSITY OF ARIZONA";
  questionsDict[16].incorrectAnswer2 = "SPACEX";
  questionsDict[16].incorrectAnswer3 = "ASU FACULTY";
  questionsDict[16].isTrueFalse = false;

  questionsDict[17] = new Object();
  questionsDict[17].question = "WHEN DID WE FIND OUT WHAT PSYCHE IS MADE OF?";
  questionsDict[17].correctAnswer = "~2010";
  questionsDict[17].incorrectAnswer1 = "~1987";
  questionsDict[17].incorrectAnswer2 = "~2001";
  questionsDict[17].incorrectAnswer3 = "~2020";
  questionsDict[17].isTrueFalse = false;
  
  questionsDict[18] = new Object();
  questionsDict[18].question = "HOW MUCH DOES THE PSYCHE ASTEROID WEIGH?";
  questionsDict[18].correctAnswer = "~ 27 SEXTILLION KG";
  questionsDict[18].incorrectAnswer1 = "~ 27 MILLION KG";
  questionsDict[18].incorrectAnswer2 = "~ 44 SEXTILLION KG";
  questionsDict[18].incorrectAnswer3 = "~ 37 SEXTILLION KG";
  questionsDict[18].isTrueFalse = false;

  questionsDict[19] = new Object();
  questionsDict[19].question = "TRUE OR FALSE: PSYCHE WAS THE 17TH ASTEROID TO BE FOUND";
  questionsDict[19].correctAnswer = "FALSE";
  questionsDict[19].incorrectAnswer1 = "TRUE";
  questionsDict[19].incorrectAnswer2 = "N/A";
  questionsDict[19].incorrectAnswer3 = "N/A";
  questionsDict[19].isTrueFalse = true;
  questionsDict[19].correctTFAnsPos = 2;

  questionsDict[20] = new Object();
  questionsDict[20].question = "WHAT GIVES ASTEROID PSYCHE GREAT SCIENTIFIC INTEREST?";
  questionsDict[20].correctAnswer  = "IT IS LIKELY RICH IN METAL. IT MAY CONSIST LARGELY OF METAL FROM THE CORE OF AN EARLY PLANET."; 
  questionsDict[20].incorrectAnswer1 =  "IT IS A NEW ASTEROID THAT NASA JUST DISCOVERED";
  questionsDict[20].incorrectAnswer2 =  "IT HAS VISIBLE WATER ON IT";
  questionsDict[20].incorrectAnswer3 = "ALL THE ABOVE";
  questionsDict[20].isTrueFalse = false;

  questionsDict[21] = new Object();
  questionsDict[21].question = "WHAT YEAR IS THE PSYCHE SPACECRAFT IS TARGETED TO LAUNCH IN?";
  questionsDict[21].correctAnswer  = "2022"; 
  questionsDict[21].incorrectAnswer1 =  "2020";
  questionsDict[21].incorrectAnswer2 =  "2056";
  questionsDict[21].incorrectAnswer3 = "2030";
  questionsDict[21].isTrueFalse = false;

  questionsDict[22] = new Object();
  questionsDict[22].question = "WHAT YEAR IS THE PSYCHE SPACECRAFT SUPPOSED TO REACH THE ASTEROID?";
  questionsDict[22].correctAnswer  = "2026"; 
  questionsDict[22].incorrectAnswer1 =  "2084";
  questionsDict[22].incorrectAnswer2 =  "2062";
  questionsDict[22].incorrectAnswer3 = "2020";
  questionsDict[22].isTrueFalse = false;

  questionsDict[23] = new Object();
  questionsDict[23].question = "HOW LONG WILL THE PSYCHE SPACECRAFT STAY ON THE ASTEROID?";
  questionsDict[23].correctAnswer  = "21 MONTHS"; 
  questionsDict[23].incorrectAnswer1 =  "AS LONG AS IT WANTS";
  questionsDict[23].incorrectAnswer2 =  "56 MONTHS";
  questionsDict[23].incorrectAnswer3 = "7 YEARS";
  questionsDict[23].isTrueFalse = false;

  questionsDict[24] = new Object();
  questionsDict[24].question = "WHO WILL BE BUILDING THE PSYCHE SPACECRAFT AND ITS SOLAR PANELS?";
  questionsDict[24].correctAnswer  = "MAXAR TECHNOLOGIES"; 
  questionsDict[24].incorrectAnswer1 =  "NASA";
  questionsDict[24].incorrectAnswer2 =  "ARIZONA STATE UNIVERSITY";
  questionsDict[24].incorrectAnswer3 = "UNIVERSITY OF ARIZONA";
  questionsDict[24].isTrueFalse = false;

  questionsDict[25] = new Object();
  questionsDict[25].question = "TRUE OR FALSE: THE PSYCHE SPACECRAFT (INCLUDING THE SOLAR PANELS) IS ABOUT THE SIZE OF A SINGLES TENNIS COURT.";
  questionsDict[25].correctAnswer  = "TRUE"; 
  questionsDict[25].incorrectAnswer1 =  "FALSE";
  questionsDict[25].incorrectAnswer2 =  "N/A";
  questionsDict[25].incorrectAnswer3 = "N/A";
  questionsDict[25].isTrueFalse = true;
  questionsDict[25].correctTFAnsPos = 1;

  questionsDict[26] = new Object();
  questionsDict[26].question = "WHAT TYPE OF PROPULSION WILL THE SPACECRAFT USE?";
  questionsDict[26].correctAnswer  = "SOLAR PROPULSION"; 
  questionsDict[26].incorrectAnswer1 =  "GAS TURBINE PROPULSION";
  questionsDict[26].incorrectAnswer2 =  "DIESEL PROPULSION";
  questionsDict[26].incorrectAnswer3 = "WATER-JET PROPULSION";
  questionsDict[26].isTrueFalse = false;

  return questionsDict;
}