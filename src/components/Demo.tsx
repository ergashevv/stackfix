"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Lightbulb, 
  Hash, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "./ErrorBoundary";

interface AnalysisResult {
  language: string;
  framework: string;
  error_type: string;
  error_category: string;
  explanation: string;
  root_cause: string;
  fix_steps: string[];
  fix_summary: string;
  before_code: string;
  after_code: string;
  confidence: number;
  soLinks: { 
    title: string; 
    link: string; 
    score: number; 
    is_answered: boolean; 
    has_accepted: boolean; 
    tags: string[] 
  }[];
}

export default function Demo() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadingSteps = [
    "Analyzing error with AI reasoning...",
    "Searching real developer solutions from Stack Overflow...",
    "Ranking best community answers...",
    "Structuring actionable debugging workflow..."
  ];

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      // Step 1: Analyze with Gemini
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: input }),
      });

      const analysisData = await analyzeRes.json();
      
      if (!analyzeRes.ok || analysisData.error) {
        throw new Error(analysisData.message || analysisData.details || "Failed to analyze error");
      }

      // Step 2: Get Stack Overflow links using Gemini's optimized search query
      let soLinks = [];
      try {
        const soRes = await fetch("/api/stackoverflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            keywords: analysisData.search_query || analysisData.keywords || input.slice(0, 50) 
          }),
        });
        
        if (soRes.ok) {
          const soData = await soRes.json();
          soLinks = soData.links || [];
        }
      } catch (soErr) {
        console.error("Stack Overflow fetch failed:", soErr);
      }

      setResult({
        language: analysisData.language || "Unknown",
        framework: analysisData.framework || "Vanilla",
        error_type: analysisData.error_type || "Error",
        error_category: analysisData.error_category || "General",
        explanation: analysisData.explanation || "No explanation provided.",
        root_cause: analysisData.root_cause || "Root cause could not be determined.",
        fix_steps: Array.isArray(analysisData.fix_steps) ? analysisData.fix_steps : [],
        fix_summary: analysisData.fix_summary || "Adjust your code following the suggested pattern.",
        before_code: analysisData.before_code || "",
        after_code: analysisData.after_code || "",
        confidence: typeof analysisData.confidence === 'number' ? analysisData.confidence : 0.85,
        soLinks: Array.isArray(soLinks) ? soLinks : [],
      });
      
    } catch (err: any) {
      console.error("Analysis process error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const highlightCode = (code: string) => {
    if (!code) return "";
    
    // 1. Strip markdown code blocks if present
    let cleanCode = code;
    const markdownMatch = code.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    if (markdownMatch) {
      cleanCode = markdownMatch[1].trim();
    } else {
      cleanCode = code.trim();
    }
    
    // 2. Escape utility
    const escape = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 3. Define token patterns (Single pass regex to avoid nesting)
    // Priority: Comments > Strings > Keywords > Constants > Functions > Classes > Numbers
    const tokenRegex = /(\/\/.+)|(['"`].*?['"`])|\b(const|let|var|function|return|if|else|for|while|import|export|from|class|try|catch|async|await|def|with|as|yield|lambda|type|interface|enum)\b|\b(true|false|null|undefined|None)\b|(\w+)(?=\s*\()|\b([A-Z]\w+)\b|\b(\d+)\b/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(cleanCode)) !== null) {
      // Add text before the match
      parts.push(escape(cleanCode.substring(lastIndex, match.index)));
      
      const [full, com, str, key, con, fn, cls, num] = match;
      
      if (com) parts.push(`<span class="text-slate-500 italic">${escape(com)}</span>`);
      else if (str) parts.push(`<span class="text-[#98c379]">${escape(str)}</span>`);
      else if (key) parts.push(`<span class="text-[#c678dd]">${key}</span>`);
      else if (con) parts.push(`<span class="text-[#56b6c2]">${con}</span>`);
      else if (fn) parts.push(`<span class="text-[#61afef]">${fn}</span>`);
      else if (cls) parts.push(`<span class="text-[#e5c07b]">${cls}</span>`);
      else if (num) parts.push(`<span class="text-[#d19a66]">${num}</span>`);
      else parts.push(escape(full));

      lastIndex = tokenRegex.lastIndex;
    }
    
    // Add remaining text
    parts.push(escape(cleanCode.substring(lastIndex)));

    return parts.join("");
  };

  const MarkdownText = ({ text }: { text: string }) => {
    if (!text) return null;
    
    // Split text by **bold** and `code` patterns
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-extrabold text-foreground">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={i} className="px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/50 font-mono text-[0.9em] text-brand whitespace-nowrap">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </>
    );
  };

  if (!mounted) return null;

  return (
    <section id="demo" className="py-32 bg-background relative overflow-hidden noise-bg">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/10 blur-[180px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-amber/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-[0.2em] uppercase">
              <Cpu size={12} />
              <span>Neural Debugging Pipeline</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Experience the <span className="text-brand">Analytical Hub</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Witness Gemini's cognitive flow as it deconstructs your code's architecture and builds a bridge to community-proven solutions.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input Panel - The 'Ingestion' phase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 sticky top-32"
          >
            <div className="rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-white/10 premium-shadow">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand/10 text-brand">
                    <Terminal size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest uppercase text-foreground">Data Ingestion</span>
                    <span className="text-[10px] text-muted-foreground">UTF-8 Input Stream</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-border" />
                  ))}
                </div>
              </div>
              <div className="p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste raw stack trace, console logs, or problematic code blocks here..."
                  className="w-full h-[400px] p-8 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/40 custom-scrollbar"
                />
              </div>
              <div className="p-6 border-t border-border/50 bg-muted/10">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                  className={cn(
                    "w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500",
                    isAnalyzing || !input.trim()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-brand text-brand-foreground hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand/40 active:scale-95 group"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="group-hover:animate-bounce" />
                      Initialize Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-4 p-6 rounded-[2rem] bg-accent-amber/5 border border-accent-amber/10 text-xs text-muted-foreground leading-relaxed italic"
            >
              <Lightbulb size={18} className="text-accent-amber shrink-0 mt-0.5" />
              <span>
                "Deep logs yield deeper insights. Our reasoning engine thrives on complete execution contexts to map recursive dependencies."
              </span>
            </motion.div>
          </motion.div>

          {/* Output Panel - The 'Cognition' phase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-border/50 bg-card/80 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] min-h-[700px] flex flex-col overflow-hidden ring-1 ring-white/10 premium-shadow"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent-emerald/10 text-accent-emerald">
                  <Cpu size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-widest uppercase text-foreground">Synthesis Engine</span>
                  <span className="text-[10px] text-muted-foreground">Gemini Neural Architecture</span>
                </div>
              </div>
              {result && (
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[9px] uppercase font-black tracking-widest">
                    {result.language}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-emerald/10 text-accent-emerald text-[9px] uppercase font-black tracking-widest border border-accent-emerald/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                    Complete
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-10 overflow-y-auto max-h-[900px] custom-scrollbar">
              <ErrorBoundary>
                <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center gap-8 text-center py-20"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-3xl bg-brand/10 flex items-center justify-center relative z-10"
                      >
                        <Cpu className="text-brand" size={40} />
                      </motion.div>
                      <div className="absolute -inset-4 blur-3xl bg-brand/30 -z-10 animate-pulse" />
                      
                      {/* Orbiting dots */}
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-brand"
                          animate={{
                            x: [Math.cos(i * 120 * Math.PI / 180) * 60, Math.cos((i * 120 + 360) * Math.PI / 180) * 60],
                            y: [Math.sin(i * 120 * Math.PI / 180) * 60, Math.sin((i * 120 + 360) * Math.PI / 180) * 60],
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60"
                        >
                          {loadingSteps[loadingStep]}
                        </motion.p>
                      </AnimatePresence>
                      
                      <div className="flex gap-1 justify-center">
                        {loadingSteps.map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "h-1 rounded-full transition-all duration-500",
                              i <= loadingStep ? "w-8 bg-brand" : "w-2 bg-muted"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    {/* Header Summary & Badges */}
                    <div className="pb-6 border-b border-border">
                       <div className="flex flex-wrap gap-2 mb-4">
                         <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider border border-brand/20">
                           {result.framework}
                         </span>
                         <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider border border-border">
                           {result.error_category}
                         </span>
                         <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                           {result.language}
                         </span>
                       </div>
                       <h3 className="text-3xl font-bold tracking-tight mb-3">{result.error_type}</h3>
                       <p className="text-muted-foreground text-lg leading-relaxed"><MarkdownText text={result.explanation} /></p>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Confidence Score</span>
                          <span className="text-xs font-bold text-brand">{Math.round(result.confidence * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full transition-all",
                              result.confidence > 0.8 ? "bg-emerald-500" : result.confidence > 0.5 ? "bg-amber-500" : "bg-red-500"
                            )}
                          />
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-background border border-border">
                        <ShieldCheck className={cn(
                          result.confidence > 0.8 ? "text-emerald-500" : "text-amber-500"
                        )} size={24} />
                      </div>
                    </div>

                    {/* Root Cause - Highlighted */}
                    <section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 ring-1 ring-red-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={80} className="text-red-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="text-red-500" size={18} />
                          <h4 className="text-sm font-bold uppercase tracking-widest text-red-500">Technical Root Cause</h4>
                        </div>
                        <p className="text-foreground leading-relaxed font-medium">
                          <MarkdownText text={result.root_cause} />
                        </p>
                      </div>
                    </section>

                    {/* Fix Steps */}
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <Lightbulb className="text-amber-500" size={18} />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Actionable Debugging Workflow</h4>
                      </div>
                      <div className="space-y-4">
                        {result.fix_steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-muted/20 border border-transparent hover:border-border hover:bg-muted/40 transition-all group">
                            <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand text-sm font-bold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              {i + 1}
                            </div>
                            <p className="text-sm leading-relaxed mt-1"><MarkdownText text={step} /></p>
                          </div>
                        ))}
                      </div>
                    </section>


                    {/* Stack Overflow Links */}
                    <section className="pt-8 border-t border-border">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <Hash className="text-brand" size={18} />
                          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Community-Driven Evidence</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">Verified via Stack Overflow API</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {result.soLinks && result.soLinks.length > 0 ? (
                          result.soLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group p-6 rounded-3xl bg-background border border-border hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 transition-all duration-500 relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-6 mb-4">
                                <h5 className="font-bold group-hover:text-brand transition-colors line-clamp-2 leading-tight">
                                  {link.title}
                                </h5>
                                <ExternalLink size={16} className="text-muted-foreground shrink-0 group-hover:text-brand transition-all" />
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground">
                                  <ChevronRight size={10} className="text-brand" />
                                  Score: {link.score}
                                </div>
                                {link.has_accepted && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <ShieldCheck size={10} strokeWidth={3} />
                                    ACCEPTED ANSWER
                                  </div>
                                )}
                                <div className="flex gap-1.5">
                                  {link.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Hover interaction line */}
                              <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand group-hover:w-full transition-all duration-700" />
                            </a>
                          ))
                        ) : (
                          <div className="p-12 rounded-3xl border border-dashed border-border bg-muted/5 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/30">
                              <Search size={32} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-foreground">No community matches found</p>
                              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                This error might be project-specific or highly unique. Relying on Gemini's logical deduction.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </motion.div>
                ) : error ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20 px-8">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                      <AlertCircle size={40} />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-xl text-red-500">Analysis Halted</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      className="mt-6 px-8 py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all"
                    >
                      Attempt Recovery
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-6 text-center py-32 px-8 text-muted-foreground/40">
                    <div className="p-6 rounded-full bg-muted/30 border border-border animate-pulse">
                      <Cpu size={64} strokeWidth={0.5} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold tracking-tight text-muted-foreground/60">Awaiting Input</p>
                      <p className="text-sm max-w-[240px] mx-auto">Input an error trace to initialize the AI reasoning pipeline.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>

        {/* Smart Fix Preview - Modern Professional Comparison - FULL WIDTH VERSION */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-12 max-w-7xl mx-auto"
            >
              <section className="space-y-8 p-10 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-white/10 premium-shadow">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-brand/10 text-brand">
                      <Zap size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-lg font-black uppercase tracking-[0.2em] text-foreground/90">Code Reconstruction</h4>
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Delta-Based Refactoring</span>
                    </div>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-accent-emerald/10 text-accent-emerald text-[11px] font-black uppercase tracking-[0.2em] border border-accent-emerald/20 flex items-center gap-2 shadow-sm">
                    <CheckCircle2 size={16} strokeWidth={3} />
                    Suggested Fix
                  </div>
                </div>
                
                <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 shadow-inner-premium group">
                  <p className="text-lg text-foreground/80 leading-relaxed font-semibold italic">
                    "<MarkdownText text={result.fix_summary} />"
                  </p>
                </div>

                {(result.before_code || result.after_code) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Before Code Block */}
                          {result.before_code && (
                            <div className="group relative rounded-[2rem] overflow-hidden border border-red-500/20 bg-[#0d1117] shadow-2xl flex flex-col h-full transition-all hover:border-red-500/40">
                              <div className="flex items-center justify-between px-6 py-4 bg-red-500/5 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                                  <span className="text-[11px] font-black text-red-400 uppercase tracking-[0.2em]">Problematic Content</span>
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(result.before_code, "before")}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all border border-white/5"
                                >
                                  {copied === "before" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                  <span>Copy</span>
                                </button>
                              </div>
                              <div className="flex-1 overflow-hidden relative">
                                <pre className="p-8 text-sm font-mono leading-relaxed overflow-x-auto custom-scrollbar-mini max-h-[450px]">
                                  <code 
                                    className="block"
                                    dangerouslySetInnerHTML={{ __html: highlightCode(result.before_code) }} 
                                  />
                                </pre>
                              </div>
                            </div>
                          )}
                          
                          {/* After Code Block */}
                          {result.after_code && (
                            <div className="group relative rounded-[2rem] overflow-hidden border border-brand/30 bg-[#0d1117] shadow-[0_20px_60px_rgba(99,102,241,0.15)] flex flex-col h-full transition-all hover:border-brand/60 ring-1 ring-brand/10">
                              <div className="flex items-center justify-between px-6 py-4 bg-brand/5 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.2em]">Refined Solution</span>
                                </div>
                                <button 
                                  onClick={() => copyToClipboard(result.after_code, "after")}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-brand-foreground hover:scale-[1.03] active:scale-95 text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand/30"
                                >
                                  {copied === "after" ? (
                                    <> <Check size={16} /> <span>Applied Fix</span> </>
                                  ) : (
                                    <> <Zap size={16} fill="currentColor" /> <span>Apply Optimized Fix</span> </>
                                  )}
                                </button>
                              </div>
                              <div className="flex-1 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-brand/10 blur-[100px] pointer-events-none" />
                                <pre className="p-8 text-sm font-mono leading-relaxed overflow-x-auto custom-scrollbar-mini max-h-[450px]">
                                  <code 
                                    className="block"
                                    dangerouslySetInnerHTML={{ __html: highlightCode(result.after_code) }} 
                                  />
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
