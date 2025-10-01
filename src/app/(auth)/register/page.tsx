"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { 
  validateUsername, 
  validateEmail, 
  validatePassword 
} from "@/lib/validation/validators";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Navbar } from "@/components/layout/Navbar";
import { Toast } from "@/components/layout/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isAuthenticated, logout } = useAuth();
  const { showToast, toastMessage, toastType, hideToast } = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError =
      formData.password !== formData.confirmPassword
        ? "Password tidak cocok"
        : null;

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      setErrors({
        username: usernameError || "",
        email: emailError || "",
        password: passwordError || "",
        confirmPassword: confirmPasswordError || "",
      });
      
      const errorMessages = [
        usernameError,
        emailError,
        passwordError,
        confirmPasswordError
      ].filter(Boolean);
      
      if (errorMessages.length > 0) {
        showToast(errorMessages[0] || "Data tidak valid", "error");
      }
      
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      showToast("Registrasi berhasil! Selamat datang.", "success");
      
      setTimeout(() => {
        router.push("/articles");
      }, 500);
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : "Registrasi gagal. Silakan coba lagi.";
      
      setErrors({
        username: "",
        email: message.includes("Email") || message.includes("username") ? message : "",
        password: message.includes("password") ? message : "",
        confirmPassword: "",
      });
      
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell page-transition bg-[var(--background)] text-slate-900">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} variant="translucent" />
      <div className="section-appear flex items-center justify-center px-4 py-12">
        <Card className="section-appear section-appear-delay-1 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full mb-4 floating-badge">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2">
              Join our travel community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={errors.username}
              icon={<User className="w-5 h-5" />}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[var(--accent-primary)] font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </Card>
      </div>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={hideToast} />}
    </div>
  );
}