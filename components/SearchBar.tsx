"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "sonner";
import { firebaseAuth } from "@/lib/firebaseClient";

type SearchBarProps = {
  initialQuery?: string;
  className?: string;
  compact?: boolean;
  showSubmitButton?: boolean;
};

export default function SearchBar({
  initialQuery = '',
  className = '',
  compact = false,
  showSubmitButton = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in with Google to search jobs.");
      return;
    }

    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  const disabled = authLoading || !user;

  return (
    <form onSubmit={handleSearch} className={`relative w-full flex items-center ${className}`}>
      <Search className="absolute left-4 h-5 w-5 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          disabled
            ? "Sign in with Google to start searching jobs"
            : "Try: Product designer remote, AI engineer, or data analyst in Bengaluru"
        }
        disabled={disabled}
        className={`w-full ${compact ? "h-12 text-base" : "h-16 text-lg"} pl-12 ${showSubmitButton ? "pr-36" : "pr-5"} rounded-full border border-slate-200 bg-white/95 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
        required
      />
      {showSubmitButton && (
        <button
          type="submit"
          disabled={disabled}
          className={`absolute right-2 ${compact ? "h-8 px-4 text-sm" : "h-12 px-6"} bg-slate-900 hover:bg-slate-700 text-white font-medium rounded-full transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed`}
        >
          {disabled ? "Login Required" : "Find Jobs"}
        </button>
      )}
    </form>
  );
}
