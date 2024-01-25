class Calculate {
    constructor(string, consts = {}, decimalPlaces = 4) {
      this.string = string;
      this.decimalPlaces = 10 ** decimalPlaces;
      this.operators = "+-*/^=";
      this.functions = ["sqrt", "sin", "cos", "tan"];
      this.consts = { pi: 3.1415, e: 2.7182, ...consts };
      this.error = "Invalid Expression.";
      this.divideByZeroError = "Dividing by 0 is not permitted.";
    }
  
    calculate = (str = this.string) => {
      if (str.length === 0) return this.error;
  
      let arr = this.#parse(str);
      if (arr.length === 0) return this.error;
  
      // Does not start with operator except + or -, and
      if ("+-".includes(arr[0])) arr.unshift(0);
      let first = arr[0];
      if (this.operators.includes(first)) return this.error;
  
      // Does not end end with operator except =, and
      let last = arr[arr.length - 1];
      if (this.operators.includes(last) && last !== "=") return this.error;
  
      // Does not end in function
      if (this.functions.includes(last)) return this.error;
      
      // If it is just a number, return the number
      if (arr.length === 1 && typeof first === "number") return first;
  
  
  
      if (arr[arr.length - 1] != "=") arr.push("=");
  
      let answer = this.#startCalculations(arr);
      // Round to given number of digits (default 4)
      if (typeof answer === "number")
        answer = Math.round(answer * this.decimalPlaces) / this.decimalPlaces;
  
      return answer;
    };
  
    // Remove all spaces
    #removeSpaces = (string) => string.replace(/\s/g, "");
  
    // Etract complete number from string
    #parseNumber = (string, num = "") => {
      while (string.length > 0) {
        if (!isNaN(+string[0]) || string[0] == ".") {
          num += string.shift();
        } else {
          break;
        }
      }
  
      return string, num === "-" ? num : Number(num);
    };
  
    // Check if a character is alphabetic
    #checkAplha = (str) =>
      "abcdefghijklmnopqrstuvwxyz".includes(str.toLowerCase());
  
    // Etract complete function or constant from string. parseNumber function iterate through the string
    //  to extract a sequence of characters that represent a numerical value, including decimal points.
  
    #parseAlphabet = (string, func = "") => {
      while (string.length > 0) {
        if (this.#checkAplha(string[0])) {
          func += string.shift();
        } else {
          break;
        }
      }
      return string, func;
    };
  
  
    // Parse inputted sting into Numbers, Operators and Functions parse function analyze and parse a string,
    // identifying and categorizing various elements such as numbers, operators, functions, and constants, and storing them in the parsedArr array. 
    #parse = (str = this.string) => {
      str = this.#removeSpaces(str).split("");
      let parsedArr = [];
      let error = false;
  
      while (str.length > 0) {
        let char = str.shift();
  
        if (!isNaN(char) || char === ".") {
          str, (char = this.#parseNumber(str, char));
          parsedArr.push(char);
        } else if (this.operators.includes(char) || "()".includes(char)) {
          parsedArr.push(char);
        } else if (this.#checkAplha(char)) {
          str, (char = this.#parseAlphabet(str, char));
          if (this.functions.includes(char)) {
            parsedArr.push(char);
          } else if (Object.keys(this.consts).includes(char)) {
            parsedArr.push(this.consts[char]);
          } else {
            error = true;
          }
        } else {
          error = true;
        }
      }
      return error ? [] : parsedArr;
    };
  
    // Begin calculating parsed array. startCalculations method is responsible for calculating expressions represented as arrays,
    // handling parentheses recursively, solving mathematical functions and operations
    #startCalculations = (arr, paren = false) => {
      let calculated = [];
      let error;
  
      // // Solve 'P'arenthesis:
      while (arr.length > 0) {
        let char = arr.shift();
        if (char === "(") {
          calculated.push(this.#startCalculations(arr, true));
        } else if (char === ")") {
          if (!paren) error = true;
          arr = [];
        } else calculated.push(char);
      }
  
      if (error) return this.error;
  
      // Reduce functions to numbers
      calculated = this.#solveFunction(calculated);
      // Follow PEDMAS
      calculated = this.#solveExponents(calculated);
      calculated = this.#solveMultiplication(calculated);
      calculated = this.#solveSums(calculated);
  
      // Divide by zero
      if (calculated === Infinity) return this.divideByZeroError;
      return calculated;
    };
  
    // Solve Functions
    // The code appears to handle basic mathematical functions 
    // performs the corresponding operation using the following element in the array. 
    // If there is no match, it simply adds the current element to the solved array.
  
    #solveFunction = (arr) => {
      const solved = [];
      for (let i = 0; i < arr.length; i++) {
        let char = arr[i];
        let next = arr[i + 1];
  
        // Parentheses should be parsed by this point, so it should act on the next number.
        switch (char) {
          case "sqrt":
            solved.push(Math.sqrt(next));
            i++;
            break;
          case "sin":
            solved.push(Math.sin(next));
            i++;
            break;
          case "cos":
            solved.push(Math.cos(next));
            i++;
            break;
          case "tan":
            solved.push(Math.tan(next));
            i++;
            break;
          case "log":
            solved.push(Math.log(next));
            i++;
            break;
          case "ln":
            solved.push(Math.log(next));
            i++;
            break;
          default:
            solved.push(char);
        }
      }
      return solved;
    };
  
    // Solve 'E'xponents:
    //  to identify and compute exponentiation operations within a given array,
    // providing the array of results with the exponentiation operations resolved.
  
    #solveExponents = (arr) => {
      const solved = [];
      let i = 0;
      while (i < arr.length) {
          const char = arr[i];
          if (arr[i + 1] === "^") {
              solved.push(char ** arr[i + 2]);
              i = i + 2;
          } else {
              solved.push(char);
          }
          i++;
      }
  
      return solved.includes("^") ? this.solveExponents(solved) : solved;
  };
  
  
    // Solve 'D'ivision and 'M'ultiplication
    #solveMultiplication = (arr) => {
      const solved = [];
      for (let i = 0; i < arr.length; i++) {
        const char = arr[i];
        if (arr[i + 1] === "/") {
          solved.push(char / arr[i + 2]);
          i = i + 2;
        } else if (arr[i + 1] === "*") {
          solved.push(char * arr[i + 2]);
          i = i + 2;
        } else {
          solved.push(char);
        }
      }
  
      if (solved.includes("*") || solved.includes("/")) {
        return this.#solveMultiplication(solved);
      }
      return solved;
    };
  
    // Solve 'A'ddition and 'S'ubstraction
    #solveSums = (arr) => {
      let sum = arr[0];
      let error = false;
      for (let i = 0; i < arr.length; i++) {
        let char = arr[i];
        if (char === "+") {
          sum += arr[i + 1];
        } else if (char === "-") {
          sum -= arr[i + 1];
        } else if (!Number(char) && char != "=") {
          console.log("solveSumsError: " + char);
          error = true;
        }
      }
      return sum;
    };
  }
  
  export default Calculate;
  