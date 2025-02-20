import { useState } from "react";

import { Button } from "@/components/ui/button";

// Assume Button is a reusable component.

const ScientificCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>("");

  const handleButtonClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleEvaluate = () => {
    try {
      // Using `eval` for simplicity, for production use, avoid using `eval` for security reasons.
      setResult(eval(input));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleScientificFunction = (func: string) => {
    try {
      if (func === "sqrt") {
        setInput(`Math.sqrt(${input})`);
      } else if (func === "sin") {
        setInput(`Math.sin(${input})`);
      } else if (func === "cos") {
        setInput(`Math.cos(${input})`);
      } else if (func === "tan") {
        setInput(`Math.tan(${input})`);
      }
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-xs rounded-lg bg-white p-4 shadow-md">
      {/* Display Section */}
      <div className="mb-4 flex flex-col items-center">
        <div className="mb-2 text-2xl font-semibold">Scientific Calculator</div>
        <div className="h-16 w-full overflow-hidden break-words rounded-lg bg-gray-200 p-4 text-right text-xl">
          <p>{input || "0"}</p>
        </div>
        <div className="mt-2 h-10 w-full rounded-lg bg-gray-100 p-4 text-right text-2xl">
          <p>{result}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          className="col-span-3 bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={handleClear}
        >
          C
        </Button>
        <Button
          className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={handleBackspace}
        >
          ⬅
        </Button>
        {/* Numeric & Operations Buttons */}
        {["7", "8", "9", "/"].map((value) => (
          <Button
            key={value}
            className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}
        {["4", "5", "6", "*"].map((value) => (
          <Button
            key={value}
            className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}
        {["1", "2", "3", "-"].map((value) => (
          <Button
            key={value}
            className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}
        {["0", ".", "=", "+"].map((value) => (
          <Button
            key={value}
            className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
            onClick={() =>
              value === "=" ? handleEvaluate() : handleButtonClick(value)
            }
          >
            {value}
          </Button>
        ))}

        {/* Scientific Function Buttons */}
        <Button
          className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={() => handleScientificFunction("sqrt")}
        >
          √
        </Button>
        <Button
          className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={() => handleScientificFunction("sin")}
        >
          sin
        </Button>
        <Button
          className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={() => handleScientificFunction("cos")}
        >
          cos
        </Button>
        <Button
          className="bg-primary p-4 text-2xl font-semibold hover:bg-primary/70"
          onClick={() => handleScientificFunction("tan")}
        >
          tan
        </Button>

        {/* Additional Buttons */}
      </div>
    </div>
  );
};

export default ScientificCalculator;
