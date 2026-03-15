"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Sparkles, ShieldCheck, SearchCheck } from "lucide-react";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { firebaseAuth } from "@/lib/firebaseClient";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.replace("/main");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome To ScoutFlow AI
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Sign in first to enter your job search workspace
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            This is a private job search app. Login with Google to unlock the main search page.
          </p>
          <div className="mt-8 flex justify-center">
            <GoogleLoginButton redirectTo="/main" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-2 sm:px-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Protected Main Page</h3>
          <p className="mt-2 text-sm text-slate-600">
            Users can access the main search page only after successful Google login.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <SearchCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Firecrawl Job Search</h3>
          <p className="mt-2 text-sm text-slate-600">
            Search jobs from crawled sources after entering your authenticated workspace.
          </p>
        </article>
      </section>
    </div>
  );
}
