var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
var character = document.querySelector(".character");
var blobs = document.querySelector(".blobs");
var enemys = document.querySelector(".enemys");
var map = document.querySelector(".map");
var spear = document.getElementById('spear');
var score = document.getElementById('score');

const characterImg = document.querySelector('.characterImage img');

var characterX = 0;
var characterY = 0;
var bloobX = 0;
var bloobY = 0;
var enemyX = 0;
var enemyY = 0;
var currentScore = 0;

var held_directions = [];

var speed = .7;


const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
};

const keys = {
  'w': directions.up,
  'a': directions.left,
  'd': directions.right,
  's': directions.down,
}

const placeCharacter = () => {
  const held_direction = held_directions[0];
  if (held_direction) {
    if (held_direction === directions.right) {
      characterX += speed; 
      characterImg.src = 'assets/rightZac.png';}
    if (held_direction === directions.left) {
      characterX -= speed;
      characterImg.src = 'assets/leftZac.png';}
    if (held_direction === directions.down) {characterY += speed;}
    if (held_direction === directions.up) {characterY -= speed;}
    character.setAttribute("facing", held_direction);
  }
  character.setAttribute("walking", held_direction ? "true" : "false");
  character.style.transform = `translate3d( ${characterX*pixelSize}px, ${characterY*pixelSize}px, 0)`
}

function placeBlobs () {
  bloobX = Math.floor(Math.random() * 170);
  bloobY = 12 + Math.floor(Math.random() * 80);
  blobs.style.transform = `translate3d( ${bloobX*pixelSize}px, ${bloobY*pixelSize}px, 0)`
}

const step = () => {
  placeCharacter();
  console.log(`X: ${characterX} Y: ${characterY}`)
  if (Math.abs(bloobX-characterX) <= 12 && Math.abs(bloobX-characterX)>=4 && (bloobY - characterY) >= 18 && (bloobY - characterY) <= 28) { 
    placeBlobs(); 
    updateScore();
  }
  window.requestAnimationFrame(()=> {
    step();
  })
}

function updateScore(){
  currentScore++;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function enemySlide(){
  setTimeout(() => {
    enemys.classList.add('animation');
    enemys.style.transform = `translate3d( ${(20+enemyX)*pixelSize}px, ${enemyY*pixelSize}px, 0)`
    setTimeout(() => {
      enemys.classList.remove('animation');
      enemyAppear();
    }, 2000);
  }, Math.floor(Math.random() * 4000)+1000);
}


function enemyAppear(){
  enemyX = -20;
  enemyY = Math.floor(Math.random() * 70);
  enemys.style.transform = `translate3d( ${enemyX*pixelSize}px, ${enemyY*pixelSize}px, 0)`
  enemySlide();
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
placeBlobs();
enemyAppear();