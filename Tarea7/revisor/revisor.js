let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");

let htmlContent = "";
let parsedDoc = null;
let testCommands = [];

SendButton.addEventListener("change", readSingleFile, false);

async function readSingleFile(evt) {
  const file = evt.target.files[0];
  await resetScore();
  if (file) {
    if (!file.name.toLowerCase().endsWith(".html")) {
      alert("Solo se aceptan archivos .html");
      evt.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = async function (e) {
      htmlContent = e.target.result;
      document.getElementById("codeInput").value = htmlContent;
      parsedDoc = parseHTML(htmlContent);
      await runTests();
    };
    reader.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

document.getElementById("processCodeButton").addEventListener("click", async function () {
  await resetScore();
  htmlContent = document.getElementById("codeInput").value;
  if (htmlContent.trim()) {
    parsedDoc = parseHTML(htmlContent);
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});

async function runTests() {
  const testFactory = new TestFactory(parsedDoc);
  testCommands = [
    testFactory.createTest("T1S1", 5, test_navbar, 1),
    testFactory.createTest("T1S2", 5, test_navbar, 2),

    testFactory.createTest("T2S1", 5, test_hero, 1),
    testFactory.createTest("T2S2", 5, test_hero, 2),

    testFactory.createTest("T3S1", 5, test_alerts, 1),
    testFactory.createTest("T3S2", 5, test_alerts, 2),

    testFactory.createTest("T4S1", 5, test_button_group, 1),
    testFactory.createTest("T4S2", 5, test_button_group, 2),

    testFactory.createTest("T5S1", 10, test_cards, 1),
    testFactory.createTest("T5S2", 10, test_cards, 2),

    testFactory.createTest("T6S1", 10, test_carousel, 1),
    testFactory.createTest("T6S2", 10, test_carousel, 2),

    testFactory.createTest("T7S1", 5, test_form, 1),
    testFactory.createTest("T7S2", 5, test_form, 2),

    testFactory.createTest("T8S1", 5, test_footer, 1),
    testFactory.createTest("T8S2", 5, test_footer, 2),
  ];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#region 1. Navbar

const test_navbar = (doc, subtest) => {
  const toggler = doc.querySelector(".navbar-toggler");
  const collapse = doc.querySelector(".collapse.navbar-collapse");

  if (subtest === 1) {
    if (!toggler || !collapse) {
      sendErrorMessage("T1S1", "Falta el navbar-toggler o el collapse.navbar-collapse.");
      return false;
    }
    const target = (toggler.getAttribute("data-bs-target") || "").replace("#", "");
    const ok = target && target === collapse.id;
    if (!ok) sendErrorMessage("T1S1", "El data-bs-target del toggler no coincide con el id del collapse — así no se conectan.");
    return ok;
  }

  const nav = toggler ? toggler.closest("nav") : null;
  const ok = nav && nav.querySelector(".dropdown-menu");
  if (!ok) sendErrorMessage("T1S2", "Falta un dropdown-menu dentro del navbar.");
  return ok;
};

//#endregion

//#region 2. Hero

const test_hero = (doc, subtest) => {
  const displayEl = Array.from(doc.querySelectorAll("[class]")).find((el) => /(^|\s)display-[1-6](\s|$)/.test(el.className));
  const lead = doc.querySelector(".lead");

  if (subtest === 1) {
    const ok = Boolean(displayEl && lead);
    if (!ok) sendErrorMessage("T2S1", "Falta un elemento con clase display-1 a display-6, o falta el .lead.");
    return ok;
  }

  if (!displayEl) {
    sendErrorMessage("T2S2", "No se encontró el título del hero para revisar su fondo.");
    return false;
  }
  let el = displayEl;
  let found = false;
  for (let i = 0; i < 4 && el; i++) {
    if (/(^|\s)bg-[a-z-]+(\s|$)/.test(el.className || "")) {
      found = true;
      break;
    }
    el = el.parentElement;
  }
  if (!found) sendErrorMessage("T2S2", "Falta una utilidad bg-* (color de fondo) cerca del título del hero.");
  return found;
};

//#endregion

//#region 3. Alerts

const test_alerts = (doc, subtest) => {
  const alerts = Array.from(doc.querySelectorAll(".alert"));

  if (subtest === 1) {
    const ok = alerts.some((a) => !a.classList.contains("alert-dismissible"));
    if (!ok) sendErrorMessage("T3S1", "Falta una alerta simple (sin alert-dismissible).");
    return ok;
  }

  const ok = alerts.some((a) => a.classList.contains("alert-dismissible") && a.querySelector('.btn-close[data-bs-dismiss="alert"]'));
  if (!ok) sendErrorMessage("T3S2", "Falta una alerta con alert-dismissible y un btn-close con data-bs-dismiss=\"alert\" adentro.");
  return ok;
};

//#endregion

//#region 4. Button group

const test_button_group = (doc, subtest) => {
  const groups = Array.from(doc.querySelectorAll(".btn-group"));
  const group = groups.find((g) => g.querySelectorAll('input[type="radio"].btn-check').length >= 3);

  if (subtest === 1) {
    if (!group) {
      sendErrorMessage("T4S1", "Falta un btn-group con al menos 3 input[type=radio].btn-check.");
      return false;
    }
    const radios = Array.from(group.querySelectorAll('input[type="radio"].btn-check'));
    const names = new Set(radios.map((r) => r.getAttribute("name")));
    const ok = names.size === 1 && [...names][0];
    if (!ok) sendErrorMessage("T4S1", "Los radios del button group no comparten el mismo name — así no funcionan como un solo selector.");
    return ok;
  }

  if (!group) {
    sendErrorMessage("T4S2", "No se encontró el button group para revisar sus labels.");
    return false;
  }
  const radios = Array.from(group.querySelectorAll('input[type="radio"].btn-check'));
  const ids = Array.from(doc.querySelectorAll("label")).map((l) => l.getAttribute("for"));
  const ok = radios.every((r) => ids.includes(r.id));
  if (!ok) sendErrorMessage("T4S2", "Algún radio no tiene un label asociado (el for del label debe coincidir con su id).");
  return ok;
};

//#endregion

//#region 5. Cards + Grid

const test_cards = (doc, subtest) => {
  const cards = Array.from(doc.querySelectorAll(".card"));
  const cardsEnGrid = cards.filter((c) => {
    const col = c.closest('[class*="col-"]');
    if (!col || !col.closest(".row")) return false;
    const colClasses = (col.className || "").split(/\s+/).filter((cl) => /^col(-\w+)?-\d+$/.test(cl));
    return colClasses.length >= 2;
  });

  if (subtest === 1) {
    const ok = cardsEnGrid.length >= 4;
    if (!ok) sendErrorMessage("T5S1", `Se encontraron ${cardsEnGrid.length} card(s) en columnas responsivas (con 2 o más breakpoints); se necesitan al menos 4.`);
    return ok;
  }

  const ok = cards.some((c) => c.querySelector(".badge"));
  if (!ok) sendErrorMessage("T5S2", "Ninguna card tiene un .badge adentro.");
  return ok;
};

//#endregion

//#region 6. Carousel

const test_carousel = (doc, subtest) => {
  const carousel = doc.querySelector(".carousel");

  if (subtest === 1) {
    if (!carousel) {
      sendErrorMessage("T6S1", "No se encontró ningún elemento .carousel.");
      return false;
    }
    const items = carousel.querySelectorAll(".carousel-item");
    const activos = carousel.querySelectorAll(".carousel-item.active");
    const ok = items.length >= 3 && activos.length === 1;
    if (!ok) sendErrorMessage("T6S1", `Hay ${items.length} carousel-item y ${activos.length} con active — se necesitan al menos 3 items y exactamente 1 active.`);
    return ok;
  }

  if (!carousel || !carousel.id) {
    sendErrorMessage("T6S2", "El carousel no tiene id, así que los controles no se pueden conectar a él.");
    return false;
  }
  const targets = Array.from(doc.querySelectorAll("[data-bs-target]")).map((el) => (el.getAttribute("data-bs-target") || "").replace("#", ""));
  const conectados = targets.filter((t) => t === carousel.id).length;
  const ok = conectados >= 5; // 3 indicadores + prev + next
  if (!ok) sendErrorMessage("T6S2", "Los indicadores y/o los controles de prev/next no apuntan (data-bs-target) al id del carousel.");
  return ok;
};

//#endregion

//#region 7. Form

const test_form = (doc, subtest) => {
  const forms = Array.from(doc.querySelectorAll("form"));

  if (subtest === 1) {
    const ok = forms.some((f) => {
      const row = f.querySelector(".row");
      if (!row) return false;
      const cols = Array.from(row.children).filter((c) => /col(-\w+)?-\d+/.test(c.className || ""));
      return cols.filter((c) => c.querySelector("input")).length >= 2;
    });
    if (!ok) sendErrorMessage("T7S1", "No se encontró un form con 2 campos dentro de columnas hermanas en el mismo row.");
    return ok;
  }

  const ok = forms.some((f) => f.querySelector('.form-check input[type="checkbox"]') && f.querySelector('button[type="submit"], input[type="submit"]'));
  if (!ok) sendErrorMessage("T7S2", "Falta el checkbox (.form-check) o el botón de enviar dentro del mismo form.");
  return ok;
};

//#endregion

//#region 8. Footer + SVG

const test_footer = (doc, subtest) => {
  const footer = doc.querySelector("footer");

  if (subtest === 1) {
    const ok = Boolean(footer);
    if (!ok) sendErrorMessage("T8S1", "No se encontró un elemento <footer>.");
    return ok;
  }

  if (!footer) {
    sendErrorMessage("T8S2", "No se encontró el footer para revisar sus íconos.");
    return false;
  }
  const ok = footer.querySelectorAll("svg").length >= 2;
  if (!ok) sendErrorMessage("T8S2", "El footer tiene menos de 2 <svg> adentro.");
  return ok;
};

//#endregion

//#region Test Factory & Command Pattern

class TestCommand {
  constructor(checkboxId, value, testFunc, subtest, doc) {
    this.checkboxId = checkboxId;
    this.value = value;
    this.testFunc = testFunc;
    this.subtest = subtest;
    this.doc = doc;
  }

  async execute() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const label = document.querySelector(`#${this.checkboxId}`);
    const checkbox = label ? label.previousElementSibling : null;

    if (this.testFunc(this.doc, this.subtest)) {
      if (checkbox) checkbox.checked = true;
      updateScore(this.value);
    }
  }
}

class TestFactory {
  constructor(doc) {
    this.doc = doc;
  }
  createTest(checkboxId, value, testFunc, subtest = null) {
    return new TestCommand(checkboxId, value, testFunc, subtest, this.doc);
  }
}

//#endregion

//#region Utilidades

const parseHTML = (str) => new DOMParser().parseFromString(str, "text/html");

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
