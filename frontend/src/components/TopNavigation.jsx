import React from 'react';

export default function TopNavigation({ activeTab, setActiveTab }) {
    return (
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">water_drop</span>
                        </div>
                        <div className="hidden md:flex flex-col">
                            <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-white">Water Management Dashboard</h1>
                            <span className="text-xs text-slate-500 font-medium mt-1">Government Monitoring Portal</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >Overview</button>
                        <button
                            onClick={() => setActiveTab('villages')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'villages' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >Villages</button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'reports' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >Reports</button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'map' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >Map View</button>
                        <button
                            onClick={() => setActiveTab('weather')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'weather' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >Weather</button>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="text-slate-500 hover:text-slate-700 relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button className="flex items-center gap-2 group">
                            <div className="size-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                                <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoxvS11AO4TE0H8R-sNH2-Exuf9WhfwLEfr1jhu6jHgo9tI2195o2hTVb3pKuvUQQiaEtO9wJKlOXhVE9Fe_7TuJ__TAdzbjdRkZt6O5954XPsuCfhkWIIFRb7Sz_GXTSD2tIcYXK83bDZklpZxg4bRCqgzZbsa4TxbPm-cIL-RjBvM_xqMMArGnvEo-9JyTKSlc-cLkmRAL9fKnN_64P9542mJPyA0uuiTuYQQVE98re2rheMD4JaUJeD9eacw_OIETsPtPb-xtc" />
                            </div>
                            <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900">Admin User</span>
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
