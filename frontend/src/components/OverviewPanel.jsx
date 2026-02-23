import React from 'react';

export default function OverviewPanel({ villages, loading, allocationData }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
            </div>
        );
    }

    const totalPop = villages.reduce((acc, v) => acc + (v.population || 0), 0);
    const avgRainfall = villages.length ? (villages.reduce((acc, v) => acc + v.rainfall_dev_pct, 0) / villages.length).toFixed(1) : 0;

    const criticalCount = villages.filter(v => v.wsi > 70).length;
    const warningCount = villages.filter(v => v.wsi > 40 && v.wsi <= 70).length;
    const safeCount = villages.filter(v => v.wsi <= 40).length;

    const totalLitres = allocationData?.allocations?.reduce((acc, a) => acc + a.allocated_liters, 0) || 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Overview</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">District-wide drought indicators and emergency response metrics.</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">groups</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Monitored Pop.</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalPop.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">rainy</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Rainfall Dev.</p>
                        <h3 className={`text-3xl font-bold mt-1 ${avgRainfall < 0 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                            {avgRainfall > 0 ? '+' : ''}{avgRainfall}%
                        </h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-red-500">
                        <span className="material-symbols-outlined text-[120px]">local_shipping</span>
                    </div>
                    <div className="size-14 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center relative z-10">
                        <span className="material-symbols-outlined text-[28px]">water_drop</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tanker Dispatch Vol.</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalLitres.toLocaleString()} <span className="text-base text-slate-500 font-normal">Liters</span></h3>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Visual Chart Mockup */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">pie_chart</span>
                            WSI Distribution
                        </h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center items-center min-h-[300px]">
                        <div className="relative size-48 mb-8">
                            {/* CSS Conic Gradient Pie Chart (Mock) */}
                            <div className="absolute inset-0 rounded-full" style={{
                                background: `conic-gradient(
                                    #ef4444 0% ${(criticalCount / villages.length) * 100}%, 
                                    #f59e0b ${(criticalCount / villages.length) * 100}% ${((criticalCount + warningCount) / villages.length) * 100}%, 
                                    #10b981 ${((criticalCount + warningCount) / villages.length) * 100}% 100%
                                )`
                            }}></div>
                            {/* Inner hole for donut shape */}
                            <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-slate-900 dark:text-white">{villages.length}</span>
                                    <span className="block text-xs font-semibold text-slate-500 uppercase">Villages</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 w-full justify-center">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-red-500"></span><span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Critical</span></div>
                                <span className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{criticalCount}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-amber-500"></span><span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Warning</span></div>
                                <span className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{warningCount}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-emerald-500"></span><span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Safe</span></div>
                                <span className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{safeCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                            System Alerts
                        </h3>
                        <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">2 New</span>
                    </div>
                    <div className="flex-1 p-0 overflow-y-auto">
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {criticalCount > 0 && (
                                <div className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4">
                                    <div className="mt-1 size-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 flex-shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">warning</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">Critical Water Stress Index Reached</p>
                                        <p className="text-sm text-slate-500 mt-1">{criticalCount} village(s) have exceeded the &gt;70 WSI threshold. Immediate tanker allocation requested.</p>
                                        <p className="text-xs text-slate-400 mt-2 font-mono">Just now</p>
                                    </div>
                                </div>
                            )}
                            <div className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4">
                                <div className="mt-1 size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">AI Insights Engine Online</p>
                                    <p className="text-sm text-slate-500 mt-1">Deepseek-v3.1 671B model is fully loaded and ready to generate diagnostic reports.</p>
                                    <p className="text-xs text-slate-400 mt-2 font-mono">2 mins ago</p>
                                </div>
                            </div>
                            {warningCount > 0 && (
                                <div className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4">
                                    <div className="mt-1 size-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 flex-shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">trending_down</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium">Below-Average Rainfall Detected</p>
                                        <p className="text-sm text-slate-500 mt-1">{warningCount} village(s) entered warning state due to severe rainfall deviations.</p>
                                        <p className="text-xs text-slate-400 mt-2 font-mono">1 hr ago</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
