"use client";

import { supabase } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://job-search-brown-ten.vercel.app/auth/callback"
      }
    });

    if (error) {
      console.error("OAuth error:", error);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Sign in with Google
    </button>
  );
}
