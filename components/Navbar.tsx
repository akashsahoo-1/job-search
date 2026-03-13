"use client";

import Link from 'next/link';
import { Search, Briefcase, LayoutDashboard, Bookmark } from 'lucide-react';
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Navbar() {
  return (
    <header className="bg-[#020617] border-b border-gray-800 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight text-white">AI Job Search</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-500 text-gray-300 flex items-center gap-1">
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link href="/saved-jobs" className="transition-colors hover:text-blue-500 text-gray-300 flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            Saved Jobs
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-blue-500 text-gray-300 flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <GoogleLoginButton />
        </nav>
      </div>
    </header>
  );
}
