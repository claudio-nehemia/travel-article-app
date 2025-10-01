"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { Toast } from "@/components/layout/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { showToast, toastMessage, toastType, hideToast } = useToast();
  
  const [formData, setFormData] = useState({ 
    identifier: "", 
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData.identifier, formData.password);
      showToast("Login berhasil! Mengalihkan ke halaman artikel...", "success");

      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push("/articles");
      }, 500);
    } catch (error: unknown) {
      console.error("Login error:", error);

      const message = (() => {
        if (typeof error === "object" && error !== null) {
          const maybeAxiosError = error as {
            response?: { data?: { error?: { message?: string } } };
          };

          const apiMessage = maybeAxiosError.response?.data?.error?.message;
          if (typeof apiMessage === "string" && apiMessage.trim()) {
            return apiMessage;
          }
        }

        if (error instanceof Error && error.message) {
          return error.message;
        }

        return "Gagal login. Periksa kembali email/username dan password Anda.";
      })();

      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page-shell page-transition bg-[var(--background)] text-slate-900">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} variant="translucent" />
      <div className="section-appear flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] floating-badge">
            <User className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Masuk ke akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Atau{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]"
            >
              daftar akun baru
            </Link>
          </p>
        </div>
        
        <Card className="section-appear section-appear-delay-1 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Email atau Username
              </label>
              <Input
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Masukkan email atau username"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Masuk'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={hideToast} />}
      </div>
    </div>
  );
}