import { Check, FileWarning, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  description: string;
  buttonText: string;
  onClose: () => void;
  cta?: () => void;
  buttonType: "default" | "destructive";
}

const Modal = ({
  title,
  description,
  buttonText,
  onClose,
  buttonType,
  cta,
}: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative flex w-full max-w-lg flex-col items-center justify-center gap-10 rounded-2xl bg-white p-10">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-black p-1 text-white"
        >
          <X className="h-4 w-4" />
        </button>
        {title === "Correct" ? (
          <Check className="size-14 text-green-500" />
        ) : (
          <FileWarning className="size-14 text-destructive" />
        )}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h2 className="w-full text-center text-2xl font-semibold">{title}</h2>
          <p className="w-full text-center text-xs text-gray-400">
            {description}
          </p>
        </div>
        <Button
          onClick={() => {
            if (cta) {
              cta();
            }
            onClose();
          }}
          variant={buttonType}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Modal;
