const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
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
  get played() { return JSON.parse(localStorage.getItem("game2048_played") || "false"); },
  set played(v) { localStorage.setItem("game2048_played", JSON.stringify(v)); },
  get score() { return +(localStorage.getItem("game2048_score") || 0); },
  set score(v) { localStorage.setItem("game2048_score", v); }
};

// Проверяем — уже играли?
if (STORAGE.played) {
  gameSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  savedPoints.textContent = STORAGE.score;
  totalPoints.textContent = STORAGE.total;
} else {
  startModal.showModal();
}

let gridArray = [];
let score = 0;
const size = 4;

function init() {
  gridArray = Array(size).fill().map(() => Array(size).fill(0));
  addNumber();
  addNumber();
  drawGrid();
}

function addNumber() {
  const empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gridArray[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  gridArray[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function drawGrid() {
  grid.innerHTML = "";
  gridArray.forEach(row => {
    row.forEach(v => {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (v) cell.dataset.value = v;
      cell.textContent = v || "";
      grid.appendChild(cell);
    });
  });
  scoreDisplay.textContent = score;
}

function slide(row) {
  const filtered = row.filter(v => v);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const result = filtered.filter(v => v);
  while (result.length < size) result.push(0);
  return result;
}

function move(dir) {
  let old = JSON.stringify(gridArray);
  if (dir === "left") {
    gridArray = gridArray.map(slide);
  } else if (dir === "right") {
    gridArray = gridArray.map(r => slide(r.reverse()).reverse());
  } else if (dir === "up") {
    gridArray = rotate(rotate(rotate(gridArray)));
    gridArray = gridArray.map(slide);
    gridArray = rotate(gridArray);
  } else if (dir === "down") {
    gridArray = rotate(gridArray);
    gridArray = gridArray.map(slide);
    gridArray = rotate(rotate(rotate(gridArray)));
  }

  if (JSON.stringify(gridArray) !== old) {
    addNumber();
    drawGrid();
    checkGameOver();
  }
}

function rotate(mat) {
  return mat[0].map((_, i) => mat.map(row => row[i]).reverse());
}

function canMove() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r < size - 1 && gridArray[r][c] === gridArray[r + 1][c]) return true;
      if (c < size - 1 && gridArray[r][c] === gridArray[r][c + 1]) return true;
    }
  }
  return false;
}

function checkGameOver() {
  const maxTile = Math.max(...gridArray.flat());
  if (maxTile >= 2048) return endGame(maxTile);
  if (!gridArray.flat().includes(0) && !canMove()) endGame(maxTile);
}

function endGame(maxTile) {
  const points = Math.floor(maxTile / 10);
  STORAGE.total = STORAGE.total + points;
  STORAGE.score = points;
  STORAGE.played = true;

  pointsDisplay.textContent = points;
  message.classList.remove("hidden");
  document.removeEventListener("keydown", keyHandler);
  removeSwipe();
}

function keyHandler(e) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
    move(e.key.replace("Arrow", "").toLowerCase());
  }
}

// === Swipe Controls ===
let startX, startY;
function addSwipe() {
  document.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });
  document.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 40) move("right");
      else if (dx < -40) move("left");
    } else {
      if (dy > 40) move("down");
      else if (dy < -40) move("up");
    }
  });
}
function removeSwipe() {
  document.removeEventListener("touchstart", () => {});
  document.removeEventListener("touchend", () => {});
}

startBtn.addEventListener("click", () => {
  startModal.close();
  init();
  document.addEventListener("keydown", keyHandler);
  addSwipe();
});
