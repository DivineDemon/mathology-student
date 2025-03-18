import React, { useState } from "react";

import { CircleAlert, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleOptionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-10">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black p-1 text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        <div className="flex items-center">
          <p className="text-gray-500">Skills:</p>
          <p className="ml-10 font-bold">(As Selected)</p>
          <CircleAlert fill="black" className="ml-4 size-6 text-white" />
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          {/* Radio buttons */}
          <div>
            <input
              type="radio"
              id="option1"
              name="options"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option1" className="ml-2 font-bold">
              Fixed number of questions
            </label>
            <p className="ml-5 text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="flex flex-col">
            {/* Radio buttons */}

            <div className="ml-4 grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label htmlFor="course-select" className="font-semibold">
                  Select Course
                </label>
                <select
                  id="course-select"
                  className="block w-full rounded-lg border border-gray-300 bg-muted p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  disabled={selectedOption !== "option1"}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">--Select a Course--</option>
                  <option value="course1">Course 1</option>
                  <option value="course2">Course 2</option>
                  <option value="course3">Course 3</option>
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="questions-select" className="font-semibold">
                  No. of Questions
                </label>
                <select
                  id="questions-select"
                  className="block w-full rounded-lg border border-gray-300 bg-muted p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  disabled={selectedOption !== "option1"}
                  value={selectedQuestions}
                  onChange={(e) => setSelectedQuestions(e.target.value)}
                >
                  <option value="">--Select Number--</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="difficulty-select" className="font-semibold">
                  Difficulty Level
                </label>
                <select
                  id="difficulty-select"
                  className="block w-full rounded-lg border border-gray-300 bg-muted p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  disabled={selectedOption !== "option1"}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="">--Select Difficulty--</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
          <div className="!mt-8">
            <input
              type="radio"
              id="option2"
              name="options"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option2" className="ml-2 font-bold">
              Accuracy required to finish
            </label>
            <p className="ml-5 text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div>
            <input
              type="radio"
              id="option3"
              name="options"
              value="option3"
              checked={selectedOption === "option3"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option3" className="ml-2 font-bold">
              Keep going until
            </label>
            <p className="ml-5 text-sm text-gray-400">I say</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
