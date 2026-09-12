let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");

let CSScontent = "";
let normalizedBlocks = [];
let rawCSS = "";
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
      rawCSS = CSScontent;
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
    rawCSS = CSScontent;
    normalizedBlocks = formatSelectors(getAllSelectors(CSScontent));
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});

async function runTests() {
  const testFactory = new TestFactory(normalizedBlocks);
  testCommands = [
    testFactory.createTest("T1S1", 5, test_enero, 1),
    testFactory.createTest("T1S2", 5, test_enero, 2),

    testFactory.createTest("T2S1", 5, test_febrero, 1),
    testFactory.createTest("T2S2", 5, test_febrero, 2),

    testFactory.createTest("T3S1", 5, test_marzo, 1),
    testFactory.createTest("T3S2", 5, test_marzo, 2),

    testFactory.createTest("T4S1", 5, test_abril, 1),
    testFactory.createTest("T4S2", 5, test_abril, 2),

    testFactory.createTest("T5S1", 5, test_mayo, 1),
    testFactory.createTest("T5S2", 5, test_mayo, 2),

    testFactory.createTest("T6S1", 5, test_junio, 1),
    testFactory.createTest("T6S2", 5, test_junio, 2),

    testFactory.createTest("T7S1", 5, test_julio, 1),
    testFactory.createTest("T7S2", 5, test_julio, 2),

    testFactory.createTest("T8S1", 5, test_agosto, 1),
    testFactory.createTest("T8S2", 5, test_agosto, 2),

    testFactory.createTest("T9S1", 5, test_sol, 1),
    testFactory.createTest("T9S2", 5, test_sol, 2),

    testFactory.createTest("T10S1", 5, test_nube, 1),
    testFactory.createTest("T10S2", 5, test_nube, 2),
  ];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#region Enero a Agosto (checks laxos: la propiedad puede ir en cualquier selector)

const test_enero = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "width:").length > 0 && findArrayIncludes(blocks, "height:").length > 0;
    if (!ok) sendErrorMessage("T1S1", "Falta width y/o height en algún selector (Mercurio).");
    return ok;
  }
  const ok = findArrayIncludes(blocks, "transform:translate").length > 0;
  if (!ok) sendErrorMessage("T1S2", "Falta transform: translate (Mercurio).");
  return ok;
};

const test_febrero = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "padding:").length > 0 && findArrayIncludes(blocks, "border-radius:").length > 0;
    if (!ok) sendErrorMessage("T2S1", "Falta padding y/o border-radius en algún selector (Venus).");
    return ok;
  }
  const ok = findArrayIncludes(blocks, "transform:rotate").length > 0;
  if (!ok) sendErrorMessage("T2S2", "Falta transform: rotate (Venus).");
  return ok;
};

const test_marzo = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "border-style:").length > 0 && findArrayIncludes(blocks, "border-color:").length > 0;
    if (!ok) sendErrorMessage("T3S1", "Falta border-style y/o border-color en algún selector (Tierra).");
    return ok;
  }
  const ok = findArrayIncludes(blocks, "transform:scale").length > 0;
  if (!ok) sendErrorMessage("T3S2", "Falta transform: scale (Tierra).");
  return ok;
};

const test_abril = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "border-width:").length > 0 && findArrayIncludes(blocks, "margin:").length > 0;
    if (!ok) sendErrorMessage("T4S1", "Falta border-width y/o margin en algún selector (Marte).");
    return ok;
  }
  const ok = findArrayIncludes(blocks, "transform:skew").length > 0;
  if (!ok) sendErrorMessage("T4S2", "Falta transform: skew (Marte).");
  return ok;
};

const test_mayo = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "overflow:").length > 0;
    if (!ok) sendErrorMessage("T5S1", "Falta la propiedad overflow (Júpiter).");
    return ok;
  }
  const durations = findArrayIncludes(blocks, "transition-duration:");
  const ok = durations.some((b) => /transition-duration:[^;]*s\s*,/.test(b));
  if (!ok) sendErrorMessage("T5S2", "Falta un transition-duration con 2 valores distintos (ej. 3s, 1s) en un mismo selector (Júpiter).");
  return ok;
};

const test_junio = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "display:").length > 0;
    if (!ok) sendErrorMessage("T6S1", "Falta la propiedad display (Saturno).");
    return ok;
  }
  const text = blocks.join("");
  const hasProperty = text.includes("transition-timing-function:");
  const distinct = countDistinctTimingFunctions(text);
  const ok = hasProperty && distinct >= 2;
  if (!ok) sendErrorMessage("T6S2", "Faltan 2 transition-timing-function distintas (ej. steps(...) y ease-in-out) (Saturno).");
  return ok;
};

