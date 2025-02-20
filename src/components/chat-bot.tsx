import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Send } from "lucide-react";

import { useChatbotMutation } from "@/store/services/math";

import { Input } from "./ui/input";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBot = () => {
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [chat, { isLoading }] = useChatbotMutation();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleToken = async () => {
    let test: string | undefined = "";

    if (getToken) {
      test = await getToken();
    }

    setToken(test ?? "");
  };

  const handleChat = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    const response = await chat({
      question_title: input.trim(),
      token: `${token}`,
    });

    if (response.data) {
      const botMessage: Message = {
        sender: "bot",
        text: response.data.solution_explain,
      };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    }
  };

  useEffect(() => {
    handleToken();
  }, [getToken]);

  return (
    <div className="h-full w-full rounded-2xl bg-popover p-2">
      <div className="flex items-center rounded-2xl bg-primary px-4">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-popover">
          <div className="absolute bottom-0 right-0 size-5 rounded-full border-2 border-primary bg-green-500"></div>
          <h1 className="text-4xl font-bold text-primary">M</h1>
        </div>
        <div className="flex flex-col items-start justify-between p-4">
          <h2 className="text-lg font-semibold text-white">
            Mathology Support
          </h2>
          <p className="text-white">Online</p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-182px)] flex-col items-start justify-start gap-4 overflow-y-auto p-4">
        {messages.map((message, idx) => (
          <>
            {message.sender === "bot" && (
              <div
                key={idx}
                className="mr-auto flex items-start justify-start gap-2"
              >
                <span className="size-10 shrink-0 rounded-full border bg-white p-2 text-center text-primary shadow-md">
                  M
                </span>
                <span className="rounded-md rounded-tr-2xl bg-gray-100 px-4 py-2 text-sm text-primary">
                  {message.text}
                </span>
              </div>
            )}
            {message.sender === "user" && (
              <span className="ml-auto rounded-md rounded-tl-2xl bg-primary px-4 py-2 text-sm text-white">
                {message.text}
              </span>
            )}
          </>
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChat();
          }}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100 pr-4"
        >
          <Input
            type="text"
            className="h-14 flex-1 rounded-md text-sm focus:outline-none focus:outline-0 focus:ring-0 focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
            placeholder="Type a message..."
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex size-9 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="w-full text-center text-xs text-gray-400">
          Chat ⚡️ by <span className="text-primary">BotMythology</span>
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
