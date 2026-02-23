import React from 'react';

export default function DashboardStats({ villages, activeFilter, onFilterChange }) {
    const totalVillages = villages.length;
    const criticalCount = villages.filter(v => v.wsi > 70).length;
    const warningCount = villages.filter(v => v.wsi > 40 && v.wsi <= 70).length;
    const safeCount = villages.filter(v => v.wsi <= 40).length;

    const cards = [
        { key: 'all', label: 'Total Villages', count: totalVillages, bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-900 dark:text-white', labelColor: 'text-slate-500' },
        { key: 'critical', label: 'Critical Status', count: criticalCount, bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-900/30', text: 'text-red-700 dark:text-red-400', labelColor: 'text-red-600 dark:text-red-400' },
        { key: 'warning', label: 'Warning Status', count: warningCount, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400', labelColor: 'text-amber-600 dark:text-amber-400' },
        { key: 'safe', label: 'Safe Status', count: safeCount, bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', labelColor: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((c) => {
                const isActive = activeFilter === c.key || (c.key === 'all' && activeFilter === 'all');
                return (
                    <button
                        key={c.key}
                        onClick={() => onFilterChange(c.key === activeFilter ? 'all' : c.key)}
                        className={`${c.bg} p-4 rounded-xl border-2 ${isActive ? 'ring-2 ring-primary ring-offset-2' : c.border} shadow-sm text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer`}
                    >
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${c.labelColor}`}>
                            {c.label}
                        </div>
                        <div className={`text-3xl font-bold ${c.text} tabular-nums`}>
                            {c.count}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
