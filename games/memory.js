const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const pointsEl = document.getElementById("points");
const infoModal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoBtn");
const startGame = document.getElementById("startGame");
const message = document.getElementById("message");
const claimBtn = document.getElementById("claimBtn");
const pointsEarned = document.getElementById("pointsEarned");

const STORAGE = {
  get played() { return localStorage.getItem("memory_played") === "true"; },
  set played(v) { localStorage.setItem("memory_played", v ? "true" : "false"); },
  get points() { return +(localStorage.getItem("memory_points") || 0); },
  set points(v) { localStorage.setItem("memory_points", v); }
};

const EMOJIS = ["🐧", "🦉", "🦆", "🕊️", "🐦", "🦜"];
let cards = [];
let firstCard = null;
let moves = 0;
let found = 0;
let lockBoard = false; // 🔒 блокировка кликов во время проверки

// === Перемешивание ===
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// === Инициализация игры ===
function startGameBoard() {
  grid.innerHTML = "";
  const pairs = shuffle([...EMOJIS, ...EMOJIS]);
  cards = [];
  moves = 0;
  found = 0;
  firstCard = null;
  lockBoard = false;
  movesEl.textContent = "0";
  pointsEl.textContent = STORAGE.points;

    // Если уже играл — показываем Popup
  if (STORAGE.played) {
    const replayModal = document.getElementById("replayModal");
    const savedPoints = document.getElementById("savedPoints");
    const totalPoints = document.getElementById("totalPoints");

    // Текущие очки и общий счёт
    savedPoints.textContent = STORAGE.points;
    totalPoints.textContent = STORAGE.points;

    replayModal.showModal();
    return;
  }

  // Создание карточек
  pairs.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "card";
    const front = document.createElement("div");
    front.className = "card-inner card-front";
    front.textContent = emoji;
    const back = document.createElement("div");
    back.className = "card-inner card-back";
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", () => flipCard(card, emoji));
    grid.appendChild(card);
    cards.push(card);
  });
}

// === Переворот карт ===
function flipCard(card, value) {
  if (lockBoard) return; // ⛔ если идёт проверка — нельзя кликать
  if (card.classList.contains("flip") || card.classList.contains("locked")) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  // 🔒 блокируем доску до завершения проверки пары
  lockBoard = true;
  moves++;
  movesEl.textContent = moves;

  const val1 = firstCard.querySelector(".card-front").textContent;
  const val2 = value;

  if (val1 === val2) {
    firstCard.classList.add("locked");
    card.classList.add("locked");
    found++;
    firstCard = null;
    lockBoard = false; // ✅ разблокируем доску
    if (found === EMOJIS.length) win();
  } else {
    // ❌ если не совпали — переворачиваем обратно
    setTimeout(() => {
      firstCard.classList.remove("flip");
      card.classList.remove("flip");
      firstCard = null;
      lockBoard = false; // ✅ разблокируем после анимации
    }, 800);
  }
}

// === Победа ===
function win() {
  let reward = 0;
  if (moves <= 8) reward = 30;
  else if (moves <= 14) reward = 20;
  else if (moves <= 20) reward = 15;
  else if (moves <= 24) reward = 10;
  else reward = 5;

  STORAGE.points += reward;
  STORAGE.played = true;
  pointsEl.textContent = STORAGE.points;

  // Показываем сообщение
  pointsEarned.textContent = reward;
  message.classList.remove("hidden");
}

// === Слушатели ===
infoBtn.addEventListener("click", () => infoModal.showModal());
startGame.addEventListener("click", () => {
  infoModal.close();
  startGameBoard();
});
claimBtn.addEventListener("click", () => {
  message.classList.add("hidden");
  window.location.href = "https://arturio0101.github.io/alex/games/geschenk.html";
});

// === Запуск ===
document.addEventListener("DOMContentLoaded", () => {
  if (!STORAGE.played) infoModal.showModal();
  startGameBoard();
});

