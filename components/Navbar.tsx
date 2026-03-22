"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { onAuthStateChanged, type User } from "firebase/auth";
import { Search, Briefcase, LayoutDashboard, Bookmark } from 'lucide-react';
import { auth } from "@/lib/firebase";
import LoginButton from "@/components/LoginButton";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-[#0b101e]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 w-full transition-all">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
             <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">AI Job Search</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-400 text-gray-300 flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            <span className="hidden sm:block">Search</span>
          </Link>
          <Link href="/saved-jobs" className="transition-colors hover:text-blue-400 text-gray-300 flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:block">Saved Jobs</span>
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-blue-400 text-gray-300 flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:block">Dashboard</span>
          </Link>
          <div className="pl-4 border-l border-gray-800 shrink-0">
             <LoginButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
