import React from 'react';

export default function CrisisHeader({ onEmergencyProtocols }) {
    return (
        <header className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm z-50">
            <div className="flex justify-between items-center p-3 md:px-6">
                <div className="flex items-center gap-4 group cursor-pointer lg:min-w-[300px]">
                    <div className="flex items-center justify-center h-10 w-10 bg-primary/10 rounded border border-primary/20 text-primary">
                        <span className="material-symbols-outlined text-[24px]">warning</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black tracking-widest text-slate-900 flex items-center gap-3">
                        FLEET COMMAND
                        <span className="hidden md:inline text-slate-300 font-normal">/</span>
                        <span className="text-sm md:text-xl font-bold text-slate-600">CRISIS MODE ACTIVE</span>
                    </h2>
                </div>

                <div className="flex gap-4 items-center text-[10px] md:text-xs font-mono font-bold tracking-widest text-slate-500 hidden sm:flex">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">satellite_alt</span>
                        <span>SAT-LINK:</span>
                        <span className="text-emerald-600 animate-pulse ml-1">ACTIVE</span>
                    </div>
                    <span>|</span>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">sync</span>
                        <span>LAST SYNC: 00:00s</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onEmergencyProtocols}
                        className="bg-primary hover:bg-red-700 text-white font-bold text-xs md:text-sm px-4 py-2 rounded shadow transition-all tracking-wider flex items-center gap-2 active:scale-95 border border-primary"
                    >
                        <span>EMERGENCY PROTOCOLS</span>
                    </button>

                    <div className="hidden md:flex bg-slate-100 rounded border border-slate-200 ml-2">
                        <button className="p-2 rounded hover:bg-slate-200 text-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                        </button>
                        <button className="p-2 rounded hover:bg-slate-200 text-slate-600 border-l border-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                        </button>
                        <button className="p-2 rounded hover:bg-slate-200 text-slate-600 border-l border-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-0.5 bg-gradient-to-r from-primary via-orange-500 to-primary w-full opacity-80"></div>
        </header>
    );
}
