const pointsDisplay = document.getElementById("pointsDisplay");
const giftList = document.getElementById("giftList");
const confirmModal = document.getElementById("confirmModal");
const giftText = document.getElementById("giftText");
const sendBtn = document.getElementById("sendBtn");
const cancelBtn = document.getElementById("cancelBtn");

const STORAGE = {
  get points() { return +(localStorage.getItem("memory_points") || 0); },
  get claimed() { return JSON.parse(localStorage.getItem("claimed_gifts") || "[]"); },
  saveClaimed(arr) { localStorage.setItem("claimed_gifts", JSON.stringify(arr)); }
};

pointsDisplay.textContent = STORAGE.points;

// 🎁 Geschenkeliste
const gifts = [
  { name: "Steam-Geschenkkarte 🎮", desc: "Gutschein für dein Lieblingsspiel auf Steam.", cost: 30, img: "https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg" },
  { name: "Romantisches Abendessen 🍷", desc: "Selbstgekochtes Menü mit Kerzenlicht.", cost: 25, img: "https://tse4.mm.bing.net/th/id/OIP.G5fbgK4fEI2rtk2B6XE6xQHaE8?pid=Api" },
  { name: "Frühstück im Bett 🥐", desc: "Kaffee, Croissants und Blumen am Morgen.", cost: 15, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { name: "The Lord Of The Rings LED Light Decoration 💡", desc: "Ein wunderschönes LED-Nachtlicht inspiriert von Mittelerde.", cost: 20, img: "images/lort2.jpg" },
  { name: "The Lord of The Rings – The Leaf of The Lorien 🍃", desc: "Das ikonische Elbenblatt – Symbol der Freundschaft der Gefährten.", cost: 30, img: "images/lort3.jpg" },
  { name: "Lord of the Rings Metal Wall Decor (LED) 🌟", desc: "Metall-Wandlampe mit leuchtendem Mittelerde-Design.", cost: 35, img: "images/sw1.jpg" },
  { name: "Harry Potter – Golden Snitch Light ✨", desc: "Eine magische Schreibtischlampe in Form des Goldenen Schnatzes.", cost: 25, img: "images/hp1.jpg" },
  { name: "The Lord Of The Rings – Mordor Torch 🔥", desc: "Ein leuchtendes Sammlerstück für wahre Fans von Mittelerde.", cost: 30, img: "images/lort4.jpg" }
];

// === Kartenanzeige ===
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

// === Pop-up Handler ===
function openGift(gift, card) {
  card.classList.toggle("flip");

  setTimeout(() => {
    if (STORAGE.points < gift.cost) {
      giftText.innerHTML = `Du hast nur <strong>${STORAGE.points} LP</strong>.<br>Für <strong>${gift.name}</strong> brauchst du <strong>${gift.cost} LP</strong>.`;
      sendBtn.style.display = "none";
    } else {
      giftText.innerHTML = `Möchtest du <strong>${gift.name}</strong> auswählen?<br>(Kosten: ${gift.cost} LP)`;
      sendBtn.style.display = "inline-block";
      sendBtn.onclick = () => {
        sendWhatsApp(gift);
        markGiftClaimed(gift, card);
      };
    }
    confirmModal.showModal();
  }, 600);
}

// === WhatsApp Zertifikat ===
function sendWhatsApp(gift) {
  const certUrl = `https://arturio0101.github.io/alex/certificate.html?gift=${encodeURIComponent(gift.name)}`;
  const text = encodeURIComponent(`💖 Ich habe ein Geschenk ausgewählt: ${gift.name}\n\n🎟️ Mein Zertifikat:\n${certUrl}`);
  const phone = "4915172386493";
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

// === Markierung als eingelöst ===
function markGiftClaimed(gift, card) {
  const claimed = STORAGE.claimed;
  if (!claimed.includes(gift.name)) {
    claimed.push(gift.name);
    STORAGE.saveClaimed(claimed);
    card.classList.add("claimed");
    card.querySelector(".card-front").insertAdjacentHTML("beforeend", `<div class="claimed-badge">🎁 Schon eingelöst</div>`);
  }
}

cancelBtn.addEventListener("click", () => confirmModal.close());
