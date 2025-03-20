import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import MDEditor from "@uiw/react-md-editor";
import { Loader2, Send } from "lucide-react";
import { useParams } from "react-router-dom";

import { usePostMathSolutionMutation } from "@/store/services/math";

import { Input } from "./ui/input";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

const ChatBot = () => {
  const { id } = useParams();
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, { isLoading }] = usePostMathSolutionMutation();

  const handleToken = async () => {
    const newToken = getToken ? await getToken() : "";
    setToken(newToken ?? "");
  };

  const handleChat = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    const botLoadingMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: "Thinking...",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, botLoadingMessage]);
    setInput("");

    try {
      const response = await chat({
        question_id: Number(id),
        query: input.trim(),
        token: token,
      });

      if (response.data) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isLoading
              ? {
                  id: Date.now(),
                  sender: "bot",
                  text: response.data.response,
                }
              : msg
          )
        );
      } else {
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                id: Date.now(),
                sender: "bot",
                text: "Something went wrong. Try again!",
              }
            : msg
        )
      );
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "bot" ? "mr-auto" : "ml-auto"} items-start gap-2`}
          >
            {message.sender === "bot" ? (
              <>
                <span className="size-10 shrink-0 rounded-full border bg-white p-2 text-center text-primary shadow-md">
                  M
                </span>
                <span className="rounded-md rounded-tr-2xl bg-gray-100 px-4 py-2 text-sm text-primary">
                  {message.isLoading ? (
                    <Loader2 className="size-7 animate-spin" />
                  ) : (
                    <MDEditor.Markdown
                      source={message.text as string}
                      style={{
                        background: "transparent",
                        padding: 0,
                        color: "black",
                      }}
                    />
                  )}
                </span>
              </>
            ) : (
              <span className="rounded-md rounded-tl-2xl bg-primary px-4 py-2 text-sm text-white">
                <MDEditor.Markdown
                  source={message.text as string}
                  style={{
                    background: "transparent",
                    padding: 0,
                    color: "white",
                  }}
                />
              </span>
            )}
          </div>
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
            className="h-14 flex-1 rounded-md border-none text-sm focus:outline-none focus:outline-0 focus:ring-0 focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
            placeholder="Type a message..."
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex size-9 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed"
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
