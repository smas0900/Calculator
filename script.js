import Calculate from "./calculate.js";

// === Constants ==== //
const calculator = document.getElementById("calculator");
const equation = document.getElementById("equation");
const display = document.getElementById("display");
const clear = document.getElementById("clr");
const del = document.getElementById("del");

const history = document.getElementById("history");
const histArr = [];

const setVar = document.getElementById("set-var");
const varName = document.getElementById("var-name");
const varVal = document.getElementById("var-val");
const err = document.getElementById("err");
const varList = document.getElementById("var-list");
const varObj = {};

const numbers = document.getElementsByClassName("num");
const consts = document.getElementsByClassName("const");
const operators = document.getElementsByClassName("oper");
const funcs = document.getElementsByClassName("func");

// === Functions ==== //
const pressButton = (btn) => {
  equation.value += `${btn.value}`;
};
const pressFunction = (btn) => {
  equation.value += `${btn.value}(`;
};
const clearText = () => {
  equation.value = "";
};
const deleteText = () => {
  equation.value = equation.value.replace(/.$/, "");
};
const showHist = () => {
  history.innerHTML = "";
  histArr.forEach((hist) => {
    const eq = document.createElement("p");
    eq.innerText = `${hist[0]} = ${hist[1]}`;
    history.appendChild(eq);

  });
};
const submit = (e) => {
  e.preventDefault();

  let prob = equation.value;

  let answer = new Calculate(prob, varObj).calculate();


  display.textContent = answer;

  if (typeof answer === "number") {
    histArr.push([prob, answer]);
    showHist();
  }
  clearText();
};
const showVars = () => {
  varList.innerHTML = "";

  for (const name in varObj) {
    const variable = document.createElement("p");
    variable.innerText = `${name} = ${varObj[name]}`;
    varList.appendChild(variable);


  }
};
const addVar = (e) => {
  e.preventDefault();

  const name = varName.value;
  const val = varVal.value;
  if (isNaN(+val)) {
    err.textContent = "Value is not a number";
    return;
  }

  // Check for numbers in the variable name
  const containsNumber = /\d/.test(name);
  if (containsNumber) {
    err.textContent = "Variable name contains a number";
    return;
  }

  if (["pi", "e"].includes(name) || Object.keys(varObj).includes(name)) {
    err.textContent = "Variable already exists";
    return;
  }

  varObj[name] = Number(val);
  showVars();
};


// === EventListeners === //
for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", (e) => pressButton(e.target));
}
for (let i = 0; i < consts.length; i++) {
  consts[i].addEventListener("click", (e) => pressButton(e.target));
}
for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener("click", (e) => pressButton(e.target));
}
for (let i = 0; i < funcs.length; i++) {
  funcs[i].addEventListener("click", (e) => pressFunction(e.target));
}
clear.addEventListener("click", () => clearText());
del.addEventListener("click", () => deleteText());
calculator.addEventListener("submit", (e) => submit(e));

setVar.addEventListener("submit", (e) => addVar(e));
