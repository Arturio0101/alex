const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const pointsEl = document.getElementById("points");
const winModal = document.getElementById("winModal");
const infoModal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoBtn");
const startGame = document.getElementById("startGame");
const claimBtn = document.getElementById("claimBtn");

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
  movesEl.textContent = "0";
  pointsEl.textContent = STORAGE.points;

  // Если уже играл — показываем сообщение
  if (STORAGE.played) {
    const msg = document.createElement("div");
    msg.id = "replayMsg";
    msg.innerHTML = `
      🎁 Du hast bereits gespielt!<br>
      Du hast <strong>${STORAGE.points}</strong> Punkte gesammelt.<br>
      <span class="small">✨ Versuch ein anderes Spiel!</span>
    `;
    document.body.appendChild(msg);

    msg.addEventListener("click", () => {
      window.location.href = "https://arturio0101.github.io/alex/index.html";
    });
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
  if (card.classList.contains("flip") || card.classList.contains("locked")) return;
  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
  } else {
    moves++;
    movesEl.textContent = moves;
    const val1 = firstCard.querySelector(".card-front").textContent;
    const val2 = value;

    if (val1 === val2) {
      firstCard.classList.add("locked");
      card.classList.add("locked");
      found++;
      firstCard = null;
      if (found === EMOJIS.length) win();
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flip");
        card.classList.remove("flip");
        firstCard = null;
      }, 800);
    }
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

  const modalText = winModal.querySelector("p");
  modalText.innerHTML = `Du hast alle Paare gefunden!<br>
    Belohnung: <strong>+${reward} Punkte</strong><br>
    <small>(${moves} Züge)</small>`;
  winModal.showModal();
}

// === Слушатели ===
infoBtn.addEventListener("click", () => infoModal.showModal());
startGame.addEventListener("click", () => {
  infoModal.close();
  startGameBoard();
});
claimBtn.addEventListener("click", () => {
  winModal.close();
  window.location.href = "https://arturio0101.github.io/alex/games/geschenk.html";
});

// === Запуск ===
document.addEventListener("DOMContentLoaded", () => {
  if (!STORAGE.played) {
    infoModal.showModal(); // показываем правила только если не играл
  }
  startGameBoard();
});
