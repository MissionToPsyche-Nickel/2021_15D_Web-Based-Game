console.log("ashfykjldsajkds");

document.getElementById("myCanvas").style.background = "url('images/Space_Background.png')";


  const asteroids = [
    [1, -1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, 1],
    [-1, 1, 1],
    [-1, 1, 1],
    [1, 1, -1],
    [1, 1, -1],
    [1, 1, -1],
    [1, 1, -1],
];
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
