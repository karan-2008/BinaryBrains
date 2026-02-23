import React from 'react';

export default function InsightDrawer({
    isOpen,
    onClose,
    village,
    insight,
    loading,
    error,
    language,
    onLanguageChange
}) {

    // Slide translation for opening/closing
    const translateClass = isOpen ? 'translate-x-0' : 'translate-x-full';

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${translateClass} flex flex-col`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">psychology</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">AI Advisory</h2>
                            <p className="text-sm text-slate-500 font-medium">
                                {village ? village.name : 'Select a village'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Controls */}
                    {village && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Action Plan Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value)}
                                className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">हिन्दी (Hindi)</option>
                                <option value="Marathi">मराठी (Marathi)</option>
                            </select>
                        </div>
                    )}

                    {/* Dynamic State Rendering */}
                    <div className="pt-4">
                        {!village && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">touch_app</span>
                                <p className="text-slate-500">Select "Analyze" on a village to generate an AI insight action plan.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">Running deterministic models...</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex gap-3 text-red-700 dark:text-red-400">
                                <span className="material-symbols-outlined">error</span>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {insight && !loading && !error && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hydrologist Report</h3>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {insight}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        Dispatch Directives
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
