import Link from "next/link";

export default function AuthCallbackPage() {
  return (
    <div className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Auth Callback</h1>
      <p className="mt-3 text-slate-600">
        Firebase popup login does not use a callback page. You can continue from home.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-700"
      >
        Go Home
      </Link>
    </div>
  );
}
