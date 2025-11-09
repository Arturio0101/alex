const pointsDisplay = document.getElementById("pointsDisplay");
const giftList = document.getElementById("giftList");
const confirmModal = document.getElementById("confirmModal");
const giftText = document.getElementById("giftText");
const sendBtn = document.getElementById("sendBtn");
const cancelBtn = document.getElementById("cancelBtn");

// --- КОНСТАНТЫ ХРАНИЛИЩА ---
const POINTS_KEY = "memory_points";
const CLAIMED_KEY = "claimed_gifts";

// --- ФУНКЦИИ РАБОТЫ СО STORAGE (надёжные) ---
function readPoints() {
  const raw = localStorage.getItem(POINTS_KEY);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function writePoints(v) {
  const safe = Math.max(0, Math.floor(Number(v) || 0));
  localStorage.setItem(POINTS_KEY, String(safe));
  return safe;
}
function readClaimed() {
  try {
    const arr = JSON.parse(localStorage.getItem(CLAIMED_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeClaimed(arr) {
  localStorage.setItem(CLAIMED_KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
}

// --- ОБЁРТКА ДЛЯ ЕДИНОГО ИСТОЧНИКА ИСТИНЫ ---
const STORAGE = {
  get points() { return readPoints(); },
  set points(v) { writePoints(v); },
  get claimed() { return readClaimed(); },
  saveClaimed(arr) { writeClaimed(arr); }
};

// --- РЕНДЕР ТЕКУЩИХ ОЧКОВ (без перезаписи в localStorage) ---
function renderPoints() {
  pointsDisplay.textContent = STORAGE.points;
}
renderPoints(); // при первом заходе

// --- СИНХРОНИЗАЦИЯ ПРИ ВОЗВРАТЕ СО СТРАНИЦЫ (bfcache) И МЕЖДУ ВКЛАДКАМИ ---
window.addEventListener("pageshow", () => renderPoints());          // возврат «назад»
document.addEventListener("visibilitychange", () => {               // переключение вкладок
  if (document.visibilityState === "visible") renderPoints();
});
window.addEventListener("storage", (e) => {                         // внешние изменения
  if (e.key === POINTS_KEY) renderPoints();
});

// === Список подарков ===
const gifts = [
  { name: "Steam-Geschenkkarte 🎮", desc: "Gutschein für dein Lieblingsspiel auf Steam.", cost: 35, img: "https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg" },
  { name: "Romantisches Abendessen 🍷", desc: "Selbstgekochtes Menü mit Kerzenlicht.", cost: 45, img: "https://tse4.mm.bing.net/th/id/OIP.G5fbgK4fEI2rtk2B6XE6xQHaE8?pid=Api" },
  { name: "Frühstück im Bett 🥐", desc: "Kaffee, Croissants und Blumen am Morgen.", cost: 30, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { name: "The Lord Of The Rings LED Light Decoration 💡", desc: "Ein wunderschönes LED-Nachtlicht inspiriert von Mittelerde.", cost: 70, img: "images/lort2.jpg" },
  { name: "The Lord of The Rings – The Leaf of The Lorien 🍃", desc: "Das ikonische Elbenblatt – Symbol der Freundschaft der Gefährten.", cost: 20, img: "images/lort3.jpg" },
  { name: "Lord of the Rings Metal Wall Decor (LED) 🌟", desc: "Metall-Wandlampe mit leuchtendem Mittelerde-Design.", cost: 45, img: "images/sw1.jpg" },
  { name: "Harry Potter – Golden Snitch Light ✨", desc: "Eine magische Schreibtischlampe in Form des Goldenen Schnatzes.", cost: 50, img: "images/hp1.jpg" },
  { name: "The Lord Of The Rings – Mordor Torch 🔥", desc: "Ein leuchtendes Sammlerstück für wahre Fans von Mittelerde.", cost: 35, img: "images/lort4.jpg" },
  { name: "Riesige Kuschel-Gans 🦢", desc: "Ein supersüßes, weiches Stofftier in Gänseform – perfekt zum Kuscheln.", cost: 40, img: "images/123.jpg" },
  { name: "Gewichtete Capybara-Plüschfigur 🦫", desc: "Ein niedliches, beruhigendes Stofftier mit Gewicht – ideal zum Entspannen.", cost: 45, img: "images/124.jpg" },
  { name: "Lord of the Rings – LED Wandlicht 💍", desc: "Ein stilvolles LED-Wandlicht inspiriert vom Einen Ring – perfekt für Fans.", cost: 60, img: "images/lort5.jpg" },
  { name: "Lord of the Rings – Premium Kissen ✨", desc: "Ein weiches, hochwertiges Kissen mit LOTR-Design – ideal zum Entspannen.", cost: 35, img: "images/lort6.jpg" },
  { name: "Immersive VR-Erlebnis 🎮🕶️", desc: "Ein spannender Besuch im VR-Club – taucht gemeinsam in fantastische Welten ein.", cost: 60, img: "images/lort7.jpg" }
];

// === Показать подарки ===
gifts.forEach(g => {
  const claimed = STORAGE.claimed.includes(g.name);
  const card = document.createElement("div");
  card.className = `card ${claimed ? "claimed" : ""}`;

  const img = new Image();
  img.src = g.img;
  img.onload = () => {
    const isPortrait = img.height > img.width;
    const imgClass = isPortrait ? "portrait" : "";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${g.img}" alt="${g.name}" class="${imgClass}">
          <div class="card-info">
            <span class="gift-name">${g.name}</span>
            <span class="price-tag">${g.cost} LP</span>
          </div>
          ${claimed ? `<div class="claimed-badge">🎁 Schon eingelöst</div>` : ""}
        </div>
        <div class="card-back">
          <h3>${g.name}</h3>
          <p>${g.desc}</p>
          <span class="price-tag back">${g.cost} LP</span>
        </div>
      </div>
    `;
    if (!claimed) card.addEventListener("click", () => openGift(g, card));
    giftList.appendChild(card);
  };
});

// === Обработчик выбора подарка ===
function openGift(gift, card) {
  card.classList.toggle("flip");

  setTimeout(() => {
    const currentPoints = STORAGE.points; // читаем актуально с LS
    if (currentPoints < gift.cost) {
      giftText.innerHTML = `Du hast nur <strong>${currentPoints} LP</strong>.<br>Für <strong>${gift.name}</strong> brauchst du <strong>${gift.cost} LP</strong>.`;
      sendBtn.style.display = "none";
    } else {
      giftText.innerHTML = `Möchtest du <strong>${gift.name}</strong> auswählen?<br>(Kosten: ${gift.cost} LP)`;
      sendBtn.style.display = "inline-block";
      sendBtn.onclick = () => {
        // 💖 Списываем очки (только через writePoints, без ручных setItem)
        const updated = writePoints(currentPoints - gift.cost);
        pointsDisplay.textContent = updated;

        // Отправляем сертификат
        sendWhatsApp(gift);

        // Отмечаем подарок как использованный
        markGiftClaimed(gift, card);

        confirmModal.close();
      };
    }
    confirmModal.showModal();
  }, 600);
}

// === WhatsApp сертификат (передаём все данные прямо в URL) ===
function sendWhatsApp(gift) {
  const certUrl =
    `https://arturio0101.github.io/alex/certificate.html?` +
    `name=${encodeURIComponent(gift.name)}` +
    `&desc=${encodeURIComponent(gift.desc)}` +
    `&img=${encodeURIComponent(gift.img)}`;

  const text = encodeURIComponent(`💖 Ich habe ein Geschenk ausgewählt: ${gift.name}\n\n🎟️ Mein Zertifikat:\n${certUrl}`);
  const phone = "4915172386493";
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

// === Отметить подарок как полученный ===
function markGiftClaimed(gift, card) {
  const claimed = STORAGE.claimed;
  if (!claimed.includes(gift.name)) {
    claimed.push(gift.name);
    STORAGE.saveClaimed(claimed);
    card.classList.add("claimed");
    card.querySelector(".card-front").insertAdjacentHTML(
      "beforeend",
      `<div class="claimed-badge">🎁 Schon eingelöst</div>`
    );
  }
}

cancelBtn.addEventListener("click", () => confirmModal.close());



