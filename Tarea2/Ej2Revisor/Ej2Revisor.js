//#region Variables and initialization

let checkboxes = document.querySelectorAll("input[type=checkbox]");
let SendButton = document.querySelector("#fileinput");
let score = document.querySelector("#score");
let barFill = document.querySelector("#progress-bar-fill");
let barFillText = document.querySelector("#progress-bar-fill-text");

SendButton.addEventListener("change", readSingleFile, false);
let HTMLcontent = "";
let allTags = [];
let testCommands = [];

//#endregion

//#region Get file and read

async function readSingleFile(evt) {
  const file = evt.target.files[0];
  await resetScore();
  if (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      HTMLcontent = e.target.result;
      document.getElementById("codeInput").value = HTMLcontent;
      allTags = getAllTags(HTMLcontent);

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
    allTags = getAllTags(HTMLcontent);
    await runTests();
  } else {
    alert("Por favor, pega tu código en el área de texto.");
  }
});
//#endregion

//#region Test Runner

async function runTests() {
  const testFactory = new TestFactory(allTags);
  testCommands = [testFactory.createTest(1, 10, test1), testFactory.createTest(2, 10, test2), testFactory.createTest(3, 10, test3), testFactory.createTest(4, 10, test4), testFactory.createTest(5, 10, test5), testFactory.createTest(6, 10, test6), testFactory.createTest(7, 10, test7), testFactory.createTest(8, 15, test8), testFactory.createTest(9, 15, test9)];

  for (let command of testCommands) {
    await command.execute();
  }
}

//#endregion

//#region Individual Tests

const test1 = (tags) => findArrayStartsWith(tags, "<p").length >= 5;
const test2 = (tags) => findArrayStartsWith(tags, "<h1").length === 1;
const test3 = (tags) => findArrayStartsWith(tags, "<h2").length >= 2;
const test4 = (tags) => {
  let result = 0;
  if (findArrayStartsWith(tags, "<h2").length >= 1) result++;
  if (findArrayStartsWith(tags, "<h3").length >= 1) result++;
  if (findArrayStartsWith(tags, "<h4").length >= 1) result++;
  if (findArrayStartsWith(tags, "<h5").length >= 1) result++;
  if (findArrayStartsWith(tags, "<h6").length >= 1) result++;
  return result >= 5;
};

const test5 = (tags) => {
  return checkListStructure(tags, "<ol", "</ol", "<li", 3);
};

const test6 = (tags) => {
  return checkListStructure(tags, "<ul", "</ul", "<li", 3);
};

const test7 = (tags) => {
  let aux = findArrayStartsWith(tags, "<a");
  return aux.length >= 1 && findArrayIncludes(aux, "http").length >= 1;
};

const test8 = (tags) => {
  let aux = findArrayStartsWith(tags, "<img");
  return aux.length >= 1 && findArrayNotIncludes(aux, "http").length >= 1;
};

const test9 = (tags) => {
  let aux = findArrayStartsWith(tags, "<img");
  return aux.length >= 1 && findArrayIncludes(aux, "http").length >= 1;
};

const checkListStructure = (tags, startTag, endTag, itemTag, minItems) => {
  let newArr = tags;
  while (newArr.length !== 0) {
    let startIndex = newArr.findIndex((item) => item.includes(startTag));
    let endIndex = newArr.findIndex((item) => item.includes(endTag));
    if (startIndex === -1 || endIndex === -1) return false;
    let subArr = tags.slice(startIndex, endIndex + 1);
    if (findArrayStartsWith(subArr, itemTag).length >= minItems) return true;
    newArr = newArr.slice(endIndex + 1);
  }
  return false;
};

//#endregion

//#region Test Factory & Command Pattern

class TestCommand {
  constructor(testNumber, value, testFunc, tags) {
    this.testNumber = testNumber;
    this.value = value;
    this.testFunc = testFunc;
    this.tags = tags;
  }

  async execute() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (this.testFunc(this.tags)) {
      console.log(`Test ${this.testNumber} was successful`);
      checkboxes[this.testNumber - 1].checked = true;
      updateScore(this.value);
    }
  }
}

class TestFactory {
  constructor(tags) {
    this.tags = tags;
  }

  createTest(testNumber, value, testFunc) {
    return new TestCommand(testNumber, value, testFunc, this.tags);
  }
}

//#endregion

//#region Utilities

const getAllTags = (str) => {
  const tags = [];
  const regex = /(<([^>]+)>)/gi;
  let result;

  while ((result = regex.exec(str))) {
    tags.push(result[0]);
  }
  return tags;
};

const findArrayStartsWith = (arr, substr) => arr.filter((item) => item.startsWith(substr));

const findArrayIncludes = (arr, substr) => arr.filter((item) => item.includes(substr));

const findArrayNotIncludes = (arr, substr) => arr.filter((item) => !item.includes(substr));

//#endregion

//#region Result bar

const updateScore = (newScore) => {
  const currentScore = Math.ceil(Number(score.textContent));
  const updatedScore = currentScore + newScore;

  score.textContent = updatedScore;
  const percentage = updatedScore + "%";

  barFill.style.width = percentage;
  barFillText.textContent = `Calificación ${percentage}`;
};

async function resetScore() {
  score.textContent = "0";
  barFill.style.width = "0%";
  barFillText.textContent = `Calificación 0%`;

  checkboxes.forEach((checkbox) => {
    checkbox.disabled = true;
    checkbox.checked = false;
  });
}

//#endregion
