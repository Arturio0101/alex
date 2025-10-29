const params = new URLSearchParams(window.location.search);

const name = params.get("name") || "Geschenk";
const desc = params.get("desc") || "";
const img = params.get("img") || "";

// Подставляем данные в сертификат
const nameEl = document.getElementById("giftName");
const descEl = document.getElementById("giftDesc");
const imgEl  = document.getElementById("giftImage");

nameEl.textContent = name;
descEl.textContent = desc;
if (img) imgEl.src = img;

// Небольшая защита имени файла (убираем недопустимые символы в некоторых ОС)
function safeFileName(s) {
  return String(s).replace(/[\\/:*?"<>|]/g, "_").trim() || "certificate";
}

// После загрузки — создаём PNG и скачиваем
window.addEventListener("load", () => {
  const cert = document.getElementById("certificate");

  // даём время шрифтам/картинке отрисоваться
  setTimeout(() => {
    html2canvas(cert, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${safeFileName(name)}.png`;
      link.click();

      setTimeout(() => {
        alert("📸 Dein Zertifikat wurde als Bild gespeichert!\nDu kannst es jetzt über WhatsApp senden.");
      }, 300);
    });
  }, 800);
});
