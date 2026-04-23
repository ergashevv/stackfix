"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Search, Zap, ArrowRight, Layers } from "lucide-react";

export default function HowItWorks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [
    {
      icon: <Layers size={28} className="text-brand" />,
      title: "Contextual Ingestion",
      description: "Feed the pipeline with raw stack traces or cryptic error segments. We ingest the full execution context.",
      number: "01",
      accent: "from-brand/20 to-brand/5"
    },
    {
      icon: <Cpu size={28} className="text-accent-amber" />,
      title: "Neural Deconstruction",
      description: "Gemini's high-entropy reasoning models map patterns across millions of verified debugging cycles.",
      number: "02",
      accent: "from-accent-amber/20 to-accent-amber/5"
    },
    {
      icon: <Search size={28} className="text-accent-emerald" />,
      title: "Synthesis & Delivery",
      description: "Receive a structured debugging workflow, blending AI intuition with proven community solutions.",
      number: "03",
      accent: "from-accent-emerald/20 to-accent-emerald/5"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-background relative noise-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>The Pipeline</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Our <span className="text-brand">Methodology</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            A three-stage refinement process designed to eliminate cognitive overhead in the debugging lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group lg:hover:-translate-y-4 transition-transform duration-500"
            >
              <div className={cn(
                "p-10 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-3xl h-full shadow-2xl shadow-black/5 relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:-z-10",
                step.accent === "from-brand/20 to-brand/5" ? "before:from-brand/5 before:to-transparent" : 
                step.accent === "from-accent-amber/20 to-accent-amber/5" ? "before:from-accent-amber/5 before:to-transparent" : 
                "before:from-accent-emerald/5 before:to-transparent"
              )}>
                <div className="absolute top-8 right-10 text-8xl font-black text-foreground/5 group-hover:text-foreground/10 transition-all select-none">
                  {step.number}
                </div>
                
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner ring-1 ring-white/10",
                  "bg-gradient-to-br",
                  step.accent
                )}>
                  {step.icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand group-hover:gap-4 transition-all">
                  Phase Details <ArrowRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility to handle classes without importing cn if it conflicts
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
