console.log("ashfykjldsajkds");
var asteroids = [];
var score = 0;
var lives = 3;
initializeAsteroids();
document.getElementById("myCanvas").style.background = "url('images/Space_Background.png')";


document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    console.log('Left was pressed');
    shiftAsteroidsUp();
    showAsteroids();
  }
  else if(event.keyCode == 39) {
      console.log('Right was pressed');
      shiftAsteroidsUp();
      showAsteroids();
  }
  else if(event.keyCode == 40) {
    console.log('Down was pressed');
    shiftAsteroidsUp();
    showAsteroids();
}
});



function initializeAsteroids(){
  for(var i = 0; i < 10; i++){
    asteroids.push(getAsteroidRow());
  }
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
          let x = j * 384.2;
          let y = i * 64.86;
          cellColor = '#e74c3c';
          if (asteroids[i][j] === -1){
            var img = document.getElementById("Error Asteroid");
          }
          else{
            var img = document.getElementById("Valid Asteroid");
          }
          
          ctx.drawImage(img, x, y, 50,50);
      }
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
