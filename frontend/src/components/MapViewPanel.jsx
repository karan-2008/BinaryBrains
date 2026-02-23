import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapViewPanel({ villages, loading }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin size-8 border-2 border-slate-200 border-t-primary rounded-full"></div>
            </div>
        );
    }

    const getPinColor = (wsi) => {
        if (wsi > 70) return '#ef4444'; // red-500
        if (wsi > 40) return '#f59e0b'; // amber-500
        return '#10b981'; // emerald-500
    };

    // Calculate map bounds/center based on villages
    const center = useMemo(() => {
        if (!villages || villages.length === 0) return [21.1458, 79.0882]; // Default to Nagpur
        const validVillages = villages.filter(v => v.lat !== undefined && v.lng !== undefined && v.lat !== 0);
        if (validVillages.length === 0) return [21.1458, 79.0882];

        // Average coordinates for center
        const avgLat = validVillages.reduce((sum, v) => sum + v.lat, 0) / validVillages.length;
        const avgLng = validVillages.reduce((sum, v) => sum + v.lng, 0) / validVillages.length;
        return [avgLat, avgLng];
    }, [villages]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Geospatial Distribution</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Live interactive heatmap of drought severity across the district.</p>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[600px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center isolation-auto z-0">

                {/* Legend Overlay */}
                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-[1000]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Heatmap Reference</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full shadow-sm" style={{ backgroundColor: '#ef4444' }}></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Critical Hotspot (&gt;70)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full shadow-sm" style={{ backgroundColor: '#f59e0b' }}></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Warning Zone (40-70)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full shadow-sm" style={{ backgroundColor: '#10b981' }}></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Safe Zone (&lt;40)</span>
                        </div>
                    </div>
                </div>

                <MapContainer
                    center={center}
                    zoom={10}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {villages.map(village => {
                        if (!village.lat || !village.lng || village.lat === 0) return null;

                        const color = getPinColor(village.wsi);
                        return (
                            <CircleMarker
                                key={village.id}
                                center={[village.lat, village.lng]}
                                radius={village.wsi > 70 ? 25 : village.wsi > 40 ? 18 : 12}
                                pathOptions={{
                                    color: color,
                                    fillColor: color,
                                    fillOpacity: 0.6,
                                    weight: 2,
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    <div className="p-1">
                                        <div className="flex justify-between items-start mb-1 gap-4">
                                            <h4 className="font-bold text-sm truncate">{village.name}</h4>
                                            <span className="text-xs font-mono text-slate-500">{village.id}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs gap-4">
                                                <span className="text-slate-500">WSI Score:</span>
                                                <span className="font-bold" style={{ color }}>{village.wsi}</span>
                                            </div>
                                            <div className="flex justify-between text-xs gap-4">
                                                <span className="text-slate-500">Live Weather Rain:</span>
                                                <span className="font-medium text-slate-700">{village.live_weather?.rainfall_mm || 0} mm</span>
                                            </div>
                                            <div className="flex justify-between text-xs gap-4">
                                                <span className="text-slate-500">Groundwater Drop:</span>
                                                <span className="font-medium text-slate-700">{village.gw_current_level}m</span>
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
