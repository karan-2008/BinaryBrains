import React, { useState, useRef, useEffect } from 'react';
import TacticalMap from './TacticalMap';
import InsightDrawer from './InsightDrawer';
import api from '../api/backendClient';

export default function MapViewPanel({ villages, loading }) {
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [insight, setInsight] = useState('');
    const [insightLoading, setInsightLoading] = useState(false);
    const [insightError, setInsightError] = useState(null);
    const [language, setLanguage] = useState('English');
    const [containerHeight, setContainerHeight] = useState(0);
    const containerRef = useRef(null);

    // Measure the actual available height using a ref
    useEffect(() => {
        function updateHeight() {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerHeight(window.innerHeight - rect.top);
            }
        }
        updateHeight();
        window.addEventListener('resize', updateHeight);
        // Re-measure after a tick (for initial layout settling)
        const t = setTimeout(updateHeight, 50);
        return () => {
            window.removeEventListener('resize', updateHeight);
            clearTimeout(t);
        };
    }, []);

    const handleVillageClick = async (village) => {
        setSelectedVillage(village);
        setDrawerOpen(true);
        setInsight('');
        setInsightError(null);
        setInsightLoading(true);
        try {
            const res = await api.get(`/api/villages/${village.id}/insight?lang=${language}`);
            setInsight(res.data.insight || 'No insight available.');
        } catch (err) {
            setInsightError('Failed to generate AI report. Model may be offline.');
        } finally {
            setInsightLoading(false);
        }
    };

    const handleLanguageChange = async (lang) => {
        setLanguage(lang);
        if (selectedVillage) {
            setInsightLoading(true);
            setInsightError(null);
            try {
                const res = await api.get(`/api/villages/${selectedVillage.id}/insight?lang=${lang}`);
                setInsight(res.data.insight || 'No insight available.');
            } catch (err) {
                setInsightError('Failed to load insight in selected language.');
            } finally {
                setInsightLoading(false);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex w-full"
            style={{ height: containerHeight > 0 ? `${containerHeight}px` : 'calc(100vh - 64px)' }}
        >
            {/* Map */}
            <div className="flex-1 relative" style={{ height: '100%' }}>
                <TacticalMap
                    villages={villages}
                    loading={loading}
                    onVillageClick={handleVillageClick}
                />
            </div>

            {/* Insight Drawer */}
            {drawerOpen && (
                <InsightDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    village={selectedVillage}
                    insight={insight}
                    loading={insightLoading}
                    error={insightError}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />
            )}
        </div>
    );
}
