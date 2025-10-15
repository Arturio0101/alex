const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
const pointsDisplay = document.getElementById("pointsEarned");
const savedPoints = document.getElementById("savedPoints");
const totalPointsDisplay = document.getElementById("totalPoints");
const timerDisplay = document.getElementById("timer");
const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startBtn");
const gameSection = document.getElementById("gameSection");
const resultSection = document.getElementById("resultSection");

let timer = 0;
let timerInterval = null;
let started = false;

const STORAGE = {
  get total() { return +(localStorage.getItem("memory_points") || 0); },
  set total(val) { localStorage.setItem("memory_points", val); },
  get bridgesPlayed() { return JSON.parse(localStorage.getItem("bridges_played") || "false"); },
  set bridgesPlayed(val) { localStorage.setItem("bridges_played", JSON.stringify(val)); },
  get bridgesScore() { return +(localStorage.getItem("bridges_score") || 0); },
  set bridgesScore(val) { localStorage.setItem("bridges_score", val); }
};

// === Если уже играл ===
if (STORAGE.bridgesPlayed) {
  gameSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  savedPoints.textContent = STORAGE.bridgesScore;
  totalPointsDisplay.textContent = STORAGE.total;
} else {
  startModal.showModal();
}

// === 9 Inseln (3x3) ===
const islands = [];
let selected = null;
const offset = 50;
const spacing = 120;

// Сгенерировать сетку 3x3
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    islands.push({
      id: row * 3 + col + 1,
      x: offset + col * spacing,
      y: offset + row * spacing,
      links: []
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Мосты
  islands.forEach(a => {
    a.links.forEach(bid => {
      const b = islands.find(i => i.id === bid);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "#7a8cff";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#7a8cff";
      ctx.shadowBlur = 12;
      ctx.stroke();
    });
  });

  // Острова
  islands.forEach(i => {
    ctx.beginPath();
    ctx.arc(i.x, i.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = selected === i ? "#ff5bd6" : "#eef1ff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff5bd6";
    ctx.shadowColor = "#ff5bd6";
    ctx.shadowBlur = 8;
    ctx.stroke();
  });
}

function getIslandAt(x, y) {
  return islands.find(i => Math.hypot(i.x - x, i.y - y) < 22);
}

canvas.addEventListener("click", e => {
  if (!started) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const hit = getIslandAt(x, y);
  if (!hit) return;

  if (!selected) {
    selected = hit;
  } else if (selected && hit !== selected) {
    if (canConnect(selected, hit)) {
      toggleLink(selected, hit);
      flashLine(selected, hit);
    }
    selected = null;
  } else {
    selected = null;
  }

  draw();
  checkWin();
});

function canConnect(a, b) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (dx > spacing + 10 || dy > spacing + 10) return false;
  return !intersectsExisting(a, b);
}

function intersectsExisting(a, b) {
  for (const i of islands) {
    for (const lid of i.links) {
      const j = islands.find(n => n.id === lid);
      if (i.id < j.id && segmentsIntersect(a, b, i, j)) return true;
    }
  }
  return false;
}

function segmentsIntersect(p1, p2, p3, p4) {
  function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

function toggleLink(a, b) {
  if (a.links.includes(b.id)) {
    a.links = a.links.filter(l => l !== b.id);
    b.links = b.links.filter(l => l !== a.id);
  } else {
    a.links.push(b.id);
    b.links.push(a.id);
  }
}

function flashLine(a, b) {
  let opacity = 1;
  const interval = setInterval(() => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
    ctx.lineWidth = 8;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 20;
    ctx.stroke();
    opacity -= 0.2;
    if (opacity <= 0) {
      clearInterval(interval);
      draw();
    }
  }, 40);
}

function checkWin() {
  const connected = islands.every(i => i.links.length > 0);
  if (connected) winGame();
}

function winGame() {
  clearInterval(timerInterval);
  const points = Math.max(10, 50 - timer);
  pointsDisplay.textContent = points;

  STORAGE.total = STORAGE.total + points;
  STORAGE.bridgesScore = points;
  STORAGE.bridgesPlayed = true;

  message.classList.remove("hidden");
  started = false;
}

function startGame() {
  started = true;
  startModal.close();
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
  draw();
}

startBtn.addEventListener("click", startGame);
draw();

document.addEventListener("DOMContentLoaded", () => {
  const claimBtn = document.getElementById("claimBtn");
  if (claimBtn) {
    claimBtn.addEventListener("click", () => {
      message.classList.add("hidden");
      window.location.href = "https://arturio0101.github.io/alex/games/geschenk.html";
    });
  }
});

