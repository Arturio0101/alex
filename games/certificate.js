// 🎁 Geschenk-Datenbank (должна совпадать с geschenk.js)
const gifts = {
  "Steam-Geschenkkarte 🎮": {
    name: "Steam-Geschenkkarte 🎮",
    desc: "Gutschein für dein Lieblingsspiel auf Steam.",
    img: "https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg"
  },
  "Romantisches Abendessen 🍷": {
    name: "Romantisches Abendessen 🍷",
    desc: "Selbstgekochtes Menü mit Kerzenlicht.",
    img: "https://tse4.mm.bing.net/th/id/OIP.G5fbgK4fEI2rtk2B6XE6xQHaE8?pid=Api"
  },
  "Frühstück im Bett 🥐": {
    name: "Frühstück im Bett 🥐",
    desc: "Kaffee, Croissants und Blumen am Morgen.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  "The Lord Of The Rings LED Light Decoration 💡": {
  name: "The Lord Of The Rings LED Light Decoration 💡",
  desc: "Ein wunderschönes LED-Nachtlicht inspiriert von Mittelerde.",
  img: "https://cdn.pixabay.com/photo/2020/02/10/15/01/lamp-4838120_1280.jpg"
},
// === Neue Amazon Geschenke ===
"The Lord of The Rings – The Leaf of The Lorien 🍃": {
  name: "The Lord of The Rings – The Leaf of The Lorien 🍃",
  desc: "Das ikonische Elbenblatt – Symbol der Freundschaft der Gefährten.",
  img: "images/lort3.jpg",
  link: "https://www.amazon.com/-/de/dp/B0DL93KM3V/"
},

"Lord of the Rings Metal Wall Decor (LED) 🌟": {
  name: "Lord of the Rings Metal Wall Decor (LED) 🌟",
  desc: "Metall-Wandlampe mit leuchtendem Mittelerde-Design.",
  img: "images/sw1.jpg",
  link: "https://www.amazon.com/dp/B0BX4CVTVD/"
},

"Harry Potter – Golden Snitch Light ✨": {
  name: "Harry Potter – Golden Snitch Light ✨",
  desc: "Eine magische Schreibtischlampe in Form des Goldenen Schnatzes.",
  img: "images/hp1.jpg",
  link: "https://www.amazon.com/Harry-Potter-Golden-Snitch-Light/dp/B07B2Y1DZ6"
},

"The Lord Of The Rings – Mordor Torch 🔥": {
  name: "The Lord Of The Rings – Mordor Torch 🔥",
  desc: "Ein leuchtendes Sammlerstück für wahre Fans von Mittelerde.",
  img: "images/lort4.jpg",
  link: "https://www.amazon.com/-/de/dp/B0FKGVGC57/"
},

"The Lord Of The Rings LED Light Decoration 💡": {
  name: "The Lord Of The Rings LED Light Decoration 💡",
  desc: "Ein wunderschönes LED-Nachtlicht inspiriert von Mittelerde.",
  img: "images/lort2.jpg",
  link: "https://www.amazon.com/Lord-Rings-Power-Lamp-Batteries/dp/B0CDTSVGH5"
}
};

// Получаем параметр из URL
const urlParams = new URLSearchParams(window.location.search);
const giftName = decodeURIComponent(urlParams.get("gift"));

// Заполняем страницу
const gift = gifts[giftName];
if (gift) {
  document.getElementById("giftImage").src = gift.img;
  document.getElementById("giftName").textContent = gift.name;
  document.getElementById("giftDesc").textContent = gift.desc;
} else {
  document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:40vh;'>❌ Geschenk nicht gefunden</h1>";
}
