import React from 'react';

export default function TankerDispatch({ allocationData, refreshStatus }) {
    const { data, loading, error, onRefresh } = allocationData;

    return (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Tanker Allocation Plan</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Automated dispatch logic based on critical WSI thresholds
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                    <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>sync</span>
                    {refreshStatus}
                </button>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                ) : !data || data.allocations.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                        <h4 className="text-slate-900 dark:text-white font-medium">No Tankers Required</h4>
                        <p className="text-sm text-slate-500 mt-1">All villages are operating below the critical Water Stress Index threshold (&gt;70).</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Village</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Deficit (L)</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanker ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity (L)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {data.allocations.map((alloc, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">#{idx + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{alloc.village_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-mono font-medium">{alloc.water_deficit.toLocaleString()}L</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 font-mono bg-amber-50 dark:bg-amber-900/20 px-2 rounded">{alloc.assigned_tanker}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono">{alloc.tanker_capacity.toLocaleString()}L</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
