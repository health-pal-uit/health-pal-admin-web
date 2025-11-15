import type { NextPage } from "next";
import { LoginForm } from "./components/login-form";

const LoginPage: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
