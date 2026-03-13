"use client";

import { useState } from "react";
import ResumeUploader from "@/components/ResumeUploader";

export default function ResumeMatchPage() {
  const [jobDesc, setJobDesc] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold dark:text-white">Resume Match Analyzer</h1>
        <p className="text-gray-600 mt-2 dark:text-gray-400">
          Upload your resume and paste a job description to see how well you match the role.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Job Description</h3>
          <textarea 
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full h-40 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100 text-sm"
            placeholder="Paste the job description here..."
          ></textarea>
        </div>
        
        {jobDesc.length > 20 ? (
          <ResumeUploader jobDescription={jobDesc} />
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center text-gray-500 dark:bg-gray-800/50 dark:border-gray-700">
            Please paste a detailed job description above to enable resume matching.
          </div>
        )}
      </div>
    </div>
  );
}
