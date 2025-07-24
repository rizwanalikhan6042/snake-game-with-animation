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
   drawSnake()
    drawFood()

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
    
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});


document.getElementById('replayBtn').addEventListener('click', function () {
  location.reload(); // Page reload karega => game restart ho jayega
});

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const part = snake[i];
        const isHead = i === 0;

        ctx.beginPath();
        ctx.fillStyle = isHead ? "#00ffcc" : `hsl(${i * 15}, 80%, 50%)`;  // Gradient hues
        ctx.shadowColor = isHead ? "#00ffff" : "#00ff66";
        ctx.shadowBlur = isHead ? 10 : 5;

        // Rounded corners for a smooth modern look
        ctx.roundRect(part.x, part.y, box, box, 5);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset
    }
}

function drawFood() {
    const glowSize = 5;
    const pulse = Math.sin(Date.now() / 200) * 2 + 8; // animated pulse

    ctx.beginPath();
    ctx.arc(snakeFood.x + box / 2, snakeFood.y + box / 2, pulse, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff3399"; // bright pink/red
    ctx.shadowColor = "#ff66cc"; // glowing pink shadow
    ctx.shadowBlur = glowSize;
    ctx.fill();
    ctx.shadowBlur = 0; // reset after drawing
}
