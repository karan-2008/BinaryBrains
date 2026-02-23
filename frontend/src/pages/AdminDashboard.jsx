import React, { useState, useEffect } from 'react';
import api from '../api/backendClient';
import OverviewPanel from '../components/OverviewPanel';
import VillageGridPanel from '../components/VillageGridPanel';
import MapViewPanel from '../components/MapViewPanel';
import DispatchEngine from '../components/DispatchEngine';
import ChatbotWidget from '../components/ChatbotWidget';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'villages', label: 'Villages', icon: 'location_city' },
    { id: 'map', label: 'Map View', icon: 'map' },
    { id: 'dispatch', label: 'Dispatch', icon: 'local_shipping' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [villages, setVillages] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [allocationData, setAllocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [vRes, tRes] = await Promise.all([
                api.get('/api/villages/status'),
                api.get('/api/tankers/allocation')
            ]);
            setVillages(vRes.data || []);
            setAllocationData(tRes.data);
            setAllocations(tRes.data.allocations || []);
        } catch (err) {
            console.error("Dashboard Sync Failed:", err);
            setError("Failed to load data. Backend may be offline.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const renderPanel = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewPanel villages={villages} loading={loading} allocationData={allocationData} />;
            case 'villages':
                return <VillageGridPanel villages={villages} allocations={allocations} loading={loading} />;
            case 'map':
                return <MapViewPanel villages={villages} loading={loading} />;
            case 'dispatch':
                return <DispatchEngine allocations={allocations} loading={loading} />;
            default:
                return <OverviewPanel villages={villages} loading={loading} allocationData={allocationData} />;
        }
    };

    return (
        <div className="bg-[#f6f7f8] text-slate-900 font-display h-screen flex flex-col overflow-hidden">
            {/* ─── Top Navigation Bar (from stitch template) ─── */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shrink-0">
                <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">water_drop</span>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <h1 className="text-lg font-bold leading-none text-slate-900">Water Management Dashboard</h1>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">Government Monitoring Portal</span>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Live Indicator */}
                        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Sync Active
                        </div>

                        <button onClick={fetchData} className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" title="Refresh Data">
                            <span className={`material-symbols-outlined text-[22px] ${loading ? 'animate-spin' : ''}`}>sync</span>
                        </button>

                        <button className="text-slate-500 hover:text-slate-700 relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        <button className="flex items-center gap-2 group">
                            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-slate-700 group-hover:text-slate-900">Admin</span>
                            <span className="material-symbols-outlined text-slate-400 text-[18px] hidden sm:block">expand_more</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 text-sm font-medium flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                    <button onClick={fetchData} className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg font-semibold transition-colors">RETRY</button>
                </div>
            )}

            {/* ─── Main Layout: Content + Right Sidebar ─── */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <main className={`flex-1 overflow-x-hidden ${activeTab === 'map' ? 'h-full' : 'overflow-y-auto'}`}>
                    {renderPanel()}
                </main>

                {/* ─── Right Sidebar Navigation (Desktop) ─── */}
                <nav className="hidden md:flex flex-col w-[72px] bg-white border-l border-slate-200 shrink-0 py-4 items-center gap-1">
                    {NAV_ITEMS.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                title={item.label}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'font-bold' : ''}`}>{item.icon}</span>
                                <span className={`text-[9px] font-semibold mt-0.5 leading-none tracking-wide ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.label}
                                </span>
                                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-l-full"></div>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* ─── Bottom Tab Bar (Mobile) ─── */}
            <nav className="md:hidden flex bg-white border-t border-slate-200 shrink-0 safe-area-bottom">
                {NAV_ITEMS.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <ChatbotWidget />
        </div>
    );
}
