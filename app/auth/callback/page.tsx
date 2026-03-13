"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      await supabase.auth.getSession();
      router.push("/");
    };

    finishLogin();
  }, [router]);

  return <div className="flex justify-center mt-20">Signing you in...</div>;
}
