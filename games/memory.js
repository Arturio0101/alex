const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const pointsEl = document.getElementById("points");
const winModal = document.getElementById("winModal");
const infoModal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoBtn");
const startGame = document.getElementById("startGame");
const claimBtn = document.getElementById("claimBtn");
const playAgain = document.getElementById("playAgain");

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

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function start() {
  grid.innerHTML = "";
  const pairs = shuffle([...EMOJIS, ...EMOJIS]);
  cards = [];
  moves = 0;
  found = 0;
  movesEl.textContent = "0";
  pointsEl.textContent = STORAGE.points;

  // Если уже играли — показать сообщение
  if (STORAGE.played) {
    const msg = document.createElement("div");
    msg.id = "replayMsg";
    msg.textContent = "🎁 Du hast alle Punkte erhalten! Danke fürs Spielen 💖";
    grid.appendChild(msg);
    return;
  }

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
      if (found === EMOJIS.length) win();
      firstCard = null;
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flip");
        card.classList.remove("flip");
        firstCard = null;
      }, 800);
    }
  }
}

function win() {
  let reward = 0;

  if (moves <= 10) reward = 30;
  else if (moves <= 16) reward = 20;
  else if (moves <= 25) reward = 15;
  else if (moves <= 35) reward = 10;
  else reward = 5;

  STORAGE.points += reward;
  STORAGE.played = true;
  pointsEl.textContent = STORAGE.points;

  const modalText = winModal.querySelector("p");
  modalText.innerHTML = `Du hast alle Paare gefunden!<br>Belohnung: <strong>+${reward} Punkte</strong><br><small>(${moves} Züge)</small>`;
  winModal.showModal();
}

claimBtn.addEventListener("click", () => winModal.close());
playAgain.addEventListener("click", () => {
  winModal.close();
  start();
});

infoBtn.addEventListener("click", () => infoModal.showModal());
startGame.addEventListener("click", () => infoModal.close());

start();
infoModal.showModal();
