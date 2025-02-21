import { ReactNode } from "react";

import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { MathJaxContext } from "better-react-mathjax";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "@/store";

import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <KindeProvider
      clientId={`${import.meta.env.VITE_KINDE_CLIENT_ID}`}
      domain={`${import.meta.env.VITE_KINDE_AUTH_DOMAIN}`}
      logoutUri={`${window.location.origin}`}
      redirectUri={`${window.location.origin}/problems`}
      isDangerouslyUseLocalStorage={true}
    >
      <Provider store={store}>
        <BrowserRouter>
          <Toaster className="bg-transparent" duration={1500} />
          <TooltipProvider>
            <MathJaxContext>{children}</MathJaxContext>
          </TooltipProvider>
        </BrowserRouter>
      </Provider>
    </KindeProvider>
  );
};

export default Providers;
