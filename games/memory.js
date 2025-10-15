const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const pointsEl = document.getElementById("points");
const winModal = document.getElementById("winModal");
const infoModal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoBtn");
const startGame = document.getElementById("startGame");
const claimBtn = document.getElementById("claimBtn");
const playAgain = document.getElementById("playAgain");

localStorage.clear(); // тестовый сброс

const EMOJIS = ["❤️", "💻", "🌸", "🎮", "🚗", "🐱"];
let cards = [];
let firstCard = null;
let moves = 0;
let found = 0;
let points = 0;

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
  points += 15;
  pointsEl.textContent = points;
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
