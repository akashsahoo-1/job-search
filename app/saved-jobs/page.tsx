"use client";

import { useState, useEffect } from "react";
import JobCard, { Job } from "@/components/JobCard";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadJobs = () => {
      try {
        const jobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        setSavedJobs(jobs);
      } catch {
        setSavedJobs([]);
      }
    };
    
    loadJobs();
    
    // Listen for custom event indicating saved jobs have updated
    window.addEventListener("storage_jobs_updated", loadJobs);
    return () => window.removeEventListener("storage_jobs_updated", loadJobs);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-400 mb-6 transition-colors">
           <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
        </Link>
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-blue-500" />
            Saved Jobs
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Your bookmarked opportunities, ready for you.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-24 bg-[#0f172a] rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
          <BookmarkIconPlaceholder />
          <h3 className="text-2xl font-bold text-white mb-2">No saved jobs yet</h3>
          <p className="text-gray-400 max-w-sm mb-8">When you find a job you are interested in, save it to track it later.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
             Discover Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job, i) => (
            <JobCard key={i} job={job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarkIconPlaceholder() {
    return (
        <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-[#0f172a]">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </div>
    )
}
