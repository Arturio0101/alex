// показать количество очков
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

// список подарков
const gifts = [
  { name: "Massage-Gutschein 💆‍♀️", cost: 20 },
  { name: "Kuschelabend 🕯️", cost: 15 },
  { name: "Kinonacht 🍿", cost: 10 },
  { name: "Frühstück im Bett 🥐", cost: 25 },
  { name: "Überraschung 🎁", cost: 30 },
];

gifts.forEach(g => {
  const div = document.createElement("div");
  div.className = "gift";
  div.innerHTML = `<h3>${g.name}</h3><p>${g.cost} LP</p>`;
  div.addEventListener("click", () => openGift(g));
  giftList.appendChild(div);
});

function openGift(gift) {
  if (STORAGE.points < gift.cost) {
    giftText.innerHTML = `Du hast nur <strong>${STORAGE.points} LP</strong>.<br>Für <strong>${gift.name}</strong> brauchst du <strong>${gift.cost} LP</strong>.`;
    sendBtn.style.display = "none";
  } else {
    giftText.innerHTML = `Möchtest du <strong>${gift.name}</strong> auswählen?<br>(Kosten: ${gift.cost} LP)`;
    sendBtn.style.display = "inline-block";
    sendBtn.onclick = () => sendWhatsApp(gift);
  }
  confirmModal.showModal();
}

function sendWhatsApp(gift) {
  const text = encodeURIComponent(`💖 Ich möchte mein Geschenk einlösen: ${gift.name} (${gift.cost} LP)`);
  const phone = "4915112345678"; // ← сюда впиши свой номер без + (например 49 для Германии)
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
}

cancelBtn.addEventListener("click", () => confirmModal.close());
