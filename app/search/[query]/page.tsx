"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import { auth } from "@/lib/firebase";

type Job = {
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
};

export default function SearchResultsPage() {
  const params = useParams<{ query: string }>();
  const router = useRouter();
  const query = useMemo(
    () => decodeURIComponent((params?.query as string) || ""),
    [params]
  );

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !query) {
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) {
           throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setErrorMsg("Oops! We encountered an error while searching for jobs. Please try again later.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, query]);

  if (authLoading) {
    return (
      <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-slate-600">Checking login status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-slate-600">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6 pb-12">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Search Results for
        <span className="text-blue-500 ml-2">{query}</span>
      </h1>

      <div className="mb-8">
        <SearchBar initialQuery={query} compact showSubmitButton={true} />
      </div>

      <div className="mb-4">
        {loading && <p className="text-gray-400">Searching jobs...</p>}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-6 font-medium text-center">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && jobs.length === 0 && (
        <div className="text-center py-12 px-4 border border-gray-800 rounded-xl bg-[#0f172a]">
          <p className="text-gray-400 text-lg">No jobs found. Try a different keyword.</p>
        </div>
      )}

      {!loading && !errorMsg && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
