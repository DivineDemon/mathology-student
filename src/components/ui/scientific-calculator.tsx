import { useEffect, useState } from "react";

import { evaluate } from "mathjs";

import DisplayWindow from "./display-window";
import KeysWindow from "./keys-window";

function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [displayEXP, setDisplayEXP] = useState("");
  const [result, setResult] = useState("0");

  const sciFunc: { [key: string]: string } = {
    sin: "sin",
    cos: "cos",
    tan: "tan",
    ln: "log",
    log: "log10",
    π: "pi",
    e: "e",
    "^": "^",
    "√": "sqrt",
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      if (key >= "0" && key <= "9") handleButton(key);
      else if (key === "Enter" || key === "=") handleButton("=");
      else if (key === "Backspace") handleButton("DEL");
      else if (key === "Escape") handleButton("AC");
      else if (["+", "-", "*", "/", ".", "(", ")"].includes(key))
        handleButton(key);
      else if (key === "s") handleButton("sin");
      else if (key === "c") handleButton("cos");
      else if (key === "t") handleButton("tan");
      else if (key === "l") handleButton("ln");
      else if (key === "L") handleButton("log");
      else if (key === "p") handleButton("π");
      else if (key === "e") handleButton("e");
      else if (key === "^") handleButton("^");
      else if (key === "r") handleButton("√");
      else if (key === "!") handleButton("!");
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [expression, displayEXP]);

  function calcResult() {
    if (expression.length !== 0) {
      try {
        let compute = evaluate(expression);
        compute = parseFloat(compute.toFixed(4));
        setResult(compute);
      } catch (error) {
        setResult("Error");
      }
    } else {
      setResult("An Error Occured!");
    }
  }

  function handleButton(value: string) {
    if (value === "AC") {
      setExpression("");
      setDisplayEXP("");
      setResult("0");
    } else if (value === "=") {
      calcResult();
    } else if (value === "DEL") {
      setDisplayEXP(displayEXP.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else if (Object.prototype.hasOwnProperty.call(sciFunc, value)) {
      // Automatically add parentheses for scientific functions
      setDisplayEXP(displayEXP + value + "(");
      setExpression(expression + sciFunc[value] + "(");
    } else if (value === "!") {
      const lastNum = extractLastNum(expression);
      if (lastNum != null) {
        const num = parseFloat(lastNum);
        setDisplayEXP(displayEXP + value);
        setExpression(expression.replace(lastNum, factorial(num).toString()));
      }
    } else {
      setExpression(expression + value);
      setDisplayEXP(displayEXP + value);
    }
  }

  function factorial(n: number) {
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }

  function extractLastNum(exp: string) {
    const numbers = exp.match(/\d+/g);
    return numbers ? numbers[numbers.length - 1] : null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px] rounded-2xl bg-white p-6 shadow-2xl">
        <DisplayWindow expression={displayEXP} result={result} />
        <KeysWindow handleButton={handleButton} />
      </div>
    </div>
  );
}

export default ScientificCalculator;
