const pointsDisplay = document.getElementById("pointsDisplay");
const giftList = document.getElementById("giftList");
const confirmModal = document.getElementById("confirmModal");
const giftText = document.getElementById("giftText");
const sendBtn = document.getElementById("sendBtn");
const cancelBtn = document.getElementById("cancelBtn");

const STORAGE = {
  get points() { return +(localStorage.getItem("memory_points") || 0); }
};

pointsDisplay.textContent = STORAGE.points;

// === список подарков ===
const gifts = [
  { name: "Steam-Geschenkkarte 🎮", desc: "Gutschein für dein Lieblingsspiel auf Steam.", cost: 30, img: "https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg" },
  { name: "Wellnessabend 🕯️", desc: "Entspannung mit Kerzen, Musik und Massage.", cost: 20, img: "https://images.unsplash.com/photo-1556228578-0930502599a4?auto=format&fit=crop&w=600&q=80" },
  { name: "Romantisches Abendessen 🍷", desc: "Selbstgekochtes Menü mit Kerzenlicht.", cost: 25, img: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80" },
  { name: "Frühstück im Bett 🥐", desc: "Kaffee, Croissants und Blumen am Morgen.", cost: 15, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { name: "Kreativer Tag 🎨", desc: "Zusammen malen, basteln oder was Neues lernen.", cost: 10, img: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=600&q=80" },
  { name: "Überraschung 💖", desc: "Lass dich überraschen – es könnte alles sein!", cost: 35, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" },
];

// === отображаем карточки ===
gifts.forEach(g => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="${g.img}" alt="${g.name}">
      </div>
      <div class="card-back">
        <h3>${g.name}</h3>
        <p>${g.desc}</p>
        <p>${g.cost} LP</p>
      </div>
    </div>
  `;
  card.addEventListener("click", () => openGift(g, card));
  giftList.appendChild(card);
});

function openGift(gift, card) {
  card.classList.toggle("flip");

  setTimeout(() => {
    if (STORAGE.points < gift.cost) {
      giftText.innerHTML = `Du hast nur <strong>${STORAGE.points} LP</strong>.<br>Für <strong>${gift.name}</strong> brauchst du <strong>${gift.cost} LP</strong>.`;
      sendBtn.style.display = "none";
    } else {
      giftText.innerHTML = `Möchtest du <strong>${gift.name}</strong> auswählen?<br>(Kosten: ${gift.cost} LP)`;
      sendBtn.style.display = "inline-block";
      sendBtn.onclick = () => sendWhatsApp(gift);
    }
    confirmModal.showModal();
  }, 700);
}

function sendWhatsApp(gift) {
  const text = encodeURIComponent(`💖 Ich möchte mein Geschenk einlösen: ${gift.name} (${gift.cost} LP)`);
  const phone = "4915112345678"; // <- замени на свой номер без +
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

cancelBtn.addEventListener("click", () => confirmModal.close());
