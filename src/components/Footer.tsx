"use client";
import React from "react";
import Link from "next/link";
import { Terminal, Mail, MapPin, Share, Code, Globe } from "lucide-react";

export default function Footer() {
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === "/") {
       window.scrollTo({ top: 0, behavior: "smooth" });
       return;
    }
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <button onClick={(e) => scrollToSection(e, "/")} className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground">
                <Terminal size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                StackFix<span className="text-brand">AI</span>
              </span>
            </button>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
              The AI-powered debugging assistant that bridges the gap between complex errors and real community solutions.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:info@soso.uz" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors">
                <Mail size={16} />
                info@soso.uz
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                Tashkent, Uzbekistan
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Product</h4>
            <ul className="space-y-4">
              <li><button onClick={(e) => scrollToSection(e, "#features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
              <li><button onClick={(e) => scrollToSection(e, "#how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workflow</button></li>
              <li><button onClick={(e) => scrollToSection(e, "#demo")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</button></li>
              <li><button onClick={(e) => scrollToSection(e, "#use-cases")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="p-2 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand transition-all"><Share size={18} /></a>
              <a href="https://github.com" className="p-2 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand transition-all"><Code size={18} /></a>
              <a href="https://linkedin.com" className="p-2 rounded-lg bg-muted hover:bg-brand/10 hover:text-brand transition-all"><Globe size={18} /></a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 StackFix AI. Built with ❤️ in Uzbekistan.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
