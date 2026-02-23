import React, { useState, useEffect } from 'react';
import api from '../api/backendClient';

import DashboardStats from './DashboardStats';
import VillageGrid from './VillageGrid';
import TankerDispatch from './TankerDispatch';
import InsightDrawer from './InsightDrawer';

export default function VillagesPanel({
    villages,
    loadingVillages,
    errorVillages,
    allocationData,
    loadingTankers,
    errorTankers,
    fetchVillagesStatus,
    fetchTankerAllocation,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
}) {
    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [insight, setInsight] = useState(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [insightLanguage, setInsightLanguage] = useState('English');
    const [insightError, setInsightError] = useState(null);

    const handleAnalyze = async (village) => {
        setSelectedVillage(village);
        setIsDrawerOpen(true);
        setInsight(null);
        setInsightError(null);
        setLoadingInsight(true);

        try {
            const response = await api.get(`/api/villages/${village.id}/insight?lang=${insightLanguage}`);
            setInsight(response.data.insight);
        } catch (err) {
            setInsightError(err.response?.data?.detail || err.message || "Failed to generate AI insight.");
        } finally {
            setLoadingInsight(false);
        }
    };

    // Re-trigger language update if already open
    useEffect(() => {
        if (selectedVillage && isDrawerOpen) {
            handleAnalyze(selectedVillage);
        }
    }, [insightLanguage]);

    // ---- Derived filtered data ----
    const getStatus = (wsi) => {
        if (wsi > 70) return 'critical';
        if (wsi > 40) return 'warning';
        return 'safe';
    };

    const filteredVillages = villages.filter((v) => {
        const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || getStatus(v.wsi) === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Village Water Stress Severity Grid</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Monitor real-time drought levels, water supply index (WSI), and tanker dispatch requirements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { fetchVillagesStatus(); fetchTankerAllocation(); }}
                        disabled={loadingVillages}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-[20px] ${loadingVillages ? 'animate-spin' : ''}`}>sync</span>
                        Refresh Data
                    </button>
                </div>
            </div>

            {errorVillages && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex gap-3 items-center animate-pulse">
                    <span className="material-symbols-outlined">error</span>
                    <p className="text-sm font-medium">{errorVillages}</p>
                </div>
            )}

            <DashboardStats
                villages={villages}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
            />

            <VillageGrid
                villages={filteredVillages}
                onAnalyze={handleAnalyze}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                loading={loadingVillages}
            />

            <TankerDispatch
                allocationData={{
                    data: allocationData,
                    loading: loadingTankers,
                    error: errorTankers,
                    onRefresh: fetchTankerAllocation
                }}
                refreshStatus={loadingTankers ? "Refreshing..." : "Refresh Dispatch Plan"}
            />

            <InsightDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                village={selectedVillage}
                insight={insight}
                loading={loadingInsight}
                error={insightError}
                language={insightLanguage}
                onLanguageChange={setInsightLanguage}
            />
        </div>
    );
}
