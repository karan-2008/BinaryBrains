/**
 * AdminDashboard Page
 *
 * Main dashboard view that composes:
 * - DashboardGrid: village table with WSI metrics
 * - InsightPanel: AI-generated advisory (triggered by Analyze)
 * - TankerDispatch: tanker allocation plan
 */

import { useState, useEffect } from "react";
import { fetchVillagesStatus } from "../api/backendClient";
import DashboardGrid from "../components/DashboardGrid";
import InsightPanel from "../components/InsightPanel";
import TankerDispatch from "../components/TankerDispatch";

function AdminDashboard() {
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);

    useEffect(() => {
        const loadVillages = async () => {
            try {
                const data = await fetchVillagesStatus();
                setVillages(data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Failed to fetch village data. Is the backend running?"
                );
            } finally {
                setLoading(false);
            }
        };

        loadVillages();
    }, []);

    const handleAnalyze = (village) => {
        setSelectedVillage(village);
    };

    const handleCloseInsight = () => {
        setSelectedVillage(null);
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-title">
                <h1>🚰 Drought Warning & Tanker Management</h1>
                <p>District-level water stress monitoring and smart tanker dispatch</p>
            </header>

            {loading && <div className="loading-state">Loading village data...</div>}
            {error && <div className="error-state">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="section-grid">
                        <h2>Village Water Stress Status</h2>
                        <DashboardGrid
                            villages={villages}
                            onAnalyze={handleAnalyze}
                        />
                    </section>

                    {selectedVillage && (
                        <section className="section-insight">
                            <InsightPanel
                                village={selectedVillage}
                                onClose={handleCloseInsight}
                            />
                        </section>
                    )}

                    <section className="section-tanker">
                        <TankerDispatch />
                    </section>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
