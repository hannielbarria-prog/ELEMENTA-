const combinations = {
  "H-O": {
    name: "Agua",
    formula: "H₂O",
    description: "El agua es un compuesto formado por hidrógeno y oxígeno.",
    points: 10
  },
  "C-O": {
    name: "Dióxido de carbono",
    formula: "CO₂",
    description: "El dióxido de carbono contiene carbono y oxígeno.",
    points: 10
  },
  "Fe-O": {
    name: "Óxido de hierro",
    formula: "FeₓOᵧ",
    description: "Los óxidos de hierro se forman cuando el hierro reacciona con oxígeno.",
    points: 15
  },
  "Cu-O": {
    name: "Óxido de cobre",
    formula: "CuO",
    description: "El cobre puede formar óxidos al reaccionar con oxígeno.",
    points: 15
  },
  "Na-Cl": {
    name: "Cloruro de sodio",
    formula: "NaCl",
    description: "Es la sal común, formada por sodio y cloro.",
    points: 20
  },
  "Ca-O": {
    name: "Óxido de calcio",
    formula: "CaO",
    description: "El óxido de calcio se obtiene de la combinación del calcio con oxígeno.",
    points: 20
  },
  "C-H": {
    name: "Hidrocarburo",
    formula: "CₓHᵧ",
    description: "Los hidrocarburos están formados por carbono e hidrógeno.",
    points: 10
  },
  "H-N": {
    name: "Amoníaco",
    formula: "NH₃",
    description: "El amoníaco está formado por nitrógeno e hidrógeno.",
    points: 20
  },
  "N-H": {
    name: "Amoníaco",
    formula: "NH₃",
    description: "El amoníaco está formado por nitrógeno e hidrógeno.",
    points: 20
  },
  "Si-O": {
    name: "Dióxido de silicio",
    formula: "SiO₂",
    description: "El dióxido de silicio está presente en materiales como el vidrio.",
    points: 20
  },
  "O-Si": {
    name: "Dióxido de silicio",
    formula: "SiO₂",
    description: "El dióxido de silicio está presente en materiales como el vidrio.",
    points: 20
  },
  "C-Si": {
    name: "Carburo de silicio",
    formula: "SiC",
    description: "El carburo de silicio es un material formado por silicio y carbono.",
    points: 25
  },
  "Si-C": {
    name: "Carburo de silicio",
    formula: "SiC",
    description: "El carburo de silicio es un material formado por silicio y carbono.",
    points: 25
  }
};

const materials = [
  { symbol: "H", name: "Hidrógeno" },
  { symbol: "O", name: "Oxígeno" },
  { symbol: "C", name: "Carbono" },
  { symbol: "Fe", name: "Hierro" },
  { symbol: "Cu", name: "Cobre" },
  { symbol: "Si", name: "Silicio" },
  { symbol: "Cl", name: "Cloro" },
  { symbol: "Na", name: "Sodio" },
  { symbol: "Ca", name: "Calcio" },
  { symbol: "N", name: "Nitrógeno" }
];

let selected = [];
let score = Number(localStorage.getItem("elementaScore") || 0);
let discovered = JSON.parse(
  localStorage.getItem("elementaDiscovered") || "[]"
);

const $ = id => document.getElementById(id);


/* =========================
   NAVEGACIÓN
========================= */

