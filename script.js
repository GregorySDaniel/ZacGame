var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
var character = document.querySelector(".character");
var blobs = document.querySelector(".blobs");
var nidalee = document.querySelector(".nidalee");
var graves = document.querySelector(".graves");
var taliyah = document.querySelector(".taliyah");
var map = document.querySelector(".map");
var spear = document.querySelector(".spear");
var rock = document.querySelector(".rock");
var shot = document.querySelector(".shot");
var smoke = document.querySelector(".smoke")
var score = document.getElementById('score');
var highScore = document.getElementById('highScore');
var nickname = document.getElementById('nickname');
const characterImg = document.querySelector('.characterImage img');
const menu = document.querySelector(".menu");
const nick = document.querySelector('.hud.player p');
var isGameRunning = false;
var end = document.querySelector(".end");
var scoreUser = end.querySelector("p");
var restartButton = document.getElementById('restartButton');


var characterX = 80;
var characterY = 35;
var rockX = 0;
var rockY = 0;
var bloobX = 0;
var bloobY = 0;
var taliyahX = 0;
var taliyahY = 0;
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
var isSmoke = false;

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
  if (held_directions.length>1){
    speed = .5;
  }
  if (held_directions.length>0) {
    let newX = characterX;
  let newY = characterY;

  if (held_directions.includes('right')) {
    newX += speed;
    characterImg.src = 'assets/rightZac.png';
  }
  if (held_directions.includes('left')) {
    newX -= speed;
    characterImg.src = 'assets/leftZac.png';
  }
  if (held_directions.includes('down')) {
    newY += speed;
  }
  if (held_directions.includes('up')) {
    newY -= speed;
  }

  if (newX >= -5 && newX <= 175 && newY >= -12 && newY <= 75) {
    characterX = newX;
    characterY = newY;
    character.setAttribute("walking", "true");
  } else {
    character.setAttribute("walking", "false");
  }
}
  character.style.transform = `translate3d( ${characterX*pixelSize}px, ${characterY*pixelSize}px, 0)`
}

function placeBlobs () {
  if (!isGameRunning) return;
  bloobX = Math.floor(Math.random() * 150);
  bloobY = 12 + Math.floor(Math.random() * 60);
  blobs.style.transform = `translate3d( ${bloobX*pixelSize}px, ${bloobY*pixelSize}px, 0)`
}

const step = () => {
  placeCharacter(); 
  checkHitbox()
  if(!isGameRunning) return;

  window.requestAnimationFrame(()=> {
    step();
  })
}

function endGame() {
  scoreUser.textContent = `Your score: ${currentScore}`;
  end.classList.remove('hidden');
  isGameRunning = false;
  map.classList.remove('dark') 
  setTimeout(()=> {
    restartButton.classList.remove('hidden');
  }, 5000);
}

function checkHitbox(){
  if (Math.abs(bloobX-characterX) <= 5 && Math.abs(bloobY - characterY) <= 5) {
    placeBlobs();
    updateScore();
  }

  if (Math.abs(rockX-characterX) <= 5 && Math.abs(rockY - characterY) < 10) {
    endGame();
  }

  if (Math.abs(spearX-characterX) < 2 && Math.abs(spearY-characterY)<10)  {
    endGame();
  }

  if (Math.abs(smokeX-characterX) <= 12 && Math.abs(smokeY - characterY) <= 12 && isGameRunning) {
      map.classList.add('dark')
      speed = .3;
  } else {
    speed = .7;
    map.classList.remove('dark') 
  }

}

