const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext("2d");
const scoreShow=document.getElementById("scoreDisplay");
const box=20;
let score=0;
let dir="RIGHT";
let baseSpeed = 150;
let minSpeed = 50;
let speedIncRate = 1;
let gameSpeed = baseSpeed;

let snake=[];

snake[0]={
    x:9*box,
    y:10*box
}

let snakeFood={
x:Math.floor(Math.random()*20)*box,
y:Math.floor(Math.random()*20)*box
}

document.addEventListener("keydown",changeDirection);

function changeDirection(e){
if(e.key==="ArrowLeft"&&dir!=="RIGHT"){
    dir="LEFT";
}else if(e.key==="ArrowUp"&&dir!=="DOWN"){
    dir="UP";
} else if(e.key==="ArrowRight"&&dir!=="LEFT"){
    dir="RIGHT";
} else if(e.key==="ArrowDown"&&dir!=="UP"){
    dir="DOWN";
}
}
//main logic
function drawGame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<snake.length;i++){
        ctx.fillStyle=i===0 ? "#00ff00" : "#007700";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }
    ctx.fillStyle="red";
    ctx.fillRect(snakeFood.x,snakeFood.y,box,box);
    let headX=snake[0].x;
let headY=snake[0].y;

if(dir==="LEFT") headX-=box;
else if(dir==="RIGHT") headX+=box;
else if(dir==="UP") headY-=box;
else if(dir==="DOWN") headY+=box;

if(headX === snakeFood.x && headY === snakeFood.y){    
  score+=5;
  scoreShow.textContent="Score "+score;
  gameSpeed = Math.max(minSpeed, baseSpeed - score * speedIncRate);
  console.log(gameSpeed)
  snakeFood={
    x:Math.floor(Math.random()*20)*box,
    y:Math.floor(Math.random()*20)*box
  };
}
else{
    snake.pop();
}

const newHead={x : headX,y : headY };

if(
    headX < 0 || headX>=canvas.width || headY < 0 ||headY>=canvas.height||
    collision(newHead,snake)
){
clearInterval(drawGame);
document.getElementById('gameOver').style.visibility='visible';
document.getElementById('replayBtn').style.visibility='visible';
return;
}

snake.unshift(newHead);
}



function collision(head,snakeBody){
for(let i=0;i<snakeBody.length;i++){
    if(head.x===snakeBody[i].x && head.y===snakeBody[i].y){
        return true;
    }
}

return false;
}
let lastFrameTime = 0;
//  gameSpeed = 200; // speed in milliseconds (100ms per frame)

function gameLoop(currentTime) {
    if (!isPaused&&currentTime - lastFrameTime >= gameSpeed) {
        drawGame();
        lastFrameTime = currentTime;
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop); // Starts the game loop
let isPaused = false;

// Pause button logic
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    if(score>0)
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});


document.getElementById('replayBtn').addEventListener('click', function () {
  location.reload(); // Page reload karega => game restart ho jayega
});


