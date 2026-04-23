"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Target, Link as LinkIcon, Monitor, Shield, Code } from "lucide-react";

export default function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: <Zap className="text-amber-500" />,
      title: "AI-powered debugging",
      description: "Harness the power of Gemini to decipher complex stack traces and cryptic error messages."
    },
    {
      icon: <Target className="text-red-500" />,
      title: "Root cause analysis",
      description: "Don't just fix symptoms. Identify the underlying logic flaw that caused the exception."
    },
    {
      icon: <LinkIcon className="text-blue-500" />,
      title: "Stack Overflow integration",
      description: "Bridge AI advice with real-world solutions from the global developer community."
    },
    {
      icon: <Monitor className="text-emerald-500" />,
      title: "Clean developer UX",
      description: "A minimalist interface designed by developers, for developers. No distractions."
    },
    {
      icon: <Shield className="text-purple-500" />,
      title: "Context-aware fixes",
      description: "Get code suggestions that actually follow your project's syntax and patterns."
    },
    {
      icon: <Code className="text-foreground" />,
      title: "Open Ecosystem",
      description: "Works with JavaScript, TypeScript, Python, Node.js, and more modern stacks."
    }
  ];

  return (
    <section id="features" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-brand uppercase tracking-widest mb-3 text-center md:text-left">Capabilities</h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tight text-center md:text-left">Built for the modern <br /> development lifecycle</p>
          </div>
          <p className="text-muted-foreground max-w-sm text-center md:text-left">
            Everything you need to spend less time debugging and more time building what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-border bg-background/50 backdrop-blur-sm hover:shadow-xl hover:shadow-brand/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
