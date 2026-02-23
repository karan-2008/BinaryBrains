import React from 'react';

export default function DashboardStats({ villages }) {
    // Compute exactly from the live 'villages' array passed as props
    const totalVillages = villages.length;
    const criticalCount = villages.filter(v => v.wsi > 70).length;
    const warningCount = villages.filter(v => v.wsi > 40 && v.wsi <= 70).length;
    const safeCount = villages.filter(v => v.wsi <= 40).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Villages</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalVillages}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
                <div className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">Critical Status</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{criticalCount}</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
                <div className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Warning Status</div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{warningCount}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm">
                <div className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Safe Status</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{safeCount}</div>
            </div>
        </div>
    );
}
