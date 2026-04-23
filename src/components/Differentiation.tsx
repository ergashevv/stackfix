"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Hash, Zap } from "lucide-react";

export default function Differentiation() {
  const points = [
    {
      icon: <Cpu className="text-brand" />,
      title: "AI Reasoning (Gemini)",
      description: "Deep structural analysis of stack traces to find the underlying logic flaw."
    },
    {
      icon: <Hash className="text-brand" />,
      title: "Real Developer Knowledge",
      description: "Direct integration with Stack Overflow to verify AI suggestions against reality."
    },
    {
      icon: <Zap className="text-brand" />,
      title: "Actionable Workflow",
      description: "Structured debugging steps and instant fix previews, not just a chatbot response."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold text-brand uppercase tracking-widest mb-3">The StackFix Advantage</h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built different for developers</p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Unlike generic AI tools that hallucinate or provide vague advice, StackFix AI combines 
            deep logical deduction with community-verified solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-6">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-brand/5 border border-brand/10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-brand text-brand-foreground">
               <ShieldCheck size={32} />
             </div>
             <div>
               <p className="font-bold text-lg">Trusted Analysis</p>
               <p className="text-sm text-muted-foreground">Combining AI reasoning with 15+ years of SO data.</p>
             </div>
          </div>
          <p className="text-sm font-medium px-4 py-2 rounded-full bg-background border border-border shadow-sm">
             Actionable debugging. <span className="text-brand">Zero Hallucinations.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
