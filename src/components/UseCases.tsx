import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      title: "Debugging JS errors",
      description: "Quickly resolve 'undefined is not a function', 'null pointer exceptions', and complex closure issues.",
      items: ["Asynchronous race conditions", "Scope and binding issues", "Typed array errors"]
    },
    {
      title: "Fixing backend issues",
      description: "Understand database connection timeouts, middleware crashes, and internal server errors.",
      items: ["Node.js event loop blocks", "Python dependency conflicts", "API route mismatches"]
    },
    {
      title: "Understanding stack traces",
      description: "Parse long, minified, or obfuscated stack traces from production environments accurately.",
      items: ["Production sourcemaps", "Nested rejection reasons", "Library-specific exceptions"]
    }
  ];

  return (
    <section id="use-cases" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand uppercase tracking-widest mb-3">Versatility</h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for every developer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <div key={i} className="p-8 rounded-3xl bg-muted/30 border border-border flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4">{c.title}</h3>
              <p className="text-muted-foreground mb-8 flex-1">{c.description}</p>
              <ul className="space-y-3 pt-6 border-t border-border">
                {c.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
