import React from 'react';

export default function MapViewPanel({ villages, loading }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
            </div>
        );
    }

    // Static map coordinate simulation mapping for the 5 seed villages (0-100% bounds)
    const mockCoordinates = {
        'V001': { top: '30%', left: '70%' }, // Ramtek
        'V002': { top: '40%', left: '40%' }, // Saoner
        'V003': { top: '65%', left: '30%' }, // Katol
        'V004': { top: '75%', left: '60%' }, // Hingna
        'V005': { top: '80%', left: '85%' }, // Umred
    };

    const getPinStyle = (wsi) => {
        if (wsi > 70) return "bg-red-500 shadow-red-500/50 animate-bounce";
        if (wsi > 40) return "bg-amber-500 shadow-amber-500/50";
        return "bg-emerald-500 shadow-emerald-500/50";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Geospatial Distribution</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Visual overview of drought severity hotspots across the district.</p>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[600px] bg-sky-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden flex items-center justify-center">

                {/* Simulated Map Grid/Background */}
                <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                {/* Topographic mock shapes */}
                <div className="absolute top-10 left-20 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-20 right-20 w-[500px] h-[400px] bg-blue-200/40 dark:bg-blue-900/20 rounded-[100px] blur-3xl pointer-events-none"></div>

                {/* Map Overlay Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                    <button className="size-10 bg-white dark:bg-slate-700 rounded-xl shadow border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary transition">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="size-10 bg-white dark:bg-slate-700 rounded-xl shadow border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary transition">
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">WSI Severity Map</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Critical Hotspot (&gt;70)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Warning Zone (40-70)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Safe Zone (&lt;40)</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Map Pins */}
                <div className="relative w-[80%] h-[80%] z-10 transition-transform duration-1000">
                    {villages.map(village => {
                        const coords = mockCoordinates[village.id] || { top: '50%', left: '50%' };
                        const pinClass = getPinStyle(village.wsi);

                        return (
                            <div key={village.id} className="absolute inline-block group" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}>
                                {/* Pin Visual */}
                                <div className="relative cursor-pointer">
                                    <div className={`mt-2 size-6 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${pinClass}`}>
                                        <div className="size-2 bg-white rounded-full"></div>
                                    </div>
                                    {/* Map Pin Tail */}
                                    <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${village.wsi > 70 ? 'border-t-red-500' : village.wsi > 40 ? 'border-t-amber-500' : 'border-t-emerald-500'}`}></div>
                                </div>

                                {/* Tooltip (Hover Card) */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 translate-y-2 group-hover:translate-y-0 text-left">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm truncate pr-2">{village.name}</h4>
                                        <span className="text-[10px] font-mono text-slate-400">{village.id}</span>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">WSI Score:</span>
                                            <span className={`font-bold ${village.wsi > 70 ? 'text-red-400' : village.wsi > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{village.wsi}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">GW Drop:</span>
                                            <span>{village.gw_current_level}m</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                                </div>
                                {/* Drop shadow beneath pin */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 dark:bg-black/40 rounded-[100%] blur-[2px]"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
