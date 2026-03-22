"use client";

import { useState, useEffect } from "react";
import { MapPin, Briefcase, Bookmark, DollarSign, X } from "lucide-react";
import { toast } from "sonner";
import AiSummary from "./AiSummary";

export interface Job {
  id?: string;
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
}

export default function JobCard({ job, isSaved = false }: { job: Job; isSaved?: boolean }) {
  const [saved, setSaved] = useState(isSaved);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      const alreadySaved = savedJobs.some((j: Job) => j.role === job.role && j.company === job.company);
      setSaved(alreadySaved);
    } catch {}
  }, [job]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      const exists = savedJobs.some((j: Job) => j.role === job.role && j.company === job.company);
      
      if (exists) {
        const newSaved = savedJobs.filter((j: Job) => !(j.role === job.role && j.company === job.company));
        localStorage.setItem("savedJobs", JSON.stringify(newSaved));
        setSaved(false);
        toast.success("Job removed from saved");
        window.dispatchEvent(new Event("storage_jobs_updated"));
      } else {
        savedJobs.push(job);
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        setSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
       toast.error("Failed to update saved jobs.");
    }
  };

  const truncateHtml = (html: string, maxLen: number = 220) => {
    const text = html.replace(/<[^>]+>/g, ' ');
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  };

  return (
    <>
      {/* CARD */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer shadow-sm hover:shadow-lg hover:shadow-blue-500/10"
      >
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="font-bold text-xl text-white line-clamp-2 leading-tight">{job.role}</h3>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-400 mt-3 text-sm font-medium">
              <span className="flex items-center text-gray-300"><Briefcase className="w-4 h-4 mr-1.5 text-gray-500" /> {job.company}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-500" /> {job.location || "Remote"}</span>
            </div>
            {job.salary && (
               <div className="flex items-center text-emerald-400 font-semibold mt-3 text-sm">
                  <DollarSign className="w-4 h-4 mr-1" /> {job.salary}
               </div>
            )}
          </div>
          <button 
            onClick={handleSave}
            title={saved ? "Remove from saved" : "Save job"}
            className={`p-2.5 transition-colors rounded-full hover:bg-gray-800 shrink-0 ${saved ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 bg-gray-900'}`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-blue-500' : ''}`} />
          </button>
        </div>
        
        <div className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed">
          {truncateHtml(job.description)}
        </div>

        <button 
          className="w-full inline-flex items-center justify-center px-5 py-2.5 font-medium rounded-lg bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white transition-all mt-auto"
        >
          View Full Details
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pb-10 sm:pt-16">
           <div className="bg-[#0f172a] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-gray-800 ring-1 ring-white/10 m-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-[#0b101e] px-6 py-5 border-b border-gray-800 flex justify-between items-start shrink-0">
                 <div className="pr-10">
                   <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{job.role}</h2>
                   <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                      <span className="text-gray-300 flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-500" />{job.company}</span>
                      <span className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-500" />{job.location || "Remote"}</span>
                      {job.salary && <span className="text-emerald-400 flex items-center"><DollarSign className="w-4 h-4 mr-1" />{job.salary}</span>}
                   </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 absolute right-5 top-5 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Body */}
              <div className="px-6 py-8 overflow-y-auto space-y-8 flex-grow">
                 <AiSummary jobDescription={job.description} />

                 <div className="bg-[#0A0F1A] p-6 rounded-xl border border-gray-800/50">
                    <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                       Full Job Description
                    </h3>
                    <div 
                      className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-headings:text-white" 
                      dangerouslySetInnerHTML={{ __html: job.description }} 
                    />
                 </div>
              </div>

              {/* Footer */}
              <div className="bg-[#0b101e] p-5 border-t border-gray-800 flex flex-col sm:flex-row gap-4 shrink-0">
                 <button 
                   onClick={handleSave}
                   className={`flex-1 inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl border transition-all ${saved ? 'bg-gray-800 border-gray-700 text-white' : 'bg-transparent border-gray-600 text-white hover:bg-gray-800'}`}
                 >
                   <Bookmark className={`w-5 h-5 mr-2 ${saved ? 'fill-white' : ''}`} /> {saved ? 'Saved Job' : 'Save Job'}
                 </button>
                 <a 
                   href={job.apply_link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex-[2] inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/25"
                 >
                   Apply on Company Site
                 </a>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
