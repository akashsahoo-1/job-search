"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { onAuthStateChanged, type User } from "firebase/auth";
import { Sparkles } from 'lucide-react';
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { firebaseAuth } from "@/lib/firebaseClient";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-900 text-white grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">ScoutFlow AI</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <GoogleLoginButton />
        </nav>
      </div>
    </header>
  );
}
