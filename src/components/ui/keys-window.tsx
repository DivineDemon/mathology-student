interface KeysWindowProps {
  handleButton: (value: string) => void;
}

function KeysWindow({ handleButton }: KeysWindowProps) {
  const sciKeys = ["sin", "cos", "ln", "log", "tan", "π", "e", "^", "!", "√"];
  const basicKeys = [
    "AC",
    "(",
    ")",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "DEL",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        {sciKeys.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButton(item)}
            className="rounded-lg bg-indigo-200 p-2 font-bold text-indigo-800 hover:bg-indigo-300"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="my-2 border-t border-gray-300"></div>

      <div className="grid grid-cols-4 gap-2">
        {basicKeys.map((item, index) => (
          <button
            key={index}
            className={`rounded-lg p-3 text-lg font-bold ${
              item === "="
                ? "col-span-4 bg-primary text-white hover:bg-primary/90"
                : item === "AC" || item === "DEL"
                  ? "bg-red-300 text-red-800 hover:bg-red-400"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleButton(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default KeysWindow;
