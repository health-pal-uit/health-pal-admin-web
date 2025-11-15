"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmitting(true);
    toast.loading("Signing in...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      toast.dismiss();

      if (!res.ok) {
        toast.error(result.message || "An error occurred");
      } else {
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <Image
            src="/image/health-pal-logo.png"
            width={70}
            height={70}
            alt="Health Pal Logo"
            className="rounded-lg"
          />

          <h1 className="text-2xl font-bold text-primary mt-2">
            Health Pal Admin
          </h1>

          <p className="text-base-content/60">
            Sign in to manage your dashboard
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex w-full flex-col gap-4 text-left"
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="admin@healthpal.com"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <div className="flex justify-between">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                {/* <label className="label">
                                    <a
                                        href="#"
                                        className="link link-primary label-text-alt"
                                    >
                                        Forgot password?
                                    </a>
                                </label> */}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-4 text-xs text-base-content/60">
            Protected by Health Pal Security
          </div>
        </div>
      </div>
    </>
  );
};
