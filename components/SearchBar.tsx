"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

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
  const initialMount = useRef(true);

  // Implement Debounce for Live Search
  useEffect(() => {
    // Avoid running on very first mount
    if (initialMount.current) {
        initialMount.current = false;
        return;
    }

    const timeoutId = setTimeout(() => {
        if (query.trim() && query.trim().length >= 2) {
            router.push(`/search/${encodeURIComponent(query.trim())}`);
        }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
    <form onSubmit={handleSearch} className="relative w-full flex items-center group">
      <Search className="absolute left-5 h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Job title, keywords, or company..."
        disabled={disabled}
        className="w-full h-16 pl-14 pr-36 rounded-2xl border-2 border-gray-200 bg-white text-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-500 dark:bg-[#0f172a] dark:border-gray-800 dark:text-white transition-all disabled:opacity-50"
        required
      />
      <button
        type="submit"
        disabled={disabled}
        className="absolute right-3 h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-md active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Search
      </button>
    </form>
  );
}
