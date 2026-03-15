"use client";

import { MapPin, Briefcase, DollarSign } from "lucide-react";

export interface Job {
  id?: string;
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
}

export default function JobCard({ job }: { job: Job }) {
  const shortDescription = (job.description || "No description available.")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.95)] transition hover:-translate-y-0.5 hover:border-slate-300 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-bold text-xl text-slate-900 line-clamp-2">{job.role}</h3>
        <div className="flex flex-wrap items-center text-slate-500 mt-2 gap-3 text-sm">
          <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.company}</span>
          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location || "Remote"}</span>
        </div>
        {job.salary && (
           <div className="flex items-center text-emerald-700 font-semibold mt-2 text-sm">
              <DollarSign className="w-4 h-4 mr-1" /> {job.salary}
           </div>
        )}
      </div>
      
      <p className="text-slate-600 text-sm flex-grow mb-6">
        {shortDescription}
        {job.description?.length > 220 ? "..." : ""}
      </p>

      <a 
        href={job.apply_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center px-5 py-2.5 font-medium rounded-xl bg-slate-900 hover:bg-slate-700 text-white transition mt-auto"
      >
        Apply Now
      </a>
    </div>
  );
}
