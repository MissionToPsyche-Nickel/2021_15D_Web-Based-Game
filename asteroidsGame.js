console.log("Starting....");
var asteroids = [];
var score = 0;
var lives = 3;
var currentPosition = 0;

initializeAsteroids();
showAsteroids();

document.getElementById("myCanvas").style.background = "url('images/Space_Background.png')";


document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event){
  if(event.keyCode == 37) {
    console.log('Left was pressed');
    currentPosition = 0;
    checkKeyPress();
  }
  else if(event.keyCode == 39) {
      console.log('Right was pressed');
      currentPosition = 2;
      checkKeyPress();
  }
  else if(event.keyCode == 40) {
    console.log('Down was pressed');
    currentPosition = 1;
    checkKeyPress();
  }
  shiftAsteroidsUp();
  showAsteroids();
}

function checkKeyPress(){
  if(asteroids[9][currentPosition] == 1){
    score++;
    document.getElementById("score").innerHTML = "SCORE: " + score;
    console.log("GOOD JUMP!");
  }
  else{
    lives--;
    document.getElementById("lives").innerHTML = "REMAINING LIVES: " + lives;
    console.log("UNSAFE ASTEROID JUMP!");
  }
  if(lives == 0){
    var playAgain = confirm("GAME OVER! Play Again?");
    if(playAgain){
      initializeAsteroids();
      document.getElementById("score").innerHTML = "SCORE: " + score;
      document.getElementById("lives").innerHTML = "REMAINING LIVES: " + lives;
    }
    else{
      document.getElementById("lives").innerHTML = "REMAINING LIVES: " + lives;
      document.removeEventListener('keydown', handleKeyPress);
    }
  }
}


function initializeAsteroids(){
  asteroids = []
  for(var i = 0; i < 10; i++){
    asteroids.push(getAsteroidRow());
  }
  score = 0;
  lives = 3;
}

function getAsteroidRow(){
  var asteroidRow = [1,1,1]
  asteroidRow[getRandomBadAsteroidColumn()] = -1;
  return asteroidRow;
}
 
function getRandomBadAsteroidColumn() {
  return Math.floor(Math.random() * Math.floor(3));
}



function shiftAsteroidsUp(){
  for(let i = 9; i >0; i--){
    asteroids[i] = asteroids[i-1];
  }
  asteroids[0] = getAsteroidRow()
}



function showAsteroids(){
  const canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  for (let i = 0; i < asteroids.length; i++) {
      for (let j = 0; j < asteroids[i].length; j++) {
          let x = 150 + j * 384.2;
          let y = i * 64.86;
          cellColor = '#e74c3c';
          if (asteroids[i][j] === -1){
            var img = document.getElementById("Error Asteroid");
          }
          else{
            var img = document.getElementById("Valid Asteroid");
          }
          ctx.drawImage(img, x, y, 50,50);
          if(i == asteroids.length - 1 && j == currentPosition){
            drawRobot(x,y)
          }
      }
  }
}



function drawRobot(x,y){
  const canvas = document.getElementById('myCanvas2');
  var ctx = canvas.getContext('2d'); 
  var robot = document.getElementById("Character");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(currentPosition == 0){
    ctx.drawImage(robot, 150, 750, 50,50);
  }
  if(currentPosition == 1){
    ctx.drawImage(robot, 540, 750, 50,50);
  }
  if(currentPosition == 2){
    ctx.drawImage(robot, 925, 750, 50,50);
  }
}






//show_image("svg/Character.svg",100,100,1)
//show_image("svg/Valid_Asteroid.svg",100,100,1)
//show_image("svg/Error_Asteroid.svg",100,100,1)

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  // This next line will just add it to the <body> tag
  document.body.appendChild(img);
}
