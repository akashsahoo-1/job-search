"use client";

import { useState } from "react";
import { MapPin, Briefcase, Bookmark, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export interface Job {
  id?: string;
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
}

export default function JobCard({ job, isSaved = false, onSave }: { job: Job; isSaved?: boolean; onSave?: (job: Job) => void }) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async () => {
    try {
      if (onSave) {
        onSave(job);
        setSaved(!saved);
        toast.success(saved ? "Job removed from saved" : "Job saved successfully");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to save jobs.");
        return;
      }

      const token = session.access_token;

      const res = await fetch("/api/save-job", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(job),
      });

      if (!res.ok) throw new Error("Failed to save job");
      
      setSaved(!saved);
      toast.success(saved ? "Job removed from saved" : "Job saved successfully");
    } catch (error) {
      toast.error("Failed to save job. Please try again.");
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-white line-clamp-2">{job.role}</h3>
          <div className="flex items-center text-gray-400 mt-2 space-x-4 text-sm">
            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.company}</span>
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location || "Remote"}</span>
          </div>
          {job.salary && (
             <div className="flex items-center text-green-400 font-semibold mt-2 text-sm">
                <DollarSign className="w-4 h-4 mr-1" /> {job.salary}
             </div>
          )}
        </div>
        <button 
          onClick={handleSave}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-800"
        >
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-blue-500 text-blue-500' : ''}`} />
        </button>
      </div>
      
      <div 
        className="text-gray-300 text-sm flex-grow line-clamp-3 mb-6"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />

      <a 
        href={job.apply_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center px-5 py-2 font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition mt-auto"
      >
        Apply Now
      </a>
    </div>
  );
}
