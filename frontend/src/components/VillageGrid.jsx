import React from 'react';

export default function VillageGrid({ villages, onAnalyze }) {

    // Helper to format WSI labels matching the template colors
    const getBadgeStyle = (wsi) => {
        if (wsi > 70) return {
            bg: "bg-red-50 dark:bg-red-900/30",
            text: "text-red-700 dark:text-red-400",
            border: "border-red-100 dark:border-red-900/50",
            dot: "bg-red-600",
            label: "CRITICAL",
            ping: true
        };
        if (wsi > 40) return {
            bg: "bg-yellow-50 dark:bg-yellow-900/30",
            text: "text-yellow-700 dark:text-yellow-400",
            border: "border-yellow-100 dark:border-yellow-900/50",
            dot: "bg-yellow-600",
            label: "WARNING",
            ping: false
        };
        return {
            bg: "bg-green-50 dark:bg-green-900/30",
            text: "text-green-700 dark:text-green-400",
            border: "border-green-100 dark:border-green-900/50",
            dot: "bg-green-600",
            label: "SAFE",
            ping: false
        };
    };

    return (
        <>
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto p-1">
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm transition-shadow"
                            placeholder="Search village..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 px-2 sm:px-0">
                    <button className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">All Regions</button>
                    <button className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 transition flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                    </button>
                </div>
            </div>

            {/* Main Data Table Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] md:shadow-none" scope="col">
                                    Village Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                                    Population
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                                    Drought Severity (WSI)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                                    GW Level (m)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                                    Rainfall Dev
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">

                            {villages.map((village) => {
                                const style = getBadgeStyle(village.wsi);
                                return (
                                    <tr key={village.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] md:shadow-none">
                                            {village.name} <span className="text-xs text-slate-400 font-normal ml-1">({village.id})</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {village.population.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                                {style.ping ? (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                                    </span>
                                                ) : (
                                                    <span className={`h-2 w-2 rounded-full ${style.dot}`}></span>
                                                )}
                                                {style.label} • {village.wsi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">
                                            {village.gw_current_level}m
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">
                                            {village.rainfall_dev_pct}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onAnalyze(village)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-primary transition shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                                                Analyze
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {villages.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No villages data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
