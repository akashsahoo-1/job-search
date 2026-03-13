import JobCard from "@/components/JobCard";
import { headers } from "next/headers";

type Job = {
  company: string;
  role: string;
  location: string;
  salary: string | null;
  description: string;
  apply_link: string;
};

export default async function Page({
  params,
}: {
  params: { query: string };
}) {
  const query = decodeURIComponent(params.query);

  let jobs: Job[] = [];

  try {
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ query }),
    });

    if (res.ok) {
      const data = await res.json();
      jobs = data.jobs || [];
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Search Results for
        <span className="text-blue-500 ml-2">{query}</span>
      </h1>

      {jobs.length === 0 && <p className="text-gray-400">No jobs found.</p>}

      <div className="space-y-6">
        {jobs.map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>
    </div>
  );
}