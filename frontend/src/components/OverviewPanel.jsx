import React from 'react';

export default function OverviewPanel({ villages, loading, allocationData }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
            </div>
        );
    }

    const totalPop = (villages || []).reduce((acc, v) => acc + (v.population || 0), 0);
    const avgRainfall = villages.length ? (villages.reduce((acc, v) => acc + (v.rainfall_dev_pct || 0), 0) / villages.length).toFixed(1) : 0;

    const criticalCount = (villages || []).filter(v => (v.wsi || 0) > 70).length;
    const warningCount = (villages || []).filter(v => (v.wsi || 0) > 40 && (v.wsi || 0) <= 70).length;
    const safeCount = (villages || []).filter(v => (v.wsi || 0) <= 40).length;

    const totalLitres = allocationData?.allocations?.reduce((acc, a) => acc + (a.allocated_liters || 0), 0) || 0;
    const totalTankers = allocationData?.total_tankers_assigned || 0;

    // Average groundwater depth (mock sparkline via computed value)
    const avgGW = villages.length
        ? (villages.reduce((acc, v) => acc + (v.gw_current_level || 0), 0) / villages.length).toFixed(1)
        : 0;

    return (
        <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">District Pulse Overview</h2>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base">Real-time monitoring of environmental and demographic key performance indicators.</p>
                </div>

                {/* District Pulse KPI Row (from stitch template) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Rainfall Deviation */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-500">Rainfall Deviation</p>
                            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[22px]">cloud</span>
                            </div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{avgRainfall > 0 ? '+' : ''}{avgRainfall}%</h3>
                        <p className="text-xs text-slate-400 mt-1">Monthly aggregate</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${avgRainfall < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                <span className="material-symbols-outlined text-[14px]">{avgRainfall < 0 ? 'trending_down' : 'trending_up'}</span>
                                {avgRainfall < 0 ? `${avgRainfall}% from avg` : `+${avgRainfall}% recovery`}
                            </span>
                        </div>
                        {/* Mini sparkline */}
                        <div className="mt-3 h-8 flex items-end gap-0.5">
                            {[35, 28, 42, 30, 25, 38, 20, 32, 28, 36].map((h, i) => (
                                <div key={i} className={`flex-1 rounded-t ${avgRainfall < 0 ? 'bg-red-200' : 'bg-emerald-200'}`} style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Groundwater Trend */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-500">Groundwater Trend</p>
                            <div className="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[22px]">water_drop</span>
                            </div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{avgGW}m</h3>
                        <p className="text-xs text-slate-400 mt-1">Mean depth level</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +1.2m recovery
                            </span>
                        </div>
                        <div className="mt-3 h-8 flex items-end gap-0.5">
                            {[20, 25, 30, 28, 35, 40, 38, 45, 50, 48].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t bg-emerald-200" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* At-Risk Population */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-500">Total At-Risk Population</p>
                            <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[22px]">groups</span>
                            </div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{totalPop >= 1000000 ? (totalPop / 1000000).toFixed(2) + 'M' : totalPop >= 1000 ? (totalPop / 1000).toFixed(1) + 'K' : totalPop}</h3>
                        <p className="text-xs text-slate-400 mt-1">Affected districts</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Stable
                            </span>
                        </div>
                        <div className="mt-3 h-8 flex items-end gap-0.5">
                            {[45, 42, 44, 43, 42, 41, 43, 42, 44, 43].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t bg-emerald-200" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second Row: Donut Chart + Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* WSI Distribution Donut */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pie_chart</span>
                                WSI Distribution
                            </h3>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-center items-center min-h-[280px]">
                            <div className="relative size-44 sm:size-48 mb-6">
                                <div className="absolute inset-0 rounded-full" style={{
                                    background: villages.length > 0 ? `conic-gradient(
                                        #ef4444 0% ${(criticalCount / villages.length) * 100}%,
                                        #f59e0b ${(criticalCount / villages.length) * 100}% ${((criticalCount + warningCount) / villages.length) * 100}%,
                                        #10b981 ${((criticalCount + warningCount) / villages.length) * 100}% 100%
                                    )` : '#e2e8f0'
                                }}></div>
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                                    <div className="text-center">
                                        <span className="block text-3xl font-bold text-slate-900">{villages.length}</span>
                                        <span className="block text-xs font-semibold text-slate-500 uppercase">Villages</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-6 w-full justify-center flex-wrap">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-red-500"></span><span className="text-sm font-semibold text-slate-600">Critical</span></div>
                                    <span className="text-xl font-bold mt-1 text-slate-900">{criticalCount}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-amber-500"></span><span className="text-sm font-semibold text-slate-600">Warning</span></div>
                                    <span className="text-xl font-bold mt-1 text-slate-900">{warningCount}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-emerald-500"></span><span className="text-sm font-semibold text-slate-600">Safe</span></div>
                                    <span className="text-xl font-bold mt-1 text-slate-900">{safeCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                                System Alerts
                            </h3>
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{criticalCount > 0 ? '2' : '1'} New</span>
                        </div>
                        <div className="flex-1 p-0 overflow-y-auto">
                            <div className="divide-y divide-slate-100">
                                {criticalCount > 0 && (
                                    <div className="p-5 hover:bg-slate-50 transition-colors flex gap-4">
                                        <div className="mt-1 size-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                                            <span className="material-symbols-outlined text-[18px]">warning</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-900 font-medium">Critical Water Stress Index Reached</p>
                                            <p className="text-sm text-slate-500 mt-1">{criticalCount} village(s) have exceeded the &gt;70 WSI threshold. Immediate tanker allocation requested.</p>
                                            <p className="text-xs text-slate-400 mt-2 font-mono">Just now</p>
                                        </div>
                                    </div>
                                )}
                                <div className="p-5 hover:bg-slate-50 transition-colors flex gap-4">
                                    <div className="mt-1 size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-900 font-medium">AI Insights Engine Online</p>
                                        <p className="text-sm text-slate-500 mt-1">Deepseek-v3.1 model loaded — generating diagnostic reports on demand.</p>
                                        <p className="text-xs text-slate-400 mt-2 font-mono">2 mins ago</p>
                                    </div>
                                </div>
                                {warningCount > 0 && (
                                    <div className="p-5 hover:bg-slate-50 transition-colors flex gap-4">
                                        <div className="mt-1 size-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                            <span className="material-symbols-outlined text-[18px]">trending_down</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-900 font-medium">Below-Average Rainfall Detected</p>
                                            <p className="text-sm text-slate-500 mt-1">{warningCount} village(s) entered warning state due to rainfall deviations.</p>
                                            <p className="text-xs text-slate-400 mt-2 font-mono">1 hr ago</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Footer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Active Tankers</p>
                        <p className="text-2xl font-bold text-slate-900">{totalTankers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Water Dispatched</p>
                        <p className="text-2xl font-bold text-slate-900">{totalLitres >= 1000000 ? (totalLitres / 1000000).toFixed(1) + 'M' : totalLitres >= 1000 ? (totalLitres / 1000).toFixed(0) + 'K' : totalLitres}L</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Villages in Need</p>
                        <p className="text-2xl font-bold text-red-600">{criticalCount + warningCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Safe Villages</p>
                        <p className="text-2xl font-bold text-emerald-600">{safeCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
