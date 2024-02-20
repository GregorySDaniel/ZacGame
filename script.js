var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
var character = document.querySelector(".character");
var blobs = document.querySelector(".blobs");
var enemys = document.querySelector(".enemys");
var map = document.querySelector(".map");
var spear = document.getElementById('spear');
var score = document.getElementById('score');
var nickname = document.getElementById('nickname');
const characterImg = document.querySelector('.characterImage img');
const menu = document.querySelector(".menu");
var gameRunning = false;

var characterX = 80;
var characterY = 30;
var bloobX = 0;
var bloobY = 0;
var enemyX = 0;
var enemyY = 0;
var spearX = 0;
var spearY = 0;
var utilY = 0;
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
  if (!gameRunning) return;
  bloobX = Math.floor(Math.random() * 170);
  bloobY = 12 + Math.floor(Math.random() * 80);
  blobs.style.transform = `translate3d( ${bloobX*pixelSize}px, ${bloobY*pixelSize}px, 0)`
}

const step = () => {
  placeCharacter();
  
  if(!gameRunning) return;

  window.requestAnimationFrame(()=> {
    step();
    if (Math.abs(bloobX-characterX) <= 12 && Math.abs(bloobX-characterX)>=4 && (bloobY - characterY) >= 18 && (bloobY - characterY) <= 28) {
      placeBlobs();
      updateScore();
    }

    if (Math.abs(spearX-characterX) < 2 && Math.abs(spearY-characterY)<10)  {
      console.log("pegou");
      character.classList.toggle('color');
      gameRunning = false;
    }
  })
}

function updateScore(){
  currentScore++;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function enemySlide(){
  if (!gameRunning) return;
  setTimeout(() => {
    utilY = enemyY;
    enemys.classList.add('animation');
    enemys.style.transform = `translate3d( ${(20+enemyX)*pixelSize}px, ${enemyY*pixelSize}px, 0)`
    setTimeout(() => {
      enemys.classList.remove('animation');
      enemyAppear();
      throwSkill(utilY);
    }, 1500);
  }, 1500);

}

function throwSkill(utilY){
  if (!gameRunning) return;
  // console.log(utilY)
  // console.log(enemyY)
  spear.classList.add('spear-animation');
  spearX = 20+enemyX;
  spearY = utilY;
  let x = ((enemyY-20)-spearY)/100;
  spear.style.transform = `translate3d( ${(250+enemyX)*pixelSize}px, ${(enemyY-20)*pixelSize}px, 0)`
  for(let i=0; i<100; i++){
    if (!gameRunning) return;
    setTimeout(()=>{
      spearX += 3;
      spearY += x;
      // console.log(`Lança X = ${spearX} Lança Y = ${spearY}`);
    }, 12 * i);
  }
  setTimeout(()=> {
    spear.classList.add('hidden');
    spear.classList.remove('spear-animation');
    spear.style.transform = `translate3d( ${(20+enemyX)*pixelSize}px, ${(enemyY-20)*pixelSize}px, 0)`
    setTimeout(()=>{
      spear.classList.remove('hidden');
    }, 1000);
  }, 1500)
}


function enemyAppear(){
  if (!gameRunning) return;
  enemyX = -25;
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

function startGame(){
  gameRunning = true;
  menu.classList.add('hidden');
  placeBlobs();
  enemyAppear();
  step();
}