function startGame() {
  const home = $("home");
  const game = $("game");

  if (home) home.classList.remove("active");
  if (game) game.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showHome() {
  const home = $("home");
  const game = $("game");

  if (game) game.classList.remove("active");
  if (home) home.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   PUNTUACIÓN
========================= */

function updateScore() {
  if ($("score")) {
    $("score").textContent = score;
  }

  if ($("foundText")) {
    $("foundText").textContent = `${discovered.length} / 10`;
  }

  if ($("progress")) {
    $("progress").style.width =
      `${Math.min(discovered.length / 10 * 100, 100)}%`;
  }

  localStorage.setItem("elementaScore", score);
  localStorage.setItem(
    "elementaDiscovered",
    JSON.stringify(discovered)
  );
}


/* =========================
   COLECCIÓN
========================= */

function renderCollection() {
  const collection = $("collection");

  if (!collection) return;

  if (discovered.length === 0) {
    collection.innerHTML =
      "<p>Aún no has descubierto combinaciones.</p>";
    return;
  }

  collection.innerHTML = discovered
    .map(
      item => `
        <div class="collection-item">
          <strong>${item.name}</strong>
          <span>${item.formula}</span>
        </div>
      `
    )
    .join("");
}


/* =========================
   RESULTADOS
========================= */

function showResult(message, type = "") {
  const result = $("result");

  if (!result) return;

  result.className = `result ${type}`;
  result.innerHTML = message;
}


/* =========================
   SELECCIÓN DE MATERIALES
========================= */

function selectMaterial(symbol) {

  if (selected.length >= 2) {
    showResult(
      "Ya seleccionaste dos materiales. Pulsa Limpiar selección para elegir otros.",
      "warning"
    );
    return;
  }

  selected.push(symbol);

  const slot = $(`slot${selected.length}`);

  if (slot) {
    slot.textContent = symbol;
  }

  const card = document.querySelector(
    `[data-symbol="${symbol}"]`
  );

  if (card) {
    card.classList.add("selected");
  }

  updateCombineButton();
}


function updateCombineButton() {
  const button = $("combineBtn");

  if (!button) return;

  button.disabled = selected.length !== 2;
}


/* =========================
   LIMPIAR
========================= */

function clearSelection() {

  selected = [];

  document
    .querySelectorAll(".material-card.selected")
    .forEach(card => {
      card.classList.remove("selected");
    });

  if ($("slot1")) {
    $("slot1").textContent = "+";
  }

  if ($("slot2")) {
    $("slot2").textContent = "+";
  }

  updateCombineButton();

  showResult(
    "Selecciona dos materiales para comenzar."
  );
}


/* =========================
   COMBINAR
========================= */

function combine() {

  if (selected.length !== 2) {
    showResult(
      "Selecciona dos materiales antes de combinar.",
      "warning"
    );
    return;
  }

  const key = `${selected[0]}-${selected[1]}`;
  const result = combinations[key];

  if (!result) {

    showResult(
      `<strong>Combinación no disponible</strong><br>
       No tenemos una combinación registrada para
       ${selected[0]} + ${selected[1]}.<br>
       ¡Prueba con otros materiales!`,
      "error"
    );

    return;
  }

  const alreadyFound = discovered.some(
    item => item.name === result.name
  );

  if (!alreadyFound) {

    discovered.push({
      name: result.name,
      formula: result.formula
    });

    score += result.points;
  }

  showResult(
    `<strong>${result.name}</strong><br>
     <span class="formula">${result.formula}</span><br>
     ${result.description}<br>
     <small>
       ${alreadyFound
         ? "Ya descubierto."
         : `+${result.points} puntos`}
     </small>`,
    "success"
  );

  updateScore();
  renderCollection();
}


/* =========================
   MATERIALES
========================= */

function renderMaterials() {

  const container = $("materials");

  if (!container) return;

  container.innerHTML = materials
    .map(
      material => `
        <button
          class="material-card"
          data-symbol="${material.symbol}"
          type="button"
        >
          <span class="symbol">
            ${material.symbol}
          </span>

          <span class="material-name">
            ${material.name}
          </span>
        </button>
      `
    )
    .join("");

  container
    .querySelectorAll(".material-card")
    .forEach(card => {

      card.addEventListener(
        "click",
        () => selectMaterial(card.dataset.symbol)
      );

    });
}


/* =========================
   INICIO
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderMaterials();
    updateScore();
    renderCollection();
    updateCombineButton();

    const combineButton = $("combineBtn");

    if (combineButton) {
      combineButton.addEventListener(
        "click",
        combine
      );
    }

  }
);
