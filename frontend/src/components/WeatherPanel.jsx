import React, { useState, useEffect } from 'react';
import api from '../api/backendClient';

export default function WeatherPanel({ villages }) {
    const [selectedVillage, setSelectedVillage] = useState(villages.length > 0 ? villages[0].id : null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedVillage && villages.length > 0) {
            setSelectedVillage(villages[0].id);
        }
    }, [villages]);

    useEffect(() => {
        if (!selectedVillage) return;

        const fetchForecast = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/villages/${selectedVillage}/forecast`);
                setForecast(response.data.forecast || []);
            } catch (err) {
                setError("Failed to load forecast data from OpenWeather API.");
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [selectedVillage]);

    const getWeatherIcon = (rain) => {
        if (rain > 5) return "thunderstorm";
        if (rain > 0) return "rainy";
        return "wb_sunny";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Weather Forecast</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">5-Day meteorological predictions for drought impact assessment.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Village Selector Sidebar */}
                <div className="w-full lg:w-1/4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-wider">Select Region</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-[500px] overflow-y-auto">
                        {villages.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVillage(v.id)}
                                className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between group ${selectedVillage === v.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'}`}
                            >
                                <div>
                                    <p className={`font-semibold ${selectedVillage === v.id ? 'text-primary dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{v.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">ID: {v.id}</p>
                                </div>
                                <span className={`material-symbols-outlined transition-transform ${selectedVillage === v.id ? 'text-primary transform translate-x-1' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100'}`}>chevron_right</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Forecast Display */}
                <div className="w-full lg:w-3/4">
                    {loading ? (
                        <div className="h-full min-h-[400px] flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin size-10 border-4 border-slate-200 border-t-primary rounded-full mb-4"></div>
                                <p className="text-slate-500 font-medium">Fetching satellite data...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-600 text-center p-8">
                            <span className="material-symbols-outlined text-[64px] mb-4 opacity-50">cloud_off</span>
                            <h3 className="text-xl font-bold">API Unavailable</h3>
                            <p className="mt-2 text-red-500/80">{error}</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-[28px]">radar</span>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{villages.find(v => v.id === selectedVillage)?.name} Forecast</h3>
                                    <p className="text-sm text-slate-500 uppercase tracking-wider">OpenWeather 5-Day Outlook</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {forecast.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-slate-500">No forecast data available for this region.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {forecast.map((day, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition bg-slate-50 dark:bg-slate-900 overflow-hidden relative group">
                                                {/* Left side: Date & Icon */}
                                                <div className="flex items-center gap-6 z-10 w-full sm:w-1/3 mb-4 sm:mb-0">
                                                    <div className="size-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-[32px]">
                                                            {getWeatherIcon(day.rainfall_mm)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                        </p>
                                                        <p className="text-sm text-slate-500 font-mono">{day.date}</p>
                                                    </div>
                                                </div>

                                                {/* Right side: Metrics Grid */}
                                                <div className="grid grid-cols-3 gap-8 w-full sm:w-2/3 z-10">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thermostat</span> Temp</span>
                                                        <div className="text-center">
                                                            <span className="text-xl font-bold text-slate-900 dark:text-white">{day.temp_max}°</span>
                                                            <span className="text-sm text-slate-500 ml-1">/{day.temp_min}°</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">water_drop</span> Rain</span>
                                                        <div className="text-center">
                                                            <span className={`text-xl font-bold ${day.rainfall_mm > 0 ? 'text-blue-500' : 'text-slate-900 dark:text-white'}`}>{day.rainfall_mm}</span>
                                                            <span className="text-sm text-slate-500 ml-1">mm</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">humidity_percentage</span> Humidity</span>
                                                        <div className="text-center">
                                                            <span className="text-xl font-bold text-slate-900 dark:text-white">{day.humidity_avg}</span>
                                                            <span className="text-sm text-slate-500 ml-1">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
