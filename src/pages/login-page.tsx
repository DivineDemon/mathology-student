import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";

import Loginimg from "@/assets/img/login.svg";
import Logo from "@/assets/img/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const { login, isAuthenticated } = useKindeAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email) {
      await login({
        authUrlParams: {
          connection_id: `${import.meta.env.VITE_KINDE_EMAIL_CONNECTION_ID}`,
          login_hint: email,
        },
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/problems");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-5">
      <div className="mb-4 flex w-full max-w-lg justify-start lg:max-w-full">
        <img src={Logo} alt="" className="lg:mx-[12%]" />
      </div>
      <div className="grid w-full max-w-lg grid-cols-1 gap-4 overflow-hidden lg:max-w-6xl lg:grid-cols-2">
        <div className="relative col-span-1 flex w-full flex-col items-center justify-center gap-5 rounded-[30px] border bg-white p-5 dark:bg-slate-900 lg:p-10 xl:p-20">
          <div className="flex w-full flex-col items-center">
            <p className="text-xl font-bold">Login</p>
            <p className="text-xs text-gray-400">
              Login to your existing account of Mathology
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="email" className="w-full text-left">
              Email
            </Label>
            <Input
              type="email"
              placeholder="johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>
        <div className="col-span-1 hidden w-full items-center justify-center rounded-[30px] bg-white dark:bg-slate-900 lg:flex">
          <img src={Loginimg} alt="Login" />
        </div>
      </div>
      <p className="mt-4 text-center text-gray-400">
        © 2024 <span className="text-primary">mathology</span>. All Rights
        Reserved{" "}
      </p>
    </div>
  );
};

export default LoginPage;
