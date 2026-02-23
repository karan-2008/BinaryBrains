import React, { useState, useMemo } from 'react';

const ROWS_PER_PAGE = 10;

export default function VillageGridPanel({ villages, allocations, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    // Compute counts
    const counts = useMemo(() => {
        let critical = 0, warning = 0, safe = 0;
        (villages || []).forEach(v => {
            if ((v.wsi || 0) > 70) critical++;
            else if ((v.wsi || 0) > 40) warning++;
            else safe++;
        });
        return { critical, warning, safe, total: (villages || []).length };
    }, [villages]);

    // Filter & search
    const filteredVillages = useMemo(() => {
        let list = villages || [];
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(v =>
                (v.name || '').toLowerCase().includes(q) ||
                (v.id || '').toLowerCase().includes(q)
            );
        }
        if (statusFilter === 'critical') list = list.filter(v => (v.wsi || 0) > 70);
        else if (statusFilter === 'warning') list = list.filter(v => (v.wsi || 0) > 40 && (v.wsi || 0) <= 70);
        else if (statusFilter === 'safe') list = list.filter(v => (v.wsi || 0) <= 40);
        return list;
    }, [villages, searchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredVillages.length / ROWS_PER_PAGE));
    const pagedVillages = filteredVillages.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    const getSeverity = (wsi) => {
        if (wsi > 70) return { color: 'bg-red-50 text-red-700 border-red-100', dotClass: 'bg-red-600', label: 'CRITICAL', pulse: true };
        if (wsi > 40) return { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', dotClass: 'bg-yellow-600', label: 'WARNING', pulse: false };
        return { color: 'bg-green-50 text-green-700 border-green-100', dotClass: 'bg-green-600', label: 'SAFE', pulse: false };
    };

    return (
        <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Village Water Stress Severity Grid</h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">Monitor real-time drought levels, water supply index (WSI), and tanker dispatch requirements.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">file_download</span>
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Villages</div>
                        <div className="text-2xl font-bold text-slate-900">{counts.total}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                        <div className="text-red-600 text-xs font-semibold uppercase tracking-wider mb-1">Critical</div>
                        <div className="text-2xl font-bold text-red-700">{counts.critical}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                        <div className="text-yellow-600 text-xs font-semibold uppercase tracking-wider mb-1">Warning</div>
                        <div className="text-2xl font-bold text-yellow-700">{counts.warning}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                        <div className="text-green-600 text-xs font-semibold uppercase tracking-wider mb-1">Safe</div>
                        <div className="text-2xl font-bold text-green-700">{counts.safe}</div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border-none ring-1 ring-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm transition-shadow"
                            placeholder="Search village or ID..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 px-1 sm:px-0">
                        {[
                            { key: 'all', label: 'All Regions' },
                            { key: 'critical', label: 'Critical' },
                            { key: 'warning', label: 'Warning' },
                            { key: 'safe', label: 'Safe' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => { setStatusFilter(f.key); setCurrentPage(1); }}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f.key
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >{f.label}</button>
                        ))}
                    </div>
                </div>

                {/* Main Data Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="sticky left-0 z-10 bg-slate-50 px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] md:shadow-none">Village Name</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Drought Severity (WSI)</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Population</th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanker Req.</th>
                                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {loading && (villages || []).length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="animate-spin size-5 border-2 border-slate-200 border-t-primary rounded-full"></div>
                                            Loading village data...
                                        </div>
                                    </td></tr>
                                ) : pagedVillages.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">No villages match your query.</td></tr>
                                ) : (
                                    pagedVillages.map(v => {
                                        const alloc = (allocations || []).find(a => a.village_id === v.id);
                                        const tankersReq = alloc ? alloc.tankers_allocated : 0;
                                        const wsi = v.wsi || 0;
                                        const sev = getSeverity(wsi);

                                        return (
                                            <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] md:shadow-none">
                                                    {v.name}
                                                    <div className="text-xs text-slate-400 font-normal sm:hidden">{(v.population || 0).toLocaleString()} pop</div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                                                    {v.lat ? `${v.lat.toFixed(2)}, ${(v.lng || 0).toFixed(2)}` : 'N/A'}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sev.color}`}>
                                                        {sev.pulse ? (
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                                            </span>
                                                        ) : (
                                                            <span className={`h-2 w-2 rounded-full ${sev.dotClass}`}></span>
                                                        )}
                                                        {sev.label} • {wsi.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono hidden md:table-cell">
                                                    {(v.population || 0).toLocaleString()}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono font-medium hidden lg:table-cell">
                                                    {tankersReq > 0 ? `${String(tankersReq).padStart(2, '0')} Units` : '00 Units'}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                                                        Analyze
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-medium">{Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredVillages.length)}</span> to <span className="font-medium">{Math.min(currentPage * ROWS_PER_PAGE, filteredVillages.length)}</span> of <span className="font-medium">{filteredVillages.length}</span> results
                            </p>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) page = i + 1;
                                    else if (currentPage <= 3) page = i + 1;
                                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                                    else page = currentPage - 2 + i;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                    ? 'z-10 bg-slate-50 border-primary text-primary font-bold'
                                                    : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >{page}</button>
                                    );
                                })}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
