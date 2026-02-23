import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';

function MapResizer() {
    const map = useMap();
    useEffect(() => {
        // Leaflet needs invalidateSize when container was hidden during init
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        const timer2 = setTimeout(() => {
            map.invalidateSize();
        }, 500);
        return () => { clearTimeout(timer); clearTimeout(timer2); };
    }, [map]);
    return null;
}

function MapBoundsUpdater({ villages }) {
    const map = useMap();
    useEffect(() => {
        if (villages && villages.length > 0) {
            const bounds = villages.map(v => [v.lat || v.latitude || 21.15, v.lng || v.longitude || 79.08]);
            if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [villages, map]);
    return null;
}

function getColor(wsi) {
    if (wsi > 70) return '#ef4444';
    if (wsi > 40) return '#f59e0b';
    return '#10b981';
}

function getLabel(wsi) {
    if (wsi > 70) return 'Critical';
    if (wsi > 40) return 'Warning';
    return 'Safe';
}

export default function TacticalMap({ villages, loading, onVillageClick }) {
    const center = [21.15, 79.08];

    return (
        <div className="w-full relative bg-slate-100" style={{ height: '100%', minHeight: '100%' }}>
            {loading && villages.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60">
                    <div className="text-center">
                        <div className="animate-spin size-10 border-2 border-slate-200 border-t-primary rounded-full mx-auto mb-3"></div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Loading Map Data...</p>
                    </div>
                </div>
            ) : null}

            <MapContainer
                center={center}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
                className="z-10"
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                />

                <MapResizer />
                {villages && villages.length > 0 && <MapBoundsUpdater villages={villages} />}

                {villages && villages.map(v => {
                    const lat = v.lat || v.latitude || 0;
                    const lng = v.lng || v.longitude || 0;
                    if (!lat || !lng) return null;
                    const wsi = v.wsi || 0;
                    const color = getColor(wsi);

                    return (
                        <CircleMarker
                            key={v.id}
                            center={[lat, lng]}
                            radius={wsi > 70 ? 12 : wsi > 40 ? 9 : 7}
                            fillColor={color}
                            color={color}
                            weight={2}
                            opacity={0.9}
                            fillOpacity={0.4}
                            eventHandlers={{
                                click: () => onVillageClick && onVillageClick(v),
                            }}
                        >
                            <Popup>
                                <div className="p-1 font-display min-w-[180px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm text-slate-900">{v.name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white`} style={{ backgroundColor: color }}>
                                            {getLabel(wsi)}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs text-slate-500">
                                        <div className="flex justify-between"><span>WSI</span><span className="font-mono font-bold text-slate-700">{wsi.toFixed(1)}</span></div>
                                        <div className="flex justify-between"><span>Population</span><span className="font-mono">{(v.population || 0).toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span>Rainfall Dev</span><span className="font-mono">{(v.rainfall_dev_pct || 0).toFixed(1)}%</span></div>
                                    </div>
                                    {onVillageClick && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onVillageClick(v); }}
                                            className="mt-3 w-full py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                            AI Insight
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
