"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Bot, SearchCheck, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { firebaseAuth } from "@/lib/firebaseClient";

export default function MainPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const quickSearches = [
    "AI Engineer Remote",
    "Frontend Developer Intern",
    "Data Analyst Bangalore",
    "Product Designer USA",
  ];

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

  if (authLoading) {
    return (
      <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
        <p className="text-slate-600">Opening your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Main Search Workspace
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Search jobs with Firecrawl
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            You are signed in. Start searching and open job links directly.
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur">
          <SearchBar />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {quickSearches.map((item) => (
              <Link
                key={item}
                href={`/search/${encodeURIComponent(item)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <SearchCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Search Pipeline</h3>
          <p className="mt-2 text-sm text-slate-600">
            Query triggers Firecrawl scraping and structured job extraction.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <Bot className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Action-Ready Results</h3>
          <p className="mt-2 text-sm text-slate-600">
            Review cards and open the apply pages in a single click.
          </p>
        </article>
      </section>
    </div>
  );
}
