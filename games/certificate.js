const params = new URLSearchParams(window.location.search);
const giftName = params.get("gift");

// Список всех подарков
const gifts = [
  { name: "Steam-Geschenkkarte 🎮", desc: "Gutschein für dein Lieblingsspiel auf Steam.", img: "https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg" },
  { name: "Romantisches Abendessen 🍷", desc: "Selbstgekochtes Menü mit Kerzenlicht.", img: "https://tse4.mm.bing.net/th/id/OIP.G5fbgK4fEI2rtk2B6XE6xQHaE8?pid=Api" },
  { name: "Frühstück im Bett 🥐", desc: "Kaffee, Croissants und Blumen am Morgen.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { name: "The Lord Of The Rings LED Light Decoration 💡", desc: "Ein wunderschönes LED-Nachtlicht inspiriert von Mittelerde.", img: "images/lort2.jpg" },
  { name: "The Lord of The Rings – The Leaf of The Lorien 🍃", desc: "Das ikonische Elbenblatt – Symbol der Freundschaft der Gefährten.", img: "images/lort3.jpg" },
  { name: "Lord of the Rings Metal Wall Decor (LED) 🌟", desc: "Metall-Wandlampe mit leuchtendem Mittelerde-Design.", img: "images/sw1.jpg" },
  { name: "Harry Potter – Golden Snitch Light ✨", desc: "Eine magische Schreibtischlampe in Form des Goldenen Schnatzes.", img: "images/hp1.jpg" },
  { name: "The Lord Of The Rings – Mordor Torch 🔥", desc: "Ein leuchtendes Sammlerstück für wahre Fans von Mittelerde.", img: "images/lort4.jpg" },
  { name: "Riesige Kuschel-Gans 🦢", desc: "Ein supersüßes, weiches Stofftier in Gänseform – perfekt zum Kuscheln.", img: "images/123.jpg" },
  { name: "Gewichtete Capybara-Plüschfigur 🦫", desc: "Ein niedliches, beruhigendes Stofftier mit Gewicht – ideal zum Entspannen.", img: "images/124.jpg" }
];

// Найти подарок по имени
const gift = gifts.find(g => g.name === giftName);

// Заполнить контент
if (gift) {
  document.getElementById("giftName").textContent = gift.name;
  document.getElementById("giftDesc").textContent = gift.desc;
  document.getElementById("giftImage").src = gift.img;
} else {
  document.getElementById("certificate").innerHTML = "<h2>❌ Geschenk nicht gefunden.</h2>";
}

// После загрузки изображения — создать PNG
window.addEventListener("load", () => {
  const cert = document.getElementById("certificate");
  setTimeout(() => {
    html2canvas(cert, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");

      // Создаём ссылку для скачивания
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${giftName || "certificate"}.png`;
      link.click();

      // Сообщение пользователю
      setTimeout(() => {
        alert("📸 Dein Zertifikat wurde als Bild gespeichert!\nDu kannst es jetzt über WhatsApp senden.");
      }, 400);
    });
  }, 1000);
});
