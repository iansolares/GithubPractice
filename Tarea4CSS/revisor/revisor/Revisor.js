let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");

let CSScontent = "";
let normalizedBlocks = [];
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
      CSScontent = e.target.result;
      document.getElementById("codeInput").value = CSScontent;
      normalizedBlocks = formatSelectors(getAllSelectors(CSScontent));

      await runTests();
    };
    reader.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

document.getElementById("processCodeButton").addEventListener("click", async function () {
  await resetScore();
  CSScontent = document.getElementById("codeInput").value;
  if (CSScontent.trim()) {
    normalizedBlocks = formatSelectors(getAllSelectors(CSScontent));
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});

async function runTests() {
  const testFactory = new TestFactory(normalizedBlocks);
  testCommands = [
    // ===== COLORES Y TEXTO (Clase 5) =====
    testFactory.createTest("T1S1", 5, test_global),

    testFactory.createTest("T2S1", 5, test_h1, 1),
    testFactory.createTest("T2S2", 5, test_h1, 2),

    testFactory.createTest("T3S1", 5, test_ofertas_alpha),

    testFactory.createTest("T4S1", 5, test_destacado),

    testFactory.createTest("T5S1", 5, test_listas, 1),
    testFactory.createTest("T5S2", 5, test_listas, 2),

    // ===== SELECTORES Y PSEUDO (Clase 6) =====
    testFactory.createTest("T6S1", 5, test_nav_a, 1),
    testFactory.createTest("T6S2", 5, test_nav_a, 2),

    testFactory.createTest("T7S1", 10, test_attribute_selector),

    testFactory.createTest("T8S1", 5, test_combinators, 1),
    testFactory.createTest("T8S2", 5, test_combinators, 2),
    testFactory.createTest("T8S3", 5, test_combinators, 3),

    testFactory.createTest("T9S1", 5, test_pseudoclases, 1),
    testFactory.createTest("T9S2", 5, test_pseudoclases, 2),
    testFactory.createTest("T9S3", 5, test_pseudoclases, 3),
    testFactory.createTest("T9S4", 5, test_pseudoclases, 4),

    testFactory.createTest("T10S1", 5, test_pseudoelementos, 1),
    testFactory.createTest("T10S2", 5, test_pseudoelementos, 2),
  ];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#region Pruebas de colores y texto

const test_global = (blocks) => {
  const candidates = ["html", "body", "*"].flatMap((sel) => blocksFor(blocks, sel));
  const found = candidates.some((b) => b.includes(normalize("font-family: Arial, Helvetica, sans-serif")));
  if (!found) {
    sendErrorMessage("T1S1", "Falta definir una tipografía general para toda la página (Arial, Helvetica o una fuente sans-serif) en html, body o *.");
  }
  return found;
};

const test_h1 = (blocks, subtest) => {
  const h1 = blocksFor(blocks, "h1");
  const combined = h1.join("");
  if (h1.length === 0) {
    sendErrorMessage("T2S" + subtest, "No se encontró ningún estilo para el encabezado principal (h1).");
    return false;
  }
  switch (subtest) {
    case 1: {
      const ok = combined.includes("text-align:center") && combined.includes("letter-spacing:");
      if (!ok) sendErrorMessage("T2S1", "El encabezado principal debe quedar centrado y con espacio entre letras.");
      return ok;
    }
    case 2: {
      const ok = combined.includes("font-size:") && hasProperty(combined, "color");
      if (!ok) sendErrorMessage("T2S2", "Al encabezado principal le falta un tamaño de letra y un color de texto definidos.");
      return ok;
    }
    default:
      return false;
  }
};

const test_ofertas_alpha = (blocks) => {
  const ofertas = blocksFor(blocks, "#ofertas");
  const ok = ofertas.some((b) => b.includes("rgba(") || b.includes("hsla("));
  if (!ok) sendErrorMessage("T3S1", "La sección de ofertas necesita un fondo de color con algo de transparencia.");
  return ok;
};

const test_destacado = (blocks) => {
  const destacado = blocksFor(blocks, ".oferta-destacada");
  const combined = destacado.join("");
  const ok = hasProperty(combined, "background-color") && (combined.includes("font-weight:bold") || hasBoldWeight(combined));
  if (!ok) sendErrorMessage("T4S1", "La oferta destacada necesita un color de fondo y su texto en negritas.");
  return ok;
};

const test_listas = (blocks, subtest) => {
  switch (subtest) {
    case 1: {
      const ul = blocksFor(blocks, "ul").join("");
      const ok = hasProperty(ul, "background-color") && ul.includes("font-weight:normal");
      if (!ok) sendErrorMessage("T5S1", "La lista sin ordenar necesita un color de fondo y su texto en peso normal (no en negritas).");
      return ok;
    }
    case 2: {
      const ol = blocksFor(blocks, "ol").join("");
      const ok = hasProperty(ol, "background-color") && (ol.includes("font-weight:bold") || hasBoldWeight(ol));
      if (!ok) sendErrorMessage("T5S2", "La lista ordenada necesita un color de fondo y su texto en negritas.");
      return ok;
    }
    default:
      return false;
  }
};

//#endregion

//#region Pruebas de selectores y pseudo

const test_nav_a = (blocks, subtest) => {
  const navA = blocksFor(blocks, "nav a").join("");
  if (!navA) {
    sendErrorMessage("T6S" + subtest, "No se encontró un estilo específico para los enlaces dentro del menú de navegación.");
    return false;
  }
  switch (subtest) {
    case 1: {
      const ok = navA.includes("text-decoration:none");
      if (!ok) sendErrorMessage("T6S1", "Los enlaces del menú de navegación no deben tener su decoración de texto (quítales el subrayado).");
      return ok;
    }
    case 2: {
      const ok = hasProperty(navA, "color");
      if (!ok) sendErrorMessage("T6S2", "A los enlaces del menú de navegación les falta un color de texto definido.");
      return ok;
    }
    default:
      return false;
  }
};

const test_attribute_selector = (blocks) => {
  const ok = blocksFor(blocks, 'a[href^="#detalle"]').length > 0;
  if (!ok) sendErrorMessage("T7S1", 'Falta un estilo para los enlaces cuyo href empieza con "#detalle" (usa un selector de atributo).');
  return ok;
};

const test_combinators = (blocks, subtest) => {
  const selectors = {
    1: "#combos li > a",
    2: "#combos span ~ a",
    3: "#combos span + a",
  };
  const mensajes = {
    1: "Falta un estilo para los enlaces que son hijos directos de un <li> dentro de la sección de combos (combinador de hijo directo, >).",
    2: "Falta un estilo para el enlace que aparece después de un <span>, sin importar qué tan lejos esté (combinador de hermano general, ~).",
    3: "Falta un estilo para el enlace que está justo después de un <span>, sin nada en medio (combinador de hermano adyacente, +).",
  };
  const ok = blocksFor(blocks, selectors[subtest]).length > 0;
  if (!ok) sendErrorMessage("T8S" + subtest, mensajes[subtest]);
  return ok;
};

const test_pseudoclases = (blocks, subtest) => {
  const selectors = {
    1: "#carrito-agregar:hover",
    2: "#carrito-comprar:active",
    3: "button:nth-of-type(3)",
    4: 'input[type="radio"]:checked',
  };
  const mensajes = {
    1: "Al botón de agregar al carrito le falta un estilo para cuando el mouse pasa encima.",
    2: "Al botón de comprar le falta un estilo para el momento en que se le da clic.",
    3: "Al tercer botón de la página le falta un estilo propio (cuenta su posición entre los botones).",
    4: "Al radio button que está marcado le falta un estilo propio.",
  };
  const ok = blocksFor(blocks, selectors[subtest]).length > 0;
  if (!ok) sendErrorMessage("T9S" + subtest, mensajes[subtest]);
  return ok;
};

const test_pseudoelementos = (blocks, subtest) => {
  const selectors = {
    1: "p:hover::before",
    2: "p:hover::after",
  };
  const mensajes = {
    1: "Al párrafo le falta un contenido que aparezca antes del texto cuando el mouse pasa encima.",
    2: "Al párrafo le falta un contenido que aparezca después del texto cuando el mouse pasa encima.",
  };
  const found = blocksFor(blocks, selectors[subtest]);
  const ok = found.some((b) => b.includes("content:"));
  if (!ok) sendErrorMessage("T10S" + subtest, mensajes[subtest]);
  return ok;
};

//#endregion

//#region Test Factory & Command Pattern

class TestCommand {
  constructor(checkboxId, value, testFunc, subtest, blocks) {
    this.checkboxId = checkboxId;
    this.value = value;
    this.testFunc = testFunc;
    this.subtest = subtest;
    this.blocks = blocks;
  }

  async execute() {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const label = document.querySelector(`#${this.checkboxId}`);
    const checkbox = label ? label.previousElementSibling : null;

    if (this.testFunc(this.blocks, this.subtest)) {
      console.log(`Test ${this.checkboxId} was successful`);
      if (checkbox) {
        checkbox.checked = true;
      }
      updateScore(this.value);
    } else {
      console.log(`Test ${this.checkboxId} failed`);
    }
  }
}

class TestFactory {
  constructor(blocks) {
    this.blocks = blocks;
  }

  createTest(checkboxId, value, testFunc, subtest = null) {
    return new TestCommand(checkboxId, value, testFunc, subtest, this.blocks);
  }
}

//#endregion

//#region Utilidades de CSS

// Extrae bloques
const getAllSelectors = (str) => {
  const blocks = [];
  const regex = /([^{}]+)\{([^{}]*)\}/g;
  let result;
  while ((result = regex.exec(str))) {
    blocks.push(result[1].trim() + "{" + result[2].trim() + "}");
  }
  return blocks;
};

// Normaliza: quita comentarios, quita TODOS los espacios y pasa a minúsculas.
const normalize = (str) =>
  str
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

const formatSelectors = (blocks) => blocks.map(normalize);


// Regresa los bloques cuyo selector es EXACTAMENTE selectorName
const blocksFor = (normalizedBlocksArr, selectorName) => {
  const target = normalize(selectorName) + "{";
  return normalizedBlocksArr.filter((b) => b.startsWith(target));
};

// Verifica que una propiedad exista de verdad, que no esté precedida por letra o guion.
const hasProperty = (str, prop) => {
  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("(^|[^a-z-])" + escaped + ":", "i");
  return re.test(str);
};

// Acepta font-weight en palabra (bold/bolder) o numérico >= 700
const hasBoldWeight = (str) => {
  if (str.includes("font-weight:bold") || str.includes("font-weight:bolder")) return true;
  const match = /font-weight:(\d+)/.exec(str);
  return !!match && parseInt(match[1], 10) >= 700;
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
