export default function AdminDashboard({
    params: _params,
}: {
    params: { tenant: string };
}) {
    void _params;
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Platform Hub</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards */}
                {[
                    { label: "Total Tenants", value: "24" },
                    { label: "Active Nodes", value: "142" },
                    { label: "MRR", value: "$4.2k" },
                    { label: "Errors (24h)", value: "3" },
                ].map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-400">{metric.label}</h3>
                        <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
                    </div>
                ))}
            </div>
            {/* Table Placeholder */}
            <div className="rounded-xl border border-slate-800 bg-slate-900">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Tenants</h2>
                    <div className="text-slate-400 text-sm">List of provisioned tenants will appear here...</div>
                </div>
            </div>
        </div>
    );
}
