interface DisplayWindowProps {
  expression: string;
  result: string | number;
}

function DisplayWindow({ expression, result }: DisplayWindowProps) {
  return (
    <div className="mb-4 flex min-h-[100px] flex-col justify-around rounded-xl bg-gray-800 p-4 text-white">
      <p className="break-words text-right text-lg text-gray-400">
        {expression}
      </p>
      <p className="break-words text-right text-2xl font-bold">{result}</p>
    </div>
  );
}

export default DisplayWindow;
