const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const message = document.getElementById("message");
const pointsDisplay = document.getElementById("pointsEarned");
const savedPoints = document.getElementById("savedPoints");
const totalPoints = document.getElementById("totalPoints");
const resultSection = document.getElementById("resultSection");
const gameSection = document.getElementById("gameSection");
const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startBtn");

const STORAGE = {
  get total() { return +(localStorage.getItem("memory_points") || 0); },
  set total(v) { localStorage.setItem("memory_points", v); },
  get played() { return JSON.parse(localStorage.getItem("fallinghearts_played") || "false"); },
  set played(v) { localStorage.setItem("fallinghearts_played", JSON.stringify(v)); },
  get score() { return +(localStorage.getItem("fallinghearts_score") || 0); },
  set score(v) { localStorage.setItem("fallinghearts_score", v); }
};

// Проверка: уже играли?
if (STORAGE.played) {
  gameSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  savedPoints.textContent = STORAGE.score;
  totalPoints.textContent = STORAGE.total;
} else {
  startModal.showModal();
}

let hearts = [];
let catcher = { x: 150, y: 350, width: 80, height: 20 };
let score = 0;
let misses = 0;
let gameRunning = false;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y - size / 4, x - size, y + size / 2, x, y + size);
  ctx.bezierCurveTo(x + size, y + size / 2, x + size / 2, y - size / 4, x, y + size / 4);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();
}

function spawnHeart() {
  const x = Math.random() * (canvas.width - 20) + 10;
  hearts.push({ x, y: 0, size: 15, speed: 2 + Math.random() * 2 });
}

function update() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка корзины
  ctx.fillStyle = "#ff5bd6";
  ctx.shadowColor = "#ff5bd6";
  ctx.shadowBlur = 20;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Обновляем и рисуем сердца
  hearts.forEach((h, i) => {
    h.y += h.speed;
    drawHeart(h.x, h.y, h.size, "#ff91f2");

    // Проверка попадания
    if (
      h.y + h.size > catcher.y &&
      h.x > catcher.x &&
      h.x < catcher.x + catcher.width
    ) {
      hearts.splice(i, 1);
      score++;
      scoreDisplay.textContent = `❤️ ${score}`;
    }

    // Пропущено
    if (h.y > canvas.height) {
      hearts.splice(i, 1);
      misses++;
      if (misses >= 3) endGame();
    }
  });

  // Спавним новые сердца
  if (Math.random() < 0.03) spawnHeart();

  requestAnimationFrame(update);
}

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  catcher.x = Math.max(0, Math.min(canvas.width - catcher.width, x - catcher.width / 2));
});

function endGame() {
  gameRunning = false;
  const points = score;
  STORAGE.total = STORAGE.total + points;
  STORAGE.score = points;
  STORAGE.played = true;

  pointsDisplay.textContent = points;
  message.classList.remove("hidden");
}

startBtn.addEventListener("click", () => {
  startModal.close();
  gameRunning = true;
  update();
});
