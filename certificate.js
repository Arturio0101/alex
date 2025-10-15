(function () {
  const qs = new URLSearchParams(location.search);

  const name   = qs.get("name")   || "Любимая";
  const reward = qs.get("reward") || "Сюрприз от сердца";
  const points = qs.get("points") || "—";
  const code   = qs.get("code")   || "—";
  const date   = qs.get("date")   || new Date().toISOString().slice(0,10);
  const theme  = (qs.get("theme") || "neon").toLowerCase();
  const bg     = qs.get("bg"); // путь к вашему фото, например /images/us.jpg
  const note   = qs.get("note");

  // Тема
  document.documentElement.classList.add(`theme-${["elegant","neon","cozy"].includes(theme)?theme:"neon"}`);

  // Данные
  document.getElementById("recipient").textContent = name;
  document.getElementById("reward").textContent    = reward;
  document.getElementById("points").textContent    = points;
  document.getElementById("code").textContent      = code;
  document.getElementById("date").textContent      = date;
  if (note) document.getElementById("note").textContent = note;

  // Фон-фото
  if (bg){
    document.body.classList.add("has-bg");
    document.body.style.setProperty("--user-bg", `url("${bg}")`);
  }

  // Небольшая защита от случайных правок при печати
  window.addEventListener("beforeprint", () => {
    document.activeElement && document.activeElement.blur();
  });
})();
