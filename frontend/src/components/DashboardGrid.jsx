/**
 * DashboardGrid Component
 *
 * Displays a sortable table of all villages with WSI color coding.
 * Clicking "Analyze" on a row triggers the insight panel.
 */

import { useState } from "react";
import { getWsiColor, getWsiLabel } from "../utils/colorUtils";

function DashboardGrid({ villages, onAnalyze }) {
    const [sortField, setSortField] = useState("priority_score");
    const [sortAsc, setSortAsc] = useState(false);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(false);
        }
    };

    const sorted = [...villages].sort((a, b) => {
        const valA = a[sortField] ?? 0;
        const valB = b[sortField] ?? 0;
        return sortAsc ? valA - valB : valB - valA;
    });

    const SortIcon = ({ field }) => (
        <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3 }}>
            {sortField === field ? (sortAsc ? "▲" : "▼") : "⇅"}
        </span>
    );

    return (
        <div className="dashboard-grid">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                            Village <SortIcon field="name" />
                        </th>
                        <th onClick={() => handleSort("population")} style={{ cursor: "pointer" }}>
                            Population <SortIcon field="population" />
                        </th>
                        <th onClick={() => handleSort("gw_current_level")} style={{ cursor: "pointer" }}>
                            GW Level (m) <SortIcon field="gw_current_level" />
                        </th>
                        <th onClick={() => handleSort("rainfall_dev_pct")} style={{ cursor: "pointer" }}>
                            Rainfall Dev % <SortIcon field="rainfall_dev_pct" />
                        </th>
                        <th onClick={() => handleSort("wsi")} style={{ cursor: "pointer" }}>
                            WSI <SortIcon field="wsi" />
                        </th>
                        <th onClick={() => handleSort("priority_score")} style={{ cursor: "pointer" }}>
                            Priority <SortIcon field="priority_score" />
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((village) => (
                        <tr key={village.id}>
                            <td>{village.name}</td>
                            <td>{village.population.toLocaleString()}</td>
                            <td>{village.gw_current_level}</td>
                            <td>{village.rainfall_dev_pct}%</td>
                            <td>
                                <span
                                    className="wsi-badge"
                                    style={{ backgroundColor: getWsiColor(village.wsi) }}
                                >
                                    {village.wsi.toFixed(1)} — {getWsiLabel(village.wsi)}
                                </span>
                            </td>
                            <td>{village.priority_score.toFixed(1)}</td>
                            <td>
                                <button
                                    className="btn-analyze"
                                    onClick={() => onAnalyze(village)}
                                >
                                    Analyze
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {villages.length === 0 && (
                <p className="empty-state">No village data available.</p>
            )}
        </div>
    );
}

export default DashboardGrid;