const test_julio = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "box-sizing:").length > 0;
    if (!ok) sendErrorMessage("T7S1", "Falta la propiedad box-sizing (Urano).");
    return ok;
  }
  const keyframes = getKeyframesBlocks(rawCSS);
  const ok = keyframes.some((k) => /\bfrom\b/i.test(k) || /\bto\b/i.test(k));
  if (!ok) sendErrorMessage("T7S2", "Falta un @keyframes que use la notación from/to (Urano).");
  return ok;
};

const test_agosto = (blocks, subtest) => {
  if (subtest === 1) {
    const ok = findArrayIncludes(blocks, "position:").length > 0;
    if (!ok) sendErrorMessage("T8S1", "Falta la propiedad position (Neptuno).");
    return ok;
  }
  const keyframes = getKeyframesBlocks(rawCSS);
  const ok = keyframes.some((k) => /\d+%/.test(k));
  if (!ok) sendErrorMessage("T8S2", "Falta un @keyframes con un porcentaje numérico (ej. 0%, 50%, 100%) (Neptuno).");
  return ok;
};

//#endregion

//#region Sol y Nube (checks atados a #sol y #nube específicamente)

const test_sol = (blocks, subtest) => {
  const sol = blocksFor(blocks, "#sol").join("");
  if (subtest === 1) {
    const ok = sol.includes("border-radius:") && sol.includes("position:");
    if (!ok) sendErrorMessage("T9S1", "#sol necesita border-radius (para ser circular) y position.");
    return ok;
  }
  const hasRotateY = rawCSS.toLowerCase().replace(/\s/g, "").includes("rotatey(");
  const solHasAnimation = sol.includes("animation");
  const pauseBlocks = blocksFor(blocks, "#sol:hover").concat(blocksFor(blocks, "#sol:active")).join("");
  const hasPause = pauseBlocks.includes("animation-play-state:paused");
  const ok = hasRotateY && solHasAnimation && hasPause;
  if (!ok) sendErrorMessage("T9S2", "#sol debe girar con rotateY() en un @keyframes, y pausarse (animation-play-state: paused) en #sol:hover o #sol:active.");
  return ok;
};

const test_nube = (blocks, subtest) => {
  const nube = blocksFor(blocks, "#nube").join("");
  if (subtest === 1) {
    const ok = nube.includes("border-radius:") && nube.includes("position:");
    if (!ok) sendErrorMessage("T10S1", "#nube necesita border-radius (forma de píldora) y position.");
    return ok;
  }
  const ok = nube.includes("animation") && nube.includes("alternate");
  if (!ok) sendErrorMessage("T10S2", "#nube debe tener una animación en movimiento con animation-direction: alternate.");
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
      if (checkbox) checkbox.checked = true;
      updateScore(this.value);
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

//#region Utilidades

const getAllSelectors = (str) => {
  const blocks = [];
  const regex = /([^{}]+)\{([^{}]*)\}/g;
  let result;
  while ((result = regex.exec(str))) {
    blocks.push(result[1].trim() + "{" + result[2].trim() + "}");
  }
  return blocks;
};

const normalize = (str) =>
  str
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

const formatSelectors = (blocks) => blocks.map(normalize);

const findArrayIncludes = (arr, substr) => {
  const target = normalize(substr);
  return arr.filter((item) => item.includes(target));
};

const blocksFor = (normalizedBlocksArr, selectorName) => {
  const target = normalize(selectorName) + "{";
  return normalizedBlocksArr.filter((b) => b.startsWith(target));
};

// Extrae bloques @keyframes completos (respetando llaves anidadas), del CSS crudo
const getKeyframesBlocks = (css) => {
  const blocks = [];
  const regex = /@keyframes\s+[\w-]+\s*\{/gi;
  let match;
  while ((match = regex.exec(css))) {
    const start = match.index;
    const openIndex = css.indexOf("{", start);
    let depth = 1;
    let i = openIndex + 1;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    blocks.push(css.slice(start, i));
  }
  return blocks;
};

const TIMING_KEYWORDS = ["ease-in-out", "ease-in", "ease-out", "step-start", "step-end", "steps(", "cubic-bezier(", "ease", "linear"];

const countDistinctTimingFunctions = (normalizedText) => {
  const found = new Set();
  for (const kw of TIMING_KEYWORDS) {
    if (normalizedText.includes(kw)) found.add(kw === "ease" ? "ease-generic" : kw);
  }
  // Evita que "ease-in-out" también cuente como solamente un "ease" duplicado
  if (found.has("ease-in-out") || found.has("ease-in") || found.has("ease-out")) found.delete("ease-generic");
  return found.size;
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
