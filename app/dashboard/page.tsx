"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import JobCard, { Job } from "@/components/JobCard";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoading(false);
    }

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
       <div className="max-w-5xl mx-auto mt-12 px-6">
         <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
         <p className="text-gray-400">Loading saved jobs...</p>
       </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      
      <div className="mb-6 flex items-center mb-8">
        <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-200">Your Saved Jobs</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-10 text-center">
          <p className="text-gray-400 mb-4">You haven't saved any jobs yet.</p>
          <Link href="/" className="inline-block bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
            Find Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}
