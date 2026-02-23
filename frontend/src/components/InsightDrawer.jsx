import React from 'react';

export default function InsightDrawer({
    isOpen, onClose, village, insight, loading, error, language, onLanguageChange
}) {
    const translateClass = isOpen ? 'translate-x-0' : 'translate-x-full';

    const getStatusColor = (wsi) => {
        if (!wsi) return { bg: 'bg-slate-100', text: 'text-slate-600', label: '—' };
        if (wsi > 70) return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'CRITICAL' };
        if (wsi > 40) return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'WARNING' };
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'SAFE' };
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
            )}

            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${translateClass} flex flex-col`}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <span className="material-symbols-outlined text-[20px]">psychology</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">AI Advisory</h2>
                                <p className="text-sm text-slate-500 font-medium">{village ? village.name : 'Select a village'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>
                    </div>
                </div>

                {/* Village Meta Cards */}
                {village && (
                    <div className="px-6 pt-4 pb-2 grid grid-cols-2 gap-3">
                        {(() => {
                            const sc = getStatusColor(village.wsi);
                            return (
                                <div className={`p-3 rounded-xl ${sc.bg} border border-slate-200/50`}>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WSI Score</div>
                                    <div className={`text-xl font-bold ${sc.text}`}>{village.wsi} <span className="text-xs font-semibold">{sc.label}</span></div>
                                </div>
                            );
                        })()}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Population</div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">{village.population?.toLocaleString()}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GW Level</div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">{village.gw_current_level}m</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rainfall Dev</div>
                            <div className={`text-xl font-bold ${village.rainfall_dev_pct < -30 ? 'text-red-600' : village.rainfall_dev_pct < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {village.rainfall_dev_pct > 0 ? '+' : ''}{village.rainfall_dev_pct}%
                            </div>
                        </div>
                    </div>
                )}

                {/* Language Selector */}
                {village && (
                    <div className="px-6 py-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Report Language</label>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-sm"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">हिन्दी (Hindi)</option>
                            <option value="Marathi">मराठी (Marathi)</option>
                        </select>
                    </div>
                )}

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">

                    {!village && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">touch_app</span>
                            <p className="text-slate-500 text-sm">Click <strong>"Analyze"</strong> on any village row to generate an AI insight.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <div className="relative">
                                <div className="animate-spin size-12 border-[3px] border-slate-200 border-t-primary rounded-full"></div>
                                <span className="material-symbols-outlined text-primary text-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">auto_awesome</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">Generating AI advisory report...</p>
                            <p className="text-xs text-slate-400">This may take 10–30 seconds</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex gap-3 text-red-700 dark:text-red-400 items-start">
                            <span className="material-symbols-outlined mt-0.5">error</span>
                            <div>
                                <p className="text-sm font-semibold">AI Service Error</p>
                                <p className="text-xs mt-1 opacity-80">{error}</p>
                            </div>
                        </div>
                    )}

                    {insight && !loading && !error && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hydrologist Report</h3>
                            </div>

                            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner leading-relaxed text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {insight}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-primary transition-all shadow-md shadow-blue-200 dark:shadow-none hover:shadow-lg">
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                    Dispatch Directives
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
