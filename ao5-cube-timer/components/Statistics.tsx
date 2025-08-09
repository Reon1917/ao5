'use client';

import { Statistics as StatsType } from './types';
import { formatTime } from './utils';

interface StatisticsProps {
  statistics: StatsType;
}

export default function Statistics({ statistics }: StatisticsProps) {
  const StatCard = ({ label, value, isTime = true }: { label: string; value: number | null; isTime?: boolean }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {value !== null ? (isTime ? formatTime(value) : value.toString()) : '-'}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Statistics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="AO5" value={statistics.ao5} />
        <StatCard label="AO12" value={statistics.ao12} />
        <StatCard label="Best" value={statistics.best} />
        <StatCard label="Worst" value={statistics.worst} />
        <StatCard label="Mean" value={statistics.mean} />
        <StatCard label="Total" value={statistics.totalSolves} isTime={false} />
      </div>
    </div>
  );
}
