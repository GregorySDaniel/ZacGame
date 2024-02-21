var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
var character = document.querySelector(".character");
var blobs = document.querySelector(".blobs");
var nidalee = document.querySelector(".nidalee");
var graves = document.querySelector(".graves");
var map = document.querySelector(".map");
var spear = document.querySelector(".spear");
var shot = document.querySelector(".shot");
var smoke = document.querySelector(".smoke")
var score = document.getElementById('score');
var highScore = document.getElementById('highScore');
var nickname = document.getElementById('nickname');
const characterImg = document.querySelector('.characterImage img');
const menu = document.querySelector(".menu");
const nick = document.querySelector('.hud.player p');
var gameRunning = false;
var end = document.querySelector(".end");
var scoreUser = end.querySelector("p");
var restartButton = document.getElementById('restartButton');


var characterX = 80;
var characterY = 35;
var bloobX = 0;
var bloobY = 0;
var nidaleeX = 0;
var nidaleeY = 0;
var gravesX = 0;
var gravesY = 0;
var smokeX = 0;
var smokeY = 0;
var spearX = 0;
var spearY = 0;
var utilY = 0;
var currentScore = 0;
var maxScore = 0;

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
      if(characterX>=175){ return; }
      characterX += speed;
      characterImg.src = 'assets/rightZac.png';}
    if (held_direction === directions.left) {
      if(characterX<=-5){ return; }
      characterX -= speed;
      characterImg.src = 'assets/leftZac.png';}
    if (held_direction === directions.down) {
      if(characterY>=75){ return; }
      characterY += speed;
    }
    if (held_direction === directions.up) {
      if(characterY<=-12){ return; }
      characterY -= speed;
    }
    character.setAttribute("facing", held_direction);
  }
  character.setAttribute("walking", held_direction ? "true" : "false");
  character.style.transform = `translate3d( ${characterX*pixelSize}px, ${characterY*pixelSize}px, 0)`
}

function placeBlobs () {
  if (!gameRunning) return;
  bloobX = Math.floor(Math.random() * 150);
  bloobY = 12 + Math.floor(Math.random() * 60);
  blobs.style.transform = `translate3d( ${bloobX*pixelSize}px, ${bloobY*pixelSize}px, 0)`
}

const step = () => {
  placeCharacter();
    console.log(`Personagem X: ${characterX} Personagem Y: ${characterY}`)
    console.log(`Smoke X: ${smokeX} Smoke Y: ${smokeY}`)
  
  if(!gameRunning) return;

  window.requestAnimationFrame(()=> {
    step();
    if (Math.abs(bloobX-characterX) <= 5 && Math.abs(bloobY - characterY) <= 5) {
      placeBlobs();
      updateScore();
    }

    if (Math.abs(spearX-characterX) < 2 && Math.abs(spearY-characterY)<10)  {
      scoreUser.textContent = `Your score: ${currentScore}`;
      end.classList.remove('hidden');
      gameRunning = false;
      setTimeout(()=> {
        restartButton.classList.remove('hidden');
      }, 3000);
    }

    if (Math.abs(smokeX-characterX) <= 12 && Math.abs(smokeY - characterY) <= 12) {
      character.classList.toggle('color');
    }
  })
}

function updateScore(){
  currentScore++;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function nidaleeSlide(){
  if (!gameRunning) return;
  setTimeout(() => {
    utilY = nidaleeY;
    nidalee.classList.add('animation');
    nidalee.style.transform = `translate3d( ${(20+nidaleeX)*pixelSize}px, ${nidaleeY*pixelSize}px, 0)`
    setTimeout(() => {
      nidalee.classList.remove('animation');
      nidaleeAppear();
      throwSpear(utilY);
    }, 1500);
  }, 1500);

}

function throwSpear(utilY){
  if (!gameRunning) return;
  spear.classList.add('spear-animation');
  spearX = nidaleeX;
  spearY = utilY;
  let x = ((nidaleeY)-spearY)/100;
  spear.style.transform = `translate3d( ${(250+nidaleeX)*pixelSize}px, ${(nidaleeY)*pixelSize}px, 0)`
  for(let i=0; i<100; i++){
    setTimeout(()=>{
      spearX += 3;
      spearY += x;
    }, 6 * i);
  }
  setTimeout(()=> {
    spear.classList.add('hidden');
    spear.classList.remove('spear-animation');
    spear.style.transform = `translate3d( ${(30+nidaleeX)*pixelSize}px, ${(nidaleeY)*pixelSize}px, 0)`
    setTimeout(()=>{
      spear.classList.remove('hidden');
    }, 1000);
  }, 1500)
}

function throwSmoke() {

  smoke.classList.remove('hidden');
  smoke.style.transform = `translate3d( ${(smokeX)*pixelSize}px, ${(smokeY)*pixelSize}px, 0)`
}

function nidaleeAppear(){
  if (!gameRunning) return;
  nidaleeX = -25;
  nidaleeY = Math.floor(Math.random() * 70);
  nidalee.style.transform = `translate3d( ${nidaleeX*pixelSize}px, ${nidaleeY*pixelSize}px, 0)`
  nidaleeSlide();
}

function gravesSlide(){
  if (!gameRunning) return;
  setTimeout(() => {
    graves.classList.add('animation');
    graves.style.transform = `translate3d( ${gravesX*pixelSize}px, ${(gravesY-40)*pixelSize}px, 0)`
    smokeX = Math.floor(Math.random() * 150);
    smokeY = Math.floor(Math.random() * 60);
    setTimeout(() => {
      graves.classList.remove('animation');
      throwSmoke(smokeX, smokeY);
      gravesAppear();
    }, 1500);
  }, 5000);
}

function gravesAppear(){
  if (!gameRunning) return;
  gravesX = Math.floor(Math.random() * 170);
  gravesY = 120;
  graves.style.transform = `translate3d( ${gravesX*pixelSize}px, ${gravesY*pixelSize}px, 0)`
  gravesSlide();
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

function resetGame(){
  if(currentScore>maxScore){
    maxScore = currentScore;
    highScore.textContent = maxScore.toString().padStart(3, '0');
  }
  end.classList.add('hidden');
  characterX = 80;
  characterY = 35;
  bloobX = 0;
  bloobY = 0;
  nidaleeX = 0;
  nidaleeY = 0;
  spearX = 0;
  spearY = 0;
  utilY = 0;
  currentScore = 0;
  restartButton.classList.add('hidden');
  updateScore();
  startGame();
}

function startGame(){
  gameRunning = true;
  menu.classList.add('hidden');
  placeBlobs();
  nidaleeAppear();
  gravesAppear();
  step();
  nick.textContent = nickname.value;
}