console.log("ashfykjldsajkds")

document.getElementById("myCanvas").style.background = "url('svg/Space_Background.png')";

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