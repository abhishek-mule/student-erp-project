"use client";

import { useState } from 'react';

const mockTenants = [
    { id: '1', name: 'MIT Institute', slug: 'mit', plan: 'PRO', status: 'ACTIVE' },
    { id: '2', name: 'Stanford Col', slug: 'stanford', plan: 'ENTERPRISE', status: 'ACTIVE' },
    { id: '3', name: 'Oxford Academy', slug: 'oxford', plan: 'FREE', status: 'PAUSED' },
];

export default function TenantsAdmin() {
    const [tenants, setTenants] = useState(mockTenants);
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tenants</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage and provision college instances.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
                >
                    Provision New Tenant
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">College Name</th>
                            <th className="px-6 py-4">Slug / Domain</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                        {tenants.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                                <td className="px-6 py-4 text-slate-400">{t.slug}.platform.com</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">{t.plan}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 ${t.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Provision Tenant</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">College Name</label>
                                <input type="text" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-1 ring-indigo-500 outline-none" placeholder="e.g. Harvard University" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Slug</label>
                                <input type="text" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-1 ring-indigo-500 outline-none" placeholder="harvard" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Subscription Plan</label>
                                <select className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none">
                                    <option>FREE</option>
                                    <option>PRO</option>
                                    <option>ENTERPRISE</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                            <button className="flex-1 py-2 text-sm font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">Create Instance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
