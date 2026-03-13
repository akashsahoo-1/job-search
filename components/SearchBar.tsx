"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full flex items-center">
      <Search className="absolute left-4 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Job title, keywords, or company..."
        className="w-full h-14 pl-12 pr-32 rounded-full border border-gray-200 bg-white text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-800 dark:text-white"
        required
      />
      <button
        type="submit"
        className="absolute right-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
      >
        Search
      </button>
    </form>
  );
}
