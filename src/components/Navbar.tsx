"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Terminal, Menu, X, Moon, Sun, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Initial theme setup from current class
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem("theme");
      // Only auto-update if no manual preference is stored in localStorage
      if (!storedTheme) {
        const isDark = e.matches;
        setTheme(isDark ? "dark" : "light");
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80; // Adjust for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Methodology", href: "#how-it-works" },
    { name: "Capabilities", href: "#features" },
    { name: "Intelligence", href: "#demo" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-center">
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-8 px-8 py-3 rounded-full transition-all duration-500 border glass",
            isScrolled
              ? "w-full max-w-5xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-white/20"
              : "w-full max-w-6xl border-transparent shadow-none"
          )}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-brand-foreground shadow-lg shadow-brand/40 group-hover:rotate-12 transition-transform">
              <Cpu size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter">StackFix<span className="text-brand">AI</span></span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Studio Edition</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-6 border-l pl-10 border-border/50">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <div className="w-[18px] h-[18px]" />}
              </button>
              <button
                onClick={(e) => scrollToSection(e, "#demo")}
                className="px-6 py-2.5 bg-foreground text-background rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg"
              >
                Launch Hub
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden px-2">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-xl bg-muted/50 text-foreground"
            >
               {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <div className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-4 right-4 z-40"
          >
            <div className="bg-card/90 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-2xl font-black tracking-tight hover:text-brand transition-colors px-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="h-px bg-border/50" />
              <button
                onClick={(e) => scrollToSection(e, "#demo")}
                className="w-full py-5 bg-brand text-brand-foreground rounded-[2rem] text-center font-black uppercase tracking-widest text-sm shadow-xl shadow-brand/20 active:scale-95 transition-transform"
              >
                Launch Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
