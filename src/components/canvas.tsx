import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Pen from "@/assets/img/pen.svg";
import Refresh from "@/assets/img/refresh.svg";
import Eraser from "@/assets/img/eraser.svg"
import { KonvaEventObject } from "konva/lib/Node";
import { Layer, Line, Stage } from "react-konva";

type Tool = "pen" | "eraser";
type LineElement = {
  id: string;
  tool: Tool;
  points: number[];
  strokeWidth: number;
  stroke: string;
  tension: number;
  lineCap: "round" | "square" | "butt";
  globalCompositeOperation: string;
};

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas = forwardRef(({ width, height }: CanvasProps, ref) => {
  const stageRef = useRef<any>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [lines, setLines] = useState<LineElement[]>([]);
  const [history, setHistory] = useState<LineElement[][]>([]);

  const containerHeight = height || 500;
  const containerWidth = width || window.innerWidth - 50;

  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
    clearCanvas: () => {
      setLines([]);
      setHistory([]);
    },
    getLines: () => lines,
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lines]);

  useEffect(() => {
    const handleResize = () => {
      if (!width || !height) {
        setLines([...lines]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height, lines]);

  const handleMouseDown = (
    e: KonvaEventObject<TouchEvent> | KonvaEventObject<MouseEvent>
  ) => {
    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const newLine: LineElement = {
      id: Date.now().toString(),
      tool,
      points: [pos.x, pos.y],
      strokeWidth,
      stroke: tool === "pen" ? "#000000" : "#000000",
      tension: 0.5,
      lineCap: "round",
      globalCompositeOperation:
        tool === "pen" ? "source-over" : "destination-out",
    };

    setLines([...lines, newLine]);
    setHistory([...history, [...lines]]);
  };

  const handleMouseMove = (
    e: KonvaEventObject<TouchEvent> | KonvaEventObject<MouseEvent>
  ) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines(lines.slice(0, -1).concat([lastLine]));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (history.length === 0) {
      setLines([]);
      return;
    }

    const previousState = history.pop();
    setHistory([...history]);

    if (previousState) {
      setLines(previousState);
    }
  };

  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-5">
      <div className="flex w-full items-center justify-start gap-4">
        <button
          className={`rounded-lg px-2 py-2 ${tool === "pen" ? "bg-blue-200 " : "bg-gray-200"}`}
          onClick={() => handleToolChange("pen")}
        >
        <img src={Pen} alt="" />
        </button>
        <button
          className={`rounded-lg px-3 py-3 ${tool === "eraser" ? "bg-blue-200 text-white" : "bg-gray-200"}`}
          onClick={() => handleToolChange("eraser")}
        >
         <img src={Eraser} alt="" />
        </button>
        <div className="flex items-center gap-2">
          <label>Pen/Eraser Size: </label>
          <input
            type="range"
            min="1"
            max="30"
            value={strokeWidth}
            onChange={handleSizeChange}
            className="w-32"
          />
          <span>{strokeWidth}px</span>
        </div>
        <button
          className="rounded-lg bg-gray-200 px-2 py-2"
          onClick={handleUndo}
          disabled={lines.length === 0 && history.length === 0}
        >
          <img src={Refresh} alt="" />
        </button>
      </div>
      <div className="h-full w-full">
        <Stage
          width={containerWidth}
          height={containerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line) => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={line.tension}
                lineCap={line.lineCap}
                // @ts-ignore
                globalCompositeOperation={line.globalCompositeOperation}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
