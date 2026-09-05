let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");

let HTMLcontent = "";
let parsedDoc = null;
let testCommands = [];

SendButton.addEventListener("change", readSingleFile, false);

async function readSingleFile(evt) {
  const file = evt.target.files[0];
  await resetScore();
  if (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      HTMLcontent = e.target.result;
      document.getElementById("codeInput").value = HTMLcontent;
      parsedDoc = parseHTML(HTMLcontent);

      await runTests();
    };
    reader.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

document.getElementById("processCodeButton").addEventListener("click", async function () {
  await resetScore();
  HTMLcontent = document.getElementById("codeInput").value;
  if (HTMLcontent.trim()) {
    parsedDoc = parseHTML(HTMLcontent);
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});

async function runTests() {
  const testFactory = new TestFactory(parsedDoc);
  testCommands = [
    // ===== FORMULARIOS =====
    testFactory.createTest("T1S1", 2, test_fieldset_legends, 1),
    testFactory.createTest("T1S2", 2, test_fieldset_legends, 2),
    testFactory.createTest("T1S3", 2, test_fieldset_legends, 3),
    testFactory.createTest("T1S4", 2, test_fieldset_legends, 4),
    testFactory.createTest("T1S5", 2, test_fieldset_legends, 5),

    testFactory.createTest("T2S1", 2, test_fieldset_inputs, 1),
    testFactory.createTest("T2S2", 2, test_fieldset_inputs, 2),
    testFactory.createTest("T2S3", 2, test_fieldset_inputs, 3),
    testFactory.createTest("T2S4", 2, test_fieldset_inputs, 4),
    testFactory.createTest("T2S5", 2, test_fieldset_inputs, 5),

    testFactory.createTest("T3S1", 10, test_labels_ids),

    testFactory.createTest("T4S1", 10, test_names),

    testFactory.createTest("T5S1", 5, test_placeholder, 1),
    testFactory.createTest("T5S2", 5, test_placeholder, 2),

    testFactory.createTest("T6S1", 5, test_preferences, 1),
    testFactory.createTest("T6S2", 5, test_preferences, 2),
    testFactory.createTest("T6S3", 5, test_preferences, 3),
    testFactory.createTest("T6S4", 5, test_preferences, 4),

    testFactory.createTest("T7S1", 5, test_busqueda, 1),
    testFactory.createTest("T7S2", 5, test_busqueda, 2),

    // ===== TABLAS (al final) =====
    testFactory.createTest("T8S1", 2, test_table_thead),
    testFactory.createTest("T8S2", 2, test_table_tbody),
    testFactory.createTest("T8S3", 2, test_table_tr),
    testFactory.createTest("T8S4", 2, test_table_th),
    testFactory.createTest("T8S5", 2, test_table_td),

    testFactory.createTest("T9S1", 5, test_colspan),
    testFactory.createTest("T9S2", 5, test_rowspan),
  ];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#region Pruebas de formularios

const test_fieldset_legends = (doc, subtest) => {
  const fieldsets = doc.querySelectorAll("fieldset");
  const legends = doc.querySelectorAll("legend");

  switch (subtest) {
    case 1:
      return fieldsets.length === 3;
    case 2:
      return legends.length === 3;
    case 3:
      return Array.from(legends).some((legend) => normalizeText(legend.textContent).includes("datos personales"));
    case 4:
      return Array.from(legends).some((legend) => normalizeText(legend.textContent).includes("preferencias"));
    case 5:
      return Array.from(legends).some((legend) => normalizeText(legend.textContent).includes("busqueda"));
    default:
      return false;
  }
};

const test_fieldset_inputs = (doc, subtest) => {
  const fieldset = getFieldsetByLegend(doc, "datos personales");
  if (!fieldset) return false;
  const inputs = fieldset.querySelectorAll("input");

  switch (subtest) {
    case 1:
      return inputs.length === 5;
    case 2:
      return Array.from(inputs).some((input) => input.getAttribute("type") === "text");
    case 3:
      return Array.from(inputs).some((input) => input.getAttribute("type") === "email");
    case 4:
      return Array.from(inputs).some((input) => input.getAttribute("type") === "password");
    case 5:
      return Array.from(inputs).some((input) => input.getAttribute("type") === "number");
    default:
      return false;
  }
};

const test_labels_ids = (doc) => {
  const labels = Array.from(doc.querySelectorAll("label"));
  const labelsWithFor = labels.filter((label) => label.hasAttribute("for"));

  const formControlIds = Array.from(doc.querySelectorAll("input[id], select[id], textarea[id]")).map((el) => el.id);

  const unmatchedFor = labelsWithFor.filter((label) => !formControlIds.includes(label.getAttribute("for")));
  const labelsSinFor = labels.length - labelsWithFor.length;

  if (unmatchedFor.length > 0 || labelsSinFor > 0) {
    sendErrorMessage("T3S1", `Labels totales: ${labels.length}, con 'for': ${labelsWithFor.length}, ids de campos encontrados: ${formControlIds.length}`);
    if (labelsSinFor > 0) {
      sendErrorMessage("T3S1", `Hay ${labelsSinFor} label(s) sin atributo 'for'.`);
    }
    if (unmatchedFor.length > 0) {
      const valores = unmatchedFor.map((label) => label.getAttribute("for")).join(", ");
      sendErrorMessage("T3S1", `atributos 'for' que no coinciden con el id de ningún input/select/textarea: ${valores}.`);
    }
    return false;
  }

  return true;
};

const test_names = (doc) => {
  const fieldset = getFieldsetByLegend(doc, "datos personales");
  if (!fieldset) return false;
  const inputs = Array.from(fieldset.querySelectorAll("input"));
  const inputsSinName = inputs.filter((input) => !input.hasAttribute("name"));

  if (inputsSinName.length > 0) {
    sendErrorMessage("T4S1", `inputs totales: ${inputs.length}, sin atributo name: ${inputsSinName.length}`);
    return false;
  }

  return true;
};

const test_placeholder = (doc, subtest) => {
  const fieldset = getFieldsetByLegend(doc, "datos personales");
  if (!fieldset) return false;
  const inputs = Array.from(fieldset.querySelectorAll("input"));

  switch (subtest) {
    case 1: {
      const sinPlaceholder = inputs.filter((input) => !input.hasAttribute("placeholder"));
      if (sinPlaceholder.length > 0) {
        sendErrorMessage("T5S1", `Inputs totales: ${inputs.length}, sin placeholder: ${sinPlaceholder.length}`);
        return false;
      }
      return true;
    }

    case 2: {
      const passwordInput = inputs.find((input) => input.getAttribute("type") === "password");
      if (!passwordInput) {
        sendErrorMessage("T5S2", "No se tiene el input de tipo password.");
        return false;
      }
      const placeholder = passwordInput.getAttribute("placeholder") || "";
      if (placeholder.includes("***")) {
        return true;
      }
      sendErrorMessage("T5S2", "Password no tiene placeholder o no contiene mínimo 3 asteriscos (***).");
      return false;
    }

    default:
      return false;
  }
};

const test_preferences = (doc, subtest) => {
  const fieldset = getFieldsetByLegend(doc, "preferencias");
  if (!fieldset) return false;

  switch (subtest) {
    case 1:
      return fieldset.querySelectorAll('input[type="checkbox"]').length >= 1;
    case 2:
      return fieldset.querySelectorAll('input[type="radio"]').length >= 1 || fieldset.querySelectorAll("select").length >= 1;
    case 3:
      return fieldset.querySelectorAll('input[type="range"], input[type="color"], input[type="file"]').length >= 1;
    case 4:
      return fieldset.querySelectorAll("button").length >= 2;
    default:
      return false;
  }
};

const test_busqueda = (doc, subtest) => {
  const forms = Array.from(doc.querySelectorAll("form"));
  const targetForm = forms.find((form) => form.getAttribute("action") === "https://www.youtube.com/results");

  switch (subtest) {
    case 1:
      if (targetForm) return true;
      sendErrorMessage("T7S1", "El atributo action no es el correcto, es el link al buscar antes del signo de interrogación ? ");
      return false;

    case 2: {
      if (!targetForm) {
        sendErrorMessage("T7S2", "No se encontró el formulario de búsqueda.");
        return false;
      }
      const tieneNameCorrecto = Array.from(targetForm.querySelectorAll("input")).some((input) => input.getAttribute("name") === "search_query");
      if (tieneNameCorrecto) return true;
      sendErrorMessage("T7S2", "El atributo name del input debe ser igual a la variable en la que YouTube guarda la búsqueda en la url (search_query).");
      return false;
    }

    default:
      return false;
  }
};

//#endregion

//#region Pruebas de tabla

const test_table_thead = (doc) => doc.querySelectorAll("thead").length === 1;
const test_table_tbody = (doc) => doc.querySelectorAll("tbody").length === 1;
const test_table_tr = (doc) => doc.querySelectorAll("tr").length >= 1;
const test_table_th = (doc) => doc.querySelectorAll("th").length >= 1;
const test_table_td = (doc) => doc.querySelectorAll("td").length >= 1;

const test_colspan = (doc) => Array.from(doc.querySelectorAll("[colspan]")).some((cell) => parseInt(cell.getAttribute("colspan"), 10) > 1);

const test_rowspan = (doc) => Array.from(doc.querySelectorAll("[rowspan]")).some((cell) => parseInt(cell.getAttribute("rowspan"), 10) > 1);

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

const getFieldsetByLegend = (doc, keyword) => {
  return Array.from(doc.querySelectorAll("fieldset")).find((fieldset) => {
    const legend = fieldset.querySelector("legend");
    return legend && normalizeText(legend.textContent).includes(keyword);
  });
};

const normalizeText = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sendErrorMessage = (elementId, message) => {
  let errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.style.color = "red";
  errorDiv.textContent = message;

  document.querySelector(`#${elementId}`).insertAdjacentElement("afterend", errorDiv);
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

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.remove();
  });
}

//#endregion
