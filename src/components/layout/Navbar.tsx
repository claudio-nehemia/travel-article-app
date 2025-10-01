"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, LogIn, UserPlus, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { User } from "@/lib/types";

interface NavbarProps {
  isAuthenticated: boolean;
  user?: User | null;
  onLogout?: () => void;
  variant?: "default" | "translucent";
  className?: string;
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Destinations", path: "/articles" },
];

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  user,
  onLogout,
  variant = "default",
  className = "",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setMobileMenuOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  const baseNavStyle =
    "bg-white/90 backdrop-blur border-b border-slate-200/70 shadow-sm";
  const translucentStyle =
    "bg-white/70 backdrop-blur-lg border-b border-white/60 shadow-sm";

  const containerClasses = useMemo(
    () =>
      [
        "sticky top-0 z-50",
        variant === "translucent" ? translucentStyle : baseNavStyle,
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className, variant]
  );

  return (
    <nav className={containerClasses}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="group flex items-center gap-3"
          onClick={() => handleNavigate(isAuthenticated ? "/articles" : "/")}
        >
          <span className="relative h-12 w-12 overflow-hidden rounded-2xl transition-transform group-hover:scale-105">
            <Image
              src="/app-logo.svg"
              alt="Travel Explorer logo"
              fill
              sizes="48px"
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="flex flex-col text-left">
            <span className="text-lg font-semibold text-slate-800">
              Travel Explorer
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Explore the World
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigate(link.path)}
                className={`transition-colors hover:text-slate-900 ${
                  isActive(link.path) ? "text-slate-900" : ""
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button
                variant={isActive("/articles/create") ? "secondary" : "ghost"}
                onClick={() => handleNavigate("/articles/create")}
                className="hidden xl:inline-flex"
              >
                <Plus className="h-4 w-4" />
                New Article
              </Button>
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {user?.username}
                </span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
              <Button variant="danger" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => handleNavigate("/login")}>
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button variant="primary" onClick={() => handleNavigate("/register")}>
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-md border border-slate-200 p-2 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 lg:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200/70 bg-white/90 px-4 py-5 backdrop-blur lg:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                className="w-full rounded-xl border border-transparent px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
                onClick={() => handleNavigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handleNavigate("/articles/create")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4" />
                  New Article
                </Button>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{user?.username}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Button variant="danger" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigate("/login")} className="w-full">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
                <Button variant="primary" onClick={() => handleNavigate("/register")} className="w-full">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};