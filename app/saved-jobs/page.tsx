import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import JobCard, { Job } from "@/components/JobCard";
import { redirect } from "next/navigation";

export default async function SavedJobs() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // Or to auth page
  }

  const { data: savedJobs, error } = await supabase
    .from("saved_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs", error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Saved Jobs</h1>
        <p className="text-gray-600 mt-2 dark:text-gray-400">
          Your bookmarked positions
        </p>
      </div>

      {(!savedJobs || savedJobs.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
          <p className="text-xl text-gray-500 dark:text-gray-400">No saved jobs yet. Go find some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job: Job) => (
            <JobCard key={job.id} job={job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}