function updateScore(){
  currentScore++;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function nidaleeSlide(){
  if (!isGameRunning) return;
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
  if (!isGameRunning) return;
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
  if (!isGameRunning) return;
  nidaleeX = -25;
  nidaleeY = Math.floor(Math.random() * 70);
  nidalee.style.transform = `translate3d( ${nidaleeX*pixelSize}px, ${nidaleeY*pixelSize}px, 0)`
  nidaleeSlide();
}

function gravesSlide(){
  if (!isGameRunning) return;
  setTimeout(() => {
    graves.classList.add('animation');
    graves.style.transform = `translate3d( ${gravesX*pixelSize}px, ${(gravesY-40)*pixelSize}px, 0)`
    setTimeout(() => {
      graves.classList.remove('animation');
      smokeX = Math.floor(Math.random() * 150);
      smokeY = Math.floor(Math.random() * 60);
      throwSmoke(smokeX, smokeY);
      gravesAppear();
    }, 1500);
  }, 3000);
}

function gravesAppear(){
  if (!isGameRunning) return;
  gravesX = Math.floor(Math.random() * 170);
  gravesY = 120;
  graves.style.transform = `translate3d( ${gravesX*pixelSize}px, ${gravesY*pixelSize}px, 0)`
  gravesSlide();
}

function taliyahAppear() {
  if(!isGameRunning) return;
  let random = Math.floor(Math.random() * 2);
  taliyahX = 195;
  random>0 ? taliyahY = 0 : taliyahY = 70; 
  taliyah.style.transform = `translate3d( ${taliyahX*pixelSize}px, ${taliyahY*pixelSize}px, 0)`
  taliyahSlide(random);
}

function taliyahSlide(random){
  if(!isGameRunning) return;
  setTimeout(() => {
    if(!isGameRunning) return;
    taliyah.style.transform = `translate3d( ${(taliyahX-20)*pixelSize}px, ${taliyahY*pixelSize}px, 0)`;
    taliyah.classList.add('animation');
    setTimeout(() => {
      if(!isGameRunning) return;
      taliyah.classList.remove('animation');
      taliyah.classList.add('taliyah-animation');
      if(random===0){
        taliyah.style.transform = `translate3d( ${(taliyahX-20)*pixelSize}px, ${(taliyahY-70)*pixelSize}px, 0)`;
        throwRock(random);
      } else {
        taliyah.style.transform = `translate3d( ${(taliyahX-20)*pixelSize}px, ${(taliyahY+70)*pixelSize}px, 0)`;
        throwRock(random);
      }
      setTimeout(() => {
        if(!isGameRunning) return;
        taliyah.classList.remove('animation');
        taliyah.classList.remove('taliyah-animation');
        taliyahAppear();
      }, 3000);
    }, 1000)
  }, 3000);
}

function  throwRock(random) {
  for(let i=0; i<3; i++){
    setTimeout(() => {
      for(let i=0; i<100; i++){
        setTimeout(()=>{
          rockX -= 2.3;
      }, 6*i)
      }
      if(random===0) {
        rockX = taliyahX;
        rockY = taliyahY - (35*i);
        rock.style.transform = `translate3d( ${(rockX)*pixelSize}px, ${(rockY)*pixelSize}px, 0)`;
        setTimeout(() => {
          rock.classList.add('spear-animation');
          rock.style.transform = `translate3d( ${(rockX-230)*pixelSize}px, ${(rockY)*pixelSize}px, 0)`;
        }, 50);
        setTimeout(() => {
          rock.classList.remove('spear-animation');
        }, 999)
      } else {
        rockX = taliyahX;
        rockY = taliyahY + (35*i);;
        rock.style.transform = `translate3d( ${(rockX)*pixelSize}px, ${(rockY)*pixelSize}px, 0)`;
        setTimeout(() => {
          rock.classList.add('spear-animation');
          rock.style.transform = `translate3d( ${(rockX-230)*pixelSize}px, ${(rockY)*pixelSize}px, 0)`;
        }, 50);
        setTimeout(() => {
          rock.classList.remove('spear-animation');
        }, 999)
      }
    }, i * 1000)
  }
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
  isGameRunning = true;
  menu.classList.add('hidden');
  placeBlobs();
  nidaleeAppear();
  gravesAppear();
  taliyahAppear();
  step();
  nick.textContent = nickname.value;
}