import React from 'react';

export default function TankerDispatch({ allocationData, refreshStatus }) {
    const { data, loading, error, onRefresh } = allocationData;

    return (
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Tanker Allocation Plan</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-8">
                        Automated dispatch based on WSI &gt; 70 threshold
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition disabled:opacity-50 shadow-sm"
                >
                    <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>sync</span>
                    {refreshStatus}
                </button>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex gap-3 items-center">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                ) : !data || data.allocations?.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-slate-800 rounded-xl border border-dashed border-emerald-200 dark:border-emerald-900/30">
                        <span className="material-symbols-outlined text-5xl text-emerald-400 mb-3">check_circle</span>
                        <h4 className="text-slate-900 dark:text-white font-semibold text-lg">No Tankers Required</h4>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">All villages are operating below the critical Water Stress Index threshold (&gt;70).</p>
                    </div>
                ) : (
                    <>
                        {/* Summary bar */}
                        <div className="mb-4 flex items-center gap-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                            <span className="material-symbols-outlined text-amber-600 text-[24px]">warning</span>
                            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                <strong>{data.total_villages_in_need}</strong> village{data.total_villages_in_need > 1 ? 's' : ''} require{data.total_villages_in_need === 1 ? 's' : ''} emergency tanker dispatch
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Village</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Deficit</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanker ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocated</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {data.allocations.map((alloc, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-l-4 border-l-red-500">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">#{idx + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{alloc.village_name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">{alloc.village_id}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-mono font-bold">{Math.round(alloc.deficit_liters).toLocaleString()}L</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-mono font-bold">
                                                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                                    {alloc.tanker_id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400 font-mono font-medium">{Math.round(alloc.allocated_liters).toLocaleString()}L</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono">{alloc.priority_score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
