import React, { useState, useEffect } from 'react';
import api from '../api/backendClient';

import TopNavigation from '../components/TopNavigation';
import VillagesPanel from '../components/VillagesPanel';
import OverviewPanel from '../components/OverviewPanel';
import ReportsPanel from '../components/ReportsPanel';
import MapViewPanel from '../components/MapViewPanel';

function AdminDashboard() {
    // ------------------------------------------------------------------------
    // Tab Navigation State
    // ------------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState('villages'); // 'overview', 'villages', 'reports', 'map'

    // ------------------------------------------------------------------------
    // Shared Data State (Hydrated once, used across tabs)
    // ------------------------------------------------------------------------
    const [villages, setVillages] = useState([]);
    const [loadingVillages, setLoadingVillages] = useState(true);
    const [errorVillages, setErrorVillages] = useState(null);

    const [allocationData, setAllocationData] = useState(null);
    const [loadingTankers, setLoadingTankers] = useState(true);
    const [errorTankers, setErrorTankers] = useState(null);

    // Filter & Search State (kept here so state persists if tab switches)
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchVillagesStatus();
        fetchTankerAllocation();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchVillagesStatus();
            fetchTankerAllocation();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchVillagesStatus = async () => {
        setLoadingVillages(true);
        setErrorVillages(null);
        try {
            const response = await api.get('/api/villages/status');
            setVillages(Array.isArray(response.data) ? response.data : []);
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

    // ------------------------------------------------------------------------
    // Render Selection
    // ------------------------------------------------------------------------
    const renderActivePanel = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewPanel villages={villages} loading={loadingVillages} allocationData={allocationData} />;
            case 'villages':
                return (
                    <VillagesPanel
                        villages={villages}
                        loadingVillages={loadingVillages}
                        errorVillages={errorVillages}
                        allocationData={allocationData}
                        loadingTankers={loadingTankers}
                        errorTankers={errorTankers}
                        fetchVillagesStatus={fetchVillagesStatus}
                        fetchTankerAllocation={fetchTankerAllocation}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                );
            case 'reports':
                return <ReportsPanel villages={villages} />;
            case 'map':
                return <MapViewPanel villages={villages} loading={loadingVillages} />;
            default:
                return <OverviewPanel villages={villages} loading={loadingVillages} allocationData={allocationData} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-display flex flex-col">
            <TopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1200px] mx-auto">
                    {renderActivePanel()}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
