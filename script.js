const touchArea = document.getElementById("touch-area");
const counter = document.getElementById("counter");

let clickCount = 0;

// Paleta exactas de 5 colores (del 1 al 5)
const colors = [
  { bg: "#f0f3f8", text: "#2c3e50" }, // 0
  { bg: "#ff7675", text: "#ffffff" }, // 1 toque/clic
  { bg: "#74b9ff", text: "#ffffff" }, // 2 toques/clics
  { bg: "#55efc4", text: "#2d3436" }, // 3 toques/clics
  { bg: "#a29bfe", text: "#ffffff" }, // 4 toques/clics
  { bg: "#fdcb6e", text: "#2d3436" }  // 5 toques/clics (máximo)
];

function updateDisplay(count) {
  // Limitamos el contador para que no pase de 5
  const limitedCount = Math.min(count, 5);
  
  counter.textContent = limitedCount;
  const colorScheme = colors[limitedCount];
  touchArea.style.backgroundColor = colorScheme.bg;
  touchArea.style.color = colorScheme.text;
}

// Pantallas táctiles (hasta 5 dedos)
touchArea.addEventListener("touchstart", (event) => {
  event.preventDefault();
  updateDisplay(event.touches.length);
}, { passive: false });

touchArea.addEventListener("touchend", (event) => {
  updateDisplay(event.touches.length);
});

// Clics en el computador (suma de 1 en 1 hasta llegar a 5 y se reinicia con clic derecho)
touchArea.addEventListener("click", () => {
  clickCount++;
  if (clickCount > 5) {
    clickCount = 1; // O puedes dejarlo en 5 si prefieres que se quede trabado ahí
  }
  updateDisplay(clickCount);
});

touchArea.addEventListener("contextmenu", (event) => {
  event.preventDefault(); // Clic derecho reinicia a 0
  clickCount = 0;
  updateDisplay(clickCount);
});