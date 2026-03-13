import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 text-gray-900 dark:text-white">
        Find your dream job with <span className="text-blue-600">AI</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mb-10 dark:text-gray-300">
        We search multiple job boards and use AI to filter the noise so you only see the most relevant roles.
      </p>
      <div className="w-full max-w-3xl">
        <SearchBar />
      </div>
      <div className="mt-10 flex gap-4 text-sm text-gray-500 flex-wrap justify-center dark:text-gray-400">
        <span>Popular:</span>
        <button className="hover:text-blue-600 transition-colors">Frontend Developer Remote</button>
        <button className="hover:text-blue-600 transition-colors">Data Analyst Intern Bangalore</button>
        <button className="hover:text-blue-600 transition-colors">Python Developer Entry Level</button>
      </div>
    </div>
  );
}
