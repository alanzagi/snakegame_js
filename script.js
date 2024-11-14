const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = getRandomFood();
let score = 0;
let highScore = 0;
let speed = 100;
let initialSpeed = speed;
let gameInterval;
let isPaused = false;

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#ff4081" : "#fff";
    ctx.shadowBlur = index === 0 ? 10 : 0;
    ctx.shadowColor = "#ff4081";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    ctx.shadowBlur = 0;
  });
}

function drawFood() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function getRandomFood() {
  return {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  };
}

function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y = (head.y - 1 + canvasSize) % canvasSize;
      break;
    case "down":
      head.y = (head.y + 1) % canvasSize;
      break;
    case "left":
      head.x = (head.x - 1 + canvasSize) % canvasSize;
      break;
    case "right":
      head.x = (head.x + 1) % canvasSize;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = getRandomFood();
    score++;
    updateScore();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
}

function increaseSpeed() {
  speed = Math.max(50, initialSpeed - Math.floor(score / 5) * 5);
}

function updateScore() {
  const scoreElement = document.querySelector("#score span");
  scoreElement.innerText = score;

  if (score > highScore) {
    highScore = score;
    const highScoreElement = document.querySelector("#high-score span");
    highScoreElement.innerText = highScore;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (checkCollision()) {
    resetGame();
  }

  drawSnake();
  drawFood();
}

function resetGame() {
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").innerText = score;
  clearInterval(gameInterval);
}

function startNewGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  food = getRandomFood();
  score = 0;
  speed = initialSpeed;
  document.getElementById("gameOver").classList.add("hidden");
  updateScore();
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  if (!isPaused) {
    moveSnake();
    draw();
  }
}

function togglePause() {
  isPaused = !isPaused;
  const pauseButton = document.querySelector("#pauseButton button");
  pauseButton.innerText = isPaused ? "Resume" : "Pause";
}

// Event Listener untuk kontrol arah
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
});

// Mulai game saat halaman dimuat
gameInterval = setInterval(gameLoop, speed);
