import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Removed</h1>
      <p className="mt-3 text-slate-600">
        This project now focuses on Firebase Google login and Firecrawl job search only.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to Search
      </Link>
    </div>
  );
}
