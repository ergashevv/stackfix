"use client";

import React from "react";
import { Code, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Team() {
  const members = [
    {
      name: "Pulat Ergashev",
      role: "Founder & Lead Architect",
      bio: "Crafting high-performance digital ecosystems with a focus on immersive UX and cognitive load reduction.",
      linkedin: "https://www.linkedin.com/in/edevz/",
      github: "https://github.com/ergashevv",
      image: "/pulat.png"
    },
    {
      name: "Azamkhuja Vosiljonov",
      role: "Co-founder & AI Lead",
      bio: "Deep specialization in neural architectures, Gemini reasoning integration, and scalable system design.",
      linkedin: "https://www.linkedin.com/in/azamkhuja-vosiljonov-38524b23a/",
      github: "https://github.com/Azamkhujav",
      image: "/azamkhuja.jpg"
    }
  ];

  return (
    <section id="team" className="py-32 bg-background relative noise-bg border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            The Architects
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter">Human <span className="text-brand">Synergy</span></h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            The minds behind the code, dedicated to evolving the developer experience.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {members.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-1 rounded-[3.5rem] bg-gradient-to-br from-border/50 to-transparent hover:from-brand/20 transition-all duration-700 shadow-2xl shadow-black/5"
            >
              <div className="bg-card/80 backdrop-blur-3xl rounded-[3.4rem] p-10 h-full flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative w-40 h-40 mb-10 group-hover:scale-105 transition-transform duration-700">
                  {/* Decorative orbital ring */}
                  <div className="absolute inset-[-10px] rounded-full border border-dashed border-brand/20 animate-[spin_10s_linear_infinite]" />
                  
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl ring-1 ring-border group-hover:ring-brand/50 transition-all">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-3xl font-black tracking-tight">{member.name}</h3>
                  <p className="inline-block px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>

                <p className="text-muted-foreground leading-relaxed font-medium mb-10 line-clamp-3">
                  {member.bio}
                </p>

                <div className="flex items-center gap-6 mt-auto">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    className="p-3 rounded-2xl bg-muted hover:bg-brand hover:text-brand-foreground transition-all duration-300"
                    aria-label="LinkedIn Profile"
                  >
                    <Globe size={20} />
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    className="p-3 rounded-2xl bg-muted hover:bg-brand hover:text-brand-foreground transition-all duration-300"
                    aria-label="GitHub Profile"
                  >
                    <Code size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
