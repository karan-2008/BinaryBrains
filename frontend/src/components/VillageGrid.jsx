import React from 'react';

export default function VillageGrid({ villages, onAnalyze, searchTerm, onSearchChange, statusFilter, onStatusFilterChange, loading }) {

    const getBadgeStyle = (wsi) => {
        if (wsi > 70) return {
            bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400",
            border: "border-red-100 dark:border-red-900/50", dot: "bg-red-600",
            label: "CRITICAL", ping: true, rowBorder: "border-l-4 border-l-red-500"
        };
        if (wsi > 40) return {
            bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-100 dark:border-amber-900/50", dot: "bg-amber-500",
            label: "WARNING", ping: false, rowBorder: "border-l-4 border-l-amber-400"
        };
        return {
            bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400",
            border: "border-emerald-100 dark:border-emerald-900/50", dot: "bg-emerald-500",
            label: "SAFE", ping: false, rowBorder: "border-l-4 border-l-emerald-400"
        };
    };

    const filterButtons = [
        { key: 'all', label: 'All' },
        { key: 'critical', label: '🔴 Critical' },
        { key: 'warning', label: '🟡 Warning' },
        { key: 'safe', label: '🟢 Safe' },
    ];

    const handleExportCSV = () => {
        if (!villages.length) return;
        const headers = ['Village Name', 'ID', 'Population', 'WSI', 'Status', 'GW Level (m)', 'Rainfall Dev (%)'];
        const rows = villages.map(v => {
            const s = getBadgeStyle(v.wsi);
            return [v.name, v.id, v.population, v.wsi, s.label, v.gw_current_level, v.rainfall_dev_pct];
        });
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'village_water_stress_report.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm transition-shadow"
                        placeholder="Search by village name or ID..."
                        type="text"
                    />
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    {filterButtons.map(fb => (
                        <button
                            key={fb.key}
                            onClick={() => onStatusFilterChange(fb.key)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${statusFilter === fb.key
                                    ? 'bg-primary text-white shadow-sm shadow-blue-200'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {fb.label}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                    <button
                        onClick={handleExportCSV}
                        className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 transition flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[16px]">file_download</span> Export CSV
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700" scope="col">Village</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">Population</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">Drought Severity</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">GW Level</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">Rainfall Dev</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">Priority</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/60">

                            {loading && villages.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
                                            <p className="text-sm text-slate-500">Loading village data...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && villages.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                                        <p className="text-slate-500 text-sm">No villages match your search or filter.</p>
                                    </td>
                                </tr>
                            )}

                            {villages.map((village, idx) => {
                                const style = getBadgeStyle(village.wsi);
                                return (
                                    <tr key={village.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-150 group ${style.rowBorder}`}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-slate-50/80 dark:group-hover:bg-slate-700/30 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{village.name}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{village.id}</div>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono font-medium">
                                            {village.population?.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
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
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">
                                            {village.gw_current_level}m
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-mono font-medium ${village.rainfall_dev_pct < -30 ? 'text-red-600' : village.rainfall_dev_pct < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {village.rainfall_dev_pct > 0 ? '+' : ''}{village.rainfall_dev_pct}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${village.wsi > 70 ? 'bg-red-500' : village.wsi > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                                    style={{ width: `${Math.min(village.priority_score / 3, 100)}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{village.priority_score}</span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => onAnalyze(village)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-primary transition-all shadow-sm shadow-blue-200 dark:shadow-none hover:shadow-md"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                                                Analyze
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {villages.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-semibold">{villages.length}</span> village{villages.length !== 1 ? 's' : ''} • Auto-refreshes every 30s
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
