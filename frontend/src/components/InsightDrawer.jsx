import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function InsightDrawer({
    isOpen, onClose, village, insight, loading, error, language, onLanguageChange
}) {
    if (!isOpen || !village) return null;

    const wsi = village.wsi || 0;
    const getStatusColor = (w) => {
        if (w > 70) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High Risk', dot: 'bg-red-500' };
        if (w > 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Warning', dot: 'bg-amber-500' };
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Safe', dot: 'bg-emerald-500' };
    };
    const status = getStatusColor(wsi);

    return (
        <div className={`absolute md:relative top-0 right-0 h-full z-30 w-full md:w-[420px] bg-white border-l border-slate-200 shadow-2xl md:shadow-lg flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 shrink-0">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">{village.name}</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${status.bg} ${status.text} ${status.border} border`}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">WSI: {wsi.toFixed(1)} • Pop: {(village.population || 0).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">close</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                {/* AI Hydrological Report */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            AI Hydrological Report
                        </div>
                        <div className="flex gap-1">
                            {['English', 'Marathi'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => onLanguageChange(lang)}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${language === lang
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {lang === 'English' ? 'EN' : 'MR'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="flex items-center gap-3 py-6 justify-center">
                                <div className="animate-spin size-5 border-2 border-slate-200 border-t-primary rounded-full"></div>
                                <span className="text-sm text-slate-500">Generating AI analysis...</span>
                            </div>
                        ) : error ? (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <span className="material-symbols-outlined text-[16px] mr-1 align-middle">error</span>
                                {error}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-700 leading-relaxed space-y-2 prose prose-sm max-w-none">
                                <ReactMarkdown>{insight || 'No insight data available.'}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>

                {/* Routing Protocol (from stitch template) */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900">Routing Protocol</h3>
                        <a href="#" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                            View Map <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                    </div>
                    <div className="relative pl-8 space-y-6">
                        {/* Timeline */}
                        <div className="absolute left-[14px] top-2 bottom-2 w-px bg-slate-200"></div>

                        <div className="relative">
                            <div className="absolute -left-[22px] size-7 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600 text-[14px]">radio_button_checked</span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Depot Load</p>
                                <p className="text-xs text-slate-500 mt-0.5">08:00 AM • Sector 7 Filling Station</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[22px] size-7 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400 text-[14px]">local_shipping</span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Transit</p>
                                <p className="text-xs text-slate-500 mt-0.5">~45 mins • 12 km distance</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[22px] size-7 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 text-[14px]">location_on</span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Village Discharge</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold mr-1">09:45 AM</span>
                                    {village.name} Central Tank
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver & Vehicle Info */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Driver</p>
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500 text-[16px]">person</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">R. Patil</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Vehicle</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-500 text-[18px]">local_shipping</span>
                            <span className="text-sm font-semibold text-slate-900 font-mono">MH-15-TC-22</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispatch CTA */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    Dispatch Tankers
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">Action will notify regional depot manager immediately.</p>
            </div>
        </div>
    );
}
