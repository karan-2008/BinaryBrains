import React, { useMemo, useState } from 'react';

export default function DispatchEngine({ allocations, loading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        const list = allocations || [];
        if (!searchTerm) return list;
        const q = searchTerm.toLowerCase();
        return list.filter(a =>
            (a.village_name || '').toLowerCase().includes(q) ||
            (a.village_id || '').toLowerCase().includes(q)
        );
    }, [allocations, searchTerm]);

    const totalLiters = useMemo(() =>
        (allocations || []).reduce((acc, a) => acc + (a.allocated_liters || 0), 0), [allocations]
    );

    return (
        <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tanker Dispatch Console</h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">AI-optimized tanker allocation and route assignments for priority villages.</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm shadow-sm">
                            <span className="text-slate-500 font-medium">Total Volume: </span>
                            <span className="font-bold text-slate-900">{totalLiters.toLocaleString()} L</span>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-sm">
                            <span className="font-bold text-primary">{(allocations || []).length} Dispatches</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border-none ring-1 ring-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm transition-shadow"
                            placeholder="Search dispatch..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Dispatch Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Village</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">WSI</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Population</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tankers</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Volume</th>
                                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {loading && filtered.length === 0 ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="animate-spin size-5 border-2 border-slate-200 border-t-primary rounded-full"></div>
                                            Calculating optimal dispatch sequences...
                                        </div>
                                    </td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-slate-500">No dispatches available.</td></tr>
                                ) : (
                                    filtered.map((alloc, idx) => {
                                        const wsi = alloc.village?.wsi || alloc.wsi || 0;
                                        const pop = alloc.village?.population || alloc.population || 0;
                                        const liters = alloc.allocated_liters || 0;
                                        const tankers = alloc.tankers_allocated || 0;

                                        const getPriorityBadge = (i) => {
                                            if (i < 3) return { bg: 'bg-red-50 border-red-200 text-red-700', label: 'URGENT' };
                                            if (i < 6) return { bg: 'bg-amber-50 border-amber-200 text-amber-700', label: 'HIGH' };
                                            return { bg: 'bg-blue-50 border-blue-200 text-blue-700', label: 'NORMAL' };
                                        };
                                        const pri = getPriorityBadge(idx);

                                        return (
                                            <tr key={alloc.village_id || idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${pri.bg}`}>
                                                        {pri.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-slate-900">{alloc.village_name || alloc.village_id}</span>
                                                    <div className="text-xs text-slate-400 font-mono sm:hidden">WSI: {wsi.toFixed ? wsi.toFixed(1) : wsi}</div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                    <span className="text-sm font-mono font-bold text-slate-700">{wsi.toFixed ? wsi.toFixed(1) : wsi}</span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono hidden md:table-cell">
                                                    {pop.toLocaleString ? pop.toLocaleString() : pop}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-900">
                                                    {String(tankers).padStart(2, '0')}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono hidden lg:table-cell">
                                                    {liters.toLocaleString ? liters.toLocaleString() : liters} L
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                                                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition">
                                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                                        <span className="hidden sm:inline">Dispatch</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
