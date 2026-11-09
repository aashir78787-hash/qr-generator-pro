import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode; icon?: React.ReactNode }[];
  defaultValue?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Tabs({ tabs, defaultValue, className, orientation = 'horizontal' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.id);

  return (
    <div className={cn("flex", orientation === 'vertical' ? 'flex-col sm:flex-row gap-6' : 'flex-col gap-4', className)}>
      <div className={cn(
        "flex overflow-x-auto hide-scrollbar",
        orientation === 'vertical' ? 'flex-row sm:flex-col min-w-[200px] border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800' : 'flex-row border-b border-slate-200 dark:border-slate-800'
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-all",
              orientation === 'vertical' ? 'w-full justify-start' : 'border-b-2',
              activeTab === tab.id
                ? (orientation === 'vertical' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 sm:border-r-indigo-600 border-b-2 sm:border-b-0 border-indigo-600' : 'border-indigo-600 text-indigo-600 dark:text-indigo-400')
                : (orientation === 'vertical' ? 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 border-r-2 border-transparent' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100')
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
