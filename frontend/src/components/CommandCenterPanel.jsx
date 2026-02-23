import React from 'react';
import CrisisHeader from './CrisisHeader';
import IncidentFeed from './IncidentFeed';
import CommandMetrics from './CommandMetrics';
import TacticalMap from './TacticalMap';
import DispatchEngine from './DispatchEngine';

export default function CommandCenterPanel({ villages, allocations, loading, autoRefreshTimestamp }) {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50">
            <CrisisHeader onEmergencyProtocols={() => { }} />
            <div className="flex flex-1 overflow-hidden relative z-0">
                <IncidentFeed villages={villages} />
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
                    <CommandMetrics villages={villages} autoRefreshTimestamp={autoRefreshTimestamp} />
                    <TacticalMap villages={villages} loading={loading} />
                    <DispatchEngine allocations={allocations} loading={loading} />
                </div>
            </div>
        </div>
    );
}
