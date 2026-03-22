"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export default function AiSummary({ jobDescription }: { jobDescription: string }) {
  const [data, setData] = useState<{ summary: string[]; skills: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: jobDescription }),
        });
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchSummary();
    return () => { mounted = false; };
  }, [jobDescription]);

  if (error) return null;

  return (
    <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-6 relative overflow-hidden shrink-0">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
      
      <div className="flex items-center gap-2 mb-4">
         <Sparkles className="w-5 h-5 text-blue-400" />
         <h3 className="text-lg font-semibold text-white">AI Job Insights</h3>
      </div>

      {loading ? (
        <div className="flex items-center text-blue-400/80 text-sm font-medium">
           <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing job details...
        </div>
      ) : data ? (
        <div className="space-y-6">
           <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Takeaways</h4>
              <ul className="space-y-2.5">
                 {data.summary?.map((bullet, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2 leading-relaxed">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0 opacity-80"></span>
                       <span>{bullet}</span>
                    </li>
                 ))}
              </ul>
           </div>
           
           <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                 {data.skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#020617] border border-blue-900/50 rounded-lg text-xs text-blue-300 font-medium flex items-center gap-1.5 shadow-sm">
                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" /> {skill}
                    </span>
                 ))}
              </div>
           </div>
        </div>
      ) : null}
    </div>
  );
}
