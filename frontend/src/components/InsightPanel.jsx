/**
 * InsightPanel Component
 *
 * Displays AI-generated 3-bullet advisory for a selected village.
 * Includes language selection dropdown and loading state.
 */

import { useState, useEffect } from "react";
import { fetchVillageInsight } from "../api/backendClient";

function InsightPanel({ village, onClose }) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lang, setLang] = useState("english");

    useEffect(() => {
        if (!village) return;

        let cancelled = false;
        const loadInsight = async () => {
            setLoading(true);
            setError(null);
            setInsight(null);

            try {
                const data = await fetchVillageInsight(village.id, lang);
                if (!cancelled) {
                    setInsight(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.detail ||
                        "Failed to generate insight. Is the AI service running?"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInsight();
        return () => {
            cancelled = true;
        };
    }, [village, lang]);

    if (!village) return null;

    return (
        <div className="insight-panel">
            <div className="insight-header">
                <h3>AI Advisory — {village.name}</h3>
                <button className="btn-close" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="insight-controls">
                <label htmlFor="lang-select">Language: </label>
                <select
                    id="lang-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                >
                    <option value="english">English</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                </select>
            </div>

            <div className="insight-body">
                {loading && (
                    <div className="insight-loading">
                        <div className="spinner" />
                        <p>Generating advisory...</p>
                    </div>
                )}

                {error && <div className="insight-error">{error}</div>}

                {insight && !loading && (
                    <div className="insight-content">
                        <pre>{insight.insight_text}</pre>
                        <p className="insight-meta">Model: {insight.model_used}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InsightPanel;
