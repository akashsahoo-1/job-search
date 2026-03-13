"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const finishLogin = async () => {
      await supabase.auth.getSession();
      router.push("/");
    };

    finishLogin();
  }, [router]);

  return <p className="text-center mt-20">Signing you in...</p>;
}