import { useState } from "react";

import Bot from "@/assets/img/bot.svg";

import GeneralBot from "./general-bot";
import { Sheet, SheetContent } from "./ui/sheet";

const BotIcon = () => {
  const [chat, setChat] = useState<boolean>(false);

  return (
    <div>
      <Sheet
        open={chat}
        onOpenChange={() => {
          setChat(false);
        }}
      >
        <SheetContent className="flex h-full w-full flex-col items-start justify-start p-0">
          <GeneralBot />
        </SheetContent>
      </Sheet>
      <div
        className="size-10 cursor-pointer rounded-full bg-primary p-2 transition duration-150 ease-in-out hover:scale-105"
        onClick={() => setChat(true)}
      >
        <img src={Bot} alt="" className="brightness-30 size-full" />
      </div>
    </div>
  );
};

export default BotIcon;
