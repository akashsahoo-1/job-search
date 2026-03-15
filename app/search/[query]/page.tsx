"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import { firebaseAuth } from "@/lib/firebaseClient";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
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
      setError(null);

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
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData?.error || "Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load search results.";
        setError(message);
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
    <div className="mx-auto mt-10 max-w-6xl px-4 pb-14 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.6)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">AI Job Search</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Results for <span className="text-amber-600">{query}</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Firecrawl gathered listings from job sources for this query.
        </p>
        <div className="mt-6">
          <SearchBar initialQuery={query} compact showSubmitButton={false} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Search button is hidden after results load. Press Enter to search again.</p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {loading
            ? "Searching jobs..."
            : jobs.length > 0
              ? `${jobs.length} job${jobs.length === 1 ? "" : "s"} found`
              : "No jobs found for this query yet"}
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No matches yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try broader keywords like "frontend developer remote" or include a location.
          </p>
          <Link
            href="/main"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Back to main page
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          {jobs.map((job, i) => (
            <JobCard key={`${job.apply_link}-${i}`} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
