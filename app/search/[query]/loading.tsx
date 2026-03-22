export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-white flex space-x-3 items-center">
        <span>Searching jobs</span>
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </h1>
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 h-40 animate-pulse hidden md:block">
             <div className="h-6 bg-gray-700 w-1/3 rounded mb-4"></div>
             <div className="flex gap-4 mb-6">
                <div className="h-4 bg-gray-700 w-1/4 rounded"></div>
                <div className="h-4 bg-gray-700 w-1/4 rounded"></div>
             </div>
             <div className="h-3 bg-gray-700 w-full rounded mb-2"></div>
             <div className="h-3 bg-gray-700 w-5/6 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
