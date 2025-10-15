const params = new URLSearchParams(window.location.search);
const giftName = params.get("gift");

document.getElementById("giftName").textContent = giftName;
document.getElementById("giftDesc").textContent = "Ein besonderes Geschenk für dich 💝";

// Когда всё загрузится — можно конвертировать в картинку
setTimeout(() => {
  html2canvas(document.getElementById("certificate")).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imgData;
    a.download = `${giftName}.png`;
    a.click();
  });
}, 1000);
