
var character = document.querySelector(".character");
var map = document.querySelector(".map");

const characterImg = document.querySelector('.character img');

var x = 6.5;
var y = 5;

var held_directions = [];

var speed = 0.5;


const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right"
};

const keys = {
  'w': directions.up,
  'a': directions.left,
  'd': directions.right,
  's': directions.down,
}

const placeCharacter = () => {
  var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
  const held_direction = held_directions[0];
  if (held_direction) {
    if (held_direction === directions.right) {
      x += speed; 
      characterImg.src = 'assets/rightZac.png';}
    if (held_direction === directions.left) {
      x -= speed;
      characterImg.src = 'assets/leftZac.png';}
    if (held_direction === directions.down) {y += speed;}
    if (held_direction === directions.up) {y -= speed;}
    character.setAttribute("facing", held_direction);
  }



  character.setAttribute("walking", held_direction ? "true" : "false");

  character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0)`
  
}

const step = () => {
  placeCharacter();
  window.requestAnimationFrame(()=> {
    step();
  })
}

document.addEventListener("keydown", (e) => {
  var dir = keys[e.key];
  if (dir && held_directions.indexOf(dir) === -1) {
    held_directions.unshift(dir);
  }
})

document.addEventListener("keyup", (e) => {
  var dir = keys[e.key];
  var index = held_directions.indexOf(dir);
  if (index > -1) {
    held_directions.splice(index, 1);
  }
})

step();