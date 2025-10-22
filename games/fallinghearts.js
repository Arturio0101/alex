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
const infoModal = document.getElementById("infoModal");
const infoStartBtn = document.getElementById("infoStartBtn");

const STORAGE = {
  get total() { return +(localStorage.getItem("memory_points") || 0); },
  set total(v) { localStorage.setItem("memory_points", v); },
  get played() { return JSON.parse(localStorage.getItem("fallinghearts_played") || "false"); },
  set played(v) { localStorage.setItem("fallinghearts_played", JSON.stringify(v)); },
  get score() { return +(localStorage.getItem("fallinghearts_score") || 0); },
  set score(v) { localStorage.setItem("fallinghearts_score", v); }
};

// === Проверка: уже играл? ===
if (STORAGE.played) {
  gameSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  savedPoints.textContent = STORAGE.score;
  totalPoints.textContent = STORAGE.total;
} else {
  // Если играет впервые — сначала показать инфо-попап
  infoModal.showModal();
}

infoStartBtn.addEventListener("click", () => {
  infoModal.close();
  startModal.showModal();
});

let hearts = [];
let flashes = [];
let catcher = { x: 150, y: 350, width: 80, height: 20 };
let score = 0;
let misses = 0;
let gameRunning = false;
let spawnRate = 0.04; // вероятность появления нового сердца

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
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

// === Эффект вспышки ===
function createFlash(x, y) {
  flashes.push({ x, y, alpha: 1, textY: y });
}

function drawFlashes() {
  flashes.forEach((f, i) => {
    f.alpha -= 0.03;
    f.textY -= 1;
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = "#ff91f2";
    ctx.font = "bold 18px Inter";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff91f2";
    ctx.shadowBlur = 12;
    ctx.fillText("+1 💖", f.x, f.textY);
    ctx.restore();
    if (f.alpha <= 0) flashes.splice(i, 1);
  });
}

function spawnHeart() {
  const size = 15 + Math.random() * 5;
  const x = Math.random() * (canvas.width - size * 2) + size;
  const angle = (Math.random() - 0.5) * 0.3;
  hearts.push({
    x,
    y: -size,
    size,
    speed: 4 + Math.random() * 4, // быстрее
    angle,
    drift: Math.random() * Math.PI * 2
  });
}

function update() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Корзина
  ctx.fillStyle = "#ff5bd6";
  ctx.shadowColor = "#ff5bd6";
  ctx.shadowBlur = 20;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Обновляем сердца
  hearts.forEach((h, i) => {
    h.y += h.speed;
    h.drift += h.angle;
    h.x += Math.sin(h.drift) * 1.5;
    h.x = Math.max(h.size, Math.min(canvas.width - h.size, h.x)); // 🔹 не выходит за экран

    drawHeart(h.x, h.y, h.size, "#ff91f2");

    // Попадание
    if (
      h.y + h.size > catcher.y &&
      h.x > catcher.x &&
      h.x < catcher.x + catcher.width
    ) {
      createFlash(h.x, h.y);
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

  // Ускорение появления
  if (score > 50) spawnRate = 0.05;
  if (score > 100) spawnRate = 0.06;

  if (Math.random() < spawnRate) spawnHeart();
  drawFlashes();

  requestAnimationFrame(update);
}

// === Управление пальцем ===
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  catcher.x = Math.max(0, Math.min(canvas.width - catcher.width, x - catcher.width / 2));
});

function endGame() {
  gameRunning = false;

  // 🎯 Подсчёт очков
  let reward = 0;
  else if (score >= 150) reward = 30;
  if (score >= 100) reward = 25;
  else if (score >= 50) reward = 20;
  else if (score >= 25) reward = 15;
  else reward = 5;

  STORAGE.total = STORAGE.total + reward;
  STORAGE.score = reward;
  STORAGE.played = true;

  pointsDisplay.textContent = reward;
  message.classList.remove("hidden");
}

startBtn.addEventListener("click", () => {
  startModal.close();
  score = 0;
  misses = 0;
  hearts = [];
  gameRunning = true;
  update();
});

const claimBtn = document.getElementById("claimBtn");
claimBtn.addEventListener("click", () => {
  message.classList.add("hidden");
  window.location.href = "https://arturio0101.github.io/alex/games/geschenk.html";
});



