let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");

let rawCSS = "";
let topBlocks = [];
let flatBlocks = [];
let testCommands = [];

SendButton.addEventListener("change", readSingleFile, false);

async function readSingleFile(evt) {
  const file = evt.target.files[0];
  await resetScore();
  if (file) {
    if (!file.name.toLowerCase().endsWith(".css")) {
      alert("Solo se aceptan archivos .css");
      evt.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = async function (e) {
      rawCSS = e.target.result;
      document.getElementById("codeInput").value = rawCSS;
      procesar();
      await runTests();
    };
    reader.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

document.getElementById("processCodeButton").addEventListener("click", async function () {
  await resetScore();
  rawCSS = document.getElementById("codeInput").value;
  if (rawCSS.trim()) {
    procesar();
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});

function procesar() {
  topBlocks = getTopBlocks(rawCSS);
  flatBlocks = topBlocks.filter((b) => !normalize(b.selectorRaw).startsWith("@media")).map((b) => normalize(b.selectorRaw) + "{" + normalize(b.bodyRaw) + "}");
}

async function runTests() {
  const testFactory = new TestFactory();
  testCommands = [
    testFactory.createTest("T1S1", 5, test_nav, 1),
    testFactory.createTest("T1S2", 5, test_nav, 2),

    testFactory.createTest("T2S1", 5, test_catalogo, 1),
    testFactory.createTest("T2S2", 5, test_catalogo, 2),

    testFactory.createTest("T3S1", 5, test_variables, 1),
    testFactory.createTest("T3S2", 5, test_variables, 2),

    testFactory.createTest("T4S1", 5, test_query_combinado, 1),
    testFactory.createTest("T4S2", 5, test_query_combinado, 2),

    testFactory.createTest("T5S1", 5, test_query_maxheight, 1),
    testFactory.createTest("T5S2", 5, test_query_maxheight, 2),

    testFactory.createTest("T6S1", 5, test_query_550, 1),
    testFactory.createTest("T6S2", 5, test_query_550, 2),

    testFactory.createTest("T7S1", 5, test_query_750, 1),
    testFactory.createTest("T7S2", 5, test_query_750, 2),

    testFactory.createTest("T8S1", 5, test_query_1000, 1),
    testFactory.createTest("T8S2", 5, test_query_1000, 2),

    testFactory.createTest("T9S1", 5, test_query_landscape, 1),
    testFactory.createTest("T9S2", 5, test_query_landscape, 2),

    testFactory.createTest("T10S1", 5, test_query_1500_550, 1),
    testFactory.createTest("T10S2", 5, test_query_1500_550, 2),
  ];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#region Flexbox base (fuera de cualquier media query)

const test_nav = (subtest) => {
  const nav = blocksFor(flatBlocks, ".sitio-header").join("");
  if (subtest === 1) {
    const ok = nav.includes("display:flex");
    if (!ok) sendErrorMessage("T1S1", "El contenedor del header/nav (.sitio-header) necesita display: flex desde la base, sin esperar a ningún media query.");
    return ok;
  }
  const ok = mediaBodies(["min-width:750px"]).some((b) => blocksFor(nestedFlatBlocks(b), ".sitio-header").join("").includes("flex-direction:row"));
  if (!ok) sendErrorMessage("T1S2", "Dentro del media query de escritorio (min-width: 750px), falta cambiar el main axis del nav de columna a fila (flex-direction: row).");
  return ok;
};

const test_catalogo = (subtest) => {
  const productos = blocksFor(flatBlocks, ".productos").join("");
  if (subtest === 1) {
    const ok = productos.includes("display:flex") && productos.includes("flex-wrap:wrap");
    if (!ok) sendErrorMessage("T2S1", "El contenedor del catálogo (.productos) necesita display: flex y flex-wrap: wrap.");
    return ok;
  }
  const producto = blocksFor(flatBlocks, ".producto").join("");
  const ok = (producto.includes("flex-basis:") && producto.includes("flex-grow:")) || (/(^|[^a-z-])flex:/.test(producto) && (producto.includes("%") || producto.includes("var(")));
  if (!ok) sendErrorMessage("T2S2", "Cada tarjeta (.producto) necesita flex-basis y flex-grow definidos (o el shorthand flex).");
  return ok;
};

//#endregion

//#region Custom properties

const test_variables = (subtest) => {
  if (subtest === 1) {
    const root = blocksFor(flatBlocks, ":root").join("");
    const matches = root.match(/--[a-z0-9-]+:/g) || [];
    const ok = matches.length >= 6;
    if (!ok) sendErrorMessage("T3S1", "Falta un bloque :root con al menos 6 variables (propiedades que empiecen con --).");
    return ok;
  }
  const hero = blocksFor(flatBlocks, ".hero").join("");
  const ok = hero.includes("background-color:var(") || hero.includes("background:var(");
  if (!ok) sendErrorMessage("T3S2", "El fondo de .hero debe usar una variable con var(--nombre) en vez de un color escrito directo.");
  return ok;
};

//#endregion

//#region Media queries

const test_query_combinado = (subtest) => {
  if (subtest === 1) {
    const bodies = mediaBodies(["min-width:150px", "max-width:699px"]);
    const ok = bodies.length > 0;
    if (!ok) sendErrorMessage("T4S1", "Falta escribir un media query con la condición (min-width: 150px) and (max-width: 699px).");
    return ok;
  }
  const boton = blocksFor(flatBlocks, ".producto .agregar").join("");
  const ok = boton.includes("cursor:pointer");
  if (!ok) sendErrorMessage("T4S2", "Al botón de agregar (.producto .agregar) le falta cursor: pointer, para que se vea que es clickeable.");
  return ok;
};

const test_query_maxheight = (subtest) => {
  const bodies = mediaBodies(["max-height:800px"]);
  if (subtest === 1) {
    const ok = bodies.length > 0;
    if (!ok) sendErrorMessage("T5S1", "Falta escribir un media query con la condición (max-height: 800px).");
    return ok;
  }
  const ok = bodies.some((b) => hasDeclaration(b));
  if (!ok) sendErrorMessage("T5S2", "Ese media query existe pero está vacío — agrégale un ajuste real para pantallas cortas.");
  return ok;
};

const test_query_550 = (subtest) => {
  const bodies = mediaBodies(["min-width:550px"]);
  if (subtest === 1) {
    const ok = bodies.length > 0;
    if (!ok) sendErrorMessage("T6S1", "Falta escribir un media query con la condición (min-width: 550px).");
    return ok;
  }
  const ok = bodies.some((b) => /--[a-z0-9-]+:/.test(b));
  if (!ok) sendErrorMessage("T6S2", "Ese media query existe pero no reasigna ninguna variable — falta cambiar el color de marca ahí adentro.");
  return ok;
};

const test_query_750 = (subtest) => {
  const bodies = mediaBodies(["min-width:750px"]);
  if (subtest === 1) {
    const ok = bodies.some((b) => blocksFor(nestedFlatBlocks(b), ".sitio-header").join("").includes("justify-content:space-between"));
    if (!ok) sendErrorMessage("T7S1", "Dentro de (min-width: 750px), ya en fila, falta separar el logo y los links a los extremos (justify-content: space-between).");
    return ok;
  }
  const ok = bodies.some((b) => b.includes(".producto") || b.includes("--columna") || b.includes("flex-basis") || /(^|[^a-z-])flex:/.test(b));
  if (!ok) sendErrorMessage("T7S2", "Dentro de (min-width: 750px), falta el cambio a 3 columnas en el catálogo (ya sea reasignando una variable o cambiando flex-basis).");
  return ok;
};

const test_query_1000 = (subtest) => {
  const bodies = mediaBodies(["min-width:1000px"]);
  if (subtest === 1) {
    const ok = /--tam-titulo-hero:/.test(bodies.join(""));
    if (!ok) sendErrorMessage("T8S1", "Dentro de (min-width: 1000px), falta reasignar una variable de :root para aumentar algún tamaño de fuente.");
    return ok;
  }
  const ok = bodies.some((b) => b.includes(".producto") || b.includes("--columna") || b.includes("flex-basis") || /(^|[^a-z-])flex:/.test(b));
  if (!ok) sendErrorMessage("T8S2", "Dentro de (min-width: 1000px), falta el cambio a 4 columnas en el catálogo.");
  return ok;
};

const test_query_landscape = (subtest) => {
  const bodies = mediaBodies(["orientation:landscape"]);
  if (subtest === 1) {
    const ok = bodies.length > 0;
    if (!ok) sendErrorMessage("T9S1", "Falta escribir un media query con la condición (orientation: landscape).");
    return ok;
  }
  const ok = bodies.some((b) => hasDeclaration(b));
  if (!ok) sendErrorMessage("T9S2", "Ese media query existe pero está vacío — agrégale un ajuste real para pantallas en horizontal.");
  return ok;
};

const test_query_1500_550 = (subtest) => {
  if (subtest === 1) {
    const bodies = mediaBodies(["min-width:1500px"]);
    const ok = bodies.some((b) => b.includes("background-image:") || b.includes("background:"));
    if (!ok) sendErrorMessage("T10S1", "Falta un media query (min-width: 1500px) que agregue una imagen de fondo.");
    return ok;
  }
  const bodies = mediaBodies(["max-width:550px"]);
  const ok = bodies.some((b) => b.includes("font-family:") || b.includes("font-size:"));
  if (!ok) sendErrorMessage("T10S2", "Falta un media query (max-width: 550px) que cambie la tipografía para pantallas chicas.");
  return ok;
};

//#endregion

//#region Test Factory & Command Pattern

class TestCommand {
  constructor(checkboxId, value, testFunc, subtest) {
    this.checkboxId = checkboxId;
    this.value = value;
    this.testFunc = testFunc;
    this.subtest = subtest;
  }

  async execute() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const label = document.querySelector(`#${this.checkboxId}`);
    const checkbox = label ? label.previousElementSibling : null;

    if (this.testFunc(this.subtest)) {
      if (checkbox) checkbox.checked = true;
      updateScore(this.value);
    }
  }
}

class TestFactory {
  createTest(checkboxId, value, testFunc, subtest = null) {
    return new TestCommand(checkboxId, value, testFunc, subtest);
  }
}

//#endregion

//#region Utilidades de CSS (respetan llaves anidadas de @media)

const normalize = (str) =>
  str
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

// Extrae bloques de NIVEL SUPERIOR contando llaves — un bloque @media conserva
// TODO su contenido anidado intacto en bodyRaw (a diferencia de un regex plano).
const getTopBlocks = (css) => {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const openIdx = css.indexOf("{", i);
    if (openIdx === -1) break;
    const selectorRaw = css.slice(i, openIdx);
    let depth = 1;
    let j = openIdx + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const bodyRaw = css.slice(openIdx + 1, j - 1);
    blocks.push({ selectorRaw, bodyRaw });
    i = j;
  }
  return blocks;
};

const blocksFor = (normalizedFlatBlocks, selectorName) => {
  const target = normalize(selectorName) + "{";
  return normalizedFlatBlocks.filter((b) => b.startsWith(target));
};

// Vuelve a extraer selectores individuales DENTRO de un cuerpo de @media
// ya obtenido con mediaBodies() — necesario cuando el check debe atarse
// a un selector específico (ej. .sitio-header) y no a "cualquier cosa
// dentro de este media query".
const nestedFlatBlocks = (mediaBodyNormalized) => {
  return getTopBlocks(mediaBodyNormalized).map((b) => normalize(b.selectorRaw) + "{" + normalize(b.bodyRaw) + "}");
};

// Regresa el cuerpo (normalizado, con anidación intacta) de cada @media cuya
// condición contenga TODAS las partes pedidas (ej. ["min-width:750px"]).
const mediaBodies = (conditionParts) => {
  const targets = conditionParts.map(normalize);
  return topBlocks
    .filter((b) => {
      const sel = normalize(b.selectorRaw);
      return sel.startsWith("@media") && targets.every((t) => sel.includes(t));
    })
    .map((b) => normalize(b.bodyRaw));
};

const sendErrorMessage = (elementId, message) => {
  const target = document.querySelector(`#${elementId}`);
  if (!target) return;
  let errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.style.color = "red";
  errorDiv.textContent = message;
  target.insertAdjacentElement("afterend", errorDiv);
};

// Verifica que haya una declaración CSS real (propiedad:valor;), no solo
// texto sobrante de un selector anidado vacío como ":root{}".
const hasDeclaration = (text) => /[a-z-]+:[^:{};]+;/.test(text);

//#endregion

//#region Barra de resultados

const updateScore = (newScore) => {
  const currentScore = Math.ceil(Number(score.textContent));
  const updatedScore = currentScore + newScore;
  score.textContent = updatedScore;
  barFill.style.width = updatedScore + "%";
};

async function resetScore() {
  score.textContent = "0";
  barFill.style.width = "0%";
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = true;
    checkbox.checked = false;
  });
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
}

//#endregion
