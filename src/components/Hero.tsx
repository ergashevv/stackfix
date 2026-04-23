"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden hero-gradient noise-bg">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[11px] font-bold mb-8 tracking-[0.2em] uppercase ring-4 ring-brand/5"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>The Future of Debugging</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-foreground">
              Debug with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand via-indigo-400 to-accent-amber">
                Intelligence.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium">
              Transcend standard error logs. StackFix AI merges Gemini's advanced reasoning with millions of community solutions to resolve complex bugs in milliseconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <Link
                href="#demo"
                className="group relative px-10 py-5 bg-brand text-brand-foreground rounded-3xl font-bold flex items-center gap-3 overflow-hidden shadow-2xl shadow-brand/20 hover:scale-[1.02] transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Try Interactive Demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-10 py-5 bg-background/50 backdrop-blur-xl text-foreground border border-border rounded-3xl font-bold hover:bg-muted transition-all active:scale-95"
              >
                Our Methodology
              </Link>
            </div>

            {/* Social Proof / Tech Logos */}
            <div className="mt-20 pt-10 border-t border-border/50 w-full">
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em] mb-8">
                Optimized for Modern Stacks
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-6 items-center opacity-30 grayscale contrast-125">
                {['React', 'Next.js', 'Python', 'TypeScript', 'Node.js', 'Go'].map((tech) => (
                  <span key={tech} className="text-lg font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Immersive Floating Elements */}
            <div className="relative z-10 p-1 bg-gradient-to-br from-brand/20 via-transparent to-accent-amber/20 rounded-[3rem] premium-shadow">
              <div className="bg-card/80 backdrop-blur-3xl rounded-[2.8rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="ml-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">reasoning_engine.log</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                      <Zap size={20} />
                    </div>
                    <div className="h-4 w-48 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-brand animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left delay-200 duration-700">
                    <div className="w-10 h-10 rounded-2xl bg-accent-amber/10 flex items-center justify-center text-accent-amber">
                      <Database size={20} />
                    </div>
                    <div className="h-4 w-64 bg-muted rounded-full" />
                  </div>
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left delay-500 duration-700">
                    <div className="w-10 h-10 rounded-2xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="h-4 w-32 bg-muted rounded-full" />
                  </div>
                </div>
                <div className="px-8 py-6 bg-brand/[0.03] border-t border-border/30">
                    <p className="font-mono text-xs text-brand/80 leading-relaxed">
                      [INFO] Analyzing stack trace... <br />
                      [SUCCESS] Identified root cause in line 42. <br />
                      [ACTION] Synthesizing fix...
                    </p>
                </div>
              </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand/30 rounded-full blur-[120px] -z-10 animate-pulse" />
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-amber/20 rounded-3xl blur-[60px] -z-10" 
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[200%] h-[120%] border-[1px] border-brand rounded-full" />
        <div className="absolute top-[-20%] right-[-20%] w-[200%] h-[120%] border-[1px] border-brand rounded-full" />
      </div>
    </section>
  );
}
