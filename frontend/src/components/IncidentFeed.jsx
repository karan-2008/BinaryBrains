import React, { useMemo } from 'react';

export default function IncidentFeed({ villages }) {
    const incidents = useMemo(() => {
        if (!villages) return [];
        const alerts = [];
        villages.forEach(v => {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (v.wsi > 70) {
                alerts.push({
                    id: `crit-${v.id}`,
                    type: 'Critical Failure',
                    color: 'primary',
                    time: timeStr,
                    message: `${v.name} groundwater reserves depleted beyond 70% threshold. Immediate tanker rerouting mandatory.`,
                    actions: [{ label: 'REROUTE', primary: true }, { label: 'CONTACT', primary: false }]
                });
            } else if (v.wsi > 40) {
                alerts.push({
                    id: `warn-${v.id}`,
                    type: 'Supply Degradation',
                    color: 'orange',
                    time: timeStr,
                    message: `${v.name} entered Warning state. WSI at ${v.wsi.toFixed(1)}. Preventative allocation recommended.`,
                    actions: []
                });
            }
        });
        alerts.push({
            id: 'mock-1',
            type: 'Status Update',
            color: 'slate',
            time: '08:00 AM',
            message: 'SAT-LINK established. All sensor endpoints acknowledging ping.',
            actions: []
        });
        return alerts;
    }, [villages]);

    return (
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto hidden lg:flex z-10 relative">
            <div className="p-4 border-b border-slate-200 bg-white/90 sticky top-0 backdrop-blur-md z-10 shadow-sm">
                <h3 className="text-primary font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">campaign</span>
                    Live Incident Feed
                </h3>
            </div>

            <div className="flex flex-col gap-3 p-4">
                {incidents.length === 0 && (
                    <div className="text-slate-500 text-sm font-mono text-center mt-10">No active incidents.</div>
                )}

                {incidents.map((incident) => {
                    let bgClass = "bg-slate-50 border-slate-300";
                    let headerClass = "text-slate-600";

                    if (incident.color === 'primary') {
                        bgClass = "bg-primary/5 border-primary shadow-sm hover:shadow transition-shadow";
                        headerClass = "text-primary";
                    } else if (incident.color === 'orange') {
                        bgClass = "bg-orange-50 border-orange-400 shadow-sm hover:shadow transition-shadow";
                        headerClass = "text-orange-600";
                    }

                    return (
                        <div key={incident.id} className={`p-3 border-l-4 rounded-r animate-in fade-in slide-in-from-left-4 duration-500 ${bgClass}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-xs uppercase tracking-wider ${headerClass}`}>{incident.type}</span>
                                <span className="text-slate-400 text-[10px] font-mono">{incident.time}</span>
                            </div>
                            <p className="text-slate-800 text-sm font-medium leading-snug">{incident.message}</p>

                            {incident.actions && incident.actions.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                    {incident.actions.map(action => (
                                        <button
                                            key={action.label}
                                            className={`text-[10px] px-2 py-1 rounded transition-colors font-bold ${action.primary
                                                    ? 'bg-primary text-white hover:bg-blue-700 shadow-sm'
                                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm'
                                                }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
