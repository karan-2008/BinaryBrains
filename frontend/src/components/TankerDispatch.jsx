/**
 * TankerDispatch Component
 *
 * Fetches and displays the tanker allocation plan.
 * Shows village-to-tanker assignments with deficit and priority info.
 */

import { useState, useEffect } from "react";
import { fetchTankerAllocation } from "../api/backendClient";

function TankerDispatch() {
    const [allocation, setAllocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAllocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTankerAllocation();
            setAllocation(data);
        } catch (err) {
            setError(
                err.response?.data?.detail || "Failed to fetch tanker allocation."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllocation();
    }, []);

    return (
        <div className="tanker-dispatch">
            <div className="dispatch-header">
                <h3>Tanker Allocation Plan</h3>
                <button className="btn-refresh" onClick={loadAllocation} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {error && <div className="dispatch-error">{error}</div>}

            {allocation && (
                <>
                    <div className="dispatch-summary">
                        <span>Villages in Need: <strong>{allocation.total_villages_in_need}</strong></span>
                        <span>Tankers Assigned: <strong>{allocation.total_tankers_assigned}</strong></span>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Village</th>
                                <th>Deficit (L)</th>
                                <th>Allocated (L)</th>
                                <th>Tanker ID</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocation.allocations.map((a, idx) => (
                                <tr key={idx}>
                                    <td>{a.village_name}</td>
                                    <td>{a.deficit_liters.toLocaleString()}</td>
                                    <td>{a.allocated_liters.toLocaleString()}</td>
                                    <td>{a.tanker_id}</td>
                                    <td>{a.priority_score.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {allocation.allocations.length === 0 && (
                        <p className="empty-state">
                            No allocations needed — all villages within safe WSI range.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default TankerDispatch;
