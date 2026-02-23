import React, { useMemo } from 'react';

export default function CommandMetrics({ villages, autoRefreshTimestamp }) {
    const metrics = useMemo(() => {
        let severeCount = 0;
        let activeTankers = 0; // Simulated total from somewhere else if we had it, but for aesthetics we simulate 108.
        let popAtRisk = 0;
        let waterDeficit = -1.1;

        if (villages) {
            villages.forEach(v => {
                if (v.wsi > 70) {
                    severeCount++;
                    popAtRisk += (v.population || 0);
                }
            });
        }

        return {
            severeCount,
            activeTankers: 108,
            popAtRisk,
            waterDeficit,
            timestamp: autoRefreshTimestamp
        };
    }, [villages, autoRefreshTimestamp]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border-b border-slate-200 z-10 shrink-0 shadow-sm relative">

            {/* Metric 1 */}
            <div className="bg-white p-3 md:p-4 flex flex-col justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider">SEVERE DROUGHT VILLAGES</span>
                </div>
                <div className="flex items-end justify-between">
                    <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{metrics.severeCount}</span>
                    <span className="text-primary text-[10px] font-bold tracking-widest animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">trending_up</span> ACTIVE
                    </span>
                </div>
                <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(metrics.severeCount * 10, 100)}%` }}></div>
                </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-3 md:p-4 flex flex-col justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider">ACTIVE TANKERS</span>
                </div>
                <div className="flex items-end justify-between">
                    <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
                        {metrics.activeTankers}<span className="text-lg text-slate-400 font-normal">/50</span>
                    </span>
                    <span className="text-primary text-[10px] font-bold tracking-widest">216% CAP</span>
                </div>
                <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-3 md:p-4 flex flex-col justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider">LIVE WATER DEFICIT</span>
                </div>
                <div className="flex items-end justify-between">
                    <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{metrics.waterDeficit}ML</span>
                    <span className="text-primary text-[10px] font-bold tracking-widest">SHORTFALL</span>
                </div>
                <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-3 md:p-4 flex flex-col justify-between relative overflow-hidden group hover:bg-slate-50 transition-colors">
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-slate-900">
                    <span className="material-symbols-outlined text-8xl">group</span>
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider">EST. POP AT RISK</span>
                </div>
                <div className="flex items-end justify-between relative z-10">
                    <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{metrics.popAtRisk.toLocaleString()}</span>
                    <span className="text-primary border border-primary/30 bg-primary/10 px-1 py-0.5 rounded text-[10px] font-bold tracking-widest">LIVE TRACKER</span>
                </div>
            </div>

        </div>
    );
}
