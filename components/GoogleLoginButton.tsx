"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

type GoogleLoginButtonProps = {
  redirectTo?: string;
};

export default function GoogleLoginButton({
  redirectTo = "/main",
}: GoogleLoginButtonProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Firebase Google sign-in failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
    }
  };

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="h-10 px-4 rounded-full border border-slate-300 text-sm text-slate-500 bg-white/80"
      >
        Loading...
      </button>
    );
  }

  if (user) {
    const avatar = user.photoURL || undefined;
    const fullName = user.displayName || user.email?.split("@")[0] || "Account";

    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm text-slate-700">
          {avatar ? (
            <Image
              src={avatar}
              alt={fullName}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-slate-900 text-white text-xs grid place-items-center">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="max-w-28 truncate">{fullName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="h-10 px-4 rounded-full border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition inline-flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="h-10 px-4 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
    >
      Sign in with Google
    </button>
  );
}
