export default function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-800"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-800"></div>
            <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-800"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-800"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-200 rounded w-full dark:bg-gray-800"></div>
        <div className="h-3 bg-gray-200 rounded w-full dark:bg-gray-800"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5 dark:bg-gray-800"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full dark:bg-gray-800"></div>
    </div>
  );
}
