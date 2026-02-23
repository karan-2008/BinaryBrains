import React from 'react';

export default function ReportsPanel({ villages }) {

    // Simulate some historical reports related to the loaded villages
    const mockReports = villages.slice(0, 4).map((v, i) => ({
        id: `RPT-2026-02-10${i}`,
        village: v.name,
        type: i % 2 === 0 ? 'AI Advisory Report' : 'Tanker Dispatch Log',
        date: `2026-02-${23 - i}`,
        status: i === 0 ? 'Pending Admin Action' : 'Resolved',
        author: i % 2 === 0 ? 'Deepseek Hydrologist' : 'System Automator'
    }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Reports & Logs</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Archived AI hydration advisories, historical tanker dispatch logs, and administrative exports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-primary transition shadow-md shadow-blue-200 dark:shadow-none">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Generate Custom Report
                    </button>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="block w-full pl-9 pr-3 py-2 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Document ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Related Village</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/60">
                            {mockReports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded flex items-center justify-center ${report.type.includes('AI') ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {report.type.includes('AI') ? 'psychology' : 'summarize'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">{report.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        {report.village}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {report.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                        {report.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.status === 'Resolved'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="View Document">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Download PDF">
                                                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
