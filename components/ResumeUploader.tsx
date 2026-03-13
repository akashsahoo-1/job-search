"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface MatchResult {
  matchScore: number;
  missingSkills: string;
  strongMatches: string;
  summary: string;
}

export default function ResumeUploader({ jobDescription }: { jobDescription: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const supabase = createClient();
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("resumes").upload(fileName, file);

      if (error) throw error;

      // Call API to analyze
      const res = await fetch("/api/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: data.path, jobDescription }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const analysis = await res.json();
      setResult(analysis);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-bold mb-4 dark:text-white">Resume Match Analyzer</h3>
      
      {!file ? (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Upload your resume (PDF)</span>
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium truncate max-w-[200px] dark:text-gray-200">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
          </div>
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="w-full flex items-center justify-center h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Match"}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="font-semibold dark:text-gray-200">Match Score</span>
            <span className={`text-lg font-bold ${result.matchScore >= 75 ? 'text-green-600' : result.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {result.matchScore}%
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Strong Matches: </span>
              <span className="text-gray-600 dark:text-gray-400">{result.strongMatches}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Missing Skills: </span>
              <span className="text-gray-600 dark:text-gray-400">{result.missingSkills}</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">Summary: </span>
              <p className="text-gray-600 italic dark:text-gray-400">"{result.summary}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
