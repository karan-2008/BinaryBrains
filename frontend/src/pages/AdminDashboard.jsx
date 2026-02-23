import React, { useState, useEffect } from 'react';
import api from '../api/backendClient';

// Components
import TopNavigation from '../components/TopNavigation';
import DashboardStats from '../components/DashboardStats';
import VillageGrid from '../components/VillageGrid';
import TankerDispatch from '../components/TankerDispatch';
import InsightDrawer from '../components/InsightDrawer';

function AdminDashboard() {
    const [villages, setVillages] = useState([]);
    const [loadingVillages, setLoadingVillages] = useState(false);
    const [errorVillages, setErrorVillages] = useState(null);

    const [allocationData, setAllocationData] = useState(null);
    const [loadingTankers, setLoadingTankers] = useState(false);
    const [errorTankers, setErrorTankers] = useState(null);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [insight, setInsight] = useState(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [insightLanguage, setInsightLanguage] = useState('English');
    const [insightError, setInsightError] = useState(null);

    useEffect(() => {
        fetchVillagesStatus();
        fetchTankerAllocation();
    }, []);

    const fetchVillagesStatus = async () => {
        setLoadingVillages(true);
        setErrorVillages(null);
        try {
            const response = await api.get('/api/villages/status');
            // The backend returns a direct array, not wrapped in { data: [...] }
            setVillages(response.data);
        } catch (err) {
            setErrorVillages(err.response?.data?.detail || err.message);
        } finally {
            setLoadingVillages(false);
        }
    };

    const fetchTankerAllocation = async () => {
        setLoadingTankers(true);
        setErrorTankers(null);
        try {
            const response = await api.get('/api/tankers/allocation');
            setAllocationData(response.data);
        } catch (err) {
            setErrorTankers(err.response?.data?.detail || err.message);
        } finally {
            setLoadingTankers(false);
        }
    };

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

    // Ensure language change retriggers analysis if drawer is open
    useEffect(() => {
        if (selectedVillage && isDrawerOpen) {
            handleAnalyze(selectedVillage);
        }
    }, [insightLanguage]);


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-display flex flex-col">
            <TopNavigation />

            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1200px] mx-auto space-y-6">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Village Water Stress Severity Grid</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Monitor real-time drought levels, water supply index (WSI), and tanker dispatch requirements.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchVillagesStatus}
                                disabled={loadingVillages}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined text-[20px] ${loadingVillages ? 'animate-spin' : ''}`}>sync</span>
                                Refresh Data
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorVillages && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex gap-3">
                            <span className="material-symbols-outlined">error</span>
                            <p className="text-sm font-medium">{errorVillages}</p>
                        </div>
                    )}

                    {/* Stats Overview Cards */}
                    <DashboardStats villages={villages} />

                    {/* Village Grid (Table) */}
                    <VillageGrid
                        villages={villages}
                        onAnalyze={handleAnalyze}
                    />

                    {/* Tanker Allocation Section */}
                    <TankerDispatch
                        allocationData={{
                            data: allocationData,
                            loading: loadingTankers,
                            error: errorTankers,
                            onRefresh: fetchTankerAllocation
                        }}
                        refreshStatus="Refresh Dispatch Plan"
                    />

                </div>
            </main>

            {/* AI Insight Slide-Over Drawer */}
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

export default AdminDashboard;
